export interface JobPosting {
    jobPostingId?: number;  // Optional for create operation
    employerId?: number;
    organisationName: string;
    role: string;
    description: string;
  }