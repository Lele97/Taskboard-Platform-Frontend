import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/env';
import { Observable } from 'rxjs';
import { Board } from '../../shared/models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    const url = `${env.apiBaseUrl}/api/projects/boards`;
    return this.http.get<Board[]>(url);
  }
}
