
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AnalysisResponse, AnalysisResult, JobDescription, Resume, ResumeUploadResponse, AnalysisRequestPayload } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(contentType: string = 'application/json'): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }

    if (environment.authEnabled) {
      const token = localStorage.getItem(environment.tokenKey);
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An API error occurred.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error('API Error details:', error);
    return throwError(() => new Error(errorMessage));
  }

  uploadResume(file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ResumeUploadResponse>(`${this.apiUrl}/resumes/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  getResume(id: string): Observable<Resume> {
    return this.http.get<Resume>(`${this.apiUrl}/resumes/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteResume(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/resumes/${id}`)
      .pipe(catchError(this.handleError));
  }

  createJobDescription(job: JobDescription): Observable<JobDescription> {
    const jobToCreate = { ...job, id: job.id === '' ? undefined : job.id };
    return this.http.post<JobDescription>(`${this.apiUrl}/jobs`, jobToCreate, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getJobDescriptions(): Observable<JobDescription[]> {
    return this.http.get<JobDescription[]>(`${this.apiUrl}/jobs`)
      .pipe(catchError(this.handleError));
  }

  getJobDescription(id: string): Observable<JobDescription> {
    return this.http.get<JobDescription>(`${this.apiUrl}/jobs/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateJobDescription(id: string, job: JobDescription): Observable<JobDescription> {
    return this.http.put<JobDescription>(`${this.apiUrl}/jobs/${id}`, job, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteJobDescription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${id}`)
      .pipe(catchError(this.handleError));
  }

  analyzeResume(resumeId: string, jobId: string): Observable<AnalysisResponse> {
    const payload: AnalysisRequestPayload = {
      resumeId: resumeId,
      jobDescriptionId: jobId
    };
    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analysis`, payload, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAnalysisResults(): Observable<AnalysisResult[]> {
    return this.http.get<AnalysisResult[]>(`${this.apiUrl}/analysis`)
      .pipe(catchError(this.handleError));
  }

  getAnalysisResult(id: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}/analysis/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteAnalysisResult(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/analysis/${id}`)
      .pipe(catchError(this.handleError));
  }
}