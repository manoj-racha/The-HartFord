import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                FinDash
              </span>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a routerLink="/dashboard" routerLinkActive="border-indigo-500 text-white"
                 class="border-transparent text-slate-300 hover:text-white hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Dashboard
              </a>
              <a routerLink="/transactions" routerLinkActive="border-indigo-500 text-white"
                 class="border-transparent text-slate-300 hover:text-white hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Transactions
              </a>
              <a routerLink="/accounts" routerLinkActive="border-indigo-500 text-white"
                 class="border-transparent text-slate-300 hover:text-white hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Accounts
              </a>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center gap-4" *ngIf="currentUser$ | async as user">
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium text-white">{{ user.firstName }} {{ user.lastName }}</span>
                <span class="text-xs text-slate-400">{{ user.email }}</span>
              </div>
              <button (click)="logout()" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
