import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { Board } from '../../shared/models/board.model';
import { BoardService } from '../../services/board-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './boards.html',
  styleUrl: './boards.css',
})
export class Boards implements OnInit {
  boards = signal<Board[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private readonly boardService: BoardService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBoards();
    }
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

  navigateToBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  createNewBoard(): void {
    // Logic to create a new board
    console.log('Creating new board');
    // For now, we'll just navigate to a create board page
    // You might want to implement a modal or form for this
    this.router.navigate(['/boards/create']);
  }
}
