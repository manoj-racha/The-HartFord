import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/models';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
  transactions = input<Transaction[]>([]);
  listChanged = output<void>();
  editRequested = output<Transaction>();

  constructor(private transactionService: TransactionService) { }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.listChanged.emit();
      });
    }
  }

  onEdit(t: Transaction) {
    this.editRequested.emit(t);
  }
}
