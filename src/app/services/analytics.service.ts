import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/env';
import { Observable } from 'rxjs';
import { BoardAnalytics } from '../shared/models/boardAnalitycs.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private readonly http: HttpClient) {}

  getBoardAnalitycs(): Observable<BoardAnalytics[]> {
    const url = `${env.apiBaseUrl}/api/analytics`;
    return this.http.get<BoardAnalytics[]>(url);
  }

  getBoardAnalitycsByBoardId(boardId: string): Observable<BoardAnalytics> {
    const url = `${env.apiBaseUrl}/api/analytics/${boardId}`;
    return this.http.get<BoardAnalytics>(url);
  }
}
