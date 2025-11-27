# 🔗 Tests d'intégration Angular - Guide complet

**Projet** : atelier-angular  
**Framework** : Jasmine + Karma  
**Version Angular** : 20

---

## 📋 Table des matières

1. [Définition](#definition)
2. [Différences unitaire vs intégration](#differences)
3. [Exemple concret](#exemple)
4. [Implémentation dans le projet](#implementation)
5. [Commandes](#commandes)

---

## <a name="definition"></a>🎯 Qu'est-ce qu'un test d'intégration ?

### Test unitaire

**Teste** : Une seule unité isolée (service OU composant)  
**Dépendances** : Mockées (fausses)  
**But** : Vérifier la logique interne

```typescript
// Test unitaire - Service isolé
it('devrait calculer le prix TTC', () => {
  const service = new PrixService();
  expect(service.calculTTC(100)).toBe(120);
});
```

### Test d'intégration

**Teste** : Plusieurs unités ensemble (service + composant)  
**Dépendances** : Réelles (vraies)  
**But** : Vérifier que tout fonctionne ensemble

```typescript
// Test d'intégration - Composant + Service
it('devrait afficher le prix calculé par le service', () => {
  // Le composant utilise le VRAI service
  expect(component.prixTTC).toBe(1200);
  expect(compiled.textContent).toContain('1200€');
});
```

---

## <a name="differences"></a>📊 Comparaison détaillée

| Critère | Test Unitaire | Test d'Intégration |
|---------|---------------|-------------------|
| **Portée** | 1 unité isolée | Plusieurs unités ensemble |
| **Dépendances** | Mockées (fake) | Réelles (vraies) |
| **Rapidité** | ⚡ Très rapide | 🐢 Plus lent |
| **Complexité** | Simple | Plus complexe |
| **Couverture** | Logique interne | Interaction entre modules |
| **Quand ?** | Développement (TDD) | Avant déploiement |
| **Nombre** | Beaucoup (80%) | Moins nombreux (20%) |

---

## <a name="exemple"></a>💡 Exemple concret du projet

### Scénario à tester

**Flux utilisateur complet** :
1. Page produit s'affiche
2. Prix TTC calculé automatiquement (via PrixService)
3. Utilisateur clique sur "Appliquer remise"
4. Prix après remise calculé (via PrixService)
5. DOM mis à jour avec le nouveau prix

### Architecture

```
ProductComponent
       ↓
   PrixService
```

**Le test d'intégration vérifie que ces deux éléments fonctionnent ensemble.**

---

## <a name="implementation"></a>🏗️ Implémentation

### Étape 1 : Créer le composant ProductComponent

**Fichier** : `src/app/components/product/product.ts`

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrixService } from '../../services/prix';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product">
      <h2>{{ productName }}</h2>
      <p>Prix HT : {{ prixHT }}€</p>
      <p>Prix TTC : {{ prixTTC }}€</p>
      <p *ngIf="remise > 0">Remise : {{ remise }}%</p>
      <p *ngIf="remise > 0">Prix après remise : {{ prixApresRemise }}€</p>
      <button (click)="appliquerRemise(10)">Appliquer remise -10%</button>
    </div>
  `
})
export class ProductComponent {
  @Input() productName = 'Ordinateur portable';
  @Input() prixHT = 1000;
  
  prixTTC = 0;
  remise = 0;
  prixApresRemise = 0;
  
  constructor(private prixService: PrixService) {
    this.calculerPrixTTC();
  }
  
  calculerPrixTTC(): void {
    this.prixTTC = this.prixService.calculTTC(this.prixHT);
  }
  
  appliquerRemise(pourcentage: number): void {
    this.remise = pourcentage;
    this.prixApresRemise = this.prixService.appliquerRemise(this.prixTTC, pourcentage);
  }
}
```

### Étape 2 : Créer les tests d'intégration

**Fichier** : `src/app/components/product/product.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product';
import { PrixService } from '../../services/prix';

describe('ProductComponent - Tests d\'intégration', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let prixService: PrixService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [PrixService]  // ← VRAI service (pas de mock)
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    prixService = TestBed.inject(PrixService);
    fixture.detectChanges();
  });
  
  // TEST 1 : Initialisation
  it('devrait calculer le prix TTC à l\'initialisation', () => {
    expect(component.prixHT).toBe(1000);
    expect(component.prixTTC).toBe(1200);
  });
  
  // TEST 2 : Affichage DOM
  it('devrait afficher le prix TTC dans le DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Prix TTC : 1200€');
  });
  
  // TEST 3 : Interaction complète
  it('devrait appliquer une remise et mettre à jour le DOM', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    
    button.click();
    fixture.detectChanges();
    
    expect(component.prixApresRemise).toBe(1080);  // 1200 - 10%
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Prix après remise : 1080€');
  });
});
```

### Étape 3 : Générer le composant (dans PowerShell)

```powershell
# Créer le composant
ng generate component components/product

# Les fichiers sont créés automatiquement :
# - product.ts
# - product.html
# - product.css
# - product.spec.ts
```

### Étape 4 : Copier les contenus

1. Copie le contenu de **[product.ts](computer:///mnt/user-data/outputs/product.ts)**
2. Copie le contenu de **[product.spec.ts](computer:///mnt/user-data/outputs/product.spec.ts)**

### Étape 5 : Lancer les tests

```powershell
ng test
```

**Résultat attendu** :
```
✓ devrait calculer le prix TTC à l'initialisation
✓ devrait afficher le prix TTC dans le DOM
✓ devrait appliquer une remise et mettre à jour le DOM
✓ devrait gérer un scénario complet
✓ devrait utiliser le vrai PrixService
✓ devrait recalculer les prix quand le prixHT change
```

---

## 🔍 Analyse détaillée des tests d'intégration

### Test d'intégration 1 : Initialisation

```typescript
it('devrait calculer le prix TTC à l\'initialisation', () => {
  expect(component.prixHT).toBe(1000);
  expect(component.prixTTC).toBe(1200);
});
```

**Ce qui est testé** :
1. ✅ Le composant s'initialise correctement
2. ✅ Le constructor appelle `calculerPrixTTC()`
3. ✅ La méthode appelle le VRAI `prixService.calculTTC()`
4. ✅ Le service calcule correctement (1000 * 1.2 = 1200)
5. ✅ La valeur est bien stockée dans `component.prixTTC`

**Flux complet** :
```
Component constructor
      ↓
calculerPrixTTC()
      ↓
prixService.calculTTC(1000)
      ↓
return 1200
      ↓
component.prixTTC = 1200
```

---

### Test d'intégration 2 : DOM

```typescript
it('devrait afficher le prix TTC dans le DOM', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.textContent).toContain('Prix TTC : 1200€');
});
```

**Ce qui est testé** :
1. ✅ Le composant calcule le prix (via service)
2. ✅ Le template affiche la valeur avec `{{ prixTTC }}`
3. ✅ Angular met à jour le DOM
4. ✅ L'utilisateur voit le bon prix

**Flux complet** :
```
Service calcule
      ↓
Component stocke
      ↓
Template interpole {{ prixTTC }}
      ↓
DOM affiche "1200€"
```

---

### Test d'intégration 3 : Interaction utilisateur

```typescript
it('devrait appliquer une remise et mettre à jour le DOM', () => {
  const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  
  button.click();
  fixture.detectChanges();
  
  expect(component.prixApresRemise).toBe(1080);
  
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.textContent).toContain('Prix après remise : 1080€');
});
```

**Ce qui est testé** :
1. ✅ Simulation du clic utilisateur
2. ✅ Appel de `appliquerRemise(10)`
3. ✅ Appel du VRAI `prixService.appliquerRemise(1200, 10)`
4. ✅ Calcul correct (1200 * 0.9 = 1080)
5. ✅ Mise à jour du composant
6. ✅ Détection de changements Angular
7. ✅ Mise à jour du DOM
8. ✅ Affichage correct

**Flux complet** :
```
User clicks button
      ↓
(click)="appliquerRemise(10)"
      ↓
component.appliquerRemise(10)
      ↓
prixService.appliquerRemise(1200, 10)
      ↓
return 1080
      ↓
component.prixApresRemise = 1080
      ↓
fixture.detectChanges()
      ↓
Template updates *ngIf
      ↓
DOM shows "1080€"
```

**C'est un vrai test d'intégration car il teste TOUT le flux !**

---

## 🆚 Comparaison : Test unitaire vs Test d'intégration

### Même fonctionnalité testée différemment

#### Test UNITAIRE (avec mock)

```typescript
describe('ProductComponent - Test unitaire', () => {
  let mockPrixService: jasmine.SpyObj<PrixService>;
  
  beforeEach(() => {
    // MOCK du service
    mockPrixService = jasmine.createSpyObj('PrixService', ['calculTTC']);
    mockPrixService.calculTTC.and.returnValue(1500);  // Valeur mockée
    
    TestBed.configureTestingModule({
      providers: [
        { provide: PrixService, useValue: mockPrixService }  // Mock
      ]
    });
  });
  
  it('devrait appeler le service', () => {
    // Teste SEULEMENT que le composant appelle le service
    expect(mockPrixService.calculTTC).toHaveBeenCalled();
    
    // La valeur retournée est celle du mock (1500)
    // On ne teste PAS la vraie logique du service
    expect(component.prixTTC).toBe(1500);
  });
});
```

**Ce qui est testé** :
- ✅ Le composant appelle bien le service
- ❌ On ne teste PAS si le calcul est correct
- ❌ On ne teste PAS l'intégration réelle

**Avantage** :
- ⚡ Très rapide
- 🎯 Isolé (si le service bug, ce test passe quand même)

---

#### Test D'INTÉGRATION (sans mock)

```typescript
describe('ProductComponent - Test d\'intégration', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrixService]  // VRAI service
    });
  });
  
  it('devrait calculer le prix TTC correctement', () => {
    // Teste l'intégration complète
    expect(component.prixTTC).toBe(1200);  // Vraie valeur calculée
  });
});
```

**Ce qui est testé** :
- ✅ Le composant appelle le service
- ✅ Le service calcule correctement
- ✅ L'intégration fonctionne

**Avantage** :
- 🔗 Teste la vraie intégration
- 🐛 Détecte les bugs d'intégration

---

## 📊 Stratégie de tests recommandée

### Pyramide des tests

```
         /\
        /E2E\          ← 10% (Cypress, Playwright)
       /------\
      /  Intég \       ← 20% (Jasmine + vrai service)
     /----------\
    /  Unitaire  \     ← 70% (Jasmine + mocks)
   /--------------\
```

### Pour ton projet

| Type | Nombre | Exemples |
|------|--------|----------|
| **Unitaires** | 70% | `prix.service.spec.ts` (avec mocks) |
| **Intégration** | 20% | `product.spec.ts` (composant + vrai service) |
| **E2E** | 10% | Tests Cypress (parcours complet) |

### Quand utiliser quoi ?

**Tests unitaires** :
- ✅ Développement quotidien (TDD)
- ✅ Tests rapides et nombreux
- ✅ Logique métier complexe
- ✅ Fonctions pures

**Tests d'intégration** :
- ✅ Vérifier que composant + service fonctionnent ensemble
- ✅ Flux utilisateur critiques
- ✅ Avant merge/déploiement
- ✅ Interactions entre modules

**Tests E2E** :
- ✅ Parcours utilisateur complet
- ✅ Avant release en production
- ✅ Tests de non-régression
- ✅ Flows critiques (paiement, inscription)

---

## <a name="commandes"></a>⚙️ Commandes utiles

### Lancer tous les tests

```powershell
ng test
```

### Lancer les tests en mode headless (CI/CD)

```powershell
ng test --no-watch --browsers=ChromeHeadless
```

### Lancer uniquement les tests d'intégration

```powershell
# Filtrer par describe
ng test --include='**/product.spec.ts'
```

### Générer un rapport de couverture

```powershell
ng test --code-coverage

# Ouvrir le rapport
open coverage/index.html
```

---

## 🎯 Résumé

### Ce que tu as appris

1. ✅ Différence entre test unitaire et test d'intégration
2. ✅ Comment créer un composant qui utilise un service
3. ✅ Comment tester l'intégration composant + service
4. ✅ Comment tester un flux utilisateur complet
5. ✅ Quand utiliser des mocks vs vrais services

### Tests dans ton projet

| Fichier | Type | Dépendances |
|---------|------|-------------|
| `prix.spec.ts` | Unitaire | Aucune (service isolé) |
| `greeting.spec.ts` | Unitaire | CommonModule |
| `product.spec.ts` | **Intégration** | **PrixService réel** |

### Bénéfices des tests d'intégration

- ✅ Détecte les bugs d'intégration
- ✅ Vérifie que tout fonctionne ensemble
- ✅ Plus proche du comportement réel
- ✅ Confiance avant déploiement

---

## 📚 Pour aller plus loin

### Tests HTTP (intégration avec API)

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

it('devrait récupérer les produits via API', () => {
  const httpMock = TestBed.inject(HttpTestingController);
  
  service.getProducts().subscribe(products => {
    expect(products.length).toBe(5);
  });
  
  const req = httpMock.expectOne('/api/products');
  req.flush([/* données mockées */]);
});
```

### Tests de routing

```typescript
it('devrait naviguer vers la page produit', () => {
  const router = TestBed.inject(Router);
  router.navigate(['/product', 123]);
  
  expect(location.path()).toBe('/product/123');
});
```

### Tests de formulaires

```typescript
it('devrait valider le formulaire', () => {
  component.form.patchValue({
    email: 'test@example.com',
    password: '123456'
  });
  
  expect(component.form.valid).toBeTruthy();
});
```

---

**Document créé pour l'atelier de tests logiciels**  
*Tests d'intégration Angular - Novembre 2024*
