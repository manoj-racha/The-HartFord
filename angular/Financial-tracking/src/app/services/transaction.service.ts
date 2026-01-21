import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Transaction } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = 'http://localhost:3000/transactions';

    // Signal to hold the state of transactions
    private _transactions = signal<Transaction[]>([]);
    readonly transactions = this._transactions.asReadonly();

    constructor(private http: HttpClient) {
        this.loadTransactions();
    }

    // Load initial data
    loadTransactions() {
        this.http.get<Transaction[]>(this.apiUrl).subscribe(data => {
            this._transactions.set(data);
        });
    }

    // Get all transactions (Legacy/Global) - optional helper if needed, but components should use the signal
    getAllTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(this.apiUrl);
    }

    // Get transactions for a specific property
    // For now, we might want to filter the signal or fetch new data. 
    // If the requirement is to show ALL transactions on valid load, we stick to that.
    // If we need server-side filtering:
    getTransactionsByProperty(propertyId: string) {
        this.http.get<Transaction[]>(`${this.apiUrl}?propertyId=${propertyId}`).subscribe(data => {
            this._transactions.set(data);
        });
    }


    // Add a new transaction
    addTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
            tap(newTransaction => {
                this._transactions.update(transactions => [...transactions, newTransaction]);
            })
        );
    }

    // Update a transaction
    updateTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction).pipe(
            tap(updatedTransaction => {
                this._transactions.update(transactions =>
                    transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
                );
            })
        );
    }

    // Delete a transaction
    deleteTransaction(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this._transactions.update(transactions => transactions.filter(t => t.id !== id));
            })
        );
    }
}
