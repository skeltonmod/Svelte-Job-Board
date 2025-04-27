import { PrismaClient } from '@prisma/client';
import type { Job, JobSubmission, ExternalJobListing } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function getAllJobs(): Promise<Job[]> {
	const jobs = await prisma.job.findMany({
		where: {
			OR: [
				{ status: 'APPROVED' },
				{ status: 'EXTERNAL' }
			]
		},
		orderBy: {
			postedAt: 'desc'
		}
	});

	return jobs as Job[];
}

export async function getPendingJobs(): Promise<Job[]> {
	const jobs = await prisma.job.findMany({
		where: {
			status: 'PENDING'
		},
		orderBy: {
			postedAt: 'desc'
		}
	});

	return jobs as Job[];
}

export async function getJob(id: string): Promise<Job | null> {
	const job = await prisma.job.findUnique({
		where: {
			id
		}
	});

	return job as Job | null;
}

export async function submitJob(
	jobSubmission: JobSubmission
): Promise<{ job: Job; isFirstTime: boolean }> {
	const previousSubmission = await prisma.job.findFirst({
		where: {
			submitterEmail: jobSubmission.submitterEmail
		}
	});

	const isFirstTime = !previousSubmission;

	const job = await prisma.job.create({
		data: {
			id: uuidv4(),
			title: jobSubmission.title,
			description: jobSubmission.description,
			company: jobSubmission.company,
			location: jobSubmission.location,
			submitterEmail: jobSubmission.submitterEmail,
			url: '',
			postedAt: new Date(),
			status: 'PENDING',
		}
	});

	return { job: job as Job, isFirstTime };
}

export async function approveJob(id: string): Promise<Job> {
	const job = await prisma.job.update({
		where: {
			id
		},
		data: {
			status: 'APPROVED',
			url: `/jobs/${id}`
		}
	});

	return job as Job;
}

export async function markAsSpam(id: string): Promise<Job> {
	const job = await prisma.job.update({
		where: {
			id
		},
		data: {
			status: 'SPAM'
		}
	});

	return job as Job;
}

export async function saveExternalJobs(externalJobs: ExternalJobListing[]): Promise<void> {
	const existingExternalJobs = await prisma.job.findMany({
		where: {
			status: 'EXTERNAL'
		},
		select: {
			url: true
		}
	});

	const existingUrls = new Set(existingExternalJobs.map((job: { url: string; }) => job.url));

	const newJobs = externalJobs.filter((job) => !existingUrls.has(job.url));

	if (newJobs.length > 0) {
		await prisma.job.createMany({
			data: newJobs.map((job) => ({
				id: uuidv4(),
				title: job.title,
				description: job.description,
				company: job.company,
				location: job.location,
				url: job.url,
				postedAt: new Date(job.postedDate),
				status: 'EXTERNAL',
				category: job.category || '',
			}))
		});
	}
}
