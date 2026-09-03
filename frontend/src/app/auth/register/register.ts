import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';

  loading = false;
  error = '';

  register(): void {

    this.error = '';

    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Compila tutti i campi.';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La password deve contenere almeno 8 caratteri.';
      return;
    }

    this.loading = true;

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 409) {
          this.error = 'Questa email è già registrata.';
        } else {
          this.error = err.error?.message ||
                       'Errore durante la registrazione.';
        }
      }
    });
  }
}