<script lang="ts">
  import type { Job } from '$lib/types';
  import { formatDate } from '$lib/utils';
  
  export let pendingJobs: Job[] = [];
</script>

<div class="notification-panel">
  <h2>Pending Job Approvals</h2>
  
  {#if pendingJobs.length === 0}
    <div class="alert alert-info">No pending jobs to review.</div>
  {:else}
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Submitted By</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each pendingJobs as job}
          <tr>
            <td>{job.title}</td>
            <td>{job.company}</td>
            <td>{job.submitterEmail}</td>
            <td>{formatDate(job.postedAt)}</td>
            <td>
              <div class="btn-group">
                <a href="/admin/approve/{job.id}" class="btn btn-success btn-sm">Approve</a>
                <a href="/admin/spam/{job.id}" class="btn btn-danger btn-sm">Spam</a>
                <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#jobModal{job.id}">Details</button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    
    {#each pendingJobs as job}
      <div class="modal fade" id="jobModal{job.id}" tabindex="-1" aria-labelledby="jobModalLabel{job.id}" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="jobModalLabel{job.id}">{job.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h6>Company: {job.company}</h6>
              <h6>Location: {job.location}</h6>
              <h6>Submitted By: {job.submitterEmail}</h6>
              <h6>Date: {formatDate(job.postedAt)}</h6>
              
              <hr>
              
              <h6>Description:</h6>
              <p>{job.description}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <a href="/admin/approve/{job.id}" class="btn btn-success">Approve</a>
              <a href="/admin/spam/{job.id}" class="btn btn-danger">Mark as Spam</a>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>