import { Component, signal, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  switchTab = output<string>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const { username, email, password } = this.form.value;

    this.auth.register(username, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Registrazione completata con successo! Ora puoi accedere.');
        this.form.reset();
        // Optionally switch to login tab after success
        setTimeout(() => this.switchTab.emit('login'), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Errore durante la registrazione. Riprova.');
        console.error(err);
      }
    });
  }

  goToLogin(): void {
    this.switchTab.emit('login');
  }
}
