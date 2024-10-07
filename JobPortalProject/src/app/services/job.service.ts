import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders
import { Observable, throwError } from 'rxjs'; // Import Observable and throwError for error handling
import { catchError } from 'rxjs/operators'; // Import catchError for handling errors
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library

// Define the ApplicationStatus model interface
export interface ApplicationStatus {
  applicationStatusId: number;
  jobSeeker_Id: number;
  jobPostingId: number;
  employerId: number;
  companyName: string;
  role: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://localhost:7134/api/JobPostings'; // Job postings URL
  private resumeApiUrl = 'https://localhost:7134/api/Resumes'; // Resume upload URL
  private applicationStatusUrl = 'https://localhost:7134/api/JobSeeker'; // Application status URL

  constructor(private http: HttpClient) {}

  // Method to get token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Method to decode the JWT token
  decodeToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token); // Decode the token and return its payload
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  // Method to get recent job postings with JWT token in the header
  getRecentJobs(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No token found. User might not be authenticated.');
      return throwError('No token found.'); // Handle the case when the token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Attach the JWT token
    });

    return this.http.get(`${this.apiUrl}/recent`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching recent jobs:', error);
          return throwError('Error fetching recent jobs. Please try again later.');
        })
      );
  }

  // Method to upload resume
  uploadResume(jobSeekerId: number, file: File): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No token found. User might not be authenticated.');
      return throwError('No token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Attach the JWT token
      'enctype': 'multipart/form-data' // Specify enctype for file upload
    });

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.resumeApiUrl}/upload/${jobSeekerId}`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error uploading resume:', error);
          return throwError('Error uploading resume. Please try again later.');
        })
      );
  }

  // Method to add application status
  addApplicationStatus(applicationStatus: ApplicationStatus): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.error('No token found. User might not be authenticated.');
      return throwError('No token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Attach the JWT token
      'Content-Type': 'application/json' // Set content type for JSON
    });

    return this.http.post(this.applicationStatusUrl, applicationStatus, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding application status:', error);
          return throwError('Error adding application status. Please try again later.');
        })
      );
  }
}
