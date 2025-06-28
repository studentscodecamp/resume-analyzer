
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { JobDescription, Resume } from '../../models';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.css']
})
export class JobDescriptionComponent implements OnInit {
  @Input() currentResumeId: string | null = null;

  @Output() analyzeJob = new EventEmitter<string>();

  jobs: JobDescription[] = [];
  newJob: JobDescription = {
    id: '',
    title: '',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    experienceLevel: ''
  };
  showForm = false;
  experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.apiService.getJobDescriptions().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: (err) => {
        this.snackBar.open('Failed to load job descriptions.', 'Dismiss', { panelClass: ['error-snackbar'] });
        console.error('Error loading jobs:', err);
      }
    });
  }

  createJob(): void {
    if (!this.newJob.title || !this.newJob.description || !this.newJob.requiredSkills || !this.newJob.experienceLevel) {
      this.snackBar.open('Please fill all required fields for the new job.', 'Dismiss', { panelClass: ['warn-snackbar'] });
      return;
    }

    this.apiService.createJobDescription(this.newJob).subscribe({
      next: (createdJob) => {
        this.snackBar.open(`Job "${createdJob.title}" created successfully!`, 'Close', { panelClass: ['success-snackbar'] });
        this.loadJobs();
        this.resetForm();
        this.showForm = false;
      },
      error: (err) => {
        this.snackBar.open('Error creating job description. Please try again.', 'Dismiss', { panelClass: ['error-snackbar'] });
        console.error('Error creating job:', err);
      }
    });
  }

  onAnalyzeJob(jobId: string): void {
    if (!this.currentResumeId) {
      this.snackBar.open('Please upload a resume first to perform analysis.', 'Dismiss', { panelClass: ['warn-snackbar'] });
      return;
    }
    this.analyzeJob.emit(jobId);
  }

  private resetForm(): void {
    this.newJob = {
      id: '',
      title: '',
      description: '',
      requiredSkills: '',
      preferredSkills: '',
      experienceLevel: ''
    };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  editJob(job: JobDescription): void {
    this.snackBar.open('Edit functionality not yet implemented.', 'Dismiss', { duration: 2000 });
    console.log('Edit Job:', job);
  }

  deleteJob(jobId: string): void {
    this.apiService.deleteJobDescription(jobId).subscribe({
      next: () => {
        this.snackBar.open('Job description deleted.', 'Close', { panelClass: ['success-snackbar'] });
        this.loadJobs();
      },
      error: (err) => {
        this.snackBar.open('Error deleting job description.', 'Dismiss', { panelClass: ['error-snackbar'] });
        console.error('Delete error:', err);
      }
    });
  }
}