<script lang="ts">
	import { onMount } from 'svelte';
	import JobList from '$lib/components/JobList.svelte';
	import type { Job } from '$lib/types';
	import {
		Grid,
		Row,
		Column,
		Select,
		SelectItem,
		Button,
		MultiSelect,
		InlineLoading,
		InlineNotification,
		TextInput,
		Tab,
		Tabs
	} from 'carbon-components-svelte';

	let jobs: Job[] = [];
	let filteredJobs: Job[] = [];
	let loading = true;
	let error = '';
	let searchTerm = '';
	let selectedCategory = 'All';
	let importingExternal = false;
	let importError = '';

	$: categories = ['All', ...new Set(jobs.map((job) => job.category))];
	// $: availableTags = [...new Set(jobs.flatMap((job) => job.tags))].sort();
	// $: tagItems = availableTags.map((tag) => ({ id: tag, text: tag }));

	$: handleSearch = () => {
		filteredJobs = jobs.filter((job) => filterJob(job));
	};

	$: {
		filteredJobs = jobs.filter((job) => filterJob(job));
	}

	function filterJob(job: Job): boolean {
		const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
			job.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;

		return matchesSearch && matchesCategory;
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/jobs');
			if (!response.ok) {
				throw new Error('Failed to fetch jobs');
			}
			jobs = await response.json();
			filteredJobs = jobs;
		} catch (err) {
			error = 'Failed to load jobs. Please try again later.';
			console.error(err);
		} finally {
			loading = false;
		}
	});

	async function fetchExternalJobs() {
		importingExternal = true;
		importError = '';
		try {
			const response = await fetch('/api/fetch-external-jobs');

			if (!response.ok) {
				throw new Error('Failed to fetch external jobs');
			}

			const jobsResponse = await fetch('/api/jobs');
			if (!jobsResponse.ok) {
				throw new Error('Failed to refresh jobs list');
			}

			jobs = await jobsResponse.json();
			filteredJobs = jobs.filter((job) => filterJob(job));
		} catch (err) {
			console.error(err);
			importError = 'Failed to fetch external jobs. Please try again.';
		} finally {
			importingExternal = false;
		}
	}

	// function handleMultiSelectChange(event: CustomEvent) {
	// 	selectedTags = event.detail.selectedIds;
	// }

	function clearFilters() {
		selectedCategory = 'All';
		searchTerm = '';

        filteredJobs = jobs.filter((job) => filterJob(job));
	}

	onMount(async () => {
		await fetchExternalJobs();
	});
</script>

<Grid fullWidth>
	<Row>
		<Column>
			<div class="page-container">
				<div class="header-section">
					<h1>Available Jobs</h1>
					<p>Find your next opportunity from our curated list of available positions.</p>
				</div>

				<div class="job-filters">
					<Row padding>
						<Column sm={4} md={6} lg={6}>
							<TextInput
								placeholder="Search jobs..."
								bind:value={searchTerm}
								on:input={handleSearch}
								labelText="Search"
							/>
						</Column>
						<Column sm={2} md={3} lg={3}>
							<Select
								id="category-select"
								labelText="Category"
								bind:selected={selectedCategory}
								on:change={(e) => {
									selectedCategory = (e.target as HTMLSelectElement)?.value;

									filteredJobs = jobs.filter((job) => filterJob(job));
								}}
							>
								{#each categories as category}
									<SelectItem value={category} text={category} />
								{/each}
							</Select>
						</Column>
						<!-- <Column sm={2} md={3} lg={3}>
							<MultiSelect
								titleText="Tags"
								label="Filter by tags"
								items={tagItems}
								selectedIds={selectedTags}
								on:select={handleMultiSelectChange}
							/>
						</Column> -->
					</Row>
				</div>

				<div class="results-section">
					{#if loading}
						<div class="loading-container">
							<InlineLoading description="Loading jobs..." status="active" />
						</div>
					{:else if error}
						<InlineNotification kind="error" title="Error" subtitle={error} hideCloseButton />
					{:else}
						<div class="results-header">
							<p>Showing {filteredJobs.length} of {filteredJobs.length} jobs</p>
							<div class="filter-actions">
								{#if selectedCategory /**|| selectedTags.length > 0*/ || searchTerm}
									<Button kind="ghost" size="small" on:click={clearFilters}>Clear Filters</Button>
								{/if}
							</div>
						</div>

						{#if importError}
							<InlineNotification
								kind="error"
								title="Error"
								subtitle={importError}
								hideCloseButton={false}
								on:close={() => (importError = '')}
							/>
						{/if}

						<div class="job-list-container">
							<JobList jobs={filteredJobs} />
						</div>
					{/if}
				</div>
			</div>
		</Column>
	</Row>
</Grid>

<style>
	
	:global(html, body) {
		height: 100%;
		margin: 0;
		overflow: hidden;
	}

	:global(.bx--grid) {
		max-width: 100%;
		min-height: 100vh;
		padding: 0 1rem;
	}

	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.header-section {
		padding: 1rem 0;
	}

	.job-filters {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: var(--cds-background);
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--cds-border-subtle);
	}

	.results-section {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0; /* This is crucial for scrolling to work */
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
	}

	.filter-actions {
		display: flex;
		gap: 0.5rem;
	}

	.job-list-container {
		flex: 1;
		overflow-y: auto;
		border: 1px solid var(--cds-border-subtle);
		border-radius: 0.25rem;
		margin-bottom: 6rem;
	}

	h1 {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		padding: 2rem 0;
	}
</style>
