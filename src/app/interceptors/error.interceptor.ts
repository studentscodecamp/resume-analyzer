
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        console.error('HTTP Error:', error);

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Network Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Bad Request: The server could not process the request due to invalid syntax.';
              break;
            case 404:
              errorMessage = error.error?.message || 'Not Found: The requested resource could not be found.';
              break;
            case 500:
              errorMessage = error.error?.message || 'Internal Server Error: Something went wrong on the server.';
              break;
            default:
              errorMessage = `Server Error (${error.status}): ${error.message}`;
              break;
          }
        }

        this.snackBar.open(errorMessage, 'Dismiss', {
          panelClass: ['error-snackbar'],
          duration: 7000
        });

        return throwError(() => error);
      })
    );
  }
}