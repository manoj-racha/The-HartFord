import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../models/transaction.model';
import { CurrencyFormatPipe } from '../../../pipes/currency-format-pipe';
import { TransactionStatusPipe } from '../../../pipes/transaction-status-pipe';
import { DateAgoPipe } from '../../../pipes/date-ago-pipe';


@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, TransactionStatusPipe, DateAgoPipe],
  template: `
    <!-- @Input and @Output demonstration -->
    <div class="card hover:shadow-lg transition-shadow cursor-pointer" (click)="onCardClick()">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="font-semibold text-lg text-gray-900">{{ transaction.category }}</h3>
          <p class="text-sm text-gray-500">{{ transaction.description }}</p>
        </div>
        <span [ngClass]="(transaction.status | transactionStatus).class"
              class="px-3 py-1 text-xs rounded-full font-medium">
          {{ (transaction.status | transactionStatus).label }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <div>
          <p [ngClass]="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
             class="text-2xl font-bold">
            {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount | currencyFormat }}
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ transaction.date | dateAgo }}</p>
        </div>

        <div class="flex gap-2">
          <button (click)="onEdit($event)" class="btn-secondary text-sm py-1 px-3">Edit</button>
          <button (click)="onDelete($event)" class="btn-danger text-sm py-1 px-3">Delete</button>
        </div>
      </div>
    </div>
  `
})
export class TransactionCardComponent {
  @Input() transaction!: Transaction;
  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<string | number>();
  @Output() cardClick = new EventEmitter<Transaction>();

  onCardClick(): void {
    this.cardClick.emit(this.transaction);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.transaction);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.transaction.id);
  }
}
