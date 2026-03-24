import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  standalone: true,
})
export class Auth {
  form: FormGroup;
  error = signal<string | null>(null);
  loading = signal(false);

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
        this.error.set('Credenziali non valide');
        console.error(err);
      },
    });
  }
}
