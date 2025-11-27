# 🧪 Atelier — Découverte et mise en pratique des tests logiciels

**Durée estimée** : 3-4 heures  
**Niveau** : Débutant à Intermédiaire  
**Technologies** : Node.js/Express, Angular, Jest, Jasmine, Karma

---

## 📋 Table des matières

1. [Objectifs de l'atelier](#objectifs)
2. [Partie 1 — Types de tests logiciels](#partie-1)
3. [Partie 2 — Tests backend (Node.js + Express)](#partie-2)
4. [Partie 3 — Tests frontend (Angular)](#partie-3)
5. [Critères de réussite](#critères)
6. [Ressources complémentaires](#ressources)

---

## <a name="objectifs"></a>🎯 Objectifs de l'atelier

Durant cet atelier, les apprenants vont :

✅ Consolider leurs connaissances sur les différents types de tests logiciels  
✅ Découvrir et installer des frameworks de tests adaptés à leur environnement  
✅ Écrire et exécuter au moins **3 tests unitaires fonctionnels**  
✅ Présenter leurs tests à l'oral avec démonstration en direct

---

## <a name="partie-1"></a>📌 PARTIE 1 — Rappel et présentation des types de tests

### 🎯 Objectif
Consolider les connaissances sur les différents types de tests et être capable de les expliquer avec ses propres mots.

---

### 1. Tests unitaires

**Définition** : Testent une **unité de code isolée** (fonction, méthode, service) sans dépendances externes.

**Objectif** : Vérifier que chaque composant fonctionne correctement de manière indépendante.

**Exemple concret** :
```javascript
// Fonction à tester
function addition(a, b) {
  return a + b;
}

// Test unitaire
test('2 + 3 doit retourner 5', () => {
  expect(addition(2, 3)).toBe(5);
});
```

**Quand l'utiliser** :
- Valider la logique métier
- Tester des calculs, transformations de données
- Vérifier les cas limites (valeurs nulles, négatives, etc.)

---

### 2. Tests d'intégration

**Définition** : Testent plusieurs **modules/composants ensemble** et leurs interactions.

**Objectif** : Vérifier que les différentes parties du système communiquent correctement entre elles.

**Exemple concret** :
```javascript
// Test d'une route Express qui utilise un service
test('GET /users doit retourner la liste des utilisateurs', async () => {
  const response = await request(app).get('/users');
  
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(5);
});
```

**Quand l'utiliser** :
- Tester une route API qui appelle un service
- Vérifier l'interaction entre composants Angular
- Valider la communication base de données → service → contrôleur

---

### 3. Tests fonctionnels / End-to-End (E2E)

**Définition** : Simulent un **parcours utilisateur complet** de bout en bout.

**Objectif** : Vérifier que l'application fonctionne correctement du point de vue de l'utilisateur final.

**Exemple concret** :
```javascript
// Test E2E avec Cypress
it('Un utilisateur peut se connecter', () => {
  cy.visit('/login');
  cy.get('#email').type('user@example.com');
  cy.get('#password').type('password123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});
```

**Quand l'utiliser** :
- Tester un parcours d'inscription complet
- Valider un processus d'achat (panier → paiement → confirmation)
- Vérifier la navigation entre pages

---

### 4. Tests de régression

**Définition** : Empêchent qu'une **fonctionnalité déjà validée ne se casse** après des modifications.

**Objectif** : Garantir que les nouvelles modifications n'impactent pas négativement les fonctionnalités existantes.

**Exemple concret** :
```javascript
// Avant la modification, ce test passait
test('Le bouton affiche "Envoyer"', () => {
  render(<ContactForm />);
  expect(screen.getByText('Envoyer')).toBeInTheDocument();
});

// Après modification du code, si le test échoue = régression détectée
```

**Quand l'utiliser** :
- Après chaque modification de code
- Avant chaque déploiement en production
- Dans le cadre d'une intégration continue (CI/CD)

---

### 5. Tests de performance

**Définition** : Mesurent le **temps de réponse**, la **charge supportée** et détectent les **saturations**.

**Objectif** : S'assurer que l'application reste performante sous différentes conditions de charge.

**Exemple concret** :
```javascript
// Test de performance avec Artillery
scenarios:
  - name: "Test de charge"
    flow:
      - get:
          url: "/api/products"
        expect:
          - statusCode: 200
          - contentType: json
          - maxDuration: 200  # Temps de réponse max 200ms
```

**Quand l'utiliser** :
- Avant un lancement avec forte affluence attendue
- Pour valider la scalabilité de l'application
- Identifier les goulots d'étranglement (bottlenecks)

---

## <a name="partie-2"></a>📌 PARTIE 2 — Tests backend (Node.js + Express)

### 🎯 Objectif
Découvrir les outils de tests backend, installer un framework de tests et écrire 3 tests unitaires fonctionnels.

---

### Choix des outils de test pour Node.js

| Outil | Description | Avantages | Inconvénients |
|-------|-------------|-----------|---------------|
| **Jest + Supertest** | Framework de test tout-en-un | Simple, mocks intégrés, très populaire | Peut être lourd pour petits projets |
| **Mocha + Chai** | Combinaison flexible | Configuration personnalisable | Nécessite plusieurs packages |
| **Node:test** | Runner natif Node.js (≥ 18) | Zéro dépendance externe | Moins de fonctionnalités avancées |

**Recommandation** : **Jest + Supertest** pour les débutants (simplicité et documentation abondante).

---

### 🧱 Application Express de base (commune aux 3 approches)

**Fichier** : `app.js`

```javascript
// ==========================================================
// APPLICATION EXPRESS DE BASE
// ==========================================================

// 1. Importation du framework Express
const express = require('express');

// 2. Création de l'instance Express
const app = express();

// 3. Middleware pour parser le JSON
app.use(express.json());

// ==========================================================
// ROUTES
// ==========================================================

// Route GET simple - Retourne un message de bienvenue
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Route GET avec paramètre - Salue une personne spécifique
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello ${name}!` });
});

// Route POST - Calcule une addition
app.post('/calculate', (req, res) => {
  const { a, b } = req.body;
  
  // Validation des entrées
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a et b doivent être des nombres' });
  }
  
  const result = a + b;
  res.json({ result });
});

// ==========================================================
// EXPORT DE L'APPLICATION (pour les tests)
// ==========================================================

// IMPORTANT : On exporte l'app SANS faire app.listen()
// Cela permet à Supertest de gérer le serveur pour les tests
module.exports = app;
```

**Note importante** : On n'appelle **pas** `app.listen()` dans ce fichier car Supertest gère le serveur automatiquement pendant les tests.

---

### 🎯 Solution 1 : Jest + Supertest (Recommandé)

#### Installation

```bash
# Installation des dépendances de développement
npm install --save-dev jest supertest
```

#### Configuration

**Fichier** : `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"]
  }
}
```

---

#### 🧪 TEST UNITAIRE 1 — Route GET simple

**Fichier** : `app.test.js`

```javascript
// ==========================================================
// TEST UNITAIRE 1 - Route GET /hello
// ==========================================================

