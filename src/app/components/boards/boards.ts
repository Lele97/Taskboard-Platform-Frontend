import { Component, OnInit } from '@angular/core';
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
  boards: Board[] = [];
  loading = false;
  error: string | null = null;

  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading = true;
    this.error = null;

    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards = boards;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Errore durante il caricamento delle board';
        console.error(err);
      },
    });
  }
}
