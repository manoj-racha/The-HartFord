import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';
import { Transaction, TransactionSummary } from '../models/transaction.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Observable<Transaction> {
    const user = this.authService.currentUserValue;
    const newTransaction = {
      ...transaction,
      userId: user?.id,
      createdAt: new Date().toISOString()
    };

    return this.http.post<Transaction>(this.apiUrl, newTransaction).pipe(
      tap(created => {
        const current = this.transactionsSubject.value;
        this.transactionsSubject.next([created, ...current]);
      })
    );
  }

  getAllTransactions(filters?: any): Observable<Transaction[]> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return of([]);
    }

    let params = new HttpParams();
    params = params.set('userId', user.id);

    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
    }

    return this.http.get<Transaction[]>(this.apiUrl, { params }).pipe(
      tap(transactions => this.transactionsSubject.next(transactions))
    );
  }

  getTransactionById(id: string | number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Calculate summary from all transactions
  getTransactionSummary(): Observable<TransactionSummary> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return of({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0
      });
    }

    let params = new HttpParams();
    params = params.set('userId', user.id);

    return this.http.get<Transaction[]>(this.apiUrl, { params }).pipe(
      map(transactions => {
        const summary: TransactionSummary = {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          transactionCount: transactions.length
        };

        transactions.forEach(t => {
          if (t.type === 'income') {
            summary.totalIncome += t.amount;
          } else if (t.type === 'expense') {
            summary.totalExpense += t.amount;
          }
        });

        summary.balance = summary.totalIncome - summary.totalExpense;

        return summary;
      })
    );
  }

  updateTransaction(id: string | number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction).pipe(
      tap(updated => {
        const current = this.transactionsSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.transactionsSubject.next([...current]);
        }
      })
    );
  }

  deleteTransaction(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.transactionsSubject.value;
        this.transactionsSubject.next(current.filter(t => t.id !== id));
      })
    );
  }
}
