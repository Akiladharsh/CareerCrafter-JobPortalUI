import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { JobPostingService } from '../services/JobPosting.service';  // Import the service
import { JobPosting } from '../Models/JobPosting.model';  // Import the model

@Component({
  selector: 'app-employee-create-jobs',
  standalone: true,
  imports: [ReactiveFormsModule],  // Make sure ReactiveFormsModule is included
  templateUrl: './employee-create-jobs.component.html',
  styleUrls: ['./employee-create-jobs.component.css']
})
export class EmployeeCreateJobsComponent {
  jobForm: FormGroup;

  constructor(private fb: FormBuilder, private JobPostingService: JobPostingService) {
    this.jobForm = this.fb.group({
      organisationName: ['', Validators.required],
      role: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Submit the form and send data to the service for API call
  onSubmit() {
    if (this.jobForm.valid) {
      const jobData: JobPosting = this.jobForm.value;
      const token = localStorage.getItem('jwtToken');  // Fetch JWT token from localStorage

      if (token) {
        // Call the service to create a new job posting
        this.JobPostingService.createJobPosting(jobData, token).subscribe({
          next: (response) => {
            alert('Job created successfully!');
            this.jobForm.reset();  // Optionally reset the form
          },
          error: (error) => {
            console.error('Error creating job:', error);
          }
        });
      } else {
        console.error('No token found in local storage');
      }
    }
  }
}
