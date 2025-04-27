import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPendingJobs } from '$lib/server/db';


export const GET: RequestHandler = async () => {
  
  try {
    const pendingJobs = await getPendingJobs();
    return json(pendingJobs);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    return json({ error: 'Failed to fetch pending jobs' }, { status: 500 });
  }
};