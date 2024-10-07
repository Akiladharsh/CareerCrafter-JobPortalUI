import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private apiUrl = 'https://localhost:7134/api/JobSeeker/applications';  // Base API URL

  constructor(private http: HttpClient) { }

  // Fetch applications by JobSeekerId from local storage
  getApplicationsByJobSeekerId(): Observable<any> {
    const jobSeekerId = Number(localStorage.getItem('jobSeekerId'));  // Get JobSeekerId from local storage
    const token = localStorage.getItem('jwtToken');  // Get JWT token from local storage

    if (!jobSeekerId) {
      throw new Error('Job Seeker ID not found in local storage.');
    }

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    // Create headers with the Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Attach the token as a Bearer token
    });

    // Append jobSeekerId to the query string
    return this.http.get(`${this.apiUrl}?jobSeekerId=${jobSeekerId}`, { headers });  // Send the request with headers
  }

  // Delete an application by applicationStatusId and jobSeekerId
  deleteApplication(id: number, jobSeekerId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');  // Get JWT token from local storage

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    console.log('Attempting to delete Application ID:', id);  // Log applicationStatusId
    console.log('For Job Seeker ID:', jobSeekerId);  // Log jobSeekerId

    // Create headers with the Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Attach the token as a Bearer token
    });

    // Make DELETE request with headers, using the updated URL format
    return this.http.delete(`https://localhost:7134/api/JobSeeker/${id}/jobSeeker/${jobSeekerId}`, { headers });
  }
}
