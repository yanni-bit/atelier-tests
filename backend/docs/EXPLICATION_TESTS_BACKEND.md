# 🟢 Explication des tests Backend - Node.js + Express

**Projet** : atelier-tests/backend  
**Framework de tests** : Jest + Supertest  
**Date** : 27 novembre 2024

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-ensemble)
2. [Processus de création](#processus-creation)
3. [Architecture du projet](#architecture)
4. [Explication détaillée des tests](#tests-detailles)
5. [Ce qui se passe en coulisses](#coulisses)
6. [Bonnes pratiques appliquées](#bonnes-pratiques)

---

## <a name="vue-ensemble"></a>🎯 Vue d'ensemble

### Résultat final

```
✅ 6 tests exécutés
✅ 6 tests réussis
✅ 0 échec
⏱️  Temps d'exécution : 1.047 secondes
```

### Routes testées

1. **GET /hello** : Route simple retournant un message JSON
   - 1 test

2. **GET /hello/:name** : Route avec paramètre dynamique
   - 2 tests (cas nominal + cas limite)

3. **POST /calculate** : Route avec calcul et validation
   - 3 tests (succès + erreur + cas limite)

---

## <a name="processus-creation"></a>🏗️ Processus de création du projet

### Étape 1 : Initialisation du projet

```powershell
# Créer le dossier
mkdir backend
cd backend

# Initialiser npm
npm init -y
```

**Ce qui est créé** :
- `package.json` : Fichier de configuration du projet

---

### Étape 2 : Installation des dépendances

```powershell
# Dépendance de production
npm install express

# Dépendances de développement (tests)
npm install --save-dev jest supertest
```

**Packages installés** :

| Package | Rôle | Type |
|---------|------|------|
| **express** | Framework web pour créer l'API | Production |
| **jest** | Framework de tests (assertions, runner) | Dev |
| **supertest** | Bibliothèque pour tester les API HTTP | Dev |

**Pourquoi ces choix ?**
- **Express** : Le framework Node.js le plus populaire pour les API REST
- **Jest** : Simple, rapide, mocks intégrés, très utilisé dans l'écosystème JavaScript
- **Supertest** : Permet de tester les routes HTTP sans démarrer réellement le serveur

---

### Étape 3 : Configuration de package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

**Commandes disponibles** :
- `npm test` : Lance tous les tests une fois
- `npm run test:watch` : Lance les tests en mode surveillance (relance automatique)
- `npm start` : Démarre le serveur Express (optionnel)

---

## <a name="architecture"></a>📁 Architecture du projet

### Structure finale

```
backend/
├── app.js              ← Application Express (routes)
├── server.js           ← Serveur (optionnel, pour lancer l'API)
├── package.json        ← Configuration npm
├── package-lock.json   ← Versions exactes des dépendances
├── node_modules/       ← Dépendances installées
└── tests/
    └── app.test.js     ← Tests Jest + Supertest
```

### Séparation app.js vs server.js

**Pourquoi 2 fichiers ?**

**app.js** : Contient SEULEMENT la logique de l'application
```javascript
const app = express();
app.get('/hello', (req, res) => { ... });
module.exports = app;  // ← Export sans app.listen()
```

**server.js** : Démarre le serveur sur un port
```javascript
const app = require('./app');
app.listen(3000);  // ← Démarre le serveur
```

**Avantage pour les tests** :
- Supertest peut importer `app.js` et gérer le serveur automatiquement
- Pas besoin de démarrer/arrêter le serveur manuellement
- Tests plus rapides et isolés

---

## <a name="tests-detailles"></a>🧪 Explication détaillée des tests

### Structure d'un test Jest

```javascript
// GROUPE DE TESTS
describe('Description du groupe', () => {
  
  // TEST INDIVIDUEL
  test('Description du comportement attendu', async () => {
    // 1. ARRANGE : Préparer les données
    const data = { a: 5, b: 3 };
    
    // 2. ACT : Exécuter l'action
    const response = await request(app).post('/calculate').send(data);
    
    // 3. ASSERT : Vérifier le résultat
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(8);
  });
});
```

**Concepts clés** :
- `describe()` : Groupe logique de tests
- `test()` ou `it()` : Un test individuel
- `async/await` : Permet d'attendre les requêtes HTTP
- `expect()` : Crée une assertion
- Pattern AAA : Arrange → Act → Assert

---

### Test 1 : Route GET /hello (simple)

**Code de l'application** (`app.js`) :
```javascript
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});
```

**Test** :
```javascript
describe('GET /hello', () => {
  test('devrait retourner Hello World', async () => {
    // ========================================
    // EXÉCUTION DE LA REQUÊTE
    // ========================================
    const response = await request(app).get('/hello');
    
    // Explication détaillée de cette ligne :
    // 1. request(app) : Crée un client de test Supertest
    //    - Importe l'application Express depuis app.js
    //    - Prépare un serveur temporaire en mémoire
    
    // 2. .get('/hello') : Prépare une requête GET vers /hello
    //    - Équivaut à faire : fetch('http://localhost:3000/hello')
    //    - Mais sans démarrer vraiment le serveur
    
    // 3. await : Attend que la requête soit terminée
    //    - La requête HTTP est asynchrone
    //    - On attend la réponse complète
    
    // 4. response : Objet contenant la réponse complète
    //    - response.statusCode : Code HTTP (200, 404, 500...)
    //    - response.body : Corps de la réponse (JSON parsé automatiquement)
    //    - response.headers : Headers HTTP
    
    
    // ========================================
    // ASSERTION 1 : Vérifier le code HTTP
    // ========================================
    expect(response.statusCode).toBe(200);
    
    // Explication :
    // - expect(response.statusCode) : Récupère le code HTTP de la réponse
    // - .toBe(200) : Compare strictement avec 200 (OK)
    // - Si le code est différent (404, 500...), le test échoue
    
    // Codes HTTP courants :
    // 200 = OK (succès)
    // 201 = Created (ressource créée)
    // 400 = Bad Request (erreur client)
    // 404 = Not Found (route inexistante)
    // 500 = Internal Server Error (erreur serveur)
    
    
    // ========================================
    // ASSERTION 2 : Vérifier le body JSON
    // ========================================
    expect(response.body).toEqual({ message: 'Hello World' });
    
    // Explication :
    // - response.body : Le JSON retourné par la route (déjà parsé par Supertest)
    // - .toEqual() : Comparaison profonde d'objets
    // - Vérifie que l'objet a exactement cette structure
    
    // Différence .toBe() vs .toEqual() :
    // .toBe() : Comparaison par référence (===) → Pour primitives
    // .toEqual() : Comparaison par valeur → Pour objets/tableaux
  });
});
```

**Ce qui se passe en coulisses** :

```
┌─────────────────────────────────────────────────┐
│ 1. PRÉPARATION                                  │
│    request(app) crée un serveur temporaire      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. REQUÊTE HTTP                                 │
│    GET /hello est envoyée au serveur            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. EXPRESS TRAITE LA REQUÊTE                    │
│    - Trouve la route GET /hello                 │
│    - Exécute le callback                        │
│    - Retourne res.json({ message: 'Hello' })    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. SUPERTEST RÉCUPÈRE LA RÉPONSE                │
│    - Code HTTP : 200                            │
│    - Body : { message: 'Hello World' }          │
│    - Headers : { 'content-type': 'application/json' }│
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. JEST VÉRIFIE LES ASSERTIONS                  │
│    ✓ statusCode === 200                         │
│    ✓ body === { message: 'Hello World' }        │
└─────────────────────────────────────────────────┘
```

---

### Test 2 : Route GET /hello/:name (avec paramètre)

**Code de l'application** :
```javascript
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello ${name}!` });
});
```

**Test 1 - Cas nominal** :
```javascript
test('devrait retourner un message personnalisé', async () => {
  // ========================================
  // PRÉPARATION : Définir le paramètre
  // ========================================
  const name = 'Alice';
  
  // Pourquoi une variable séparée ?
  // - Rend le test plus lisible
  // - Facile à modifier pour tester d'autres valeurs
  // - Documente clairement ce qui est testé
  
  
  // ========================================
  // EXÉCUTION : Requête avec paramètre
  // ========================================
  const response = await request(app).get(`/hello/${name}`);
  
  // Explication de la syntaxe :
  // - Template string avec backticks : `texte ${variable}`
  // - ${name} est remplacé par 'Alice'
  // - URL finale : /hello/Alice
  // - Express capture 'Alice' dans req.params.name
  
  
  // ========================================
  // ASSERTIONS
  // ========================================
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Hello Alice!');
  
  // Vérification plus spécifique :
  // - response.body : { message: "Hello Alice!" }
  // - response.body.message : "Hello Alice!"
  // - On accède directement à la propriété message
});
```

**Test 2 - Cas limite (espaces)** :
```javascript
test('devrait gérer les noms avec espaces', async () => {
  // ========================================
  // CAS LIMITE : Nom avec espace
  // ========================================
  const response = await request(app).get('/hello/Jean%20Dupont');
  
  // Explication de l'encodage URL :
  // - Les espaces ne sont pas autorisés dans les URL
  // - %20 = représentation encodée d'un espace
  // - %2F = / (slash)
  // - %3F = ? (point d'interrogation)
  // - %26 = & (esperluette)
  
  // Ce qui se passe :
  // 1. URL envoyée : /hello/Jean%20Dupont
  // 2. Express décode automatiquement : "Jean Dupont"
  // 3. req.params.name = "Jean Dupont"
  // 4. Réponse : { message: "Hello Jean Dupont!" }
  
  
  // ========================================
  // ASSERTIONS
  // ========================================
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Hello Jean Dupont!');
  
  // Pourquoi ce test est important :
  // - Vérifie que l'encodage URL fonctionne
  // - Les prénoms composés sont courants (Marie-Claire, Jean-Pierre)
  // - Prévient les bugs avec les caractères spéciaux
});
```

**Pourquoi tester les cas limites ?**
- ✅ Prénoms composés : "Jean-Pierre", "Marie Claire"
- ✅ Caractères accentués : "José", "François"
- ✅ Caractères spéciaux : "O'Brien", "Jean&Marie"
- ✅ Robustesse de l'application

---

### Test 3 : Route POST /calculate (avec validation)

**Code de l'application** :
```javascript
app.post('/calculate', (req, res) => {
  const { a, b } = req.body;
  
  // Validation des entrées
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a et b doivent être des nombres' });
  }
  
  const result = a + b;
  res.json({ result });
});
```

**Test 1 - Cas nominal (succès)** :
```javascript
test('devrait additionner deux nombres', async () => {
  // ========================================
  // PRÉPARATION : Payload JSON
  // ========================================
  const payload = { a: 5, b: 3 };
  
  // payload = "charge utile" en français
  // C'est l'objet JavaScript qui sera envoyé dans le body
  
  
  // ========================================
  // EXÉCUTION : Requête POST avec body
  // ========================================
  const response = await request(app)
    .post('/calculate')
    .send(payload)
    .set('Content-Type', 'application/json');
  
  // Explication ligne par ligne :
  
  // 1. request(app) : Crée le client de test
  
  // 2. .post('/calculate') : Définit la méthode HTTP POST
  //    - POST pour envoyer des données
  //    - GET pour récupérer des données
  //    - PUT pour mettre à jour
  //    - DELETE pour supprimer
  
  // 3. .send(payload) : Envoie le payload dans le body
  //    - Supertest convertit automatiquement en JSON
  //    - Équivaut à : JSON.stringify({ a: 5, b: 3 })
  //    - Express reçoit req.body = { a: 5, b: 3 }
  
  // 4. .set('Content-Type', 'application/json') : Définit le header
  //    - Indique à Express que les données sont en JSON
  //    - Express peut alors parser le body correctement
  //    - Nécessaire pour que express.json() fonctionne
  
  
  // ========================================
  // ASSERTIONS
  // ========================================
  expect(response.statusCode).toBe(200);
  // Vérifie que la requête a réussi
  
  expect(response.body.result).toBe(8);
  // Vérifie que 5 + 3 = 8
  // response.body : { result: 8 }
  // response.body.result : 8
});
```

**Test 2 - Cas d'erreur (validation)** :
```javascript
test('devrait retourner une erreur pour entrées invalides', async () => {
  // ========================================
  // PRÉPARATION : Données INVALIDES
  // ========================================
  const payload = { a: 'cinq', b: 3 };
  
  // a: 'cinq' est une chaîne de caractères, pas un nombre
  // Cela doit déclencher l'erreur de validation
  
  
  // ========================================
  // EXÉCUTION
  // ========================================
  const response = await request(app)
    .post('/calculate')
    .send(payload)
    .set('Content-Type', 'application/json');
  
  // Ce qui se passe dans Express :
  // 1. req.body = { a: 'cinq', b: 3 }
  // 2. typeof 'cinq' !== 'number' → true
  // 3. Condition if est vraie
  // 4. return res.status(400).json({ error: '...' })
  // 5. L'exécution s'arrête (return)
  // 6. Le résultat n'est jamais calculé
  
  
  // ========================================
  // ASSERTIONS
  // ========================================
  expect(response.statusCode).toBe(400);
  // 400 = Bad Request (erreur du client)
  // C'est le code correct pour une erreur de validation
  
  expect(response.body.error).toBe('a et b doivent être des nombres');
  // Vérifie le message d'erreur exact
  // Important pour le débogage côté client
  
  // Pourquoi tester les erreurs ?
  // - Vérifie que la validation fonctionne
  // - Empêche les bugs en production
  // - Documente les cas d'erreur
  // - Vérifie les messages d'erreur clairs
});
```

**Test 3 - Cas limite (nombres négatifs)** :
```javascript
test('devrait gérer les nombres négatifs', async () => {
  // ========================================
  // CAS LIMITE : Nombre négatif
  // ========================================
  const payload = { a: -5, b: 3 };
  
  // Les nombres négatifs sont valides
  // Ce test vérifie qu'ils fonctionnent correctement
  
  
  // ========================================
  // EXÉCUTION ET ASSERTIONS
  // ========================================
  const response = await request(app)
    .post('/calculate')
    .send(payload)
    .set('Content-Type', 'application/json');
  
  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(-2);
  // -5 + 3 = -2
  
  // Autres cas limites à tester (exemples) :
  // - Nombres très grands : 999999999999
  // - Zéro : 0 + 0 = 0
  // - Nombres décimaux : 0.1 + 0.2 = 0.3
  // - Nombres négatifs : -5 + -3 = -8
});
```

**Pourquoi tester 3 scénarios différents ?**

| Test | Vérifie | Importance |
|------|---------|------------|
| **Succès** | Que ça marche quand tout va bien | ⭐⭐⭐ Essentiel |
| **Erreur** | Que ça échoue proprement quand c'est invalide | ⭐⭐⭐ Essentiel |
| **Limite** | Que ça gère les cas particuliers | ⭐⭐ Important |

---

## <a name="coulisses"></a>⚙️ Ce qui se passe en coulisses

### Architecture Jest

```
┌──────────────────────────────────────────────────────┐
│ JEST (Test Runner)                                   │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. DÉCOUVERTE DES TESTS                        │ │
│  │    - Cherche tous les fichiers *.test.js       │ │
│  │    - Charge les fichiers trouvés               │ │
│  └────────────────────────────────────────────────┘ │
│                      ↓                               │
│  ┌────────────────────────────────────────────────┐ │
│  │ 2. EXÉCUTION                                   │ │
│  │    Pour chaque fichier de test :               │ │
│  │    - Exécute describe() (groupe)               │ │
│  │    - Pour chaque test() :                      │ │
│  │      • Exécute le test                         │ │
│  │      • Collecte les assertions                 │ │
│  │      • Détermine succès/échec                  │ │
│  └────────────────────────────────────────────────┘ │
│                      ↓                               │
│  ┌────────────────────────────────────────────────┐ │
│  │ 3. RAPPORT                                     │ │
│  │    - Affiche les résultats dans le terminal    │ │
│  │    - Nombre de tests passés/échoués            │ │
│  │    - Temps d'exécution                         │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

