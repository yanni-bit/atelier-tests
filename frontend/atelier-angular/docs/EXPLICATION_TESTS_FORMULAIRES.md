# 📝 Explication des tests de formulaires Angular

**Projet** : atelier-tests  
**Composant testé** : LoginComponent  
**Framework** : Jasmine + Karma  
**Type** : Tests de validation de formulaires

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-ensemble)
2. [Architecture du composant](#architecture)
3. [Explication de chaque test](#tests)
4. [Concepts clés](#concepts)
5. [Bonnes pratiques](#bonnes-pratiques)

---

## <a name="vue-ensemble"></a>🎯 Vue d'ensemble

### Fichiers impliqués

```
src/app/components/login/
├── login.ts           ← Composant avec ReactiveFormsModule
├── login.html         ← Template avec formulaire
├── login.css          ← Styles
└── login.spec.ts      ← 12 TESTS ✅
```

### Résultat des tests

```
✅ 12/12 tests réussis
⏱️ Temps d'exécution : ~0.15 secondes
```

---

## <a name="architecture"></a>🏗️ Architecture du composant

### LoginComponent (login.ts)

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // ← Import nécessaires
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;      // ← Le formulaire réactif
  submitted = false;          // ← État de soumission
  
  constructor(private fb: FormBuilder) {
    // Création du formulaire avec validateurs
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  // Getters pour accès facile dans le template
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
    }
  }
  
  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
```

### Points clés

1. **ReactiveFormsModule** : Permet de créer des formulaires réactifs
2. **FormBuilder** : Service pour construire facilement des FormGroup
3. **Validators** : Validateurs intégrés (required, email, minLength)
4. **FormGroup** : Groupe de contrôles de formulaire
5. **Getters** : Raccourcis pour accéder aux contrôles dans le template

---

## <a name="tests"></a>🧪 Explication de chaque test

### TEST 1 : Création du composant

```typescript
it('devrait être créé', () => {
  expect(component).toBeTruthy();
});
```

**Ce qui est testé** :
- Le composant s'instancie correctement
- Pas d'erreur dans le constructeur

**Pourquoi c'est important** :
- Test de base pour vérifier que tout compile
- Détecte les erreurs de configuration

---

### TEST 2 : Formulaire invalide au départ

```typescript
it('devrait avoir un formulaire invalide au départ', () => {
  expect(component.loginForm.invalid).toBeTruthy();
});
```

**Ce qui est testé** :
- Le formulaire est invalide quand il est vide
- Les validateurs `required` fonctionnent

**Pourquoi c'est important** :
- Les champs obligatoires sont bien configurés
- L'utilisateur ne peut pas soumettre un formulaire vide

**États d'un FormControl** :
- `valid` : Toutes les validations passent
- `invalid` : Au moins une validation échoue
- `pristine` : Jamais modifié
- `dirty` : Modifié au moins une fois
- `touched` : A reçu le focus puis l'a perdu
- `untouched` : N'a jamais reçu le focus

---

### TEST 3 : Validation email - requis

```typescript
it('devrait invalider un email vide', () => {
  const emailControl = component.loginForm.get('email');
  
  emailControl?.setValue('');
  expect(emailControl?.hasError('required')).toBeTruthy();
});
```

**Ligne par ligne** :

```typescript
const emailControl = component.loginForm.get('email');
// → Récupère le contrôle 'email' du formulaire
// → Type: AbstractControl | null

emailControl?.setValue('');
// → Définit la valeur du champ à vide
// → Le '?' est l'optional chaining (au cas où null)

expect(emailControl?.hasError('required')).toBeTruthy();
// → Vérifie que l'erreur 'required' est présente
// → hasError('required') retourne true si le champ est requis et vide
```

**Pourquoi c'est important** :
- Vérifie que l'email est obligatoire
- L'utilisateur doit remplir ce champ

---

### TEST 4 : Validation email - format

```typescript
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
```

**Ce qui est testé** :
- Le validateur `Validators.email` fonctionne
- Différents formats incorrects sont détectés
- Un email valide passe la validation

**Formats testés** :
- ❌ `testexample.com` → Pas de @
- ❌ `test@` → @ mais pas de domaine
- ✅ `test@example.com` → Format valide

**Validateur email d'Angular** :
```typescript
Validators.email
// Regex : /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/
// Vérifie : utilisateur@domaine.extension
```

---

### TEST 5 : Validation mot de passe - requis

```typescript
it('devrait invalider un mot de passe vide', () => {
  const passwordControl = component.loginForm.get('password');
  
  passwordControl?.setValue('');
  expect(passwordControl?.hasError('required')).toBeTruthy();
});
```

**Ce qui est testé** :
- Le mot de passe est obligatoire
- Similaire au test 3 mais pour le password

---

### TEST 6 : Validation mot de passe - longueur minimale

```typescript
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
```

**Ce qui est testé** :
- Le validateur `Validators.minLength(6)` fonctionne
- Exactement 6 caractères est accepté (limite inclusive)
- Plus de 6 caractères est accepté

**Validateur minLength** :
```typescript
Validators.minLength(6)
// Vérifie : value.length >= 6
// Retourne : { minlength: { requiredLength: 6, actualLength: X } } si invalide
```

**Cas testés** :
- ❌ `12345` → 5 caractères (invalide)
- ✅ `123456` → 6 caractères (limite, valide)
- ✅ `1234567890` → 10 caractères (valide)

---

### TEST 7 : État du bouton submit

```typescript
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
```

**Ligne par ligne** :

```typescript
const compiled = fixture.nativeElement as HTMLElement;
// → Récupère l'élément DOM racine du composant
// → Type: HTMLElement

const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
// → Cherche le bouton submit dans le DOM
// → querySelector retourne le premier élément qui matche
// → Type: HTMLButtonElement

expect(component.loginForm.invalid).toBeTruthy();
expect(button.disabled).toBeTruthy();
// → Vérifie que formulaire invalide ET bouton désactivé

component.loginForm.patchValue({
  email: 'test@example.com',
  password: '123456'
});
// → patchValue() met à jour plusieurs champs en une fois
// → Différence avec setValue() : patchValue accepte un objet partiel

fixture.detectChanges();
// → CRUCIAL : Force Angular à mettre à jour le DOM
// → Sans ça, le [disabled] dans le template ne serait pas mis à jour
```

**Template correspondant** :
```html
<button type="submit" [disabled]="loginForm.invalid">Se connecter</button>
```

**Pourquoi fixture.detectChanges() ?**
- Angular utilise la détection de changements pour mettre à jour le DOM
- En test, on doit déclencher manuellement cette détection
- Sinon, le DOM reste dans son état initial

---

### TEST 8 : Soumission du formulaire

```typescript
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
```

**Ligne par ligne** :

```typescript
spyOn(component, 'onSubmit');
// → Crée un espion sur la méthode onSubmit
// → Jasmine va surveiller si cette méthode est appelée
// → L'espion remplace temporairement la vraie méthode

const form = fixture.nativeElement.querySelector('form');
// → Récupère l'élément <form> du DOM

form.dispatchEvent(new Event('submit'));
// → Simule l'événement submit sur le formulaire
// → Équivalent à cliquer sur le bouton submit
// → Déclenche (ngSubmit)="onSubmit()" dans le template

expect(component.onSubmit).toHaveBeenCalled();
// → Vérifie que l'espion a détecté un appel à onSubmit()
// → toHaveBeenCalled() : appelé au moins une fois
// → toHaveBeenCalledTimes(n) : appelé exactement n fois
```

**Template correspondant** :
```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
```

**Concept : Spy (Espion)** :
- Jasmine crée un "espion" sur une méthode
- L'espion enregistre tous les appels
- On peut vérifier : appelé ? combien de fois ? avec quels arguments ?

---

### TEST 9 : Affichage des erreurs

```typescript
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
```

**Ligne par ligne** :

```typescript
const emailInput = compiled.querySelector('input[type="email"]') as HTMLInputElement;
// → Récupère l'input email du DOM

emailInput.value = 'invalide';
// → Définit une valeur invalide dans l'input

emailInput.dispatchEvent(new Event('input'));
// → Simule la saisie (événement input)
// → Déclenche la validation Angular

emailInput.dispatchEvent(new Event('blur'));
// → Simule la perte de focus (événement blur)
// → Marque le champ comme 'touched'

component.loginForm.get('email')?.markAsTouched();
// → Force le champ à être marqué comme touched
// → Nécessaire pour afficher les erreurs (condition dans le template)

fixture.detectChanges();
// → Met à jour le DOM pour afficher les messages d'erreur

const errorMessage = compiled.querySelector('.error-message');
// → Récupère le div d'erreur dans le DOM

expect(errorMessage?.textContent).toContain('Email invalide');
// → Vérifie que le message d'erreur est affiché
```

**Template correspondant** :
```html
<div *ngIf="email?.invalid && (email?.dirty || email?.touched || submitted)" 
     class="error-message">
  <span *ngIf="email?.hasError('required')">L'email est requis</span>
  <span *ngIf="email?.hasError('email')">Email invalide</span>
</div>
```

**Pourquoi markAsTouched() ?**
- Les erreurs ne s'affichent que si le champ est `touched` ou `dirty`
- Évite d'afficher des erreurs avant que l'utilisateur ait interagi
- UX : On ne veut pas "crier" sur l'utilisateur dès l'ouverture du formulaire

---

### TEST 10 : Reset du formulaire

```typescript
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
```

**Ce qui est testé** :
- La méthode `onReset()` vide le formulaire
- `.reset()` met les valeurs à `null`
- Le formulaire redevient `pristine` (non modifié)
- La variable `submitted` est remise à false

**Méthode onReset()** :
```typescript
onReset(): void {
  this.submitted = false;
  this.loginForm.reset();  // ← Remet tout à null
}
```

**États après reset** :
- `pristine: true` (non modifié)
- `dirty: false` (pas sale)
- `touched: false` (pas touché)
- `value: null` pour chaque champ

---

### TEST 11 : Validation complète

```typescript
it('devrait valider le formulaire avec des données correctes', () => {
  component.loginForm.patchValue({
    email: 'user@example.com',
    password: 'securePassword123'
  });
  
  expect(component.loginForm.valid).toBeTruthy();
  expect(component.loginForm.get('email')?.valid).toBeTruthy();
  expect(component.loginForm.get('password')?.valid).toBeTruthy();
});
```

**Ce qui est testé** :
- Un formulaire rempli correctement est valide
- Chaque champ individuellement est valide
- Toutes les validations passent

**Pourquoi ce test ?**
- Vérifie le cas nominal (happy path)
- S'assure qu'un utilisateur peut bien se connecter
- Complémentaire des tests d'erreur

---

### TEST 12 : Message de succès

```typescript
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
```

**Ce qui est testé** :
- Après soumission, un message de succès s'affiche
- Le div `.success-message` est présent dans le DOM
- Le texte contient bien "Formulaire valide"

**Template correspondant** :
```html
<div *ngIf="submitted && loginForm.valid" class="success-message">
  ✓ Formulaire valide !
</div>
```

**Flow complet** :
1. Remplir le formulaire
2. Soumettre (`onSubmit()`)
3. `submitted = true`
4. Condition `*ngIf="submitted && loginForm.valid"` devient vraie
5. Le div apparaît dans le DOM

---

## <a name="concepts"></a>🔑 Concepts clés

### Reactive Forms (Formulaires réactifs)

```typescript
// Création
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});

// Structure
loginForm: FormGroup
  ├── email: FormControl
  │   ├── value: string
  │   ├── validators: [required, email]
  │   └── errors: { required?: true, email?: true }
  └── password: FormControl
      ├── value: string
      ├── validators: [required, minLength]
      └── errors: { required?: true, minlength?: {...} }
```

---

### Validateurs intégrés

| Validateur | Usage | Erreur retournée |
|------------|-------|------------------|
| `Validators.required` | Champ obligatoire | `{ required: true }` |
| `Validators.email` | Format email | `{ email: true }` |
| `Validators.minLength(n)` | Longueur min | `{ minlength: {...} }` |
| `Validators.maxLength(n)` | Longueur max | `{ maxlength: {...} }` |
| `Validators.pattern(regex)` | Pattern regex | `{ pattern: {...} }` |
| `Validators.min(n)` | Valeur min (nombre) | `{ min: {...} }` |
| `Validators.max(n)` | Valeur max (nombre) | `{ max: {...} }` |

---

### États d'un FormControl

```typescript
// Validité
.valid      // Toutes validations OK
.invalid    // Au moins une validation KO

// Modification
.pristine   // Jamais modifié
.dirty      // Modifié au moins une fois

// Interaction
.touched    // A reçu et perdu le focus
.untouched  // N'a jamais eu le focus

// Statut
.pending    // Validation asynchrone en cours
.disabled   // Désactivé
.enabled    // Activé
```

---

### Méthodes importantes

```typescript
// Définir une valeur
control.setValue('nouvelle valeur')         // Valeur complète requise
control.patchValue({ email: 'test@test.com' })  // Partiel OK

// Marquer manuellement
control.markAsTouched()    // Marque comme touché
control.markAsDirty()      // Marque comme modifié
control.markAsPristine()   // Marque comme non modifié

// Reset
control.reset()            // Remet à null
control.reset('valeur')    // Reset avec valeur par défaut

// Vérifier erreurs
control.hasError('required')      // true/false
control.getError('minlength')     // Objet erreur ou null
```

---

### fixture.detectChanges()

**CRUCIAL en tests Angular !**

```typescript
// Sans detectChanges()
component.loginForm.patchValue({ email: 'test@test.com' });
const button = compiled.querySelector('button');
console.log(button.disabled);  // ❌ Ancien état (pas mis à jour)

// Avec detectChanges()
component.loginForm.patchValue({ email: 'test@test.com' });
fixture.detectChanges();  // ← Force la mise à jour du DOM
const button = compiled.querySelector('button');
console.log(button.disabled);  // ✅ État actuel (mis à jour)
```

**Quand l'utiliser ?**
- Après modification d'une propriété du composant
- Avant de vérifier le DOM
- Après un événement (click, input, etc.)

---

## <a name="bonnes-pratiques"></a>✅ Bonnes pratiques

### 1. Pattern AAA

```typescript
it('devrait valider un email correct', () => {
  // ARRANGE (Préparer)
  const emailControl = component.loginForm.get('email');
  
  // ACT (Agir)
  emailControl?.setValue('test@example.com');
  
  // ASSERT (Vérifier)
  expect(emailControl?.valid).toBeTruthy();
});
```

---

### 2. Nommage explicite

```typescript
// ✅ BON : Décrit le comportement attendu
it('devrait invalider un mot de passe trop court', () => { ... });

// ❌ MAUVAIS : Trop vague
it('test password', () => { ... });
```

---

### 3. Un test = une responsabilité

```typescript
// ✅ BON : Teste une seule chose
it('devrait invalider un email vide', () => {
  emailControl?.setValue('');
  expect(emailControl?.hasError('required')).toBeTruthy();
});

// ❌ MAUVAIS : Teste trop de choses
it('devrait valider le formulaire', () => {
  // Teste email, password, bouton, message, reset...
});
```

---

### 4. Tester les cas limites

```typescript
// ✅ Tester les limites exactes
passwordControl?.setValue('12345');   // 5 caractères (invalide)
passwordControl?.setValue('123456');  // 6 caractères (limite, valide)
passwordControl?.setValue('1234567'); // 7 caractères (valide)
```

---

### 5. Ne pas oublier detectChanges()

```typescript
// ✅ BON
component.loginForm.patchValue({ email: 'test@test.com' });
fixture.detectChanges();  // ← Met à jour le DOM
const button = compiled.querySelector('button');

// ❌ MAUVAIS
component.loginForm.patchValue({ email: 'test@test.com' });
const button = compiled.querySelector('button');  // DOM pas à jour !
```

---

## 📊 Couverture des tests

| Aspect | Testé ? |
|--------|---------|
| Création du composant | ✅ Test 1 |
| État initial | ✅ Test 2 |
| Validation email (requis) | ✅ Test 3 |
| Validation email (format) | ✅ Test 4 |
| Validation password (requis) | ✅ Test 5 |
| Validation password (longueur) | ✅ Test 6 |
| État du bouton | ✅ Test 7 |
| Soumission | ✅ Test 8 |
| Messages d'erreur | ✅ Test 9 |
| Reset | ✅ Test 10 |
| Cas nominal | ✅ Test 11 |
| Message de succès | ✅ Test 12 |

**Couverture** : 100% ✅

---

## 🎓 Résumé

### Ce qu'on a appris

1. ✅ Créer des formulaires réactifs avec `FormBuilder`
2. ✅ Utiliser les validateurs intégrés d'Angular
3. ✅ Tester la validation de formulaires
4. ✅ Interagir avec le DOM dans les tests
5. ✅ Utiliser `fixture.detectChanges()` correctement
6. ✅ Créer des espions avec `spyOn()`
7. ✅ Simuler des événements (`input`, `blur`, `submit`)
8. ✅ Vérifier l'affichage conditionnel (`*ngIf`)

### Points clés à retenir

- **ReactiveFormsModule** : Indispensable pour les formulaires réactifs
- **Validators** : Utilisez les validateurs intégrés avant de créer des custom
- **fixture.detectChanges()** : TOUJOURS après modification d'état
- **markAsTouched()** : Nécessaire pour afficher les erreurs en test
- **spyOn()** : Vérifie qu'une méthode est appelée sans l'exécuter
- **Pattern AAA** : Arrange, Act, Assert pour clarté

---

**Document créé pour l'atelier de tests logiciels**  
*Explication complète des tests de formulaires - 12 tests - Novembre 2024*