// 1. Importation de Supertest pour simuler des requêtes HTTP
const request = require('supertest');

// 2. Importation de l'application Express à tester
const app = require('./app');

// 3. Groupe de tests pour la route /hello
describe('GET /hello', () => {
  
  // Test individuel
  test('devrait retourner un message Hello World', async () => {
    
    // Exécution de la requête GET vers /hello
    const response = await request(app).get('/hello');
    
    // ASSERTION 1 : Vérifier le code de statut HTTP
    // Attend : 200 (OK)
    expect(response.statusCode).toBe(200);
    
    // ASSERTION 2 : Vérifier le type de contenu
    // Attend : application/json
    expect(response.headers['content-type']).toMatch(/json/);
    
    // ASSERTION 3 : Vérifier le corps de la réponse
    // Attend : { message: 'Hello World' }
    expect(response.body).toEqual({ message: 'Hello World' });
  });
});
```

**Explication des assertions** :
- `expect(response.statusCode).toBe(200)` → Vérifie que la requête a réussi
- `expect(response.body).toEqual(...)` → Compare l'objet JSON retourné

**Résultat attendu** :
```
PASS  app.test.js
  GET /hello
    ✓ devrait retourner un message Hello World (25 ms)
```

---

#### 🧪 TEST UNITAIRE 2 — Route GET avec paramètre

**Fichier** : `app.test.js` (suite)

```javascript
// ==========================================================
// TEST UNITAIRE 2 - Route GET /hello/:name
// ==========================================================