### Architecture Supertest

```
┌──────────────────────────────────────────────────────┐
│ SUPERTEST                                            │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 1. IMPORT DE L'APP                             │ │
│  │    const app = require('./app')                │ │
│  │    - Charge l'application Express              │ │
│  │    - SANS faire app.listen()                   │ │
│  └────────────────────────────────────────────────┘ │
│                      ↓                               │
│  ┌────────────────────────────────────────────────┐ │
│  │ 2. CRÉATION SERVEUR TEMPORAIRE                 │ │
│  │    request(app)                                │ │
│  │    - Crée un serveur HTTP en mémoire           │ │
│  │    - Pas de port réel (pas de conflit)         │ │
│  │    - Isolé des autres tests                    │ │
│  └────────────────────────────────────────────────┘ │
│                      ↓                               │
│  ┌────────────────────────────────────────────────┐ │
│  │ 3. REQUÊTE HTTP                                │ │
│  │    .get('/hello')                              │ │
│  │    - Envoie une vraie requête HTTP             │ │
│  │    - Passe par tous les middlewares Express    │ │
│  │    - Exécute la route correspondante           │ │
│  └────────────────────────────────────────────────┘ │
│                      ↓                               │
│  ┌────────────────────────────────────────────────┐ │
│  │ 4. RÉCUPÉRATION RÉPONSE                        │ │
│  │    - Capture la réponse complète               │ │
│  │    - Parse le JSON automatiquement             │ │
│  │    - Retourne un objet avec statusCode, body   │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

### Flux complet d'un test

```
┌─────────────────────────────────────────────────────────┐
│ 1. LANCEMENT : npm test                                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. JEST DÉMARRE                                         │
│    - Lit la configuration package.json                  │
│    - Trouve app.test.js dans tests/                     │
│    - Charge le fichier                                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. POUR CHAQUE describe()                               │
│    Jest exécute tous les test() à l'intérieur           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. POUR CHAQUE test()                                   │
│                                                         │
│    A. Supertest crée un serveur temporaire              │
│    B. Envoie la requête HTTP                            │
│    C. Express traite la requête                         │
│    D. Supertest récupère la réponse                     │
│    E. Jest vérifie les assertions                       │
│    F. Supertest ferme le serveur temporaire             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. JEST AFFICHE LES RÉSULTATS                           │
│                                                         │
│    PASS  tests/app.test.js                              │
│      GET /hello                                         │
│        ✓ devrait retourner Hello World (25 ms)          │
│      GET /hello/:name                                   │
│        ✓ devrait retourner un message personnalisé      │
│        ✓ devrait gérer les noms avec espaces            │
│      POST /calculate                                    │
│        ✓ devrait additionner deux nombres               │
│        ✓ devrait retourner une erreur pour invalides    │
│        ✓ devrait gérer les nombres négatifs             │
│                                                         │
│    Test Suites: 1 passed, 1 total                       │
│    Tests:       6 passed, 6 total                       │
│    Time:        1.047 s                                 │
└─────────────────────────────────────────────────────────┘
```

---

## <a name="bonnes-pratiques"></a>💡 Bonnes pratiques appliquées

### 1. Nommage explicite des tests

```javascript
// ✅ BON - Description claire du comportement
test('devrait retourner une erreur pour entrées invalides', () => {})

