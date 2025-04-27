import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const jobId = params.id;
    const job = await getJob(jobId);
    
    if (!job) {
      return json({ error: 'Job not found' }, { status: 404 });
    }
    
    if (job.status !== "APPROVED") {
      return json({ error: 'Job is not published' }, { status: 403 });
    }
    
    return json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return json({ error: 'Failed to fetch job' }, { status: 500 });
  }
};