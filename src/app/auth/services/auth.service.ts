import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticateApiResponse, User, UserApiResponse } from '../store/models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthenticateApiResponse>(`${environment.api}/users/login`,{ data: { email, password }}, httpOptions)
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.data.private.token);
          return true;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }

  register(data: User): Observable<UserApiResponse> {
    return this.http.post<UserApiResponse>(`${environment.api}/users`, { data }, httpOptions)
  }
}
