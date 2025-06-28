import { Component, OnInit } from '@angular/core'; // Imports core Angular decorators and lifecycle hooks.
import { CommonModule } from '@angular/common'; // Provides common directives like *ngIf, *ngFor.
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router'; // Imports Angular routing modules and classes for navigation.
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Imports Material Design spinner module.
import { ResumeUploadComponent } from './components/resume-upload/resume-upload.component'; // Imports component for resume upload functionality.
import { JobDescriptionComponent } from './components/job-description/job-description.component'; // Imports component for job description management.
import { AnalysisResultsComponent } from './components/analysis-results/analysis-results.component'; // Imports component to display analysis results.
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Imports component for the main dashboard view.
import { ApiService } from './services/api.service'; // Imports a service for making API calls.
import { LoadingService } from './services/loading.service'; // Imports a service to manage global loading state.
import { AnalysisResponse, JobDescription, Resume } from './models'; // Imports data model interfaces from your 'models.ts' file.
import { MatToolbarModule } from '@angular/material/toolbar'; // Imports Material Design toolbar module.
import { MatButtonModule } from '@angular/material/button'; // Imports Material Design button module.
import { MatIconModule } from '@angular/material/icon'; // Imports Material Design icon module.
import { MatSidenavModule } from '@angular/material/sidenav'; // Imports Material Design sidenav module.
import { MatListModule } from '@angular/material/list'; // Imports Material Design list module.
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Imports Material Design progress bar module.
import { MatDividerModule } from '@angular/material/divider'; // Imports Material Design divider module.
import { filter } from 'rxjs/operators'; // Imports the `filter` operator for RxJS streams.

@Component({ // Decorator that marks a class as an Angular component.
  selector: 'app-root', // Custom HTML tag for this component (e.g., <app-root>).
  standalone: true, // Declares this component as standalone, not requiring a separate NgModule.
  imports: [ // Specifies other standalone components or NgModules this component needs.
    CommonModule, // Required for common Angular directives.
    RouterOutlet, // Placeholder for routed components.
    RouterLink, // Directive for navigation links.
    RouterLinkActive, // Directive for active link styling.
    MatProgressSpinnerModule, // Allows using Material spinner.
    ResumeUploadComponent, // Makes ResumeUploadComponent available.
    JobDescriptionComponent, // Makes JobDescriptionComponent available.
    AnalysisResultsComponent, // Makes AnalysisResultsComponent available.
    DashboardComponent, // Makes DashboardComponent available.
    MatToolbarModule, // Allows using Material toolbar.
    MatButtonModule, // Allows using Material buttons.
    MatIconModule, // Allows using Material icons.
    MatSidenavModule, // Allows using Material sidenav.
    MatListModule, // Allows using Material lists.
    MatProgressBarModule, // Allows using Material progress bar.
    MatDividerModule // Allows using Material divider.
  ],
  templateUrl: './app.component.html', // Specifies the HTML template file for this component.
  styleUrls: ['./app.component.css'] // Specifies the CSS stylesheet files for this component.
})
export class AppComponent implements OnInit { // Defines the AppComponent class, implementing OnInit for lifecycle hooks.
  title = 'Students Code Camp'; // Application title variable.
  currentYear = new Date().getFullYear(); // Dynamically gets the current year.

  currentStep: 'dashboard' | 'upload_resume' | 'select_job' | 'view_analysis' = 'dashboard'; // Manages application's current view/step.
  currentResumeId: string | null = null; // Stores ID of the currently active resume.
  currentResumeContent: string = ''; // Stores text content of the current resume.
  selectedJob: JobDescription | null = null; // Stores details of the selected job description.
  analysisResult: AnalysisResponse | null = null; // Stores the result of resume analysis.

  isLoading = false; // Tracks global loading state for UI feedback.

  constructor( // Constructor for dependency injection.
    private apiService: ApiService, // Injects ApiService for backend communication.
    public loadingService: LoadingService, // Injects LoadingService to control loading indicators.
    private router: Router // Injects Angular Router for programmatically navigating.
  ) {}

  ngOnInit(): void { // Lifecycle hook: runs once after component initialization.
    this.loadingService.isLoading$.subscribe(loading => { // Subscribes to loading service to update isLoading state.
      this.isLoading = loading; // Updates local isLoading flag based on service.
    });

    // Subscribe to router events to update currentStep based on URL
    this.router.events.pipe( // Listens to router events.
      filter(event => event instanceof NavigationEnd) // Filters events, processing only when navigation officially ends.
    ).subscribe((event: NavigationEnd) => { // Subscribes to filtered NavigationEnd events.
      if (event.urlAfterRedirects.includes('/upload')) { // Checks if the navigated URL includes '/upload'.
        this.currentStep = 'upload_resume'; // Sets current step to resume upload.
      } else if (event.urlAfterRedirects.includes('/jobs/new')) { // Checks if URL includes '/jobs/new'.
        this.currentStep = 'select_job'; // Sets current step to job selection.
      } else if (event.urlAfterRedirects.includes('/dashboard')) { // Checks if URL includes '/dashboard'.
        this.currentStep = 'dashboard'; // Sets current step to dashboard.
      } else { // Handles other routes, defaults to dashboard.
        this.currentStep = 'dashboard'; // Default step for unmatched routes.
      }
    });

    // Initialize currentStep based on the initial URL on load
    this.updateCurrentStepFromUrl(this.router.url); // Sets initial step based on current browser URL.
  }

