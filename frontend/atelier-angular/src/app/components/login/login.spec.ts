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
  // TEST 1 : Création du composant
  // ==========================================================
  
  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 2 : Formulaire invalide au départ
  // ==========================================================
  
  it('devrait avoir un formulaire invalide au départ', () => {
    expect(component.loginForm.invalid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 3 : Validation email - requis
  // ==========================================================
  
  it('devrait invalider un email vide', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 4 : Validation email - format
  // ==========================================================
  
  it('devrait invalider un email incorrect', () => {
    const emailControl = component.loginForm.get('email');
    
    // Email sans @
    emailControl?.setValue('testexample.com');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Email avec @ mais incomplet
    emailControl?.setValue('test@');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Email valide
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 5 : Validation mot de passe - requis
  // ==========================================================
  
  it('devrait invalider un mot de passe vide', () => {
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 6 : Validation mot de passe - longueur minimale
  // ==========================================================
  
  it('devrait invalider un mot de passe trop court', () => {
    const passwordControl = component.loginForm.get('password');
    
    // Moins de 6 caractères
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    // Exactement 6 caractères (valide)
    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
    
    // Plus de 6 caractères (valide)
    passwordControl?.setValue('1234567890');
    expect(passwordControl?.valid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 7 : État du bouton submit
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
  // TEST 8 : Soumission du formulaire
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
  // TEST 9 : Affichage des erreurs
  // ==========================================================
  
  it('devrait afficher un message d\'erreur pour email invalide', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector('input[type="email"]') as HTMLInputElement;
    
    // Rendre le champ dirty et touched
    emailInput.value = 'invalide';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    
    component.loginForm.get('email')?.markAsTouched();
    fixture.detectChanges();
    
    const errorMessage = compiled.querySelector('.error-message');
    expect(errorMessage?.textContent).toContain('Email invalide');
  });
  
  // ==========================================================
  // TEST 10 : Reset du formulaire
  // ==========================================================
  
  it('devrait réinitialiser le formulaire', () => {
    // Remplir le formulaire
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });
    
    expect(component.loginForm.get('email')?.value).toBe('test@example.com');
    expect(component.loginForm.get('password')?.value).toBe('123456');
    
    // Reset
    component.onReset();
    
    expect(component.loginForm.get('email')?.value).toBeNull();
    expect(component.loginForm.get('password')?.value).toBeNull();
    expect(component.loginForm.pristine).toBeTruthy();
    expect(component.submitted).toBeFalsy();
  });
  
  // ==========================================================
  // TEST 11 : Validation complète du formulaire
  // ==========================================================
  
  it('devrait valider le formulaire avec des données correctes', () => {
    component.loginForm.patchValue({
      email: 'user@example.com',
      password: 'securePassword123'
    });
    
    expect(component.loginForm.valid).toBeTruthy();
    expect(component.loginForm.get('email')?.valid).toBeTruthy();
    expect(component.loginForm.get('password')?.valid).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 12 : Message de succès après soumission
  // ==========================================================
  
  it('devrait afficher le message de succès après soumission valide', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Remplir le formulaire
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });
    
    // Soumettre
    component.onSubmit();
    fixture.detectChanges();
    
    const successMessage = compiled.querySelector('.success-message');
    expect(successMessage).toBeTruthy();
    expect(successMessage?.textContent).toContain('Formulaire valide');
  });
});