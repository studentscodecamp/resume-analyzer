
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AnalysisResult } from '../../models';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DatePipe,
    PercentPipe,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  quickActions = [
    {
      icon: 'upload_file',
      title: 'Upload New Resume',
      description: 'Start a new analysis by uploading your resume',
      route: '/upload'
    },
    {
      icon: 'description',
      title: 'Manage Job Descriptions',
      description: 'View, add, or edit job descriptions',
      route: '/jobs/new'
    },
    {
      icon: 'history',
      title: 'View Past Analyses',
      description: 'Review your previous resume comparisons',
      route: '/dashboard'
    }
  ];

  recentAnalyses: AnalysisResult[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentAnalyses();
  }

  loadRecentAnalyses(): void {
    this.apiService.getAnalysisResults().subscribe({
      next: (results) => {
        this.recentAnalyses = results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => {
        console.error('Error loading recent analyses:', err);
      }
    });
  }

  viewAnalysisDetails(analysisId: string): void {
    console.log('Viewing details for analysis ID:', analysisId);
  }
}