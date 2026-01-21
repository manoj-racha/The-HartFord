import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit' : 'Add' }} Account</h2>

      <form [formGroup]="accountForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Account Name</label>
            <input type="text" formControlName="accountName" class="input-field"
                   placeholder="My Savings Account">
            <p *ngIf="isFieldInvalid('accountName')" class="text-red-500 text-xs mt-1">
              Account name is required
            </p>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Account Number</label>
            <input type="text" formControlName="accountNumber" class="input-field"
                   placeholder="1234567890">
            <p *ngIf="isFieldInvalid('accountNumber')" class="text-red-500 text-xs mt-1">
              Account number is required
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Account Type</label>
            <select formControlName="accountType" class="input-field">
              <option value="savings">Savings</option>
              <option value="checking">Checking</option>
              <option value="credit">Credit</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Balance</label>
            <input type="number" formControlName="balance" class="input-field"
                   placeholder="0.00" step="0.01">
            <p *ngIf="isFieldInvalid('balance')" class="text-red-500 text-xs mt-1">
              Balance is required
            </p>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Currency</label>
            <select formControlName="currency" class="input-field">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center">
            <input type="checkbox" formControlName="isActive" class="mr-2 h-4 w-4">
            <span class="text-gray-700 text-sm font-bold">Active Account</span>
          </label>
        </div>

        <div class="flex gap-3">
          <button type="submit" [disabled]="accountForm.invalid"
                  class="btn-primary disabled:opacity-50">
            {{ isEditMode ? 'Update' : 'Create' }} Account
          </button>
          <button type="button" (click)="onCancel()" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class AccountFormComponent implements OnInit {
  @Input() account?: Account;
  @Output() formSubmit = new EventEmitter<Partial<Account>>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  accountForm: FormGroup;
  isEditMode = false;

  constructor() {
    this.accountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountType: ['savings', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.account) {
      this.isEditMode = true;
      this.accountForm.patchValue(this.account);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.accountForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.formSubmit.emit(this.accountForm.value);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
