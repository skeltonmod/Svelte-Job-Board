<script lang="ts">
  import { 
    Button, 
    InlineLoading,
    InlineNotification,
    Tile,
    Grid,
    Row,
    Column
  } from 'carbon-components-svelte';

  let importing = false;
  let success = false;
  let error = '';
  let jobsImported = 0;
  
  async function importExternalJobs() {
    importing = true;
    success = false;
    error = '';
    
    try {
      const response = await fetch('/api/fetch-external-jobs', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to import external jobs');
      }
      
      const result = await response.json();
      jobsImported = result.jobsImported;
      success = true;
    } catch (err) {
      console.error(err);
      error = 'Failed to import external jobs. Please try again.';
    } finally {
      importing = false;
    }
  }
</script>

<Tile light>
  <h3>Import External Jobs</h3>
  <p class="description">Import jobs from the configured external XML feed.</p>
  
  {#if success}
    <div class="notification-container">
      <InlineNotification
        kind="success"
        title="Success:"
        subtitle="Successfully imported {jobsImported} external jobs."
        hideCloseButton={false}
        on:close={() => success = false}
      />
    </div>
  {/if}
  
  {#if error}
    <div class="notification-container">
      <InlineNotification
        kind="error"
        title="Error:"
        subtitle={error}
        hideCloseButton={false}
        on:close={() => error = ''}
      />
    </div>
  {/if}
  
  <div class="action-container">
    {#if importing}
      <InlineLoading description="Importing..." />
    {:else}
      <Button on:click={importExternalJobs} disabled={importing}>
        Import External Jobs
      </Button>
    {/if}
  </div>
</Tile>

<style>
  h3 {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .description {
    margin-bottom: 1rem;
  }
  
  .notification-container {
    margin: 1rem 0;
  }
  
  .action-container {
    margin-top: 1rem;
  }
</style>