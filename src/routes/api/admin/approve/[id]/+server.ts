import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob, approveJob } from '$lib/server/db';

export const POST: RequestHandler = async ({ params }) => {
  // In a real app, you would check authentication here
  // if (!locals.user || !locals.user.isAdmin) {
  //   return json({ error: 'Unauthorized' }, { status: 401 });
  // }
  
  try {
    const jobId = params.id;
    const job = await getJob(jobId);
    
    if (!job) {
      return json({ success: false, message: 'Job not found' }, { status: 404 });
    }
    
    const updatedJob = await approveJob(jobId);
    
    return json({
      success: true,
      message: 'Job approved successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error approving job:', error);
    return json({ success: false, message: 'Error approving job' }, { status: 500 });
  }
};