# 🧪 Autres types de tests recommandés

**Projet** : atelier-tests  
**Au-delà des tests unitaires et d'intégration**

---

## 📋 Table des matières

1. [Tests HTTP / API externes](#http-api)
2. [Tests de formulaires](#formulaires)
3. [Tests de routing](#routing)
4. [Tests asynchrones / Observables](#async)
5. [Tests E2E (End-to-End)](#e2e)
6. [Tests de performance](#performance)
7. [Pyramide des tests](#pyramide)
8. [Recommandations pour ton projet](#recommandations)

---

## <a name="http-api"></a>🔌 1. Tests HTTP / API externes

### Qu'est-ce que c'est ?

Tests des appels à des API externes ou services tiers (météo, paiement, géolocalisation, etc.)

### Pourquoi c'est important ?

- ✅ Vérifie que ton app gère correctement les réponses API
- ✅ Teste les cas d'erreur (API down, timeout, mauvaise réponse)
- ✅ Évite les vraies requêtes HTTP (coûteuses, lentes)

### Exemple Backend (Jest)

```javascript
// Mock axios pour éviter les vraies requêtes
jest.mock('axios');

test('devrait récupérer la météo', async () => {
  // Simuler la réponse de l'API
  axios.get.mockResolvedValue({
    data: { city: 'Paris', temperature: 15 }
  });
  
  const response = await request(app).get('/weather/Paris');
  
  expect(response.body.temperature).toBe(15);
});
```

### Exemple Frontend (Angular)

```typescript
it('devrait récupérer des utilisateurs', () => {
  const mockUsers = [{ id: 1, name: 'Alice' }];
  
  service.getUsers().subscribe(users => {
    expect(users[0].name).toBe('Alice');
  });
  
  const req = httpMock.expectOne('https://api.example.com/users');
  req.flush(mockUsers);
});
```

### Ce qui est testé

| Aspect | Test |
|--------|------|
| **Succès** | Réponse correcte de l'API |
| **Erreur 404** | Ressource non trouvée |
| **Erreur 500** | Erreur serveur |
| **Timeout** | API trop lente |
| **Format** | Structure de la réponse |
| **Headers** | Authorization, Content-Type |

### Fichier d'exemple

📄 **[test-http.js](computer:///mnt/user-data/outputs/exemples-tests/test-http.js)** - Tests HTTP backend

---

## <a name="formulaires"></a>📝 2. Tests de formulaires

### Qu'est-ce que c'est ?

Tests de validation, soumission et gestion d'erreurs dans les formulaires

### Pourquoi c'est important ?

- ✅ Les formulaires sont critiques pour l'UX
- ✅ La validation côté client évite des erreurs
- ✅ Les messages d'erreur doivent être clairs

### Exemple Angular (Reactive Forms)

```typescript
it('devrait invalider un email incorrect', () => {
  const emailControl = component.loginForm.get('email');
  
  emailControl?.setValue('test@');
  expect(emailControl?.hasError('email')).toBeTruthy();
});

it('devrait désactiver le bouton si formulaire invalide', () => {
  const button = fixture.nativeElement.querySelector('button');
  
  expect(component.loginForm.invalid).toBeTruthy();
  expect(button.disabled).toBeTruthy();
});
```

### Ce qui est testé

| Aspect | Test |
|--------|------|
| **Validation** | Email, mot de passe, champs requis |
| **État** | Valid, invalid, pristine, dirty, touched |
| **Bouton submit** | Activé/désactivé selon validité |
| **Messages erreur** | Affichage des erreurs |
| **Reset** | Réinitialisation du formulaire |
| **Soumission** | Appel de onSubmit() |

### Types de validateurs

```typescript
Validators.required          // Champ obligatoire
Validators.email            // Format email
Validators.minLength(6)     // Longueur minimale
Validators.maxLength(50)    // Longueur maximale
Validators.pattern(/regex/) // Pattern personnalisé
Validators.min(0)           // Valeur minimale (nombres)
Validators.max(100)         // Valeur maximale (nombres)
```

### Fichier d'exemple

📄 **[test-formulaire.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-formulaire.spec.ts)** - Tests de formulaires Angular

---

## <a name="routing"></a>🔀 3. Tests de routing

### Qu'est-ce que c'est ?

Tests de navigation, guards (protection de routes), paramètres d'URL

### Pourquoi c'est important ?

- ✅ Vérifie que la navigation fonctionne
- ✅ Teste les routes protégées (authentification)
- ✅ Vérifie la récupération des paramètres

### Exemple Angular

```typescript
it('devrait naviguer vers /about', async () => {
  await router.navigate(['/about']);
  
  expect(location.path()).toBe('/about');
});

it('devrait bloquer l\'accès sans authentification', async () => {
  authService.logout();
  
  const canActivate = await router.navigate(['/protected']);
  
  expect(canActivate).toBeFalsy();
});
```

### Ce qui est testé

| Aspect | Test |
|--------|------|
| **Navigation simple** | Aller de A vers B |
| **Paramètres** | /user/:id |
| **Query params** | ?search=test |
| **Guards** | CanActivate, CanDeactivate |
| **Redirections** | Route invalide → Home |
| **Lazy loading** | Chargement différé de modules |

### Types de guards

```typescript
CanActivate          // Peut-on activer cette route ?
CanDeactivate        // Peut-on quitter cette route ?
CanActivateChild     // Peut-on activer les routes enfants ?
CanLoad              // Peut-on charger ce module lazy ?
Resolve              // Résoudre des données avant navigation
```

### Fichier d'exemple

📄 **[test-routing.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-routing.spec.ts)** - Tests de routing Angular

---

## <a name="async"></a>🔄 4. Tests asynchrones / Observables

### Qu'est-ce que c'est ?

Tests des appels HTTP, streams de données RxJS, promesses

### Pourquoi c'est important ?

- ✅ La plupart des apps Angular sont asynchrones
- ✅ Les appels API sont asynchrones
- ✅ Les Observables sont au cœur d'Angular

### Exemple Angular (HttpClient)

```typescript
it('devrait récupérer des utilisateurs', () => {
  const mockUsers = [{ id: 1, name: 'Alice' }];
  
  service.getUsers().subscribe(users => {
    expect(users.length).toBe(1);
  });
  
  const req = httpMock.expectOne('https://api.example.com/users');
  expect(req.request.method).toBe('GET');
  req.flush(mockUsers);
});
```

### Méthodes HTTP testées

| Méthode | Usage | Test |
|---------|-------|------|
| **GET** | Récupérer des données | Liste, détail |
| **POST** | Créer une ressource | Nouvel utilisateur |
| **PUT** | Mettre à jour | Modifier utilisateur |
| **DELETE** | Supprimer | Supprimer utilisateur |
| **PATCH** | Mise à jour partielle | Modifier un champ |

### Gestion d'erreurs HTTP

```typescript
it('devrait gérer une erreur 404', () => {
  service.getUserById(999).subscribe({
    error: (error) => {
      expect(error.status).toBe(404);
    }
  });
  
  const req = httpMock.expectOne('https://api.example.com/users/999');
  req.flush('Non trouvé', { status: 404, statusText: 'Not Found' });
});
```

### Tests RxJS

```typescript
// Observable simple
it('devrait émettre une valeur', (done) => {
  of('Hello').subscribe(value => {
    expect(value).toBe('Hello');
    done();
  });
});

// Observable avec délai
it('devrait émettre après 1s', fakeAsync(() => {
  of('Delayed').pipe(delay(1000)).subscribe(value => {
    result = value;
  });
  
  tick(1000);
  expect(result).toBe('Delayed');
}));
```

### Fichier d'exemple

📄 **[test-async.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-async.spec.ts)** - Tests asynchrones Angular

---

## <a name="e2e"></a>🎬 5. Tests E2E (End-to-End)

### Qu'est-ce que c'est ?

Tests du parcours utilisateur complet dans un vrai navigateur

### Pourquoi c'est important ?

- ✅ Teste l'application comme un vrai utilisateur
- ✅ Détecte les bugs d'intégration complexes
- ✅ Valide les flows critiques (inscription, paiement)

### Outils populaires

| Outil | Avantages | Inconvénients |
|-------|-----------|---------------|
| **Cypress** | Simple, rapide, excellent DX | Pas de multi-navigateurs (sauf payant) |
| **Playwright** | Multi-navigateurs, puissant | Courbe d'apprentissage |
| **Protractor** | ❌ Déprécié | N'utilise plus |

### Exemple Cypress

```javascript
describe('Login Flow', () => {
  it('devrait se connecter avec succès', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenue').should('be.visible');
  });
});
```

### Exemple Playwright

```typescript
test('devrait ajouter un produit au panier', async ({ page }) => {
  await page.goto('https://example.com');
  
  await page.click('text=Ajouter au panier');
  await page.click('text=Voir le panier');
  
  await expect(page.locator('.cart-item')).toHaveCount(1);
});
```

### Quand utiliser les tests E2E ?

- ✅ Flows critiques (paiement, inscription)
- ✅ Avant une release en production
- ✅ Tests de non-régression
- ❌ Pas pour tout (trop lents, trop coûteux)

### Pyramide des tests

```
       /\
      /E2E\        ← 10% (lents, coûteux, fragiles)
     /------\
    /  Intég \     ← 20% (moyennement rapides)
   /----------\
  /  Unitaire  \   ← 70% (rapides, nombreux, ciblés)
 /--------------\
```

---

## <a name="performance"></a>⚡ 6. Tests de performance

### Qu'est-ce que c'est ?

Tests de vitesse, charge, scalabilité de l'application

### Pourquoi c'est important ?

- ✅ Performance = expérience utilisateur
- ✅ Détecte les ralentissements
- ✅ Vérifie la scalabilité

### Outils populaires

| Outil | Usage |
|-------|-------|
| **Lighthouse** | Performance frontend (score 0-100) |
| **Artillery** | Tests de charge backend |
| **k6** | Tests de charge avancés |
| **Jest --maxWorkers** | Performance des tests |

### Exemple Lighthouse (CI)

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

### Exemple Artillery (charge backend)

```yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 utilisateurs/seconde
scenarios:
  - flow:
      - get:
          url: '/hello'
      - post:
          url: '/calculate'
          json:
            a: 5
            b: 3
```

### Métriques à surveiller

| Métrique | Backend | Frontend |
|----------|---------|----------|
| **Temps de réponse** | < 200ms | - |
| **Throughput** | Requêtes/sec | - |
| **First Contentful Paint** | - | < 1.8s |
| **Time to Interactive** | - | < 3.8s |
| **Lighthouse Score** | - | > 90 |

---

## <a name="pyramide"></a>🔺 Pyramide des tests

### Répartition recommandée

```
         /\
        /10%\       E2E (End-to-End)
       /------\     - Cypress, Playwright
      /  20%  \     Intégration
     /----------\   - Composant + Service
    /    70%    \   Unitaires
   /--------------\ - Fonctions, Services isolés
```

### Pourquoi cette répartition ?

**70% Unitaires** :
- ✅ Très rapides (< 1s pour des centaines)
- ✅ Ciblés (un bug = un test échoue)
- ✅ Faciles à déboguer
- ✅ Feedback immédiat

**20% Intégration** :
- ✅ Rapides (quelques secondes)
- ✅ Testent que tout fonctionne ensemble
- ✅ Confiance dans les interactions

**10% E2E** :
- ⚠️ Lents (minutes)
- ⚠️ Fragiles (changements d'UI cassent les tests)
- ⚠️ Coûteux (maintenance)
- ✅ Mais testent le parcours utilisateur réel

### Coût vs Confiance

```
                    Coût
                     ↑
                     |
              E2E    |  ● (Très coûteux)
                     |
        Intégration  |    ● (Moyennement coûteux)
                     |
         Unitaires   |       ● (Peu coûteux)
                     |
                     └────────────────────→
                              Confiance
```

---

## <a name="recommandations"></a>🎯 Recommandations pour ton projet

### Tests déjà implémentés ✅

| Type | Nombre | Status |
|------|--------|--------|
| **Backend unitaire** | 6 tests | ✅ Fait |
| **Frontend unitaire** | 10 tests | ✅ Fait |
| **Frontend intégration** | 8 tests | ✅ Fait |

### Tests à ajouter pour un projet complet

#### Priorité 1 (Facile, important) ⭐⭐⭐

1. **Tests de formulaires**
   - LoginComponent avec validation
   - Temps : 30 minutes
   - Impact : Haute (UX critique)

2. **Tests HTTP**
   - Service qui appelle une API externe
   - Temps : 1 heure
   - Impact : Haute (données réelles)

#### Priorité 2 (Moyen, utile) ⭐⭐

3. **Tests de routing**
   - Navigation entre pages
   - AuthGuard pour routes protégées
   - Temps : 1 heure
   - Impact : Moyenne (navigation)

4. **Tests asynchrones avancés**
   - Observables avec retry
   - Debounce, throttle
   - Temps : 1 heure
   - Impact : Moyenne (robustesse)

#### Priorité 3 (Avancé, bonus) ⭐

5. **Tests E2E (Cypress)**
   - Parcours utilisateur complet
   - Temps : 2-3 heures
   - Impact : Haute (confiance totale)

6. **Tests de performance**
   - Lighthouse CI
   - Temps : 1 heure
   - Impact : Moyenne (UX)

---

## 📊 Tableau récapitulatif

| Type de test | Quoi | Outils | Vitesse | Priorité |
|--------------|------|--------|---------|----------|
| **Unitaires** | Fonctions isolées | Jest, Jasmine | ⚡⚡⚡ | ⭐⭐⭐ |
| **Intégration** | Composant + Service | Jasmine | ⚡⚡ | ⭐⭐⭐ |
| **HTTP/API** | Appels externes | HttpTestingController | ⚡⚡ | ⭐⭐⭐ |
| **Formulaires** | Validation, UX | Jasmine | ⚡⚡ | ⭐⭐⭐ |
| **Routing** | Navigation, guards | Jasmine | ⚡⚡ | ⭐⭐ |
| **Async** | Observables, RxJS | Jasmine | ⚡⚡ | ⭐⭐ |
| **E2E** | Parcours utilisateur | Cypress, Playwright | ⚡ | ⭐ |
| **Performance** | Vitesse, charge | Lighthouse, k6 | ⚡ | ⭐ |

---

## 🚀 Plan d'implémentation suggéré

### Étape 1 : Tests de formulaires (30 min)
```bash
ng generate component components/login
# Implémenter LoginComponent avec ReactiveFormsModule
# Écrire 6 tests (validation, état, soumission)
```

### Étape 2 : Tests HTTP (1h)
```bash
ng generate service services/user
# Implémenter UserService avec HttpClient
# Écrire 9 tests (GET, POST, PUT, DELETE, erreurs)
```

### Étape 3 : Tests de routing (1h)
```bash
# Créer routes et guards
# Écrire 5 tests (navigation, guards, paramètres)
```

### Étape 4 : Tests E2E (2h) - Bonus
```bash
npm install cypress --save-dev
npx cypress open
# Créer 2-3 flows E2E critiques
```

---

## 📚 Ressources

### Documentation officielle

- **Jest** : https://jestjs.io/
- **Jasmine** : https://jasmine.github.io/
- **Karma** : https://karma-runner.github.io/
- **Angular Testing** : https://angular.dev/guide/testing
- **Cypress** : https://www.cypress.io/
- **Playwright** : https://playwright.dev/

### Fichiers d'exemples créés

1. 📄 **[test-http.js](computer:///mnt/user-data/outputs/exemples-tests/test-http.js)**
   - Tests HTTP backend avec Jest

2. 📄 **[test-formulaire.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-formulaire.spec.ts)**
   - Tests de formulaires Angular

3. 📄 **[test-routing.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-routing.spec.ts)**
   - Tests de routing et guards

4. 📄 **[test-async.spec.ts](computer:///mnt/user-data/outputs/exemples-tests/test-async.spec.ts)**
   - Tests asynchrones et HTTP

---


**Document créé pour l'atelier de tests logiciels**  
*Autres types de tests recommandés - Novembre 2024*
