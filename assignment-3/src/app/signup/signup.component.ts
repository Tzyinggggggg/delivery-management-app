import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService
      .signup(this.username, this.password, this.confirmPassword)
      .subscribe(
        (response) => {
          console.log('Sign up successful!', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.router.navigate(['invalid-data']);
          console.error('Sign up failed!', error);
        }
      );
  }
}
