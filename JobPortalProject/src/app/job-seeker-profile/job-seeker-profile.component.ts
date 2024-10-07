import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { JobProfileService } from '../services/job-profile.service';
import { Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-seeker-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './job-seeker-profile.component.html',
  styleUrls: ['./job-seeker-profile.component.css'],
})
export class JobSeekerProfileComponent implements OnInit {
  jobSeekerForm!: FormGroup;
  message: string = '';
  isEditing: boolean = false;
  jobSeekerId!: number;

  constructor(private formBuilder: FormBuilder, private jobProfileService: JobProfileService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadJobSeekerData();
  }

  // Form initialization
  initializeForm() {
    this.jobSeekerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      tempAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      gender: ['', Validators.required],
      totalExperienceInYears: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      jobSeekerSkills: this.formBuilder.array([]),
      jobSeekerCertifications: this.formBuilder.array([]),
      jobSeekerLanguages: this.formBuilder.array([]),
      jobSeekerProjects: this.formBuilder.array([]),
      jobSeekerExperience: this.formBuilder.array([]),
      jobSeekerQualification: this.formBuilder.array([]),
    });
  }

  // Load job seeker data
  loadJobSeekerData() {
    const jobSeekerIdFromStorage = localStorage.getItem('jobSeekerId');
    if (jobSeekerIdFromStorage) {
      this.jobSeekerId = +jobSeekerIdFromStorage;
      this.jobProfileService.getJobSeeker(this.jobSeekerId).subscribe({
        next: (response: any) => {
          console.log('Job Seeker Data Fetched:', response);
          
          // Format dob to 'yyyy-MM-dd' if it's a valid date
          if (response.dob) {
            response.dob = new Date(response.dob).toISOString().split('T')[0]; // Convert to 'yyyy-MM-dd'
          }
          
          this.setDefaultValues(response);
          this.message = 'Job seeker profile loaded successfully!';

          // Populate form arrays with the correct structure
          this.populateFormArray('jobSeekerSkills', response.jobSeekerSkills || [], 'skills');
          this.populateFormArray('jobSeekerCertifications', response.jobSeekerCertifications || [], 'certifications');
          this.populateFormArray('jobSeekerLanguages', response.jobSeekerLanguages || [], 'languages');
          this.populateFormArray('jobSeekerProjects', response.jobSeekerProjects || [], 'projects');
          
          this.populateExperience(response.jobSeekerExperience || []);
          this.populateQualification(response.jobSeekerQualification || []);
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.message = 'An error occurred while fetching the job seeker profile.';
        }
      });
    }
  }

  // Set default values for empty fields
  setDefaultValues(data: any) {
    const defaultValues: { [key: string]: string | number } = {
      name: 'Enter Name',
      phoneNo: 'Enter Phone Number',
      dob: 'Enter Date of Birth',
      tempAddress: 'Enter Temporary Address',
      permanentAddress: 'Enter Permanent Address',
      gender: 'Enter Gender (Male/Female/Other)',
      totalExperienceInYears: 0,
    };

    Object.keys(defaultValues).forEach(key => {
      if (!data[key] || data[key] === '') {
        data[key] = defaultValues[key];
      }
    });

    this.jobSeekerForm.patchValue(data);
  }

  // Populate dynamic form array
  populateFormArray(controlName: string, items: any[], itemKey: string) {
    const formArray = this.jobSeekerForm.get(controlName) as FormArray;
    formArray.clear();
    if (items && items.length > 0) {
      items.forEach(item => {
        formArray.push(this.formBuilder.group({
          [itemKey]: [item[itemKey] || 'Enter ' + itemKey.charAt(0).toUpperCase() + itemKey.slice(1)]
        }));
      });
    } else {
      formArray.push(this.formBuilder.group({
        [itemKey]: ['Enter ' + itemKey.charAt(0).toUpperCase() + itemKey.slice(1)]
      }));
    }
  }

  // Populate experience with structured data
  populateExperience(experiences: any[]) {
    const experienceArray = this.jobSeekerForm.get('jobSeekerExperience') as FormArray;
    experienceArray.clear();
    
    // Check if there are experiences, if not, populate with default values
    if (experiences.length === 0) {
      experienceArray.push(this.formBuilder.group({
        previousCompanyName: ['Enter Previous Company Name', Validators.required],
        fromYear: ['Enter From Year', Validators.required],
        toYear: ['Enter To Year', Validators.required]
      }));
    } else {
      experiences.forEach(experience => {
        experienceArray.push(this.formBuilder.group({
          previousCompanyName: [experience.previousCompanyName || 'Enter Previous Company Name', Validators.required],
          fromYear: [experience.fromYear || 'Enter From Year', Validators.required],
          toYear: [experience.toYear || 'Enter To Year', Validators.required]
        }));
      });
    }
  }

  // Populate qualification with structured data
  populateQualification(qualifications: any[]) {
    const qualificationArray = this.jobSeekerForm.get('jobSeekerQualification') as FormArray;
    qualificationArray.clear();
    
    // Check if there are qualifications, if not, populate with default values
    if (qualifications.length === 0) {
      qualificationArray.push(this.formBuilder.group({
        qualification: ['Enter Qualification', Validators.required],
        instituteName: ['Enter Institute Name', Validators.required],
        passedOutYear: ['Enter Passed Out Year', Validators.required]
      }));
    } else {
      qualifications.forEach(qualification => {
        qualificationArray.push(this.formBuilder.group({
          qualification: [qualification.qualification || 'Enter Qualification', Validators.required],
          instituteName: [qualification.instituteName || 'Enter Institute Name', Validators.required],
          passedOutYear: [qualification.passedOutYear || 'Enter Passed Out Year', Validators.required]
        }));
      });
    }
  }

  // Toggle edit mode
  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.jobSeekerForm.enable();
      this.jobSeekerForm.get('email')?.disable(); // Keep email disabled
    } else {
      this.jobSeekerForm.disable();
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.jobSeekerForm.valid) {
      const formData = this.jobSeekerForm.getRawValue();

      // Ensure email is included even if it's disabled
      formData.email = this.jobSeekerForm.get('email')?.value;

      // Format DOB to 'yyyy-MM-dd'
      formData.dob = new Date(formData.dob).toISOString().split('T')[0]; // Ensure correct date format

      console.log('Formatted Form Data:', formData); // Log to check the output

      this.jobProfileService.updateJobSeeker(this.jobSeekerId, formData).subscribe({
        next: () => {
          this.message = 'Profile updated successfully!';
          this.isEditing = false;

          // Optional: Show a popup notification (you can use a modal library or a simple alert)
          alert('Profile updated successfully!');
          this.router.navigate(['/job-seeker-home']);
        },
        error: (error) => {
          console.error('Error:', error);
          if (error.error && error.error.errors) {
            console.error('Validation Errors:', error.error.errors);
          }
          this.message = error.error?.title || 'An error occurred while updating the profile.';
        }
      });
    } else {
      this.message = 'Please fill in all required fields correctly.';
    }
  }

  // Dynamic FormArray handling for skills
  get jobSeekerSkills() { return this.jobSeekerForm.get('jobSeekerSkills') as FormArray; }
  addSkill() { this.jobSeekerSkills.push(this.formBuilder.group({ skills: ['Enter Skill', Validators.required] })); }
  removeSkill(index: number) { this.jobSeekerSkills.removeAt(index); }

  // Dynamic FormArray handling for certifications
  get jobSeekerCertifications() { return this.jobSeekerForm.get('jobSeekerCertifications') as FormArray; }
  addCertification() { this.jobSeekerCertifications.push(this.formBuilder.group({ certifications: ['Enter Certification', Validators.required] })); }
  removeCertification(index: number) { this.jobSeekerCertifications.removeAt(index); }

  // Dynamic FormArray handling for languages
  get jobSeekerLanguages() { return this.jobSeekerForm.get('jobSeekerLanguages') as FormArray; }
  addLanguage() { this.jobSeekerLanguages.push(this.formBuilder.group({ languages: ['Enter Language', Validators.required] })); }
  removeLanguage(index: number) { this.jobSeekerLanguages.removeAt(index); }

  // Dynamic FormArray handling for projects
  get jobSeekerProjects() { return this.jobSeekerForm.get('jobSeekerProjects') as FormArray; }
  addProject() { this.jobSeekerProjects.push(this.formBuilder.group({ projects: ['Enter Project', Validators.required] })); }
  removeProject(index: number) { this.jobSeekerProjects.removeAt(index); }

  // Dynamic FormArray handling for experience
  get jobSeekerExperience() { return this.jobSeekerForm.get('jobSeekerExperience') as FormArray; }
  addExperience() {
    this.jobSeekerExperience.push(this.formBuilder.group({
      previousCompanyName: ['Enter Previous Company Name', Validators.required],
      fromYear: ['Enter From Year', Validators.required],
      toYear: ['Enter To Year', Validators.required]
    }));
  }
  removeExperience(index: number) { this.jobSeekerExperience.removeAt(index); }

  // Dynamic FormArray handling for qualifications
  get jobSeekerQualification() { return this.jobSeekerForm.get('jobSeekerQualification') as FormArray; }
  addQualification() {
    this.jobSeekerQualification.push(this.formBuilder.group({
      qualification: ['Enter Qualification', Validators.required],
      instituteName: ['Enter Institute Name', Validators.required],
      passedOutYear: ['Enter Passed Out Year', Validators.required]
    }));
  }
  removeQualification(index: number) { this.jobSeekerQualification.removeAt(index); }
}
