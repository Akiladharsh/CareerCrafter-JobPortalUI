import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service'; // Import the service
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-my-profile',
  standalone: true,
  imports: [ReactiveFormsModule],  // Add ReactiveFormsModule to the imports array
  templateUrl: './employee-my-profile.component.html',
  styleUrls: ['./employee-my-profile.component.css'],
})

export class EmployeeMyProfileComponent implements OnInit {  // Implement OnInit
  profileForm: FormGroup;
  employerId: number | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    // Fetch employerId from local storage
    const storedEmployerId = localStorage.getItem('employerId');
    if (storedEmployerId) {
      this.employerId = +storedEmployerId; // Convert to a number
    }

    // Initialize the reactive form with form controls and validators
    this.profileForm = this.fb.group({
      contactPersonName: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.loadProfile();  // Call the method to load the profile details on initialization
  }

  loadProfile() {
    if (this.employerId !== null) {
      this.profileService.getProfile(this.employerId).subscribe(
        (profileData) => {
          // Populate the form with the fetched data
          this.profileForm.patchValue({
            contactPersonName: profileData.contactPersonName,
            companyName: profileData.companyName,
            location: profileData.location,
            phoneNo: profileData.phoneNo,
            email: profileData.email,
          });
        },
        (error) => {
          console.error('Error fetching profile data', error);
          alert('Failed to load profile data. Please try again later.');
        }
      );
    }
  }

  // Function to handle form submission
  onSubmit() {
    if (this.profileForm.valid && this.employerId !== null) {
      const formData = {
        employerId: this.employerId, // Include employerId from local storage
        ...this.profileForm.value,  // Merge form values
      };

      // Call the service to update the profile
      this.profileService.updateProfile(formData).subscribe(
        (response) => {
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error('Error updating profile', error);
          alert('Failed to update profile. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}

