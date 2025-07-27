import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../api/services';
import { LocalAuthService } from '../services/local-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">{{ isLogin() ? 'Login' : 'Register' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="username" class="block text-gray-700">Username</label>
            <input id="username" type="text" formControlName="username" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-red-500 text-xs mt-1">Username required</div>
          </div>
          <div>
            <label for="password" class="block text-gray-700">Password</label>
            <input id="password" type="password" formControlName="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-red-500 text-xs mt-1">Password required</div>
          </div>
          <div *ngIf="!isLogin()">
            <label for="confirmPassword" class="block text-gray-700">Confirm Password</label>
            <input id="confirmPassword" type="password" formControlName="confirmPassword" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div *ngIf="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched" class="text-red-500 text-xs mt-1">Passwords must match</div>
          </div>
          <button type="submit" [disabled]="form.invalid" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">{{ isLogin() ? 'Login' : 'Register' }}</button>
        </form>
        <div class="mt-4 text-center">
          <button (click)="toggleMode()" class="text-blue-600 hover:underline">
            {{ isLogin() ? 'No account? Register' : 'Already have an account? Login' }}
          </button>
        </div>
        <div *ngIf="error()" class="mt-4 text-red-500 text-center">{{ error() }}</div>
      </div>
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private localAuth = inject(LocalAuthService);
  private mode = signal<'login' | 'register'>('login');
  error = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: [''],
  });

  isLogin() {
    return this.mode() === 'login';
  }

  toggleMode() {
    this.mode.set(this.isLogin() ? 'register' : 'login');
    this.error.set('');
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password, confirmPassword } = this.form.value;
    const safeUsername = username ?? '';
    const safePassword = password ?? '';
    this.error.set('');
    if (!this.isLogin() && password !== confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      this.error.set('Passwords do not match');
      return;
    }
    if (this.isLogin()) {
      this.authService.authControllerLogin({ body: { username: safeUsername, password: safePassword } }).subscribe({
        next: (res) => {
          if (res && typeof res.accessToken === 'string') {
            this.localAuth.setToken(res.accessToken);
          }
          this.router.navigate(['/']);
        },
        error: (err: unknown) => {
          let message = 'Login failed';
          type ErrorWithMessage = { error?: { message?: string } };
          if (typeof err === 'object' && err && 'error' in err && typeof (err as ErrorWithMessage).error?.message === 'string') {
            message = (err as ErrorWithMessage).error?.message ?? message;
          }
          this.error.set(message);
        },
      });
    } else {
      this.authService.authControllerRegister({ body: { username: safeUsername, password: safePassword } }).subscribe({
        next: (res) => {
          if (res && typeof res.accessToken === 'string') {
            this.localAuth.setToken(res.accessToken);
          }
          this.mode.set('login');
          this.error.set('Registration successful! Please login.');
          this.form.reset();
        },
        error: (err: unknown) => {
          let message = 'Registration failed';
          type ErrorWithMessage = { error?: { message?: string } };
          if (typeof err === 'object' && err && 'error' in err && typeof (err as ErrorWithMessage).error?.message === 'string') {
            message = (err as ErrorWithMessage).error?.message ?? message;
          }
          this.error.set(message);
        },
      });
    }
  }
}
