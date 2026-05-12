import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

import { routes } from './app.routes';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('taskboard_jwt');
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    }
  }
  return next(req);
};

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Skip auth endpoints — login/register don't carry a token
  const isAuthEndpoint = req.url.includes('/auth/');

  return next(req).pipe(
    catchError((err) => {
      // On 401 from a protected endpoint: clear the stale token.
      // The authGuard will redirect to /auth on the next navigation.
      if (err.status === 401 && !isAuthEndpoint && isPlatformBrowser(platformId)) {
        localStorage.removeItem('taskboard_jwt');
      }
      return throwError(() => err);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, unauthorizedInterceptor])),
  ],
};
