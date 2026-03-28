import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/env';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'taskboard_jwt';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object, private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<TokenResponse> {
    const url = `${env.apiBaseUrl}/auth/token`;
    const body: LoginRequest = { username, password };
    return this.http.post<TokenResponse>(url, body).pipe(
      tap((res) => {
        this.setToken(res.token);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<string> {
    const url = `${env.apiBaseUrl}/auth/register`;
    return this.http.post(url, { username, email, password }, { responseType: 'text' });
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
