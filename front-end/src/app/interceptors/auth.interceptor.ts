
import { inject } from '@angular/core';
// ...existing code...
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalAuthService } from '../services/local-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LocalAuthService);
  const token = authService.token;
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloned);
};