describe('GET /hello/:name', () => {
  
  test('devrait retourner un message personnalisé avec le nom', async () => {
    
    // Paramètre de test : "Alice"
    const name = 'Alice';
    
    // Exécution de la requête GET avec paramètre dynamique
    const response = await request(app).get(`/hello/${name}`);
    
    // ASSERTION 1 : Vérifier le code de statut
    expect(response.statusCode).toBe(200);
    
    // ASSERTION 2 : Vérifier que le message contient le nom
    expect(response.body.message).toBe('Hello Alice!');
  });
  
  // Test avec un cas limite : nom avec espaces
  test('devrait gérer les noms avec espaces', async () => {
    
    // Paramètre avec espace encodé en URL (%20)
    const response = await request(app).get('/hello/Jean%20Dupont');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello Jean Dupont!');
  });
});
```

**Pourquoi tester plusieurs cas** :
- Cas nominal (nom simple)
- Cas limite (nom avec espaces)
- Cas d'erreur (si applicable)

**Résultat attendu** :
```
PASS  app.test.js
  GET /hello/:name
    ✓ devrait retourner un message personnalisé avec le nom (18 ms)
    ✓ devrait gérer les noms avec espaces (12 ms)
```

---

#### 🧪 TEST UNITAIRE 3 — Route POST avec validation

**Fichier** : `app.test.js` (suite)

```javascript
// ==========================================================
// TEST UNITAIRE 3 - Route POST /calculate
// ==========================================================

describe('POST /calculate', () => {
  
  // Test du cas nominal (entrées valides)
  test('devrait additionner deux nombres correctement', async () => {
    
    // Données envoyées dans le corps de la requête
    const payload = { a: 5, b: 3 };
    
    // Exécution de la requête POST avec données JSON
    const response = await request(app)
      .post('/calculate')
      .send(payload)                    // Corps de la requête
      .set('Content-Type', 'application/json'); // Header
    
    // ASSERTION 1 : Vérifier le statut
    expect(response.statusCode).toBe(200);
    
    // ASSERTION 2 : Vérifier le résultat du calcul
    expect(response.body.result).toBe(8);
  });
  
  // Test du cas d'erreur (entrées invalides)
  test('devrait retourner une erreur si les paramètres ne sont pas des nombres', async () => {
    
    // Données invalides (chaînes au lieu de nombres)
    const payload = { a: 'cinq', b: 3 };
    
    // Exécution de la requête avec données invalides
    const response = await request(app)
      .post('/calculate')
      .send(payload)
      .set('Content-Type', 'application/json');
    
    // ASSERTION 1 : Vérifier le code d'erreur 400 (Bad Request)
    expect(response.statusCode).toBe(400);
    
    // ASSERTION 2 : Vérifier le message d'erreur
    expect(response.body.error).toBe('a et b doivent être des nombres');
  });
  
  // Test avec nombres négatifs
  test('devrait gérer les nombres négatifs', async () => {
    
    const payload = { a: -5, b: 3 };
    
    const response = await request(app)
      .post('/calculate')
      .send(payload)
      .set('Content-Type', 'application/json');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(-2);
  });
});
```

**Principe du test exhaustif** :
1. **Cas nominal** : Données valides, comportement attendu
2. **Cas d'erreur** : Données invalides, erreur attendue
3. **Cas limites** : Valeurs extrêmes (négatifs, zéro, très grands nombres)

**Résultat attendu** :
```
PASS  app.test.js
  POST /calculate
    ✓ devrait additionner deux nombres correctement (22 ms)
    ✓ devrait retourner une erreur si les paramètres ne sont pas des nombres (15 ms)
    ✓ devrait gérer les nombres négatifs (14 ms)
```

---

#### ▶️ Exécution des tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch (relance automatique)
npm run test:watch

# Lancer les tests avec couverture de code
npm test -- --coverage
```

