import { bootstrapApplication } from '@angular/platform-browser'; // Imports the function to launch a standalone Angular application in a browser environment.
import { appConfig } from './app/app.config'; // Imports the configuration object for your application, defined in app.config.ts.
import { AppComponent } from './app/app.component'; // Imports your root component, AppComponent, which serves as the main entry point for your application's UI.

bootstrapApplication(AppComponent, appConfig) // Calls the function to initialize and render the AppComponent, using the provided appConfig.
  .catch((err) => console.error(err)); // Catches and logs any errors that occur during the application's bootstrapping process to the browser console.