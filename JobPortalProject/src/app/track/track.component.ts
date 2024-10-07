import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TrackService } from '../services/track.service'; // Track service to call API
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track',
  standalone: true,
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
  imports: [HttpClientModule, CommonModule]
})
export class TrackComponent implements OnInit {
  applications: any[] = [];

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  // Fetch all applications for the current job seeker
  loadApplications() {
    this.trackService.getApplicationsByJobSeekerId().subscribe(
      (data) => {
        console.log('Applications fetched:', data);
        this.applications = data;
      },
      (error) => {
        console.error('Error fetching applications:', error);
        alert('Failed to load applications. Please try again later.');
      }
    );
  }

  // Delete an application
  deleteApplication(id: number) {
    const jobSeekerId = Number(localStorage.getItem('jobSeekerId'));  // Get JobSeekerId from local storage
    console.log('Deleting Application with ID:', id);  // Log applicationStatusId
    console.log('Job Seeker ID:', jobSeekerId);  // Log jobSeekerId

    if (confirm('Are you sure you want to delete this application?')) {
      this.trackService.deleteApplication(id, jobSeekerId).subscribe(
        (response) => {
          console.log('Deleted Application ID:', id);  // Log after successful deletion
          alert('Application deleted successfully!');
          // Filter out the deleted application from the UI
          this.applications = this.applications.filter(app => app.applicationStatusId !== id);
        },
        (error) => {
          console.error('Error deleting application:', error);
          alert('Failed to delete the application. Please try again later.');
        }
      );
    }
  }
}
