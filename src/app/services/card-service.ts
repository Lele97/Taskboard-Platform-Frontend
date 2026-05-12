import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/env';
import { Observable } from 'rxjs';
import { Card } from '../shared/models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private readonly http: HttpClient) { }

  getCardsByBoard(boardId: string, column?: string): Observable<Card[]> {
    const base = `${env.apiBaseUrl}/api/projects/board/${boardId}`;
    const url = column ? `${base}?column=${column}` : base;
    return this.http.get<Card[]>(url);
  }

  createCard(card: Partial<Card>): Observable<Card> {
    const url = `${env.apiBaseUrl}/api/projects/cards`;
    return this.http.post<Card>(url, card);
  }

  updateCard(id: string, patch: Partial<Card>): Observable<Card> {
    const url = `${env.apiBaseUrl}/api/projects/${id}`;
    return this.http.put<Card>(url, patch);
  }

  deleteCard(id: string): Observable<void> {
    const url = `${env.apiBaseUrl}/api/projects/${id}`;
    return this.http.delete<void>(url);
  }
}
