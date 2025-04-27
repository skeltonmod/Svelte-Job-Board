<script lang="ts">
  import { onMount } from 'svelte';
  import type { Job } from '$lib/types';
  import { page } from '$app/stores';
  import {
    Loading,
    Button,
    Tile,
    Tag,
    InlineNotification,
    Grid,
    Row,
    Column,
    Content,
    CopyButton,
  } from "carbon-components-svelte";
  import LogoLinkedin from "carbon-icons-svelte/lib/LogoLinkedin.svelte";
  import LogoTwitter from "carbon-icons-svelte/lib/LogoTwitter.svelte";
  
  let job: Job | null = null;
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      const jobId = $page.params.id;
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load job details');
      }
      
      job = await response.json();
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : 'Failed to load job details';
    } finally {
      loading = false;
    }
  });
  
  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
</script>

<svelte:head>
  {#if job}
    <title>{job.title} at {job.company} | Job Board</title>
  {:else}
    <title>Job Details | Job Board</title>
  {/if}
</svelte:head>

<Content>
  <Grid>
    <div class="job-detail-page">
      {#if loading}
        <div class="loading-container">
          <Loading withOverlay={false} description="Loading job details" />
        </div>
      {:else if error}
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          hideCloseButton
        />
        <Button href="/" kind="primary">Return to Job Listings</Button>
      {:else if job}
        <Tile>
          <div class="job-header">
            <h1>{job.title}</h1>
            {#if job.status === "EXTERNAL"}
              <Tag type="cool-gray">External</Tag>
            {/if}
          </div>
          
          <div class="job-meta">
            <Row>
              <Column sm={4} md={4} lg={8}>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
              </Column>
              <Column sm={4} md={4} lg={8}>
                <p class="date"><strong>Posted:</strong> {formatDate(job.postedAt)}</p>
              </Column>
            </Row>
          </div>
          
          <div class="divider"></div>
          
          <div class="job-description">
            <h5>Job Description</h5>
            <div class="description-content">
              {#if job.description.includes('<')}
                {@html job.description}
              {:else}
                <p>{job.description}</p>
              {/if}
            </div>
          </div>
          
          <div class="job-actions">
            {#if job.status === "EXTERNAL"}
              <Button
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                kind="primary"
              >
                Apply on Company Website
              </Button>
            {:else}
              <Button
                href="/apply/{job.id}"
                kind="primary"
              >
                Apply for this Position
              </Button>
            {/if}
            <Button
              href="/"
              kind="secondary"
              class="back-button"
            >
              Back to Job Listings
            </Button>
          </div>
        </Tile>
        
        <Tile class="share-tile">
          <h5 class="share-title">Share This Job</h5>
          <div class="share-actions">
            <CopyButton
              text={window.location.href}
              feedback="Copied!"
            />
            
            <Button
              kind="tertiary"
              size="small"
              icon={LogoTwitter}
              iconDescription="Share on Twitter"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${job.title} at ${job.company}`)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Button>
            
            <Button
              kind="tertiary"
              size="small"
              icon={LogoLinkedin}
              iconDescription="Share on LinkedIn"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Button>
          </div>
        </Tile>
      {/if}
    </div>
  </Grid>
</Content>

<style>
  .job-detail-page {
    margin: 2rem 0;
    width: 100%;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
  }
  
  .job-meta {
    margin-bottom: 1.5rem;
  }
  
  .date {
    text-align: right;
  }
  
  .divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 1.5rem 0;
  }
  
  .description-content {
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .job-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }
  
  .share-title {
    margin-bottom: 1rem;
  }
  
  .share-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  :global(.back-button) {
    margin-left: 1rem;
  }
</style>