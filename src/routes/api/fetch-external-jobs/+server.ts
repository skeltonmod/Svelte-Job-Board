import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseJobsXml } from '$lib/utils';
import { saveExternalJobs } from '$lib/server/db';

const EXTERNAL_API_URL = 'https://mrge-group-gmbh.jobs.personio.de/xml';

export const GET: RequestHandler = async () => {
  try {
    // Fetch the external XML
    const response = await fetch(EXTERNAL_API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch external jobs: ${response.statusText}`);
    }
    
    const xmlData = await response.text();
    const parsedJobs = await parseJobsXml(xmlData);
    
    // Save the jobs to our database
    await saveExternalJobs(parsedJobs);
    
    return json({ success: true, jobsImported: parsedJobs.length });
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    return json({ error: 'Failed to fetch and process external jobs' }, { status: 500 });
  }
};