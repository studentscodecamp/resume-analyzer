
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    // Defer the show() call to the next microtask cycle to avoid ExpressionChangedAfterItHasBeenCheckedError
    // This ensures `isLoading` is set to true *after* the current change detection cycle completes.
    Promise.resolve().then(() => this.loadingService.show());

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          // Defer the hide() call as well to prevent similar issues if loading becomes false too quickly.
          Promise.resolve().then(() => this.loadingService.hide());
        }
      })
    );
  }
}