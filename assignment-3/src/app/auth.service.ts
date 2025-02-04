import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/32758324/tzeying/api/v1/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isUserAuthenticated(): boolean {
    const currentUser = sessionStorage.getItem('currentUser');
    console.log('Current user in localStorage:', currentUser);
    return currentUser !== null;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { username, password });
  }

  signup(
    username: string,
    password: string,
    confirm_password: string
  ): Observable<any> {
    return this.http.post(`${API_URL}/signup`, {
      username,
      password,
      confirm_password,
    });
  }
}
