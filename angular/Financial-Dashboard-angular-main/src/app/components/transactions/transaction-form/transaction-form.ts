import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../../models/transaction.model';
import {AccountService} from '../../../services/account';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit' : 'Add' }} Transaction</h2>

      <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Account</label>
            <select formControlName="accountId" class="input-field">
              <option value="">Select Account</option>
              <option *ngFor="let account of accounts$ | async" [value]="account.id">
                {{ account.accountName }}
              </option>
            </select>
            <p *ngIf="isFieldInvalid('accountId')" class="text-red-500 text-xs mt-1">
              Account is required
            </p>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select formControlName="type" class="input-field">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <input type="text" formControlName="category" class="input-field"
                   placeholder="e.g., Salary, Groceries">
            <p *ngIf="isFieldInvalid('category')" class="text-red-500 text-xs mt-1">
              Category is required
            </p>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Amount</label>
            <input type="number" formControlName="amount" class="input-field"
                   placeholder="0.00" step="0.01">
            <p *ngIf="isFieldInvalid('amount')" class="text-red-500 text-xs mt-1">
              Amount is required and must be positive
            </p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea formControlName="description" class="input-field" rows="3"
                    placeholder="Enter description"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input type="date" formControlName="date" class="input-field">
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select formControlName="status" class="input-field">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3">
          <button type="submit" [disabled]="transactionForm.invalid"
                  class="btn-primary disabled:opacity-50">
            {{ isEditMode ? 'Update' : 'Create' }} Transaction
          </button>
          <button type="button" (click)="onCancel()" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class TransactionFormComponent implements OnInit {
  @Input() transaction?: Transaction;
  @Output() formSubmit = new EventEmitter<Partial<Transaction>>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  transactionForm: FormGroup;
  accounts$ = this.accountService.accounts$;
  isEditMode = false;

  constructor() {
    this.transactionForm = this.fb.group({
      accountId: ['', Validators.required],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['completed', Validators.required]
    });
  }

  ngOnInit(): void {
    this.accountService.getAllAccounts().subscribe();

    if (this.transaction) {
      this.isEditMode = true;
      this.transactionForm.patchValue({
        ...this.transaction,
        date: new Date(this.transaction.date).toISOString().split('T')[0]
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.formSubmit.emit(this.transactionForm.value);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
