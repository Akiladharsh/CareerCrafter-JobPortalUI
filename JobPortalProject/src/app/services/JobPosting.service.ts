import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { JobPosting } from '../models/JobPosting.model';
import { JobPosting } from '../Models/JobPosting.model';  // Import JobPosting model

@Injectable({
  providedIn: 'root',
})
export class JobPostingService {
  private apiUrl = 'https://localhost:7134/api/JobPostings';  // Base API URL

  constructor(private http: HttpClient) {}

  // Method to create a job posting
  createJobPosting(jobPosting: JobPosting, token: string): Observable<JobPosting> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Attach JWT token for authentication
    });

    return this.http.post<JobPosting>(this.apiUrl, jobPosting, { headers });
  }

  // Method to get all job postings (example if needed in the future)
  getJobPostings(token: string): Observable<JobPosting[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<JobPosting[]>(this.apiUrl, { headers });
  }
}
