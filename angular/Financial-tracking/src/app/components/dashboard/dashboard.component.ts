import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertySwitchComponent } from '../property-switch/property-switch.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { StatsComponent } from '../stats/stats.component';
import { Property, Transaction } from '../../models/models';
import { TransactionService } from '../../services/transaction.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertySwitchComponent, AddTransactionComponent, TransactionListComponent, StatsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  viewMode = signal<'XYZ' | 'Property'>('XYZ');

  // Data
  properties = signal<Property[]>([]);
  currentProperty = signal<Property | null>(null);
  transactionToEdit = signal<Transaction | null>(null);

  // Derived State (Selector)
  displayedTransactions = computed(() => {
    const transactions = this.transactionService.transactions();
    const mode = this.viewMode();
    const prop = this.currentProperty();

    let filtered = transactions;

    if (mode === 'Property' && prop) {
      filtered = transactions.filter(t => t.propertyId === prop.id);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  constructor(
    private propertyService: PropertyService,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.loadProperties();
    // TransactionService loads transactions in its constructor, but we can ensure it's loaded or re-fetch if needed.
    this.loadAllTransactions();
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe(data => {
      this.properties.set(data);
    });
  }

  loadAllTransactions() {
    this.transactionService.loadTransactions();
  }

  // --- View Switching Logic ---

  switchToXYZ() {
    this.viewMode.set('XYZ');
    this.currentProperty.set(null);
  }

  switchToProperty(p: Property) {
    this.viewMode.set('Property');
    this.currentProperty.set(p);
  }

  // --- Actions ---

  onEditRequested(t: Transaction) {
    this.transactionToEdit.set(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onTransactionSaved(newTrx: Transaction) {
    this.transactionToEdit.set(null);
  }
}
