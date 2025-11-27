import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  // Getters pour accéder facilement aux contrôles dans le template
  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.valid) {
      console.log('Formulaire soumis', this.loginForm.value);
      // Ici tu pourrais appeler un service d'authentification
    }
  }
  
  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}