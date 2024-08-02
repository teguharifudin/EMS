import { Component, ContentChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[@#%$!&*])[a-zA-Z0-9@#%$!&*]{8,50}$')]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    terms: new FormControl(false, Validators.requiredTrue)
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;
  fieldTextType: boolean | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')!.value!;
      const password = this.registerForm.get('password')!.value!;
      const firstName = this.registerForm.get('name')!.value!;
      const phone = this.registerForm.get('phone')!.value!;
      this.authService.register(email, password, firstName, phone).subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.errorMessage = null;
          this.setAutoHideMessages();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'Registration failed.';
          this.successMessage = null;
          this.setAutoHideMessages();
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  private setAutoHideMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}