**Résultat global attendu** :
```
PASS  app.test.js
  GET /hello
    ✓ devrait retourner un message Hello World (25 ms)
  GET /hello/:name
    ✓ devrait retourner un message personnalisé avec le nom (18 ms)
    ✓ devrait gérer les noms avec espaces (12 ms)
  POST /calculate
    ✓ devrait additionner deux nombres correctement (22 ms)
    ✓ devrait retourner une erreur si les paramètres ne sont pas des nombres (15 ms)
    ✓ devrait gérer les nombres négatifs (14 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        1.234 s
```

---

### 🎯 Solution 2 : Mocha + Chai + Supertest

#### Installation

```bash
npm install --save-dev mocha chai supertest
```

#### Configuration

**Fichier** : `package.json`

```json
{
  "scripts": {
    "test": "mocha"
  }
}
```

---

#### 🧪 TEST avec Mocha + Chai

**Fichier** : `test/app.test.js`

```javascript
// ==========================================================
// TESTS AVEC MOCHA + CHAI
// ==========================================================

// 1. Importation de Supertest
const request = require('supertest');

// 2. Importation de Chai pour les assertions
const { expect } = require('chai');

// 3. Importation de l'application Express
const app = require('../app');

// ==========================================================
// TEST 1 - Route GET /hello
// ==========================================================

describe('GET /hello', () => {
  
  it('devrait retourner Hello World', async () => {
    
    // Exécution de la requête
    const response = await request(app).get('/hello');
    
    // Assertions avec syntaxe Chai
    expect(response.status).to.equal(200);
    // .to.equal() est la syntaxe Chai (différente de Jest)
    
    expect(response.body).to.deep.equal({ message: 'Hello World' });
    // .deep.equal() compare les objets en profondeur
  });
});

// ==========================================================
// TEST 2 - Route POST /calculate
// ==========================================================

describe('POST /calculate', () => {
  
  it('devrait additionner deux nombres', async () => {
    
    const response = await request(app)
      .post('/calculate')
      .send({ a: 10, b: 5 });
    
    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal(15);
  });
  
  it('devrait retourner une erreur pour des entrées invalides', async () => {
    
    const response = await request(app)
      .post('/calculate')
      .send({ a: 'texte', b: 5 });
    
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
    // .to.have.property() vérifie l'existence d'une clé
  });
});
```

**Différences avec Jest** :
- `expect(...).toBe()` (Jest) → `expect(...).to.equal()` (Chai)
- `expect(...).toEqual()` (Jest) → `expect(...).to.deep.equal()` (Chai)
- Syntaxe plus verbeuse mais très lisible

#### ▶️ Exécution

```bash
npm test
```

**Résultat attendu** :
```
  GET /hello
    ✓ devrait retourner Hello World

  POST /calculate
    ✓ devrait additionner deux nombres
    ✓ devrait retourner une erreur pour des entrées invalides

  3 passing (145ms)
```

---

### 🎯 Solution 3 : Node:test (natif Node.js)

**Prérequis** : Node.js version ≥ 18

#### Installation

```bash
# Seulement Supertest (Node:test est intégré à Node.js)
npm install --save-dev supertest
```

---

#### 🧪 TEST avec Node:test

**Fichier** : `app.node.test.js`

```javascript
// ==========================================================
// TESTS AVEC NODE:TEST (natif)
// ==========================================================

// 1. Importation du runner de tests natif de Node.js
const test = require('node:test');

// 2. Importation du module d'assertions natif
const assert = require('node:assert');

// 3. Importation de Supertest
const request = require('supertest');

// 4. Importation de l'application
const app = require('./app');

// ==========================================================
// TEST 1 - Route GET /hello
// ==========================================================

test('GET /hello devrait retourner Hello World', async () => {
  
  // Exécution de la requête
  const response = await request(app).get('/hello');
  
  // Assertions avec assert natif de Node.js
  assert.strictEqual(response.statusCode, 200);
  // strictEqual() compare avec ===
  
  assert.deepStrictEqual(response.body, { message: 'Hello World' });
  // deepStrictEqual() compare les objets en profondeur
});

// ==========================================================
// TEST 2 - Route POST /calculate
// ==========================================================

test('POST /calculate devrait additionner deux nombres', async () => {
  
  const response = await request(app)
    .post('/calculate')
    .send({ a: 7, b: 3 });
  
  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(response.body.result, 10);
});

// ==========================================================
// TEST 3 - Validation des erreurs
// ==========================================================

test('POST /calculate devrait rejeter les entrées invalides', async () => {
  
  const response = await request(app)
    .post('/calculate')
    .send({ a: 'invalid', b: 3 });
  
  assert.strictEqual(response.statusCode, 400);
  assert.ok(response.body.error);
  // assert.ok() vérifie que la valeur est "truthy"
});
```

