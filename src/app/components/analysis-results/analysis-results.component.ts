
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, PercentPipe, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NlpService } from '../../services/nlp.service';
import { AnalysisResponse } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-analysis-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    PercentPipe,
    DatePipe,
    MatDividerModule
  ],
  templateUrl: './analysis-results.component.html',
  styleUrls: ['./analysis-results.component.css']
})
export class AnalysisResultsComponent implements OnChanges {
  @Input() result: AnalysisResponse | null = null;
  @Input() resumeContent: string = '';
  @Input() jobDescription: string = '';

  highlightedResumeContent: SafeHtml = '';
  highlightedJobDescriptionContent: SafeHtml = '';

  constructor(
    private nlpService: NlpService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] || changes['resumeContent'] || changes['jobDescription']) {
      this.updateHighlights();
    }
  }

  private updateHighlights(): void {
    if (!this.result || !this.resumeContent || !this.jobDescription) {
      this.highlightedResumeContent = this.sanitize(this.resumeContent);
      this.highlightedJobDescriptionContent = this.sanitize(this.jobDescription);
      return;
    }

    const combinedText = [
      this.result.strengths,
      this.result.weaknesses,
      this.result.recommendations
    ].filter(Boolean).join(' ');

    const keywords = this.nlpService.extractKeywords(combinedText);

    this.highlightedResumeContent = this.sanitize(
      this.nlpService.highlightMatches(this.resumeContent, keywords)
    );
    this.highlightedJobDescriptionContent = this.sanitize(
      this.nlpService.highlightMatches(this.jobDescription, keywords)
    );
  }

  private sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}