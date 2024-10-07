// job-seeker.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


// This interface matches the response from the GetJobSeekersWithRole API
export interface JobSeekerApplication {
  jobSeeker_Id: number;  // Matching `jobSeeker_Id` from the response
  name: string;
  phoneNo: string;
  email: string;
  role: string;
  jobPostingId: number;
}

// This interface matches the detailed job seeker profile API response
export interface JobSeekerProfile {
  name: string;
  phoneNo: string;
  email: string;
  dob: string;
  tempAddress: string;
  permanentAddress: string;
  gender: string;
  totalExperienceInYears: number;
  skills: string[];
  certifications: string[];
  languages: string[];
  projects: string[];
  experience: {
    previousCompanyName: string;
    fromYear: number;
    toYear: number;
  }[];
  qualifications: {
    qualification: string;
    instituteName: string;
    passedOutYear: number;
  }[];
  resumes: {
    filePath: string;
  }[];
}


@Injectable({
    providedIn: 'root'
  })
  
  export class JobSeekerService {
    private apiUrl = 'https://localhost:7134/api/ApplicationStatus/JobSeekersWithRole';
  
    constructor(private http: HttpClient) {}
  
    // Method to get all job seekers with their roles, including the ID
    getJobSeekersWithRole(): Observable<JobSeekerApplication[]> {
      const headers = this.getAuthHeaders();
      return this.http.get<JobSeekerApplication[]>(this.apiUrl, { headers });
    }
  
    // Method to get a specific job seeker by their ID (this will return a detailed profile)
    getJobSeekerById(jobSeeker_Id: number): Observable<JobSeekerProfile> {
      const headers = this.getAuthHeaders();
      const url = `https://localhost:7134/api/JobSeeker/${jobSeeker_Id}`;
      return this.http.get<JobSeekerProfile>(url, { headers });
    }

    // New method to store JobPostingId in local storage
  storeJobPostingId(jobPostingId: number): void {
    if (jobPostingId) {
      localStorage.setItem('jobPostingId', jobPostingId.toString());
      console.log(`JobPostingId ${jobPostingId} stored in localStorage`);
    } else {
      console.error("Job Posting ID is undefined", jobPostingId);
    }
  }
  
    // Helper method to set up authorization headers
    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      });
    }
  }