**Avantages de Node:test** :
- ✅ Zéro dépendance (sauf Supertest)
- ✅ Rapide et léger
- ✅ Intégré nativement à Node.js

**Inconvénients** :
- ❌ Moins de fonctionnalités que Jest
- ❌ Pas de mocks avancés intégrés

#### ▶️ Exécution

```bash
node --test
```

**Résultat attendu** :
```
▶ GET /hello devrait retourner Hello World
  ✔ GET /hello devrait retourner Hello World (52.123ms)

▶ POST /calculate devrait additionner deux nombres
  ✔ POST /calculate devrait additionner deux nombres (12.456ms)

▶ POST /calculate devrait rejeter les entrées invalides
  ✔ POST /calculate devrait rejeter les entrées invalides (8.789ms)

ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
```

---

### 📊 Comparaison des 3 solutions

| Critère | Jest + Supertest | Mocha + Chai | Node:test |
|---------|------------------|--------------|-----------|
| **Installation** | 2 packages | 3 packages | 1 package |
| **Popularité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Facilité** | Très simple | Moyenne | Simple |
| **Mocks intégrés** | ✅ Oui | ❌ Non | ❌ Non |
| **Couverture de code** | ✅ Intégrée | ❌ Package séparé | ❌ Package séparé |
| **Performance** | Rapide | Rapide | Très rapide |
| **Documentation** | Excellente | Très bonne | Bonne |

**Recommandation** :
- **Débutants** → Jest + Supertest
- **Projets existants** → Mocha + Chai
- **Minimalistes** → Node:test

---

### 🧩 Tests unitaires supplémentaires (bonus)

#### TEST BONUS 1 — Fonction utilitaire simple

**Fichier** : `utils/calcul.js`

```javascript
// ==========================================================
// FONCTION UTILITAIRE - Addition
// ==========================================================

/**
 * Additionne deux nombres
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} Somme de a et b
 */
function addition(a, b) {
  return a + b;
}

module.exports = addition;
```

**Fichier** : `utils/calcul.test.js`

```javascript
// Test de la fonction addition isolée
const addition = require('./calcul');

describe('Fonction addition', () => {
  
  test('2 + 3 devrait égaler 5', () => {
    expect(addition(2, 3)).toBe(5);
  });
  
  test('devrait gérer les nombres négatifs', () => {
    expect(addition(-5, 3)).toBe(-2);
  });
  
  test('devrait gérer zéro', () => {
    expect(addition(0, 0)).toBe(0);
    expect(addition(5, 0)).toBe(5);
  });
});
```

---

#### TEST BONUS 2 — Service métier

**Fichier** : `services/prix.service.js`

```javascript
// ==========================================================
// SERVICE MÉTIER - Calcul de prix TTC
// ==========================================================

/**
 * Calcule le prix TTC à partir du prix HT et du taux de TVA
 * @param {number} prixHT - Prix hors taxes
 * @param {number} taux - Taux de TVA (ex: 0.2 pour 20%)
 * @returns {number} Prix TTC arrondi à 2 décimales
 */
function calculPrixTTC(prixHT, taux) {
  const prixTTC = prixHT * (1 + taux);
  return Math.round(prixTTC * 100) / 100; // Arrondi à 2 décimales
}

module.exports = { calculPrixTTC };
```

**Fichier** : `services/prix.service.test.js`

