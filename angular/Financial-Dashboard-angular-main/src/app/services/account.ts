import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  public accounts$ = this.accountsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Observable<Account> {
    const user = this.authService.currentUserValue;
    const newAccount = { ...account, userId: user?.id };

    return this.http.post<Account>(this.apiUrl, newAccount).pipe(
      tap(newAccount => {
        const current = this.accountsSubject.value;
        this.accountsSubject.next([...current, newAccount]);
      })
    );
  }

  getAllAccounts(): Observable<Account[]> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return of([]);
    }

    let params = new HttpParams();
    params = params.set('userId', user.id);

    return this.http.get<Account[]>(this.apiUrl, { params }).pipe(
      tap(accounts => this.accountsSubject.next(accounts))
    );
  }

  getAccountById(id: string | number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  updateAccount(id: string | number, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account).pipe(
      tap(updated => {
        const current = this.accountsSubject.value;
        const index = current.findIndex(a => a.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.accountsSubject.next([...current]);
        }
      })
    );
  }

  deleteAccount(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.accountsSubject.value;
        this.accountsSubject.next(current.filter(a => a.id !== id));
      })
    );
  }
}
