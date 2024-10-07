import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobProfileService {
  private apiUrl = 'https://localhost:7134/api/JobSeeker';

  constructor(private http: HttpClient) {}

  // Method to update a job seeker
  updateJobSeeker(jobSeekerId: number, jobSeekerData: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${jobSeekerId}`, jobSeekerData, { headers });
  }

  // Method to fetch a job seeker by ID
  getJobSeeker(jobSeekerId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${jobSeekerId}`, { headers });
  }
}
