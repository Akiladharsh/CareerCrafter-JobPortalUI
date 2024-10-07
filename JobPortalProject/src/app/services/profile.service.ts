import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'https://localhost:7134/api/Employer'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Method to fetch employer profile details
  getProfile(employerId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const url = `${this.apiUrl}/${employerId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Pass the token here
    });

    return this.http.get(url, { headers }); // Use GET request to fetch profile data
  }

  // Method to update employer profile
  updateProfile(data: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const url = `${this.apiUrl}/${data.employerId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Pass the token here
    });

    return this.http.patch(url, data, { headers });
  }
}
