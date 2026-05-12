import { Component, computed, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Register } from '../register/register';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { env } from '../../environments/env';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Register, NgOptimizedImage],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  form!: FormGroup;
  error = signal<string | null>(null);
  loading = signal(false);
  activeTab = signal<'login' | 'register'>('login');
  formChanges!: ReturnType<typeof toSignal>;
  formErrors!: Signal<string[]>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.formChanges = toSignal(this.form.valueChanges.pipe(startWith(this.form.value)));

    this.formErrors = computed((): string[] => {
      this.formChanges(); // traccia le dipendenze
      const errors: string[] = [];
      const u = this.form.get('username');
      const p = this.form.get('password');

      if (u?.touched) if (u.hasError('required')) errors.push('Username obbligatorio.');
      if (p?.touched) if (p.hasError('required')) errors.push('Password obbligatoria.');

      return errors;
    });
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.error.set(null);
  }

  isProduction() {
    if (env.production) {
      return true;
    }
    return false;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/boards');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Credenziali non valide. Riprova.');
        console.error(err);
      },
    });
  }
}
