import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllJobs } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const jobs = await getAllJobs();
    
    return json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
};