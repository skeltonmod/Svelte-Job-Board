import { parseStringPromise } from 'xml2js';
import type { ExternalJobListing, ExternalJobResponse } from './types';

export function truncateHTML(html: string, maxWords: number): string {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = html;

	let wordCount = 0;
	const result = document.createElement('div');

	function processNode(node: Node, parentNode: Node): boolean {
		if (wordCount >= maxWords) {
			return false;
		}

		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent || '';
			const words = text.trim().split(/\s+/);

			if (wordCount + words.length <= maxWords) {
				parentNode.appendChild(node.cloneNode(true));
				wordCount += words.length;
			} else {
				const remainingWords = maxWords - wordCount;
				const truncatedText = words.slice(0, remainingWords).join(' ') + '...';
				const textNode = document.createTextNode(truncatedText);
				parentNode.appendChild(textNode);
				wordCount = maxWords;
			}
			return wordCount < maxWords;
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const newElement = document.createElement(node.nodeName);

			if (node instanceof Element) {
				Array.from(node.attributes).forEach((attr) => {
					newElement.setAttribute(attr.name, attr.value);
				});
			}

			let shouldContinue = true;
			for (let i = 0; i < node.childNodes.length && shouldContinue; i++) {
				shouldContinue = processNode(node.childNodes[i], newElement);
			}

			if (newElement.hasChildNodes()) {
				parentNode.appendChild(newElement);
			}

			return shouldContinue;
		}

		return true;
	}

	for (let i = 0; i < tempDiv.childNodes.length && wordCount < maxWords; i++) {
		processNode(tempDiv.childNodes[i], result);
	}

	return result.innerHTML;
}

export async function parseJobsXml(xmlContent: string): Promise<ExternalJobListing[]> {
	try {
		const result = await parseStringPromise(xmlContent, { explicitArray: false });

		if (!result['workzag-jobs'] || !result['workzag-jobs'].position) {
			return [];
		}

		const positionsData = Array.isArray(result['workzag-jobs'].position)
			? result['workzag-jobs'].position
			: [result['workzag-jobs'].position];

		return positionsData.map((position: ExternalJobResponse) => {
			const descriptions = position.jobDescriptions?.jobDescription || [];
			const descriptionArray = Array.isArray(descriptions) ? descriptions : [descriptions];

			let fullDescription = '';
			descriptionArray.forEach((desc) => {
				if (desc.name && desc.value) {
					fullDescription += `<h3>${desc.name}</h3>${desc.value}`;
				}
			});
			return {
				title: position.name || 'No Title',
				description: fullDescription || 'No Description Available',
				company: position.subcompany || 'Unknown Company',
				location: position.office || 'Remote/Various',
				url: `https://mrge-group-gmbh.jobs.personio.de/job/${position.id}`,
				postedDate: position.createdAt || new Date().toISOString(),
				id: position.id,
				department: position.department,
				employmentType: position.employmentType,
				seniority: position.seniority,
				schedule: position.schedule,
				yearsOfExperience: position.yearsOfExperience,
				keywords: position.keywords?.split(',').map((k: string) => k.trim()) || [],
        category: position.department,
			};
		});
	} catch (error) {
		console.error('Error parsing XML:', error);
		return [];
	}
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
}
