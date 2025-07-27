import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalAuthService {
  private readonly TOKEN_KEY = 'access_token';
  private _token = signal<string | null>(this.getTokenFromStorage());

  get token() {
    return this._token();
  }

  get isLoggedIn() {
    return !!this._token();
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
