<script lang="ts">
	import { onMount } from 'svelte';
	import type { Job } from '$lib/types';
	import { page } from '$app/stores';

	// Import Carbon components
	import {
		Button,
		Form,
		FormGroup,
		TextInput,
		FileUploader,
		TextArea,
		Loading,
		Checkbox,
		InlineNotification,
		SkeletonText,
		Link
	} from 'carbon-components-svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';

	let job: Job | null = null;
	let loading = true;
	let error = '';
	let submitting = false;
	let applicationSubmitted = false;

	onMount(async () => {
		try {
			const jobId = $page.params.id;
			const response = await fetch(`/api/jobs/${jobId}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to load job details');
			}

			job = await response.json();

			// Check if this is an external job
			if (job?.status === 'EXTERNAL') {
				window.location.href = job.url;
			}
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'Failed to load job details';
		} finally {
			loading = false;
		}
	});

	async function submitApplication(event: Event) {
		event.preventDefault();
		submitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// In a real app, you would send this data to an API endpoint
			// For now, we'll just simulate a successful submission
			await new Promise((resolve) => setTimeout(resolve, 1000));

			applicationSubmitted = true;
		} catch (err) {
			console.error(err);
			error = 'Failed to submit your application. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	{#if job}
		<title>Apply: {job.title} | Job Board</title>
	{:else}
		<title>Job Application | Job Board</title>
	{/if}
</svelte:head>

<div class="apply-page">
	{#if loading}
		<div style="margin: 2rem 0; display: flex; justify-content: center;">
			<Loading withOverlay={false} description="Loading job details..." />
		</div>
	{:else if error}
		<InlineNotification kind="error" title="Error" subtitle={error} hideCloseButton />
		<div style="margin-top: 1rem;">
			<Button href="/">Return to Job Listings</Button>
		</div>
	{:else if applicationSubmitted}
		<div class="bx--tile">
			<div style="text-align: center; padding: 2rem;">
				<div style="margin-bottom: 1rem; font-size: 3rem; color: #24a148;">
					<CheckmarkFilled size={48} />
				</div>
				<h2>Application Submitted!</h2>
				<p style="margin: 1rem 0;">
					Thank you for your interest in the {job?.title} position at {job?.company}.
				</p>
				<p>We have received your application and will review it shortly.</p>
				<div style="margin-top: 2rem;">
					<Button href="/">Back to Job Listings</Button>
				</div>
			</div>
		</div>
	{:else if job}
		<div class="bx--tile">
			<h1 class="bx--type-productive-heading-04">Apply: {job.title}</h1>
			<p style="margin: 1rem 0;">
				Complete the form below to apply for the {job.title} position at {job.company}.
			</p>

			<Form on:submit={submitApplication}>
				<FormGroup legendText="Personal Information">
					<TextInput id="fullName" name="fullName" labelText="Full Name *" required />

					<TextInput type="email" id="email" name="email" labelText="Email Address *" required />

					<TextInput id="phone" name="phone" labelText="Phone Number" />
				</FormGroup>

				<FormGroup legendText="Professional Information">
					<FileUploader
						labelTitle="Resume/CV *"
						buttonLabel="Add file"
						labelDescription="Accepted formats: PDF, DOC, DOCX (Max 5MB)"
						accept={['.pdf', '.doc', '.docx']}
						name="resume"
						multiple={false}
					/>

					<TextArea id="coverLetter" name="coverLetter" labelText="Cover Letter" rows={5} />

					<TextInput
						id="linkedIn"
						name="linkedIn"
						labelText="LinkedIn Profile"
						placeholder="https://linkedin.com/in/yourusername"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox id="termsCheck" labelText={`I agree to the terms and conditions *`} required />
					<Link href="/terms" target="_blank" style="margin-left: 1.5rem; font-size: 0.875rem;">
						View Terms and Conditions
					</Link>
				</FormGroup>

				<div style="display: flex; gap: 1rem; margin-top: 2rem;">
					<Button type="submit" disabled={submitting}>
						{submitting ? 'Submitting...' : 'Submit Application'}
					</Button>
					<Button href={`/jobs/${job.id}`} kind="secondary">Back to Job Details</Button>
				</div>
			</Form>
		</div>
	{/if}
</div>

<style>
	.apply-page {
		max-width: 768px;
		margin: 0 auto;
		padding: 1rem;
	}

	:global(.bx--tile) {
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	:global(.bx--form-item) {
		margin-bottom: 1.5rem;
	}
</style>
