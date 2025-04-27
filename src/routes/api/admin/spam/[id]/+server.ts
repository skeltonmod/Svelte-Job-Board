import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob, markAsSpam } from '$lib/server/db';

export const POST: RequestHandler = async ({ params, locals }) => {
  
  try {
    const jobId = params.id;
    const job = await getJob(jobId);
    
    if (!job) {
      return json({ success: false, message: 'Job not found' }, { status: 404 });
    }
    
    const updatedJob = await markAsSpam(jobId);
    
    return json({
      success: true,
      message: 'Job marked as spam',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error marking job as spam:', error);
    return json({ success: false, message: 'Error marking job as spam' }, { status: 500 });
  }
};