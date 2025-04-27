// Single source of truth for all types used in the application
export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  url: string;
  postedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'EXTERNAL' | 'SPAM';
  submitterEmail?: string;
  category: string;
  tags: string[];
  jobDescription?: string[];
  department?: string;
  subCompany?: string;
  schedule?: string;
  seniority?: string;
  employmentType?: string;
  yearsOfExperience?: string;
}

export interface JobSubmission {
  title: string;
  description: string;
  company: string;
  location: string;
  submitterEmail: string;
  category: string;
  tags: string[];
  jobDescription?: string[];
  department?: string;
  subCompany?: string;
  schedule?: string;
  seniority?: string;
  employmentType?: string;
  yearsOfExperience?: string;
}

export interface ExternalJobResponse {
  id: string;
  name: string;
  description: string;
  subcompany: string;
  office: string;
  url: string;
  postedDate: string;
  occupationCategory: string;
  keywords: string;
  jobDescriptions?: {
    jobDescription: string
  }[];
  department?: string;
  subCompany?: string;
  schedule?: string;
  seniority?: string;
  employmentType?: string;
  yearsOfExperience?: string;
  createdAt: string;
}

export interface ExternalJobListing {
  title: string;
  description: string;
  company: string;
  location: string;
  url: string;
  postedDate: string;
  category: string;
  tags: string[];
  jobDescription?: string[];
  department?: string;
  subCompany?: string;
  schedule?: string;
  seniority?: string;
  employmentType?: string;
  yearsOfExperience?: string;
}