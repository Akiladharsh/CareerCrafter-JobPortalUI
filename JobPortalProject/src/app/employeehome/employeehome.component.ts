import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employeehome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employeehome.component.html',
  styleUrls: ['./employeehome.component.css']
})

export class EmployeehomeComponent implements OnInit {
  jobs: any[] = [];  // Hold job postings from API
  filteredJobs: any[] = [];  // Hold filtered job postings for display
  editMode: boolean = false;  // Flag for displaying the edit form
  currentJob: any = null;  // Hold job to be edited
  totalJobPostings: number = 0;  // To store total job postings count
  totalApplications: number = 0;  // To store total applications count
  searchTerm: string = '';  // To hold the search term

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getJobPostings();  // Fetch job postings when component initializes
    this.getTotalJobPostings();  // Fetch total job postings count
    this.getTotalApplications();  // Fetch total applications count
  }

  // Fetch job postings from API
  getJobPostings() {
    const url = 'https://localhost:7134/api/JobPostings/employer';
    const token = localStorage.getItem('jwtToken');  // Retrieve the JWT token from local storage

    if (token) {
      this.http.get<any[]>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          this.jobs = response;
          this.filteredJobs = response; // Initialize filteredJobs with all jobs
        },
        (error) => {
          console.error('Error fetching job postings:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  // Fetch total number of job postings for the employer
  getTotalJobPostings() {
    const employerId = localStorage.getItem('employerId');  // Retrieve employer ID from local storage
    console.log('EmployerId:', employerId);  // Log EmployerId to ensure it's being retrieved
    const url = `https://localhost:7134/api/JobPostings/employer/${employerId}/count`;
    const token = localStorage.getItem('jwtToken');
  
    if (token) {
      this.http.get<any>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('Job postings count response:', response);  // Log API response
          this.totalJobPostings = response.jobPostingCount;
        },
        (error) => {
          console.error('Error fetching job postings count:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }
  
  getTotalApplications() {
    const employerId = localStorage.getItem('employerId');
    console.log('EmployerId for applications:', employerId);  // Log EmployerId to ensure it's being retrieved
    const url = `https://localhost:7134/api/ApplicationStatus/CountApplications/${employerId}`;
    const token = localStorage.getItem('jwtToken');
  
    if (token) {
      this.http.get<number>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('Applications count response:', response);  // Log API response
          this.totalApplications = response;
        },
        (error) => {
          console.error('Error fetching applications count:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  // Filter job postings based on the search term
  filterJobs() {
    this.filteredJobs = this.jobs.filter(job => 
      job.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Search input change event
  onSearchChange() {
    this.filterJobs();
  }

  // Delete job posting
  deleteJob(jobPostingId: number) {
    const url = `https://localhost:7134/api/JobPostings/${jobPostingId}`;
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http.delete(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('Job deleted successfully', response);
          this.jobs = this.jobs.filter(job => job.jobPostingId !== jobPostingId);
          this.filterJobs(); // Refresh the filtered jobs list
        },
        (error) => {
          console.error('Error deleting job posting:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  // Activate edit mode and set the current job for editing
  editJob(job: any) {
    this.editMode = true;
    this.currentJob = { ...job };  // Create a copy of the job to edit
  }

  // Update the job posting using PUT request
  updateJob() {
    const url = `https://localhost:7134/api/JobPostings/${this.currentJob.jobPostingId}`;
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http.put(url, this.currentJob, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).subscribe(
        (response) => {
          console.log('Job updated successfully', response);
          this.editMode = false;  // Exit edit mode after successful update
          this.getJobPostings();  // Refresh job list
        },
        (error) => {
          console.error('Error updating job posting:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  // Navigate to Create Job page
  createJob() {
    this.router.navigate(['/create-job']);
  }

  // Navigate to track applications
  trackApplications() {
    this.router.navigate(['/track-applications']);
  }
}

