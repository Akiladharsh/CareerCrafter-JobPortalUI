import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Updated import statement for jwtDecode

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userType: string = '';  // Default user type
  errorMessage: string = ''; // Error message for UI

  constructor(private router: Router, private http: HttpClient) {}

  // Decodes JWT token and logs token information
  decodeToken(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Log the decoded token
      return decodedToken; // Return the decoded token for further processing
    } catch (error) {
      console.log('Invalid token or unable to decode:', error);
      return null; // Return null if token cannot be decoded
    }
  }

  // Handles form submission and login process
  onSubmit() {
    const loginPayload = {
      email: this.email,
      password: this.password,
      userType: this.userType
    };
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Select API endpoint based on userType
    let apiUrl = '';
    if (this.userType === 'JobSeeker') {
      apiUrl = 'https://localhost:7134/api/Auth/jobseeker/login';
    } else if (this.userType === 'Employer') {
      apiUrl = 'https://localhost:7134/api/Auth/employer/login';
    } else {
      this.errorMessage = 'Invalid user type selected. Please try again.';
      return;
    }
  
    // Post request to the selected API
    this.http.post<any>(apiUrl, loginPayload, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error response:', error); 
          this.errorMessage = error.error?.title || 'Login failed. Please check your credentials.';
          return throwError(error);
        })
      )
      .subscribe(response => {
        localStorage.clear();  // Clear existing local storage before setting new values
        
        if (response.token) {
          // Store token in localStorage
          localStorage.setItem('jwtToken', response.token);
          
          // Decode token and log details
          const decodedToken = this.decodeToken(response.token);
          
          // Store email in localStorage
          localStorage.setItem('email', this.email);
          
          // Check user type and store relevant ID
          if (this.userType === 'JobSeeker') {
            if (decodedToken && decodedToken.sub) {
              localStorage.setItem('jobSeekerId', decodedToken.sub); // Store JobSeeker_Id (sub) in localStorage
            }
          } else if (this.userType === 'Employer' && response.employerId) {
            localStorage.setItem('employerId', response.employerId); // Store employerId in localStorage
          }

          // Redirect based on user type
          if (this.userType === 'Employer') {
            this.router.navigate(['/employer-home']);
          } else if (this.userType === 'JobSeeker') {
            this.router.navigate(['/job-seeker-home']);
          } else {
            alert(`Logged in successfully as ${this.userType}, ${this.email}!`);
          }
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
  }

  // Method to navigate to the register component
  goToRegister() {
    this.router.navigate(['/register']);

    
  }
}
