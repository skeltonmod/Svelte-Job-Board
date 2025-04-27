<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		Button,
		InlineLoading,
		InlineNotification,
		Tile,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';

	let loading = true;
	let error = '';
	let success = false;
	let jobTitle = '';
	let jobCompany = '';

	onMount(async () => {
		const jobId = $page.params.id;

		try {
			const jobResponse = await fetch(`/api/jobs/${jobId}`);

			const job = await jobResponse.json();
			jobTitle = job.title;
			jobCompany = job.company;

			const response = await fetch(`/api/admin/approve/${jobId}`, {
				method: 'POST'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to approve job');
			}

			success = true;
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	});
</script>

<Grid>
	<Row>
		<Column lg={8} md={6} sm={4} class="job-approval-container">
			<h1>Job Approval</h1>

			{#if loading}
				<Tile light>
					<div class="loading-container">
						<InlineLoading description="Processing job approval..." />
					</div>
				</Tile>
			{:else if error}
				<InlineNotification kind="error" title="Error" subtitle={error} hideCloseButton />
				<div style="margin-top: 1rem;">
					<Button href="/admin" kind="tertiary">Return to Admin Dashboard</Button>
				</div>
			{:else if success}
				<Tile light>
					<div class="success-container">
						<div class="checkmark">
							<CheckmarkFilled size={32} />
						</div>
						<h2>Job Approved!</h2>
						<p>
							You have successfully approved the job listing "{jobTitle}" from {jobCompany}. The job
							is now published and visible on the job board.
						</p>
						<div class="action-buttons">
							<Button href="/admin" kind="primary">Return to Admin Dashboard</Button>
							<Button href="/" kind="tertiary">View Job Board</Button>
						</div>
					</div>
				</Tile>
			{/if}
		</Column>
	</Row>
</Grid>

<style>

	h1 {
		margin-bottom: 1.5rem;
	}

	.loading-container {
		padding: 2rem;
		display: flex;
		justify-content: center;
	}

	.success-container {
		padding: 1rem;
		text-align: center;
	}

	.checkmark {
		margin: 1rem auto;
		color: #24a148;
		font-size: 3rem;
	}

	h2 {
		margin-bottom: 1rem;
	}

	.action-buttons {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
</style>
