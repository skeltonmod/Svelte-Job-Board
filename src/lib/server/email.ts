import nodemailer from 'nodemailer';
import type { Job } from '$lib/types';

const transporter = nodemailer.createTransport({
  host: '0.0.0.0',
  port: 1025,
  secure: false,
});

const MODERATOR_EMAIL = 'moderator@mrge.com';
const BASE_URL = 'http://localhost:5173';

export async function sendFirstTimeJobNotification(job: Job): Promise<void> {
  const approveUrl = `${BASE_URL}/admin/approve/${job.id}`;
  const spamUrl = `${BASE_URL}/admin/spam/${job.id}`;
  
  const mailOptions = {
    from: '"Job Board" <jobboard@mrge.com>',
    to: MODERATOR_EMAIL,
    subject: `New First-Time Job Submission: ${job.title}`,
    html: `
      <h1>New Job Submission from First-Time Poster</h1>
      <p>A user has submitted a job listing for the first time.</p>
      
      <h2>Job Details:</h2>
      <ul>
        <li><strong>Title:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Location:</strong> ${job.location}</li>
        <li><strong>Submitter Email:</strong> ${job.submitterEmail}</li>
      </ul>
      
      <h3>Description:</h3>
      <p>${job.description}</p>
      
      <div style="margin-top:20px;">
        <a href="${approveUrl}" style="background-color:#28a745;color:white;padding:10px 15px;text-decoration:none;margin-right:10px;">
          Approve Job
        </a>
        <a href="${spamUrl}" style="background-color:#dc3545;color:white;padding:10px 15px;text-decoration:none;">
          Mark as Spam
        </a>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}