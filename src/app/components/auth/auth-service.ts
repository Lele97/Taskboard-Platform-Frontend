import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/env';
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

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<TokenResponse> {
    const url = `${env.apiBaseUrl}/auth/token`;
    const body: LoginRequest = { username, password };
    return this.http.post<TokenResponse>(url, body).pipe(
      tap((res) => {
        this.setToken(res.token);
      })
    );
  }

  register(username: string, password: string): Observable<string> {
    const url = `${env.apiBaseUrl}/auth/register`;
    return this.http.post(url, { username, password }, { responseType: 'text' });
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
