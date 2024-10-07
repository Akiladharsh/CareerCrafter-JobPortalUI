import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobSeekerService, JobSeekerApplication, JobSeekerProfile  } from '../services/job-seeker2.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-employee-view-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-view-applications.component.html',
  styleUrl: './employee-view-applications.component.css'
})

export class EmployeeViewApplicationsComponent implements OnInit {
  jobSeeker: JobSeekerProfile | undefined;

  constructor(
    private route: ActivatedRoute, 
    private jobSeekerService: JobSeekerService
  ) {}

  ngOnInit(): void {
    const seekerId = Number(this.route.snapshot.paramMap.get('seekerId'));  // Fetch seekerId from route params

    // Fetch job seeker details based on the seekerId
    if (seekerId) {
      this.jobSeekerService.getJobSeekerById(seekerId).subscribe(
        (data) => {
          this.jobSeeker = data;  // Store the fetched profile data
        },
        (error) => {
          console.error('Error fetching job seeker details:', error);
        }
      );
    }
  }
}
