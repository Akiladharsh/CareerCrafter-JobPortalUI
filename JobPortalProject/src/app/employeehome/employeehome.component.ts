import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-employeehome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employeehome.component.html',
  styleUrls: ['./employeehome.component.css']
})
export class EmployeehomeComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  editMode: boolean = false;
  currentJob: any = null;
  totalJobPostings: number = 0;
  totalApplications: number = 0;
  searchTerm: string = '';
  jobPostingsChart: any;
  dataFetched = { postings: false, applications: false };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getJobPostings();
    this.getTotalJobPostings();
    this.getTotalApplications();
  }

  createCharts() {
    if (this.jobPostingsChart) {
      this.jobPostingsChart.destroy();
    }
  
    this.jobPostingsChart = new Chart('jobPostingsChart', {
      type: 'bar',
      data: {
        labels: ['Your Job Postings', 'Total Applications Received'],
        datasets: [{
          label: 'Count',
          data: [this.totalJobPostings, this.totalApplications],
          backgroundColor: ['#42A5F5', '#66BB6A'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false  // Hide the legend
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Categories'
            }
          }
        }
      }
    });
  }
  

  getJobPostings() {
    const url = 'https://localhost:7134/api/JobPostings/employer';
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http.get<any[]>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          this.jobs = response;
          this.filteredJobs = response;
        },
        (error) => {
          console.error('Error fetching job postings:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  getTotalJobPostings() {
    const employerId = localStorage.getItem('employerId');
    const url = `https://localhost:7134/api/JobPostings/employer/${employerId}/count`;
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http.get<any>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          this.totalJobPostings = response.jobPostingCount;
          this.dataFetched.postings = true;
          this.checkAndCreateChart();
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
    const url = `https://localhost:7134/api/ApplicationStatus/CountApplications/${employerId}`;
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http.get<number>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          this.totalApplications = response;
          this.dataFetched.applications = true;
          this.checkAndCreateChart();
        },
        (error) => {
          console.error('Error fetching applications count:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  checkAndCreateChart() {
    if (this.dataFetched.postings && this.dataFetched.applications) {
      this.createCharts();
    }
  }

  filterJobs() {
    this.filteredJobs = this.jobs.filter(job =>
      job.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange() {
    this.filterJobs();
  }

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
          this.filterJobs();
        },
        (error) => {
          console.error('Error deleting job posting:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  editJob(job: any) {
    this.editMode = true;
    this.currentJob = { ...job };
  }

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
          this.editMode = false;
          this.getJobPostings();
        },
        (error) => {
          console.error('Error updating job posting:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  createJob() {
    this.router.navigate(['/create-job']);
  }

  trackApplications() {
    this.router.navigate(['/track-applications']);
  }
}
