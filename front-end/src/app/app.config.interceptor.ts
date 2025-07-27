
import { ApplicationConfig } from '@angular/core';


import { appConfig } from './app.config';

export const appConfigWithInterceptor: ApplicationConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
  ],
};
