import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5001/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  navigateBasedOnRole(role: string) {
    if (role === 'client') {
      this.router.navigate(['/client/dashboard']);
    } else if (role === 'professional') {
      this.router.navigate(['/professionals/dashboard']);
    }
  }
}