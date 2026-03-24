import { Component, OnInit, signal } from '@angular/core';
import { Board } from '../../shared/models/board.model';
import {BoardService} from './board-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './boards.html',
  styleUrl: './boards.css',
})
export class Boards implements OnInit {
  boards = signal<Board[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private readonly boardService: BoardService) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.error.set(null);

    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Errore durante il caricamento delle board');
        console.error(err);
      },
    });
  }
}
