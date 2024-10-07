import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobSeekerHomeComponent } from './job-seeker-home/job-seeker-home.component';
import { JobSeekerProfileComponent } from './job-seeker-profile/job-seeker-profile.component';
import { TrackComponent } from './track/track.component'; // Import TrackComponent
import { EmployeehomeComponent } from './employeehome/employeehome.component';
import { EmployeeTrackApplicationsComponent } from './employee-track-applications/employee-track-applications.component';
import { EmployeeMyProfileComponent } from './employee-my-profile/employee-my-profile.component';
import { EmployeeCreateJobsComponent } from './employee-create-jobs/employee-create-jobs.component';
import { EmployeeViewApplicationsComponent } from './employee-view-applications/employee-view-applications.component';
// Uncomment the below line if you need the Employer homepage component
// import { EmployerhomepageComponent } from './employerhomepage/employerhomepage.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route to Home
  { path: 'login', component: LoginComponent },  // Route for Login
  { path: 'register', component: RegisterComponent },  // Route for Registration
  { path: 'job-seeker-home', component: JobSeekerHomeComponent },  // Route for Job Seeker Home
  { path: 'profile', component: JobSeekerProfileComponent },  // Route for Job Seeker Profile
  { path: 'track', component: TrackComponent },  // Route for Track My Application
  { path: 'employer-home', component: EmployeehomeComponent }, // Route for Employer Home
  { path: 'track-applications', component: EmployeeTrackApplicationsComponent }, // Route for Tracking Applications
  { path: 'my-profile', component: EmployeeMyProfileComponent }, // Route for Employer Profile
  { path: 'create-job', component: EmployeeCreateJobsComponent }, // Route for Creating Jobs
  { path: 'view-applications/:seekerId', component: EmployeeViewApplicationsComponent }, // Route for Viewing Applications
  // Uncomment the below line if you need the Employer homepage route
  // { path: 'home-employer', component: EmployerhomepageComponent },
  
  // Redirect any unknown paths to Home
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
