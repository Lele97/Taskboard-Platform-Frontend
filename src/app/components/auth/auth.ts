import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Register } from '../register/register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Register],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  form: FormGroup;
  error = signal<string | null>(null);
  loading = signal(false);
  activeTab = signal<'login' | 'register'>('login');

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.error.set(null);
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
