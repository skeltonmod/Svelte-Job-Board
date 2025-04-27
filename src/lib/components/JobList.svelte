<script lang="ts">
	import type { Job } from '$lib/types';
	import { truncateHTML } from '$lib/utils';
	import { Tile, Tag, Button, Link, InlineNotification } from 'carbon-components-svelte';

	export let jobs: Job[] = [];

	function formatDate(dateString: string | Date): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<div class="job-list">
	{#if jobs.length === 0}
		<InlineNotification
			kind="info"
			title="No jobs available"
			subtitle="There are no jobs available at the moment."
			hideCloseButton
		/>
	{:else}
		{#each jobs as job}
			<div class="job-card">
				<Tile>
					<div class="job-header">
						<h3 class="job-title">
							<Link
								href={job.url}
								target={job.status === 'EXTERNAL' ? '_blank' : '_self'}
								rel={job.status === 'EXTERNAL' ? 'noopener noreferrer' : ''}
							>
								{job.title}
							</Link>
							{#if job.status === 'EXTERNAL'}
								<Tag type="gray">External</Tag>
							{/if}
						</h3>
					</div>

					<div class="job-meta">
						<span class="company">{job.company}</span>
						<span class="location">{job.location}</span>
						<Tag type="blue">{job.category}</Tag>
						<span class="date">Posted: {formatDate(job.postedAt)}</span>
					</div>

					{#if job.tags && job.tags.length > 0}
						<div class="job-tags">
							{#each job.tags as tag}
								<Tag type="warm-gray">{tag}</Tag>
							{/each}
						</div>
					{/if}

					<div class="job-description">
						{@html truncateHTML(job.description, 20)}
					</div>

					<div class="job-actions">
						<Button
							kind="primary"
							size="small"
							href={job.url}
							target={job.status === 'EXTERNAL' ? '_blank' : '_self'}
							rel={job.status === 'EXTERNAL' ? 'noopener noreferrer' : ''}
						>
							View Details
						</Button>
					</div>
				</Tile>
			</div>
		{/each}
	{/if}
</div>

<style>
	.job-list {
		padding: 1rem;
		height: 100%;
	}

	.job-card {
		margin-bottom: 1rem;
	}

	.job-card:last-child {
		margin-bottom: 0;
	}

	.job-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.job-title {
		margin: 0;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.job-meta {
		display: flex;
		gap: 15px;
		color: var(--cds-text-secondary);
		font-size: 0.9rem;
		margin-bottom: 10px;
		flex-wrap: wrap;
		align-items: center;
	}

	.job-description {
		margin: 15px 0;
	}

	.job-actions {
		display: flex;
		justify-content: flex-end;
	}

	.job-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 12px;
	}
</style>