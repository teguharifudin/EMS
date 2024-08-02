import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  register(email: string, password: string, firstName: string, phone: string): Observable<User> {
    const url = `${this.baseUrl}/register`;
    const body = { email, password, firstName, phone };
    return this.http.post<User>(url, body);
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    const url = `${this.baseUrl}/login`;
    const body = { email, password };
    return this.http.post<{ user: User; token: string }>(url, body);
  }

  setUser(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(url, { headers });
  }
}