```javascript
const { calculPrixTTC } = require('./prix.service');

describe('Service Prix - Calcul TTC', () => {
  
  test('100€ HT avec 20% de TVA = 120€ TTC', () => {
    expect(calculPrixTTC(100, 0.2)).toBe(120);
  });
  
  test('50€ HT avec 5.5% de TVA = 52.75€ TTC', () => {
    expect(calculPrixTTC(50, 0.055)).toBe(52.75);
  });
  
  test('devrait gérer un taux de TVA de 0%', () => {
    expect(calculPrixTTC(100, 0)).toBe(100);
  });
});
```

---

## <a name="partie-3"></a>📌 PARTIE 3 — Tests frontend (Angular)

### 🎯 Objectif
Découvrir Jasmine et Karma, les outils de tests intégrés à Angular, et écrire 3 tests frontend.

---

### Outils de tests Angular

**Jasmine** : Framework de tests (syntaxe des tests)  
**Karma** : Lanceur de tests (exécution dans le navigateur)

**Pré-installé** : Ces outils sont automatiquement inclus dans les projets Angular générés avec Angular CLI.

---

### 🧪 TEST ANGULAR 1 — Tester un service

**Fichier** : `src/app/services/prix.service.ts`

```typescript
// ==========================================================
// SERVICE ANGULAR - Calcul de prix
// ==========================================================

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Service disponible dans toute l'application
})
export class PrixService {
  
  /**
   * Calcule le prix TTC
   * @param prix Prix hors taxes
   * @returns Prix avec TVA à 20%
   */
  calculTTC(prix: number): number {
    return prix * 1.2;
  }
  
  /**
   * Applique une remise en pourcentage
   * @param prix Prix initial
   * @param remise Pourcentage de remise (ex: 10 pour 10%)
   * @returns Prix après remise
   */
  appliquerRemise(prix: number, remise: number): number {
    return prix * (1 - remise / 100);
  }
}
```

**Fichier** : `src/app/services/prix.service.spec.ts`

```typescript
// ==========================================================
// TESTS DU SERVICE PRIX
// ==========================================================

import { TestBed } from '@angular/core/testing';
import { PrixService } from './prix.service';

describe('PrixService', () => {
  let service: PrixService;
  
  // Exécuté AVANT chaque test
  beforeEach(() => {
    // Configuration du module de test
    TestBed.configureTestingModule({});
    
    // Injection du service à tester
    service = TestBed.inject(PrixService);
  });
  
  // TEST 1 : Vérifier que le service est créé
  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
  
  // TEST 2 : Calcul du prix TTC
  it('devrait calculer le prix TTC correctement', () => {
    // Arrange : Préparer les données
    const prixHT = 100;
    
    // Act : Exécuter la fonction
    const resultat = service.calculTTC(prixHT);
    
    // Assert : Vérifier le résultat
    expect(resultat).toBe(120);
  });
  
  // TEST 3 : Application d'une remise
  it('devrait appliquer une remise de 10%', () => {
    const prix = 100;
    const remise = 10;
    
    const resultat = service.appliquerRemise(prix, remise);
    
    expect(resultat).toBe(90);
  });
  
  // TEST 4 : Cas limite - remise de 0%
  it('devrait retourner le prix initial si remise = 0', () => {
    expect(service.appliquerRemise(100, 0)).toBe(100);
  });
});
```

**Concepts clés** :
- `beforeEach()` : Exécuté avant chaque test pour initialiser
- `TestBed` : Outil Angular pour configurer l'environnement de test
- `expect(...).toBeTruthy()` : Vérifie qu'une valeur existe

---

### 🧪 TEST ANGULAR 2 — Tester un composant

**Fichier** : `src/app/components/greeting/greeting.component.ts`

```typescript
// ==========================================================
// COMPOSANT ANGULAR - Message de bienvenue
// ==========================================================

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `
    <div class="greeting">
      <h1>{{ title }}</h1>
      <p *ngIf="userName">Bienvenue, {{ userName }} !</p>
      <button (click)="onButtonClick()">Cliquer ici</button>
    </div>
  `,
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent {
  @Input() title = 'Application de test';
  @Input() userName: string = '';
  
  clickCount = 0;
  
  onButtonClick(): void {
    this.clickCount++;
  }
}
```

**Fichier** : `src/app/components/greeting/greeting.component.spec.ts`

