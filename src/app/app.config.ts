import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // Imports core Angular utilities for application configuration and module imports in standalone mode.
import { provideRouter } from '@angular/router'; // Imports a function to set up routing for the application.
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http'; // Imports HTTP client functionalities for making API requests, including new standalone HTTP client providers and interceptor support.
import { provideAnimations } from '@angular/platform-browser/animations'; // Imports a function to enable standard Angular browser animations.
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Imports a function to enable asynchronous loading of Angular browser animations.
import { routes } from './app.routes'; // Imports your defined application routes from app.routes.ts.
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'; // Imports a token to configure default options for Material Design snack bars.
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'; // Imports a token to configure default options for Material Design form fields.
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Imports a custom HTTP interceptor for handling authentication.
import { ErrorInterceptor } from './interceptors/error.interceptor'; // Imports a custom HTTP interceptor for handling errors globally.
import { LoadingInterceptor } from './interceptors/loading.interceptor'; // Imports a custom HTTP interceptor for managing loading states.
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Imports the token used to register HTTP interceptors.

export const appConfig: ApplicationConfig = { // Declares and exports the main application configuration object.
  providers: [ // An array defining all the services and configurations available application-wide.
    provideRouter(routes), // Provides the Angular Router with your defined application routes.
    importProvidersFrom(HttpClientModule), // Imports HttpClientModule's providers (older module-based approach, often used alongside provideHttpClient for compatibility).
    provideHttpClient( // Provides the modern, tree-shakable Angular HTTP client.
      withJsonpSupport(), // Enables JSONP support for HttpClient (less common now, used for cross-domain requests without CORS).
      withInterceptorsFromDi() // Integrates HTTP interceptors that are provided via dependency injection (like the custom ones below).
    ),
    provideAnimations(), // Enables Angular browser animations for the application.
    provideAnimationsAsync(), // Provides animations asynchronously, potentially improving initial load performance.
    // Provide interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Registers AuthInterceptor as an HTTP interceptor, allowing multiple interceptors to run.
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, // Registers ErrorInterceptor as an HTTP interceptor.
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, // Registers LoadingInterceptor as an HTTP interceptor.
    { // Provides default options for Material Snack Bars.
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, // Token for default snack bar options.
      useValue: { // Specifies the default values.
        duration: 3000, // Snack bar stays visible for 3000 milliseconds (3 seconds).
        horizontalPosition: 'right', // Snack bar appears on the right side of the screen.
        verticalPosition: 'top', // Snack bar appears at the top of the screen.
        panelClass: ['mat-toolbar', 'mat-primary'] // Adds CSS classes for styling the snack bar, using Material's toolbar and primary color.
      }
    },
    { // Provides default options for Material Form Fields.
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, // Token for default form field options.
      useValue: { // Specifies the default values.
        appearance: 'outline', // Sets the default visual appearance of form fields to 'outline'.
        floatLabel: 'auto', // Labels automatically float above the input when content is present.
        hideRequiredMarker: false // Shows the asterisk for required fields by default.
      }
    }
  ]
};