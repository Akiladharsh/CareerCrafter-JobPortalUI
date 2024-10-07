import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  userType: string = '';  // Default user type
  errorMessage: string = ''; // Error message for UI

  constructor(private router: Router, private http: HttpClient) {}

  // Handles form submission for registration
  onRegister() {
    const registerPayload = {
      email: this.email,
      password: this.password,
      userType: this.userType
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Select API endpoint based on userType
    let apiUrl = '';
    if (this.userType === 'JobSeeker') {
      apiUrl = 'https://localhost:7134/api/Auth/register';
    } else if (this.userType === 'Employer') {
      apiUrl = 'https://localhost:7134/api/Employer/register';
    } else {
      this.errorMessage = 'Invalid user type selected. Please try again.';
      return;
    }

    // Post request to the selected API
    this.http.post<any>(apiUrl, registerPayload, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error response:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          return throwError(error);
        })
      )
      .subscribe(response => {
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']); // Navigate back to login after registration
      });
  }
}