```typescript
// ==========================================================
// TESTS DU COMPOSANT GREETING
// ==========================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';

describe('GreetingComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;
  
  beforeEach(async () => {
    // Configuration du module de test
    await TestBed.configureTestingModule({
      declarations: [ GreetingComponent ]
    })
    .compileComponents();
    
    // Création du composant
    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    
    // Détection des changements (équivalent du cycle de vie Angular)
    fixture.detectChanges();
  });
  
  // TEST 1 : Création du composant
  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });
  
  // TEST 2 : Affichage du titre
  it('devrait afficher le titre dans un h1', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    
    expect(h1?.textContent).toContain('Application de test');
  });
  
  // TEST 3 : Affichage conditionnel du nom d'utilisateur
  it('devrait afficher le message de bienvenue si userName est défini', () => {
    // Arrange : Définir le nom d'utilisateur
    component.userName = 'Alice';
    
    // Act : Déclencher la détection de changements
    fixture.detectChanges();
    
    // Assert : Vérifier l'affichage
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');
    
    expect(paragraph?.textContent).toContain('Bienvenue, Alice !');
  });
  
  // TEST 4 : Interaction - clic sur le bouton
  it('devrait incrémenter clickCount lors du clic', () => {
    const button = fixture.nativeElement.querySelector('button');
    
    // Avant le clic
    expect(component.clickCount).toBe(0);
    
    // Simuler un clic
    button.click();
    
    // Après le clic
    expect(component.clickCount).toBe(1);
  });
});
```

**Concepts clés** :
- `ComponentFixture` : Wrapper autour du composant pour les tests
- `fixture.detectChanges()` : Force Angular à mettre à jour le DOM
- `fixture.nativeElement` : Accès au DOM HTML réel

---

### 🧪 TEST ANGULAR 3 — Mock d'un service

**Fichier** : `src/app/components/product/product.component.ts`

```typescript
// ==========================================================
// COMPOSANT UTILISANT UN SERVICE
// ==========================================================

import { Component, OnInit } from '@angular/core';
import { PrixService } from '../../services/prix.service';

@Component({
  selector: 'app-product',
  template: `
    <div class="product">
      <h2>Produit : {{ productName }}</h2>
      <p>Prix HT : {{ prixHT }}€</p>
      <p>Prix TTC : {{ prixTTC }}€</p>
    </div>
  `
})
export class ProductComponent implements OnInit {
  productName = 'Ordinateur portable';
  prixHT = 1000;
  prixTTC = 0;
  
  constructor(private prixService: PrixService) {}
  
  ngOnInit(): void {
    // Appel au service pour calculer le prix TTC
    this.prixTTC = this.prixService.calculTTC(this.prixHT);
  }
}
```

**Fichier** : `src/app/components/product/product.component.spec.ts`

```typescript
// ==========================================================
// TESTS AVEC MOCK DE SERVICE
// ==========================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { PrixService } from '../../services/prix.service';

describe('ProductComponent avec mock de service', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockPrixService: jasmine.SpyObj<PrixService>;
  
  beforeEach(async () => {
    // Création d'un mock du service
    mockPrixService = jasmine.createSpyObj('PrixService', ['calculTTC']);
    
    // Configuration : Le mock retourne toujours 1500
    mockPrixService.calculTTC.and.returnValue(1500);
    
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      providers: [
        // Remplacement du vrai service par le mock
        { provide: PrixService, useValue: mockPrixService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  // TEST 1 : Vérifier que le service mocké est appelé
  it('devrait appeler le service PrixService au chargement', () => {
    expect(mockPrixService.calculTTC).toHaveBeenCalled();
  });
  
  // TEST 2 : Vérifier que le prix TTC provient du mock
  it('devrait utiliser la valeur retournée par le mock', () => {
    // Le mock retourne 1500 au lieu du vrai calcul
    expect(component.prixTTC).toBe(1500);
  });
  
  // TEST 3 : Vérifier l'affichage dans le DOM
  it('devrait afficher le prix TTC dans le template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const prixElement = compiled.querySelector('p:last-child');
    
    expect(prixElement?.textContent).toContain('Prix TTC : 1500€');
  });
});
```

**Pourquoi utiliser des mocks** :
- ✅ Isoler le composant testé (pas de dépendances réelles)
- ✅ Contrôler les valeurs retournées
- ✅ Tester uniquement la logique du composant
- ✅ Tests plus rapides et prévisibles

