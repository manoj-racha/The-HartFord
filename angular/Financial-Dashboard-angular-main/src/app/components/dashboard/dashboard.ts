import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionSummary } from '../../models/transaction.model';
import { CurrencyFormatPipe } from '../../pipes/currency-format-pipe';
import { TransactionService } from '../../services/transaction';
import { AccountService } from '../../services/account';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>

      <!-- Summary Cards with Interpolation -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card border-l-4 border-l-emerald-500 bg-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Income</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ summary.totalIncome | currencyFormat }}</div>
            </div>
            <div class="p-3 bg-emerald-50 rounded-full">
              <span class="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div class="card border-l-4 border-l-red-500 bg-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Expenses</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ summary.totalExpense | currencyFormat }}</div>
            </div>
            <div class="p-3 bg-red-50 rounded-full">
              <span class="text-2xl">💸</span>
            </div>
          </div>
        </div>

        <div class="card border-l-4 border-l-indigo-500 bg-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Net Balance</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ summary.balance | currencyFormat }}</div>
            </div>
            <div class="p-3 bg-indigo-50 rounded-full">
              <span class="text-2xl">🏦</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounts Overview -->
      <div class="card mb-8">
        <h2 class="text-xl font-bold mb-4">Accounts Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let account of accounts$ | async"
               class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-gray-900">{{ account.accountName }}</h3>
                <p class="text-sm text-gray-500">{{ account.accountType | titlecase }}</p>
              </div>
              <span [ngClass]="account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="px-2 py-1 text-xs rounded-full">
                {{ account.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="mt-3">
              <p class="text-2xl font-bold text-gray-900">
                {{ account.balance | currencyFormat:account.currency }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Statistics -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Quick Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">{{ summary.transactionCount }}</div>
            <div class="text-sm text-gray-600 mt-1">Transactions</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-secondary">{{ (accounts$ | async)?.length || 0 }}</div>
            <div class="text-sm text-gray-600 mt-1">Accounts</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-success">{{ calculateAverage() | currencyFormat }}</div>
            <div class="text-sm text-gray-600 mt-1">Avg Transaction</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-warning">{{ calculateSavingsRate() }}%</div>
            <div class="text-sm text-gray-600 mt-1">Savings Rate</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  summary: TransactionSummary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  };

  accounts$ = this.accountService.accounts$;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.transactionService.getTransactionSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => console.error('Error loading summary:', err)
    });

    this.accountService.getAllAccounts().subscribe({
      error: (err) => console.error('Error loading accounts:', err)
    });
  }

  calculateAverage(): number {
    return this.summary.transactionCount > 0
      ? (this.summary.totalIncome + this.summary.totalExpense) / this.summary.transactionCount
      : 0;
  }

  calculateSavingsRate(): number {
    return this.summary.totalIncome > 0
      ? Math.round(((this.summary.totalIncome - this.summary.totalExpense) / this.summary.totalIncome) * 100)
      : 0;
  }
}
