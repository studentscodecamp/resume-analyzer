import { Routes } from '@angular/router'; // Imports the `Routes` type from Angular's router module, used to define an array of route configurations.

import { DashboardComponent } from './components/dashboard/dashboard.component'; // Imports the DashboardComponent, which will be displayed when its associated path is active.
import { ResumeUploadComponent } from './components/resume-upload/resume-upload.component'; // Imports the ResumeUploadComponent, used for uploading resumes.
import { JobDescriptionComponent } from './components/job-description/job-description.component'; // Imports the JobDescriptionComponent, used for managing job descriptions.
import { AnalysisResultsComponent } from './components/analysis-results/analysis-results.component'; // Imports the AnalysisResultsComponent, which displays analysis outcomes.

export const routes: Routes = [ // Declares and exports a constant array named `routes` of type `Routes`. This array holds all the individual route definitions.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Defines the default route: if the path is empty (''), it redirects fully to '/dashboard'.
  { path: 'dashboard', component: DashboardComponent }, // Maps the '/dashboard' URL path to display the DashboardComponent.
  { path: 'upload', component: ResumeUploadComponent }, // Maps the '/upload' URL path to display the ResumeUploadComponent.
  { path: 'jobs/new', component: JobDescriptionComponent }, // Maps the '/jobs/new' URL path to display the JobDescriptionComponent (likely for adding a new job).
  // The AnalysisResultsComponent is rendered dynamically by AppComponent's ngSwitch, not directly routed // This is an inline comment explaining why AnalysisResultsComponent isn't directly mapped to a path here.
  { path: '**', redirectTo: '/dashboard' } // Wildcard route: if any other unmatching URL path is entered, it redirects back to '/dashboard'.
];