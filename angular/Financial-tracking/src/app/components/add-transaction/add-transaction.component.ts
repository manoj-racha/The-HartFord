import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Property, Transaction } from '../../models/models';

@Component({
    selector: 'app-add-transaction',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-transaction.component.html',
    styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {
    properties = input<Property[]>([]);
    transactionToEdit = input<Transaction | null>(null);
    transactionAdded = output<Transaction>();
    editCancelled = output<void>();

    selectedPropertyId: string = ''; // User selected property

    type: 'Income' | 'Expense' = 'Expense';
    category: string = '';
    amount: number | null = null;
    date: string = new Date().toISOString().split('T')[0];
    description: string = '';
    editingId: string | null = null;

    get isEditing(): boolean {
        return !!this.editingId;
    }

    constructor(private transactionService: TransactionService) {
        effect(() => {
            const transaction = this.transactionToEdit();
            if (transaction) {
                // POPULATE FORM
                this.editingId = transaction.id;
                this.selectedPropertyId = transaction.propertyId;
                this.type = transaction.transactionType;
                this.category = transaction.category;
                this.amount = transaction.amount;
                this.date = transaction.date;
                this.description = transaction.description;
            } else {
                // RESET FORM (Exit edit mode)
                this.resetForm();
            }
        });
    }

    isValid(): boolean {
        // Ensure amount is valid number
        return !!(this.amount && this.amount > 0 && this.category && this.date && this.selectedPropertyId);
    }

    save() {
        if (!this.isValid()) return;

        const selectedProp = this.properties().find(p => p.id === this.selectedPropertyId);
        if (!selectedProp) return;

        console.log('Saving Transaction...', { isEditing: this.isEditing, property: selectedProp });

        const trxData: Transaction = {
            id: this.editingId || crypto.randomUUID(),
            propertyId: selectedProp.id,
            propertyName: selectedProp.name,
            transactionType: this.type,
            category: this.category,
            amount: this.amount!,
            date: this.date,
            description: this.description
        };

        const action$ = this.isEditing
            ? this.transactionService.updateTransaction(trxData)
            : this.transactionService.addTransaction(trxData);

        action$.subscribe({
            next: (result) => {
                console.log('Transaction Saved Successfully!', result);
                this.transactionAdded.emit(result);
                this.resetForm(); // Clear form after success
            },
            error: (err) => {
                console.error('Error saving transaction:', err);
            }
        });
    }

    cancelEdit() {
        this.resetForm();
        this.editCancelled.emit();
    }

    resetForm() {
        this.amount = null;
        this.category = '';
        this.description = '';
        this.type = 'Expense';
        this.editingId = null;
        this.selectedPropertyId = ''; // Reset selection
        this.date = new Date().toISOString().split('T')[0];
    }
}
