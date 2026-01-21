import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of, switchMap } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common'; // added
import { PLATFORM_ID, Inject } from '@angular/core'; // added

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Modified login to work with JSON Server
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // JSON Server doesn't have auth endpoint, so we'll query users
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}`)
      .pipe(
        map(users => {
          if (users.length === 0) {
            throw new Error('User not found');
          }

          const user = users[0];

          // In real app, password would be checked on backend
          // For demo, we'll do basic check
          if ((user as any).password !== credentials.password) {
            throw new Error('Invalid password');
          }

          // Generate mock token
          const token = `mock-jwt-token-${user.id}-${Date.now()}`;

          const response: LoginResponse = {
            user: user,
            token: token
          };

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
          }
          this.currentUserSubject.next(user);

          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(user: User): Observable<User> {
    // Check if user exists
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${user.email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          throw new Error('User with this email already exists');
        }

        return this.http.post<User>(`${this.apiUrl}/users`, user);
      }),
      tap(createdUser => {
        // Optionally log them in immediately or just return the user
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