---

### ▶️ Exécution des tests Angular

```bash
# Lancer tous les tests avec Karma (navigateur)
ng test

# Lancer les tests en mode headless (sans interface graphique)
ng test --no-watch --browsers=ChromeHeadless

# Lancer les tests avec couverture de code
ng test --code-coverage
```

**Résultat attendu** :
```
Chrome Headless 120.0.0.0 (Windows 10): Executed 9 of 9 SUCCESS (0.523 secs / 0.445 secs)

TOTAL: 9 SUCCESS
```

---

## <a name="critères"></a>✅ Critères de réussite de l'atelier

### Partie 1 : Restitution orale
- [ ] Explication claire des 5 types de tests
- [ ] Exemples concrets pour chaque type
- [ ] Capacité à répondre aux questions du groupe

### Partie 2 : Tests backend
- [ ] Installation réussie d'un framework de tests
- [ ] 3 tests unitaires écrits et exécutés avec succès
- [ ] Compréhension des assertions et de la structure des tests

### Partie 3 : Tests frontend (bonus)
- [ ] Test d'un service Angular fonctionnel
- [ ] Test d'un composant avec vérification du DOM
- [ ] Utilisation d'un mock de service

### Démonstration finale
- [ ] Présentation orale de 5-10 minutes
- [ ] Explication du choix de l'outil de test
- [ ] Exécution en direct des tests devant le groupe
- [ ] Réponse aux questions techniques

---

## <a name="ressources"></a>📚 Ressources complémentaires

### Documentation officielle
- **Jest** : https://jestjs.io/
- **Mocha** : https://mochajs.org/
- **Chai** : https://www.chaijs.com/
- **Supertest** : https://github.com/visionmedia/supertest
- **Angular Testing** : https://angular.io/guide/testing

### Tutoriels recommandés
- Testing Node.js Apps with Jest : https://www.youtube.com/watch?v=FgnxcUQ5vho
- Mocha & Chai Crash Course : https://www.youtube.com/watch?v=MLTRHc5dk6s
- Angular Testing Tutorial : https://www.youtube.com/watch?v=BumgayeUC08

### Bonnes pratiques
1. **AAA Pattern** : Arrange → Act → Assert
2. **Un test = une responsabilité** : Ne testez qu'une chose à la fois
3. **Nommage explicite** : `devrait retourner 200 quand...`
4. **Tests isolés** : Chaque test doit pouvoir s'exécuter indépendamment
5. **Couverture de code** : Visez au moins 80% de couverture

---

## 🎯 Conseils pour la présentation orale

### Structure recommandée (5-10 min)

1. **Introduction (1 min)**
   - Présentation du choix technologique
   - Pourquoi cet outil de test ?

2. **Démonstration des tests (3-5 min)**
   - Montrer le code des 3 tests
   - Expliquer la logique de chaque test
   - Exécuter les tests en direct

3. **Résultats et interprétation (2 min)**
   - Commenter les résultats des tests
   - Expliquer ce qui est vérifié

4. **Questions/réponses (2 min)**
   - Répondre aux questions du groupe

### Points d'attention
- ✅ Préparer son environnement AVANT de passer
- ✅ Tester son code au préalable (éviter les surprises)
- ✅ Expliquer avec des termes simples
- ✅ Ne pas hésiter à montrer les erreurs (c'est pédagogique !)

---

## 🏆 Barème d'évaluation

| Critère | Points |
|---------|--------|
| **Partie 1 - Restitution orale** | /5 |
| Clarté des explications | 3 |
| Pertinence des exemples | 2 |
| **Partie 2 - Tests backend** | /10 |
| Installation correcte de l'outil | 2 |
| Qualité des 3 tests unitaires | 5 |
| Exécution réussie des tests | 3 |
| **Partie 3 - Présentation finale** | /5 |
| Qualité de la démonstration | 3 |
| Réponses aux questions | 2 |
| **TOTAL** | **/20** |

---

*Document créé pour l'atelier de découverte des tests logiciels*  
*Version 1.0 - Dernière mise à jour : Novembre 2024*
