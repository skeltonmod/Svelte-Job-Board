import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { submitJob } from '$lib/server/db';
import { sendFirstTimeJobNotification } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const jobData = await request.json();
    
    // Basic validation
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.email || !jobData.description) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }
    
    const { job, isFirstTime } = await submitJob({
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      submitterEmail: jobData.email,
      description: jobData.description,
      category: jobData.category,
      tags: [],
    });
    
    // If this is a first-time job poster, notify the moderator
    if (isFirstTime) {
      await sendFirstTimeJobNotification(job);
    }
    
    return json({ success: true, jobId: job.id });
  } catch (error) {
    console.error('Error submitting job:', error);
    return json({ error: 'Failed to submit job' }, { status: 500 });
  }
};