// ❌ MAUVAIS - Trop vague
test('test calcul', () => {})
```

**Pourquoi ?**
- Un développeur comprend immédiatement ce qui est testé
- Les messages d'erreur sont clairs
- Sert de documentation

---

### 2. Pattern AAA (Arrange-Act-Assert)

```javascript
test('exemple', async () => {
  // ARRANGE : Préparer les données
  const payload = { a: 5, b: 3 };
  
  // ACT : Exécuter l'action
  const response = await request(app).post('/calculate').send(payload);
  
  // ASSERT : Vérifier le résultat
  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(8);
});
```

**Avantages** :
- Structure claire et lisible
- Facile à maintenir
- Standard dans l'industrie

---

### 3. Tester les cas nominaux ET les cas d'erreur

```javascript
// ✅ Cas nominal (tout va bien)
test('devrait additionner deux nombres', () => {})

// ✅ Cas d'erreur (données invalides)
test('devrait retourner une erreur pour entrées invalides', () => {})

// ✅ Cas limite (valeurs extrêmes)
test('devrait gérer les nombres négatifs', () => {})
```

**Couverture complète** :
- Succès : Vérifie que ça marche quand tout va bien
- Erreur : Vérifie que ça échoue proprement
- Limite : Vérifie la robustesse

---

### 4. Séparation app.js et server.js

```javascript
// app.js - SEULEMENT la logique
const app = express();
app.get('/hello', ...);
module.exports = app;  // ← Pas de app.listen()

