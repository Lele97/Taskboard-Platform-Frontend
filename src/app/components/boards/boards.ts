import { Component, OnInit, signal, Inject, PLATFORM_ID, Signal } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Board } from '../../shared/models/board.model';
import { BoardService } from '../../services/board-service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [DatePipe, MatIcon, FormsModule, ReactiveFormsModule, MdbFormsModule],
  templateUrl: './boards.html',
  styleUrl: './boards.css',
})
export class Boards implements OnInit {
  boards = signal<Board[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  isOpen = signal<boolean>(false);

  formChanges: ReturnType<typeof toSignal>; // Signal
  formErrors: Signal<string[]>;

  form: FormGroup;

  constructor(
    private readonly boardService: BoardService,
    private readonly router: Router,
    private formbuilder: FormBuilder,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    this.form = this.formbuilder.group({
      name: [''],
      description: [''],
      ownerUserId: [''],
    });

    this.formChanges = toSignal(
      this.form.valueChanges.pipe(startWith(this.form.value)),
      { initialValue: this.form.value }
    );

    this.formErrors = toSignal(
      this.form.valueChanges.pipe(
        startWith(this.form.value),
        map(() =>
          Object.entries(this.form.controls)
            .filter(([_, control]) => control.invalid && control.dirty)
            .flatMap(([field, control]) =>
              Object.keys(control.errors ?? {}).map((err) => {
                switch (err) {
                  case 'required': return `${field} è obbligatorio`;
                  case 'minlength': return `${field} è troppo corto`;
                  case 'maxlength': return `${field} è troppo lungo`;
                  default: return `${field}: errore ${err}`;
                }
              })
            )
        )
      ),
      { initialValue: [] }
    );
  }

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

  onClick(): void {
    if (this.isOpen()) this.isOpen.set(false);
    else {
      console.log('Modale creazione Aperta');
      this.isOpen.set(true);
    }
  }

  navigateToBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/analytics/boards']);
  }


  submit(): void {
    console.log('submit');

    const payload: Partial<Board> = {
      name: this.form.value.name,
      description: this.form.value.description,
      ownerUserId: this.form.value.ownerUserId,
    };

    this.createNewBoard(payload);
  }

  createNewBoard(board: Partial<Board>): void {
    console.log('Creating new board');
    this.loading.set(true);
    this.error.set(null);
    this.boardService.createBoard(board).subscribe({
      next: (board) => {
        this.boards.update((boards) => [...boards, board]);
        this.loading.set(false);
        this.form.reset();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err);
        console.error(err);
      },
    });
  }
}