  private updateCurrentStepFromUrl(url: string): void { // Helper method to set step from a given URL string.
    if (url.includes('/upload')) { // Checks for '/upload' in URL.
      this.currentStep = 'upload_resume'; // Sets step to upload.
    } else if (url.includes('/jobs/new')) { // Checks for '/jobs/new' in URL.
      this.currentStep = 'select_job'; // Sets step to select job.
    } else if (url.includes('/dashboard')) { // Checks for '/dashboard' in URL.
      this.currentStep = 'dashboard'; // Sets step to dashboard.
    } else { // Default for other URLs.
      this.currentStep = 'dashboard'; // Default step.
    }
  }

  onResumeUploaded(resumeId: string): void { // Method called when a resume is successfully uploaded.
    this.currentResumeId = resumeId; // Stores the ID of the uploaded resume.
    this.analysisResult = null; // Clears previous analysis result.
    this.selectedJob = null; // Clears previously selected job.
    this.loadResumeContent(resumeId); // Loads the textual content of the uploaded resume.

    this.currentStep = 'select_job'; // Advances the application step to select a job.
  }

  loadResumeContent(resumeId: string): void { // Fetches resume content from API.
    this.apiService.getResume(resumeId).subscribe({ // Calls API service to get resume details.
      next: (resume) => { // Handles successful API response.
        this.currentResumeContent = resume.content; // Stores extracted resume text.
      },
      error: (err) => { // Handles API error.
        console.error('Error fetching resume content:', err); // Logs error.
        this.currentResumeContent = 'Could not load resume content.'; // Sets a fallback message.
      }
    });
  }

  onAnalyzeJob(jobId: string): void { // Initiates resume analysis against a job.
    if (!this.currentResumeId) { // Checks if a resume is available.
      console.error('No resume uploaded to analyze.'); // Logs error if no resume.
      return; // Stops execution.
    }

    this.loadingService.show(); // Shows loading indicator.
    this.apiService.analyzeResume(this.currentResumeId, jobId).subscribe({ // Calls API to analyze resume.
      next: (result) => { // Handles successful analysis response.
        this.analysisResult = result; // Stores analysis result.
        this.apiService.getJobDescription(jobId).subscribe(job => { // Fetches job details for display.
          this.selectedJob = job; // Stores selected job.
          this.loadingService.hide(); // Hides loading indicator.
          this.currentStep = 'view_analysis'; // Advances to view analysis results.
        });
      },
      error: (err) => { // Handles analysis error.
        console.error('Error analyzing resume:', err); // Logs error.
        this.loadingService.hide(); // Hides loading indicator.
      }
    });
  }

  goToDashboard(): void { // Navigates to the dashboard view.
    this.router.navigate(['/dashboard']); // Uses Angular Router for navigation.
    this.resetAnalysisState(); // Resets stored analysis data.
  }

  goToUploadResume(): void { // Navigates to the resume upload view.
    this.router.navigate(['/upload']); // Uses Angular Router for navigation.
    this.resetAnalysisState(); // Resets stored analysis data.
  }

  goToSelectJob(): void { // Navigates to select a job for analysis.
    if (this.currentResumeId) { // Checks if a resume is uploaded.
      this.router.navigate(['/jobs/new']); // Navigates to new job page.
      this.analysisResult = null; // Clears previous analysis.
    } else { // If no resume, redirects to upload.
      this.router.navigate(['/upload']); // Redirects to resume upload.
    }
  }

  goToViewAnalysis(): void { // Navigates to view analysis results.
    if (this.analysisResult) { // Checks if an analysis result exists.
      this.currentStep = 'view_analysis'; // Sets step to view analysis.
    } else { // If no analysis, goes to dashboard.
      this.router.navigate(['/dashboard']); // Redirects to dashboard.
    }
  }

  resetAnalysisState(): void { // Resets all analysis-related data to initial state.
    this.currentResumeId = null; // Clears resume ID.
    this.currentResumeContent = ''; // Clears resume content.
    this.selectedJob = null; // Clears selected job.
    this.analysisResult = null; // Clears analysis result.
  }
}