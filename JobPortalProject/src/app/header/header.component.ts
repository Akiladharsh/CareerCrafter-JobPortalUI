import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';  // Import NgIf

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  // Function to check if the current page is the Employer Home page
  isEmployerHomePage(): boolean {
    return this.router.url === '/employer-home';
  }


  onLoginClick() {
    this.router.navigate(['/login']);  // Navigate to login page
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  // Navigation methods for the Track Applications and My Profile buttons
  trackApplications() {
    // Add routing logic for tracking applications
    this.router.navigate(['/track-applications']);
  }

  myProfile() {
    // Add routing logic for My Profile
    this.router.navigate(['/my-profile']);
  }

  // Function to check if the current page is the My Profile page
  isProfilePage(): boolean {
    return this.router.url === '/my-profile';
  }

  isMyProfilePage(): boolean {
    return this.router.url === '/my-profile';
  }
  isTrackApplicationsPage(): boolean {
    return this.router.url === '/track-applications';
  }

}

