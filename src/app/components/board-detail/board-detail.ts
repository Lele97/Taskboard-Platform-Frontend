import { Component, OnInit, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BoardService } from '../../services/board-service';
import { CardService } from '../../services/card-service';
import { Board } from '../../shared/models/board.model';
import { Card } from '../../shared/models/card.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

type ColumnKey = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Column {
  key: ColumnKey;
  title: string;
}

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CdkDragPlaceholder,
    CdkDragPreview,
  ],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {
  board = signal<Board | null>(null);
  cards = signal<Card[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  columns: Column[] = [
    { key: 'TODO', title: 'To Do' },
    { key: 'IN_PROGRESS', title: 'In Progress' },
    { key: 'DONE', title: 'Done' },
  ];

  // Filtra le card per colonna usando un computed signal
  todoCards = computed(() => this.cards().filter((c) => c.column === 'TODO'));
  inProgressCards = computed(() => this.cards().filter((c) => c.column === 'IN_PROGRESS'));
  doneCards = computed(() => this.cards().filter((c) => c.column === 'DONE'));

  // Form stato
  newCardTitle = '';
  newCardDescription = '';
  showCreateFormForCol = signal<ColumnKey | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly boardService: BoardService,
    private readonly router: Router,
    private readonly cardService: CardService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
    } else {
      this.error.set('Board non trovata');
    }
  }

  private loadBoard(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.boardService.getBoardsById(id).subscribe({
      next: (res: any) => {
        let board: Board | null = null;
        if (Array.isArray(res) && res.length > 0) {
          board = res[0];
        } else if (res && !Array.isArray(res)) {
          board = res;
        }

        if (board) {
          this.board.set(board);
          this.loadCards(board.id);
        } else {
          this.loading.set(false);
          this.error.set('Board non trovata');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Errore nel caricamento della board');
        console.error(err);
      },
    });
  }

  navigateToAnalytics(boardId: string | undefined): void {
    if (boardId) {
      this.router.navigate(['/analytics/boards', boardId]);
    }
  }

  private loadCards(boardId: string): void {
    this.cardService.getCardsByBoard(boardId).subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Errore nel caricamento delle card');
        console.error(err);
      },
    });
  }

  moveCard(card: Card, targetColumn: ColumnKey): void {
    if (card.column === targetColumn) return;
    this.cardService.updateCard(card.id, { column: targetColumn }).subscribe({
      next: (updated) => {
        this.cards.update((cards) =>
          cards.map((c) => (c.id === card.id ? { ...c, column: targetColumn } : c)),
        );
      },
      error: (err) => console.error(err),
    });
  }

  createCard(initialColumn: ColumnKey): void {
    const board = this.board();
    if (!board || !this.newCardTitle.trim()) return;

    this.loading.set(true);
    const payload: Partial<Card> = {
      boardId: board.id,
      column: initialColumn,
      title: this.newCardTitle.trim(),
      description: this.newCardDescription.trim() || undefined,
    };

    this.cardService.createCard(payload).subscribe({
      next: (card) => {
        this.cards.update((cards) => [...cards, card]);
        this.resetForm();
      },
      error: (err) => {
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  deleteCard(id: string): void {
    if (!confirm('Sei sicuro di voler eliminare questa card?')) return;

    this.cardService.deleteCard(id).subscribe({
      next: () => {
        this.cards.update((cards) => cards.filter((c) => c.id !== id));
      },
      error: (err) => console.error(err),
    });
  }

  resetForm(): void {
    this.newCardTitle = '';
    this.newCardDescription = '';
    this.showCreateFormForCol.set(null);
    this.loading.set(false);
  }

  drop(event: CdkDragDrop<Card[], any, Card>) {
    if (event.previousContainer === event.container) {
      // Reordinamento nella stessa colonna (opzionale, se il backend lo supporta)
      // Per ora rinfreschiamo solo la vista locale se necessario
      const newItems = [...event.container.data];
      moveItemInArray(newItems, event.previousIndex, event.currentIndex);
      // Se vuoi supportare il riordinamento persistente, dovresti aggiornare un campo "position"
      const col = event.container.id as ColumnKey;
      this.cards.update((cards) => {
        const others = cards.filter((c) => c.column !== col);
        return [...others, ...newItems];
      });
    } else {
      // Spostamento tra colonne
      const card = event.item.data;
      const targetColumn = event.container.id as ColumnKey;

      // Ottimisticamente aggiorniamo lo stato locale
      this.cards.update((cards) =>
        cards.map((c) => (c.id === card.id ? { ...c, column: targetColumn } : c)),
      );

      // Persistenza sul backend
      this.cardService.updateCard(card.id, { column: targetColumn }).subscribe({
        error: (err) => {
          console.error('Errore nel salvataggio del movimento:', err);
          // Revert in caso di errore
          this.cards.update((cards) =>
            cards.map((c) => (c.id === card.id ? { ...c, column: card.column } : c)),
          );
        },
      });
    }
  }
}