// server.js - SEULEMENT le démarrage
const app = require('./app');
app.listen(3000);
```

**Avantages** :
- Tests plus rapides (pas de port réel)
- Pas de conflit de ports
- Tests isolés
- Facilite les tests d'intégration

---

### 5. Assertions précises

```javascript
// ✅ BON - Vérifie le code ET le body
expect(response.statusCode).toBe(200);
expect(response.body.result).toBe(8);

// ❌ MAUVAIS - Vérifie seulement le code
expect(response.statusCode).toBe(200);
```

**Pourquoi ?**
- Détecte plus de bugs
- Vérifie le contenu de la réponse
- Garantit que les données sont correctes

---

### 6. Tests isolés (pas de dépendances entre tests)

```javascript
// ✅ BON - Chaque test est indépendant
test('test 1', () => {
  const response = await request(app).get('/hello');
  expect(response.statusCode).toBe(200);
});

test('test 2', () => {
  const response = await request(app).get('/hello/Alice');
  expect(response.statusCode).toBe(200);
});

// ❌ MAUVAIS - Test 2 dépend de test 1
let sharedVariable;
test('test 1', () => {
  sharedVariable = await request(app).get('/hello');
});
test('test 2', () => {
  expect(sharedVariable.statusCode).toBe(200);  // Dépend de test 1
});
```

**Pourquoi ?**
- Les tests peuvent s'exécuter dans n'importe quel ordre
- Pas d'effet de bord
- Débogage plus facile

---

## 📊 Comparaison avec d'autres outils

### Jest vs Mocha vs Node:test

| Critère | Jest | Mocha + Chai | Node:test |
|---------|------|--------------|-----------|
| **Installation** | 1 package | 2-3 packages | Natif (0 package) |
| **Assertions** | Intégrées | Chai séparé | assert natif |
| **Mocks** | Intégrés | Package séparé | Basique |
| **Couverture** | Intégrée | Package séparé | Package séparé |
| **Popularité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Rapidité** | Rapide | Rapide | Très rapide |
| **Simplicité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

**Pourquoi Jest pour ce projet ?**
- ✅ Tout-en-un (pas besoin de multiples packages)
- ✅ Configuration minimale
- ✅ Très populaire (beaucoup de documentation)
- ✅ Mocks intégrés
- ✅ Watch mode pratique

---

## 🎯 Résumé des tests

### Tests exécutés

| Groupe | Test | Type | Importance |
|--------|------|------|------------|
| **GET /hello** | Retour Hello World | Nominal | ⭐⭐⭐ |
| **GET /hello/:name** | Message personnalisé | Nominal | ⭐⭐⭐ |
| **GET /hello/:name** | Gestion espaces | Limite | ⭐⭐ |
| **POST /calculate** | Addition correcte | Nominal | ⭐⭐⭐ |
| **POST /calculate** | Erreur validation | Erreur | ⭐⭐⭐ |
| **POST /calculate** | Nombres négatifs | Limite | ⭐⭐ |

### Couverture de code

**Routes testées** : 3/3 (100%)
- ✅ GET /hello
- ✅ GET /hello/:name
- ✅ POST /calculate

**Types de tests** :
- ✅ Cas nominaux : 3 tests
- ✅ Cas d'erreur : 1 test
- ✅ Cas limites : 2 tests

---

## 🚀 Commandes utiles

### Lancer les tests

```powershell
# Lancer tous les tests une fois
npm test

