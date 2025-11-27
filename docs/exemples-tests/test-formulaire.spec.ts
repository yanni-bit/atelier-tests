// ==========================================================
// TESTS DE FORMULAIRES ANGULAR
// Teste la validation, soumission et gestion d'erreurs
// ==========================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login';

describe('LoginComponent - Tests de formulaire', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  // ==========================================================
  // TEST 1 : Validation - Email invalide
  // ==========================================================
  
  it('devrait invalider un email incorrect', () => {
    const emailControl = component.loginForm.get('email');
    
    // Email vide
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
    
    // Email invalide
    emailControl?.setValue('test@');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Email valide
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 2 : Validation - Mot de passe trop court
  // ==========================================================
  
  it('devrait invalider un mot de passe trop court', () => {
    const passwordControl = component.loginForm.get('password');
    
    // Mot de passe trop court (< 6 caractères)
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    // Mot de passe valide
    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 3 : État du formulaire
  // ==========================================================
  
  it('devrait désactiver le bouton si formulaire invalide', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    // Formulaire vide → bouton désactivé
    expect(component.loginForm.invalid).toBeTruthy();
    expect(button.disabled).toBeTruthy();
    
    // Remplir le formulaire correctement
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });
    fixture.detectChanges();
    
    // Formulaire valide → bouton activé
    expect(component.loginForm.valid).toBeTruthy();
    expect(button.disabled).toBeFalsy();
  });
  
  // ==========================================================
  // TEST 4 : Soumission du formulaire
  // ==========================================================
  
  it('devrait appeler onSubmit lors de la soumission', () => {
    spyOn(component, 'onSubmit');
    
    // Remplir le formulaire
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });
    
    // Soumettre
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    
    expect(component.onSubmit).toHaveBeenCalled();
  });
  
  // ==========================================================
  // TEST 5 : Affichage des erreurs
  // ==========================================================
  
  it('devrait afficher un message d\'erreur pour email invalide', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector('input[type="email"]') as HTMLInputElement;
    
    // Déclencher la validation
    emailInput.value = 'invalide';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    
    const errorMessage = compiled.querySelector('.error-message');
    expect(errorMessage?.textContent).toContain('Email invalide');
  });
  
  // ==========================================================
  // TEST 6 : Reset du formulaire
  // ==========================================================
  
  it('devrait réinitialiser le formulaire', () => {
    // Remplir le formulaire
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });
    
    // Reset
    component.loginForm.reset();
    
    expect(component.loginForm.get('email')?.value).toBeNull();
    expect(component.loginForm.get('password')?.value).toBeNull();
    expect(component.loginForm.pristine).toBeTruthy();
  });
});


// ==========================================================
// COMPOSANT EXEMPLE : login.ts
// ==========================================================

/*
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div>
        <input type="email" formControlName="email" placeholder="Email">
        <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
             class="error-message">
          Email invalide
        </div>
      </div>
      
      <div>
        <input type="password" formControlName="password" placeholder="Mot de passe">
        <div *ngIf="loginForm.get('password')?.hasError('minlength')" 
             class="error-message">
          6 caractères minimum
        </div>
      </div>
      
      <button type="submit" [disabled]="loginForm.invalid">Se connecter</button>
    </form>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulaire soumis', this.loginForm.value);
    }
  }
}
*/
