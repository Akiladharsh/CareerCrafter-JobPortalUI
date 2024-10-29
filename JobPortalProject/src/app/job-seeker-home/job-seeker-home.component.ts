import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JobService, ApplicationStatus } from '../services/job.service';

@Component({
  selector: 'app-job-seeker-home',
  standalone: true,
  templateUrl: './job-seeker-home.component.html',
  styleUrls: ['./job-seeker-home.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class JobSeekerHomeComponent implements OnInit {
  searchTerm: string = '';
  jobs: any[] = [];
  filteredJobs: any[] = [];
  isLoading: boolean = true;
  applyingJobId: number | null = null;
  resumeFile: File | null = null;
  isResumeUploaded: boolean = false;
  appliedJobs: Set<number> = new Set();
  jobSeekerName: string = '';  // New property for the job seeker's name

  constructor(private jobService: JobService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadJobs();
    this.fetchJobSeekerName();
  }

  loadJobs() {
    this.jobService.getRecentJobs().subscribe(
      (data) => {
        this.jobs = data;
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
        this.isLoading = false;
        alert('Failed to load jobs. Please try again later.');
      }
    );
  }

  fetchJobSeekerName() {
    const jobSeekerId = localStorage.getItem('jobSeekerId');
    if (jobSeekerId) {
      this.http.get<any>(`https://localhost:7134/api/JobSeeker/${jobSeekerId}`).subscribe(
        (response) => {
          this.jobSeekerName = response.name || 'Guest';
        },
        (error) => {
          console.error('Error fetching job seeker name:', error);
        }
      );
    }
  }

  onSearchChange() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.role && job.role.toLowerCase().includes(searchTermLower)) ||
      (job.organisationName && job.organisationName.toLowerCase().includes(searchTermLower))
    );
  }

  applyForJob(job: any) {
    this.applyingJobId = job.jobPostingId;
    this.isResumeUploaded = false;
  }

  onResumeSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resumeFile = file;
      this.isResumeUploaded = true;
    }
  }

  submitApplication(job: any) {
    const jobSeekerId = Number(localStorage.getItem('jobSeekerId'));
    if (!this.isResumeUploaded) {
      alert('Please upload a resume before submitting your application.');
      return;
    }

    if (this.resumeFile && jobSeekerId) {
      this.jobService.uploadResume(jobSeekerId, this.resumeFile).subscribe(
        (response) => {
          const applicationStatus: ApplicationStatus = {
            applicationStatusId: 0,
            jobSeeker_Id: jobSeekerId,
            jobPostingId: this.applyingJobId!,
            employerId: job.employerId,
            companyName: job.organisationName,
            role: job.role,
            description: job.description,
            status: 'Pending'
          };

          this.jobService.addApplicationStatus(applicationStatus).subscribe(
            () => {
              alert('Application submitted successfully!');
              this.appliedJobs.add(this.applyingJobId!);
              this.resetApplicationState();
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
    }
  }

  resetApplicationState() {
    this.applyingJobId = null;
    this.resumeFile = null;
    this.isResumeUploaded = false;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToTrack() {
    this.router.navigate(['/track']);
  }
}
