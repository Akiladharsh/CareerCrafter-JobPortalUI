import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP requests
import { JobService, ApplicationStatus } from '../services/job.service'; // Adjust the path if necessary

@Component({
  selector: 'app-job-seeker-home',
  standalone: true,
  templateUrl: './job-seeker-home.component.html',
  styleUrls: ['./job-seeker-home.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]  // Include necessary Angular modules
})
export class JobSeekerHomeComponent {
  searchTerm: string = '';
  jobs: any[] = [];
  filteredJobs: any[] = [];
  isLoading: boolean = true;  // Loading indicator

  // State variables for application flow
  applyingJobId: number | null = null;  // Stores the job id for the currently applied job
  resumeFile: File | null = null;  // Stores the uploaded resume file
  isResumeUploaded: boolean = false;  // Tracks if resume has been uploaded

  // Track applied jobs
  appliedJobs: Set<number> = new Set(); // Use a Set to store applied job IDs

  constructor(private jobService: JobService, private router: Router) {
    this.loadJobs();
  }

  // Load recent jobs
  loadJobs() {
    this.jobService.getRecentJobs().subscribe(
      (data) => {
        console.log('Jobs received from API:', data);
        this.jobs = data;
        this.filteredJobs = [...this.jobs];  // Initialize with all jobs
        this.isLoading = false;  // Stop loading
      },
      (error) => {
        console.error('Error fetching jobs:', error);
        this.isLoading = false;  // Stop loading even if there's an error
        alert('Failed to load jobs. Please try again later.');
      }
    );
  }

  // Filter jobs based on search input (case-insensitive)
  onSearchChange() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredJobs = this.jobs.filter(job => 
      (job.role && job.role.toLowerCase().includes(searchTermLower)) ||
      (job.organisationName && job.organisationName.toLowerCase().includes(searchTermLower))
    );
  }

  // Trigger the application process for a specific job
  applyForJob(job: any) {
    console.log('Applying for job:', job);
    this.applyingJobId = job.jobPostingId;  // Set the jobId for which the apply button was clicked
    this.isResumeUploaded = false;  // Reset resume upload state
  }

  // Handle resume file input
  onResumeSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resumeFile = file;
      this.isResumeUploaded = true;  // Set to true if a resume file is uploaded
    }
  }

  // Submit the application for the specific job
  submitApplication(job: any) {
    const jobSeekerId = Number(localStorage.getItem('jobSeekerId')); // Retrieve jobSeekerId from localStorage

    // Check if a resume has been uploaded
    if (!this.isResumeUploaded) {
      alert('Please upload a resume before submitting your application.'); // Show error message
      return; // Exit the method
    }

    // Proceed only if resume file is uploaded
    if (this.resumeFile && jobSeekerId) {
      console.log('Submitting application for:', job);
      console.log('Resume file:', this.resumeFile);

      // Call the service to upload the resume
      this.jobService.uploadResume(jobSeekerId, this.resumeFile).subscribe(
        (response) => {
          console.log('Resume uploaded successfully:', response);

          // Prepare the application status object
          const applicationStatus: ApplicationStatus = {
            applicationStatusId: 0,
            jobSeeker_Id: jobSeekerId,
            jobPostingId: this.applyingJobId!,
            employerId: job.employerId,  // Ensure to retrieve the employerId from the job object
            companyName: job.organisationName,  // Get the company name from the job object
            role: job.role,  // Get the role from the job object
            description: job.description,  // Get the job description
            status: 'Pending'  // Set status to pending
          };

          // Call the service to add application status
          this.jobService.addApplicationStatus(applicationStatus).subscribe(
            (statusResponse) => {
              console.log('Application status added successfully:', statusResponse);
              alert('Application submitted successfully!');
              this.appliedJobs.add(this.applyingJobId!); // Mark the job as applied
              this.resetApplicationState(); // Reset the application state
            },
            (error) => {
              console.error('Error adding application status:', error);
              alert('Applied already');
            }
          );
        },
        (error) => {
          console.error('Error uploading resume:', error);
          alert('Failed to upload resume. Please try again later.');
        }
      );
    } else {
      alert('Please upload a resume first.'); // Fallback alert
    }
  }

  // Reset application state
  resetApplicationState() {
    this.applyingJobId = null; 
    this.resumeFile = null; 
    this.isResumeUploaded = false; 
  }

  // Navigation to job seeker's profile page
  navigateToProfile() {
    this.router.navigate(['/profile']);  // Update the route to your profile component
  }

  // Navigation to track application status
  navigateToTrack() {
    this.router.navigate(['/track']);
  }
}
