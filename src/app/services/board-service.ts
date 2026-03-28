import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environments/env';
import { Observable } from 'rxjs';
import { Board } from '../../shared/models/board.model';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getBoards(): Observable<Board[]> {
    const url = `${env.apiBaseUrl}/api/projects/boards`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Board[]>(url, {
      headers: headers,
    });
  }

  getBoardsById(): Observable<Board[]> {
    const url = `${env.apiBaseUrl}/api/projects/boards/${id}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Board[]>(url, {
      headers: headers,
    })
  }
}
