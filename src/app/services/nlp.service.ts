
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NlpService {

  constructor(private apiService: ApiService) { }

  extractKeywords(text: string): string[] {
    if (!text) return [];
    const words = text.toLowerCase().split(/\s+|[,.;!?"'(){}[\]\-]/)
                    .filter(word => word.length > 2)
                    .filter(word => !this.isStopWord(word));

    return [...new Set(words)];
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'as', 'by', 'from',
      'up', 'down', 'out', 'into', 'over', 'under', 'through', 'about', 'against', 'between', 'before',
      'after', 'above', 'below', 'from', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
      'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
      'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
      'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
      's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
    ]);
    return stopWords.has(word.toLowerCase());
  }


  highlightMatches(text: string, keywords: string[]): string {
    if (!text || !keywords || keywords.length === 0) {
      return text;
    }

    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="highlight">$&</span>`);
    });
    return highlightedText;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}