# Lancer en mode watch (relance automatique)
npm run test:watch

# Lancer avec couverture de code
npm test -- --coverage
```

### Lancer le serveur (optionnel)

```powershell
# Démarrer l'API sur http://localhost:3000
npm start
```

### Tester manuellement avec curl

```powershell
# GET /hello
curl http://localhost:3000/hello

# GET /hello/:name
curl http://localhost:3000/hello/Alice

# POST /calculate
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d "{\"a\":5,\"b\":3}"
```

---

## 💡 Points clés à retenir

### 1. Supertest ne démarre pas le serveur

```javascript
// ❌ PAS BESOIN de ça pour les tests
app.listen(3000);

// ✅ Supertest gère tout automatiquement
const response = await request(app).get('/hello');
```

### 2. async/await est nécessaire

```javascript
// ❌ MAUVAIS - Sans await
test('test', () => {
  const response = request(app).get('/hello');  // Retourne une Promise
  expect(response.statusCode).toBe(200);  // ❌ Erreur !
});

// ✅ BON - Avec async/await
test('test', async () => {
  const response = await request(app).get('/hello');
  expect(response.statusCode).toBe(200);  // ✅ Fonctionne
});
```

### 3. Supertest parse le JSON automatiquement

```javascript
// Pas besoin de faire :
const body = JSON.parse(response.text);

