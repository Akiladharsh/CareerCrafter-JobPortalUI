import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'https://localhost:7134/api/Auth/register';  // Replace with your API URL

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',  // Replace with your actual token
    });

    return this.http.post<any>(this.apiUrl, userData, { headers })
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(error);
        })
      );
  }
}
