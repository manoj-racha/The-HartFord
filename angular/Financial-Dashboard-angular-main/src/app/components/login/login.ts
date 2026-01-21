import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // Added RouterLink
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Added RouterLink
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">💰 Financial Dashboard</h2>
          <p class="mt-2 text-gray-600">Sign in to manage your finances</p>
        </div>

        <!-- Reactive Form with Two-way Data Binding -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('email')"
              placeholder="admin@findash.com">
            <p *ngIf="isFieldInvalid('email')" class="text-red-500 text-xs mt-1">
              Email is required and must be valid
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              formControlName="password"
              class="input-field"
              [class.border-red-500]="isFieldInvalid('password')"
              placeholder="Enter password">
            <p *ngIf="isFieldInvalid('password')" class="text-red-500 text-xs mt-1">
              Password is required (min 6 characters)
            </p>
          </div>

          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
          <p class="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: <span class="font-mono">admin@findash.com</span></p>
          <p>Password: <span class="font-mono">admin123</span></p>
        </div>

        <div class="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <a routerLink="/register" class="font-medium text-primary hover:text-indigo-500">Sign up</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Login failed';
          this.loading = false;
        }
      });
    }
  }
}
