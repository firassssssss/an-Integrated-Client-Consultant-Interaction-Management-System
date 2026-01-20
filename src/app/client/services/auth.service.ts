// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

login(email: string, password: string) {
  const login$ = this.http.post<any>('http://localhost:8000/login', { email, password });
  return lastValueFrom(login$.pipe(
    tap(() => {
      localStorage.setItem('user_email', email);
    })
  ));
}

}
