
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { ResumeUploadResponse } from '../../models';

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css']
})
export class ResumeUploadComponent {
  selectedFile: File | null = null;
  fileName = '';
  uploadProgress = 0;
  isUploading = false;
  uploadComplete = false;
  uploadFailed = false;
  allowedFileTypes = ['.pdf', '.doc', '.docx'];

  @Output() resumeUploaded = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.uploadComplete = false;
      this.uploadFailed = false;
      if (!this.validateFile()) {
        this.selectedFile = null;
        this.fileName = '';
      }
    }
  }

  validateFile(): boolean {
    if (!this.selectedFile) {
      this.showError('No file selected.');
      return false;
    }

    const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !this.allowedFileTypes.includes(`.${fileExtension}`)) {
      this.showError('Invalid file type. Please upload a PDF or Word document (.doc, .docx).');
      return false;
    }

    if (this.selectedFile.size > 5 * 1024 * 1024) {
      this.showError('File size too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  }

  uploadResume(): void {
    if (!this.selectedFile || !this.validateFile()) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadComplete = false;
    this.uploadFailed = false;

    const progressInterval = setInterval(() => {
      this.uploadProgress = Math.min(95, this.uploadProgress + Math.floor(Math.random() * 5) + 2);
    }, 150);

    this.apiService.uploadResume(this.selectedFile).subscribe({
      next: (response: ResumeUploadResponse) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        this.uploadComplete = true;
        this.isUploading = false;
        this.showSuccess('Resume uploaded successfully!');
        if (response.id) {
          this.resumeUploaded.emit(response.id);
        } else {
          this.showError('Upload successful, but no resume ID received.');
        }
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isUploading = false;
        this.uploadFailed = true;
        this.showError('Error uploading resume. Please try again.');
        console.error('Upload error:', err);
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.uploadProgress = 0;
    this.isUploading = false;
    this.uploadComplete = false;
    this.uploadFailed = false;
  }
}