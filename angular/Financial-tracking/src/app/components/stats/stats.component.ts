import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/models';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  transactions = input<Transaction[]>([]);

  income = computed(() => this.transactions().filter(t => t.transactionType === 'Income').reduce((sum, t) => sum + t.amount, 0));
  expense = computed(() => this.transactions().filter(t => t.transactionType === 'Expense').reduce((sum, t) => sum + t.amount, 0));
  balance = computed(() => this.income() - this.expense());
}
