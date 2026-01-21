import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionFormComponent } from '../transaction-form/transaction-form';
import { CurrencyFormatPipe } from '../../../pipes/currency-format-pipe';
import { TransactionService } from '../../../services/transaction';
import { AccountService } from '../../../services/account';
import { Transaction } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionFormComponent, CurrencyFormatPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Transactions</h1>
        <button (click)="toggleForm()" class="btn-primary">
          {{ showForm ? 'Cancel' : '+ Add Transaction' }}
        </button>
      </div>

      <app-transaction-form
        *ngIf="showForm"
        [transaction]="selectedTransaction"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onFormCancel()"
        class="mb-8 block">
      </app-transaction-form>

      <!-- Filter Section -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select [(ngModel)]="filters.type" (change)="applyFilters()"
                  class="input-field" [ngModelOptions]="{standalone: true}">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select [(ngModel)]="filters.status" (change)="applyFilters()"
                  class="input-field" [ngModelOptions]="{standalone: true}">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input type="date" [(ngModel)]="filters.startDate" (change)="applyFilters()"
                 class="input-field" placeholder="Start Date" [ngModelOptions]="{standalone: true}">

          <input type="date" [(ngModel)]="filters.endDate" (change)="applyFilters()"
                 class="input-field" placeholder="End Date" [ngModelOptions]="{standalone: true}">
        </div>
      </div>

      <!-- Transactions Grid -->
      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr *ngFor="let transaction of transactions$ | async" class="hover:bg-gray-50" (click)="onCardClick(transaction)">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.date | date:'mediumDate' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ transaction.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                 <span [ngClass]="{'text-green-600': transaction.type === 'income', 'text-red-600': transaction.type === 'expense'}" class="font-medium capitalize">
                  {{ transaction.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div [ngClass]="{'text-green-600': transaction.type === 'income', 'text-red-600': transaction.type === 'expense'}" class="text-sm font-bold">
                  {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount | currencyFormat:'USD' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'bg-green-100 text-green-800': transaction.status === 'completed',
                  'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                  'bg-red-100 text-red-800': transaction.status === 'cancelled'}"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="$event.stopPropagation(); onEdit(transaction)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button (click)="$event.stopPropagation(); onDelete(transaction)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="(transactions$ | async)?.length === 0"
           class="text-center py-12 text-gray-500">
        No transactions found. Click "Add Transaction" to create one.
      </div>
    </div>
  `
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  transactions$ = this.transactionService.transactions$;
  showForm = false;
  selectedTransaction?: Transaction;

  filters = {
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions(this.filters).subscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.selectedTransaction = undefined;
    }
  }

  onFormSubmit(transactionData: Partial<Transaction>): void {
    const accountId = transactionData.accountId!;
    const amount = Number(transactionData.amount);
    const type = transactionData.type;

    if (this.selectedTransaction) {
      // Handle Update
      const oldTransaction = this.selectedTransaction;

      // We first revert the old transaction's effect
      this.accountService.getAccountById(oldTransaction.accountId).pipe(
        switchMap(oldAccount => {
          let revertedBalance = oldAccount.balance;
          if (oldTransaction.type === 'income') {
            revertedBalance -= oldTransaction.amount;
          } else {
            revertedBalance += oldTransaction.amount;
          }

          return this.accountService.updateAccount(oldAccount.id, { balance: revertedBalance });
        }),
        // Then apply the new transaction's effect
        switchMap(() => this.accountService.getAccountById(accountId)),
        switchMap(newAccount => {
          let newBalance = newAccount.balance;
          // If account changed, this logic holds (we updated the old account above, now we update the new one)
          // If account didn't change, we just fetched the updated version of it (with reverted balance)

          if (type === 'income') {
            newBalance += amount;
          } else {
            newBalance -= amount;
          }
          return this.accountService.updateAccount(newAccount.id, { balance: newBalance });
        }),
        // Finally update the transaction itself
        switchMap(() => this.transactionService.updateTransaction(oldTransaction.id, transactionData))
      ).subscribe({
        next: () => {
          this.showForm = false;
          this.selectedTransaction = undefined;
          this.loadTransactions();
          // Also refresh accounts list in case dashboard or other components need it
          this.accountService.getAllAccounts().subscribe();
        },
        error: (err) => console.error('Update failed:', err)
      });

    } else {
      // Handle Create
      this.accountService.getAccountById(accountId).pipe(
        switchMap(account => {
          let newBalance = account.balance;
          if (type === 'income') {
            newBalance += amount;
          } else {
            newBalance -= amount;
          }
          return this.accountService.updateAccount(accountId, { balance: newBalance });
        }),
        switchMap(() => this.transactionService.createTransaction(transactionData as any))
      ).subscribe({
        next: () => {
          this.showForm = false;
          this.loadTransactions();
          this.accountService.getAllAccounts().subscribe();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedTransaction = undefined;
  }

  onEdit(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.showForm = true;
  }

  onDelete(transaction: Transaction): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.accountService.getAccountById(transaction.accountId).pipe(
        switchMap(account => {
          let newBalance = account.balance;
          // Revert the effect
          if (transaction.type === 'income') {
            newBalance -= transaction.amount;
          } else {
            newBalance += transaction.amount;
          }
          return this.accountService.updateAccount(account.id, { balance: newBalance });
        }),
        switchMap(() => this.transactionService.deleteTransaction(transaction.id))
      ).subscribe({
        next: () => {
          this.loadTransactions();
          this.accountService.getAllAccounts().subscribe();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  onCardClick(transaction: Transaction): void {
    console.log('Transaction clicked:', transaction);
  }

  applyFilters(): void {
    this.loadTransactions();
  }
}
