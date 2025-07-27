import { bootstrapApplication } from '@angular/platform-browser';
import { appConfigWithInterceptor } from './app/app.config.interceptor';
import { App } from './app/app';

bootstrapApplication(App, appConfigWithInterceptor).catch((err) => console.error(err));
