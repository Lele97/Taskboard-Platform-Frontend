import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../environments/env';
import { Observable } from 'rxjs';
import { Card } from '../shared/models/card.model';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getCardsByBoard(boardId: string, column?: string): Observable<Card[]> {
    const base = `${env.apiBaseUrl}/api/projects/cards/board/${boardId}`;
    const url = column ? `${base}?column=${column}` : base;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Card[]>(url, {
      headers: headers,
    });
  }

  createCard(card: Partial<Card>): Observable<Card> {
    const url = `${env.apiBaseUrl}/api/projects/cards`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Card>(url, card, {
      headers: headers,
    });
  }

  updateCard(id: string, patch: Partial<Card>): Observable<Card> {
    const url = `${env.apiBaseUrl}/api/projects/cards/${id}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Card>(url, patch, {
      headers: headers,
    });
  }

  deleteCard(id: string): Observable<void> {
    const url = `${env.apiBaseUrl}/api/projects/cards/${id}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(url, {
      headers: headers,
    });
  }
}
