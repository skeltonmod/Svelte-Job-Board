<script lang="ts">
  import { onMount } from 'svelte';
  import NotificationPanel from '$lib/components/NotificationPanel.svelte';
  import ExternalJobImporter from '$lib/components/ExternalJobImporter.svelte';
  import type { Job } from '$lib/types';
  import {
    DataTable,
    Row,
    Column,
    Grid,
    Button,
    Loading,
    Modal,
    InlineNotification,
  } from 'carbon-components-svelte';
  
  let pendingJobs: Job[] = [];
  let loading = true;
  let error = '';
  let selectedJob: Job | null = null;
  let modalOpen = false;
  let successMessage = '';
  let showSuccess = false;
  
  onMount(async () => {
    try {
      const response = await fetch('/api/admin/pending-jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch pending jobs');
      }
      pendingJobs = await response.json();
    } catch (err) {
      error = 'Failed to load pending jobs. Please try again later.';
      console.error(err);
    } finally {
      loading = false;
    }
  });
  async function approveJob(jobId: string) {
    try {
      const response = await fetch(`/api/admin/approve/${jobId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve job');
      }

      pendingJobs = pendingJobs.filter(job => job.id !== jobId);
      
      successMessage = 'Job approved successfully';
      showSuccess = true;
      modalOpen = false;
      
      setTimeout(() => {
        showSuccess = false;
      }, 5000);
    } catch (err) {
      error = 'Failed to approve job';
      console.error(err);
    }
  }
  
  // Function to mark job as spam
  async function markAsSpam(jobId: string) {
    try {
      const response = await fetch(`/api/admin/spam/${jobId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark job as spam');
      }
      
      pendingJobs = pendingJobs.filter(job => job.id !== jobId);
      
      successMessage = 'Job marked as spam';
      showSuccess = true;
      modalOpen = false;
      setTimeout(() => {
        showSuccess = false;
      }, 5000);
    } catch (err) {
      error = 'Failed to mark job as spam';
      console.error(err);
    }
  }
  
  function openJobDetails(job: Job) {
    selectedJob = job;
    modalOpen = true;
  }
  
  // Format date for display
  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
</script>

<Grid>
  <Row>
    <Column>
      <h1>Admin Dashboard</h1>
      <p>Review and manage job submissions.</p>

      <ExternalJobImporter />
      
      {#if showSuccess}
        <InlineNotification
          kind="success"
          title="Success"
          subtitle={successMessage}
          hideCloseButton={false}
          on:close={() => showSuccess = false}
        />
      {/if}
      
      {#if loading}
        <div style="display: flex; justify-content: center; margin: 2rem 0;">
          <Loading withOverlay={false} description="Loading pending jobs..." small />
        </div>
      {:else if error}
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          hideCloseButton={false}
          on:close={() => error = ''}
        />
      {:else}
        <div class="notification-panel">
          <h2>Pending Job Approvals</h2>
          
          {#if pendingJobs.length === 0}
            <InlineNotification
              kind="info"
              title="No pending jobs"
              subtitle="There are no pending jobs to review at this time."
              hideCloseButton
            />
          {:else}
            <DataTable
              headers={[
                { key: 'title', value: 'Title' },
                { key: 'company', value: 'Company' },
                { key: 'submitterEmail', value: 'Submitted By' },
                { key: 'postedAt', value: 'Date' },
                { key: 'actions', value: 'Actions' }
              ]}
              rows={pendingJobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company,
                submitterEmail: job.submitterEmail,
                postedAt: formatDate(job.postedAt),
                job: job // Store the full job object for reference
              }))}
            >
              <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === 'actions'}
                  <div style="display: flex; gap: 0.5rem">
                    <Button
                      kind="primary"
                      size="small"
                      on:click={() => approveJob(row.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      kind="danger"
                      size="small"
                      on:click={() => markAsSpam(row.id)}
                    >
                      Spam
                    </Button>
                    <Button
                      kind="tertiary"
                      size="small"
                      on:click={() => openJobDetails(row.job)}
                    >
                      Details
                    </Button>
                  </div>
                {:else}
                  {cell.value}
                {/if}
              </svelte:fragment>
            </DataTable>
          {/if}
        </div>
      {/if}
    </Column>
  </Row>
</Grid>
{#if selectedJob}
  <Modal
    bind:open={modalOpen}
    modalHeading={selectedJob.title}
    primaryButtonText="Approve"
    secondaryButtonText="Mark as Spam"
    on:click:button--primary={() => approveJob(selectedJob?.id || "")}
    on:click:button--secondary={() => markAsSpam(selectedJob?.id || "")}
  >
    <div style="margin-bottom: 1rem;">
      <p><strong>Company:</strong> {selectedJob.company}</p>
      <p><strong>Location:</strong> {selectedJob.location}</p>
      <p><strong>Submitted By:</strong> {selectedJob.submitterEmail}</p>
      <p><strong>Date:</strong> {formatDate(selectedJob.postedAt)}</p>
    </div>
    
    <hr />
    
    <div style="margin-top: 1rem;">
      <h6>Description:</h6>
      <p>{selectedJob.description}</p>
    </div>
  </Modal>
{/if}

<style>
  h1 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  
  h2 {
    margin: 1.5rem 0 1rem;
  }
  
  .notification-panel {
    margin-top: 1.5rem;
  }
</style>