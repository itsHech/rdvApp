import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface RegisterResponse {
  token: string;
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    role: '',
    civility: '',
    birthday: '',
    governorate: '',
    phone: '',
    profession: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response: any) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/login']);
      },
      error: (error: { error: { message: string } }) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}
