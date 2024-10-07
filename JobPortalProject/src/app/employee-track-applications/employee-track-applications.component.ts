import { Component , OnInit } from '@angular/core';
import { NgFor } from '@angular/common';  // Import NgFor directive
import { CommonModule } from '@angular/common'; // Import CommonModule for other common functionalities
import { JobSeekerService, JobSeekerApplication  } from '../services/job-seeker.service';
import { Router } from '@angular/router'; // Import Router
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { of } from 'rxjs'; // In case you mock the API call in the service
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-track-applications',
  standalone: true,
  imports: [NgFor, CommonModule,FormsModule],
  templateUrl: './employee-track-applications.component.html',
  styleUrl: './employee-track-applications.component.css'
})

export class EmployeeTrackApplicationsComponent implements OnInit {
  jobSeekers: JobSeekerApplication[] = [];
  filteredJobSeekers: JobSeekerApplication[] = []; // For filtered job seekers
  employerId: number = 1;
  token: string = '';
  searchQuery: string = ''; // Add a search query variable

  constructor(
    private jobSeekerService: JobSeekerService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken') || '';
    const storedEmployerId = localStorage.getItem('employerId');
    if (storedEmployerId) {
      this.employerId = parseInt(storedEmployerId, 10);
    }

    this.fetchJobSeekers();
  }

  fetchJobSeekers() {
    this.jobSeekerService.getJobSeekersWithRole().subscribe((data) => {
      this.jobSeekers = data;
      this.filteredJobSeekers = data; // Initialize filtered list
    });
  }

  filterJobSeekers() {
    this.filteredJobSeekers = this.jobSeekers.filter(seeker => 
      seeker.role.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  viewProfile(seekerId: number) {
    if (seekerId) {
      localStorage.setItem('jobSeekerId', seekerId.toString());
      this.router.navigate([`/view-applications`, seekerId]);
    }
  }

  selectJobPosting(jobPostingId: number) {
    if (jobPostingId) {
      localStorage.setItem('jobPostingId', jobPostingId.toString());
    }
  }

  updateApplicationStatus(jobSeekerId: number, status: string) {
    const jobPostingId = localStorage.getItem('jobPostingId');

    if (jobSeekerId && this.employerId && jobPostingId) {
      const apiUrl = `https://localhost:7134/api/ApplicationStatus/UpdateStatus?jobSeekerId=${jobSeekerId}&jobPostingId=${jobPostingId}&employerId=${this.employerId}`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

      this.http.patch(apiUrl, `"${status}"`, { headers, responseType: 'text' }).subscribe(
        (response) => {
          alert(`Status updated to '${status}' for JobSeekerId: ${jobSeekerId}`);
        },
        (error) => {
          alert('Error updating status');
        }
      );
    }
  }
}
