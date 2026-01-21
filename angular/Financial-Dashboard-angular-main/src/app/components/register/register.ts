import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Sign Up</h2>
          <p class="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input type="text" formControlName="firstName" class="input-field"
                     [class.border-red-500]="isFieldInvalid('firstName')" placeholder="First Name">
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
              <input type="text" formControlName="lastName" class="input-field"
                     [class.border-red-500]="isFieldInvalid('lastName')" placeholder="Last Name">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input type="text" formControlName="username" class="input-field"
                   [class.border-red-500]="isFieldInvalid('username')" placeholder="Username">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" formControlName="email" class="input-field"
                   [class.border-red-500]="isFieldInvalid('email')" placeholder="Email">
             <p *ngIf="isFieldInvalid('email')" class="text-red-500 text-xs mt-1">
              Please enter a valid email.
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" formControlName="password" class="input-field"
                   [class.border-red-500]="isFieldInvalid('password')" placeholder="Password (min 6 chars)">
             <p *ngIf="isFieldInvalid('password')" class="text-red-500 text-xs mt-1">
              Password must be at least 6 characters.
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input type="password" formControlName="confirmPassword" class="input-field"
                   [class.border-red-500]="isFieldInvalid('confirmPassword')" placeholder="Confirm Password">
             <p *ngIf="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched" class="text-red-500 text-xs mt-1">
              Passwords do not match.
            </p>
          </div>

          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading"
                  class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <a routerLink="/login" class="font-medium text-primary hover:text-indigo-500">Sign in</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    loading = false;
    errorMessage = '';

    constructor() {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            role: ['user']
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.registerForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            this.errorMessage = '';

            const { confirmPassword, ...user } = this.registerForm.value;

            this.authService.register(user).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.errorMessage = err.message || 'Registration failed';
                    this.loading = false;
                }
            });
        }
    }
}