// Supertest le fait pour vous :
expect(response.body).toEqual({ message: 'Hello' });
```

### 4. .toBe() vs .toEqual()

```javascript
// ✅ Pour les primitives (nombres, chaînes)
expect(response.statusCode).toBe(200);

// ✅ Pour les objets
expect(response.body).toEqual({ message: 'Hello' });
```

---

## 📚 Pour aller plus loin

### Tests de middlewares

```javascript
test('devrait appliquer le middleware CORS', async () => {
  const response = await request(app).get('/hello');
  
  expect(response.headers['access-control-allow-origin']).toBe('*');
});
```

### Tests d'authentification

```javascript
test('devrait rejeter sans token', async () => {
  const response = await request(app).get('/protected');
  
  expect(response.statusCode).toBe(401);
});

test('devrait accepter avec token valide', async () => {
  const response = await request(app)
    .get('/protected')
    .set('Authorization', 'Bearer valid-token');
  
  expect(response.statusCode).toBe(200);
});
```

### Tests de base de données (avec mocks)

```javascript
const userService = require('./userService');

jest.mock('./userService');

test('devrait récupérer un utilisateur', async () => {
  userService.findById.mockResolvedValue({ id: 1, name: 'Alice' });
  
  const response = await request(app).get('/users/1');
  
  expect(response.body.name).toBe('Alice');
});
```

---

## 🎓 Conclusion

### Ce que tu as appris

1. ✅ Comment configurer Jest + Supertest
2. ✅ Structure d'un test backend
3. ✅ Tester des routes GET et POST
4. ✅ Tester les cas nominaux, d'erreur et limites
5. ✅ Pattern AAA (Arrange-Act-Assert)
6. ✅ Différence .toBe() vs .toEqual()
7. ✅ Importance de async/await
8. ✅ Séparation app.js et server.js

### Tests dans ton projet

```
✅ 6 tests backend passent
   - 1 test GET simple
   - 2 tests GET avec paramètre
   - 3 tests POST avec validation
```

### Bénéfices

- ✅ Détecte les bugs avant la production
- ✅ Documentation vivante du code
- ✅ Confiance pour refactorer
- ✅ Régression zéro

---

**Document créé pour l'atelier de tests logiciels**  
*Tests Backend Node.js + Express - Novembre 2024*
