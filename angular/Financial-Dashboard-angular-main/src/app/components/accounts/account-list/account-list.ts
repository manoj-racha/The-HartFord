import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../pipes/currency-format-pipe';
import { AccountFormComponent } from '../account-form/account-form';
import { AccountService } from '../../../services/account';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, AccountFormComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Accounts</h1>
        <button (click)="toggleForm()" class="btn-primary">
          {{ showForm ? 'Cancel' : '+ Add Account' }}
        </button>
      </div>

      <app-account-form
        *ngIf="showForm"
        [account]="selectedAccount"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onFormCancel()"
        class="mb-8 block">
      </app-account-form>

      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Number</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr *ngFor="let account of accounts$ | async" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ account.accountName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ account.accountNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ account.accountType | titlecase }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">
                  {{ account.balance | currencyFormat:account.currency }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ account.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="onEdit(account)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button (click)="onDelete(account.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="(accounts$ | async)?.length === 0"
           class="text-center py-12 text-gray-500">
        No accounts found. Click "Add Account" to create one.
      </div>
    </div>
  `
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);

  accounts$ = this.accountService.accounts$;
  showForm = false;
  selectedAccount?: Account;

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.selectedAccount = undefined;
    }
  }

  onFormSubmit(accountData: Partial<Account>): void {
    if (this.selectedAccount) {
      this.accountService.updateAccount(this.selectedAccount.id, accountData)
        .subscribe({
          next: () => {
            this.showForm = false;
            this.selectedAccount = undefined;
            this.loadAccounts();
          },
          error: (err) => console.error('Update failed:', err)
        });
    } else {
      this.accountService.createAccount(accountData as any).subscribe({
        next: () => {
          this.showForm = false;
          this.loadAccounts();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedAccount = undefined;
  }

  onEdit(account: Account): void {
    this.selectedAccount = account;
    this.showForm = true;
  }

  onDelete(id: string | number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => this.loadAccounts(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}
