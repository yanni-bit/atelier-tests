# 🧪 Atelier - Tests logiciels

**Projet d'apprentissage** : Découverte et mise en pratique des tests logiciels  
**Technologies** : Node.js, Express, Angular 20, Jest, Jasmine, Karma  
**Date** : Novembre 2024

---

## 📋 Table des matières

- [Description](#description)
- [Structure du projet](#structure)
- [Installation](#installation)
- [Lancer les tests](#tests)
- [Documentation](#documentation)
- [Résultats](#resultats)

---

## <a name="description"></a>📖 Description

Ce projet est un atelier complet sur les tests logiciels comprenant :
- **Backend** : API REST Node.js/Express testée avec Jest + Supertest
- **Frontend** : Application Angular 20 testée avec Jasmine + Karma
- **Tests unitaires** : Services, composants isolés
- **Tests d'intégration** : Composants + services ensemble

---

## <a name="structure"></a>📁 Structure du projet

```
atelier-tests/
├── 📄 README.md                    ← Ce fichier
│
├── 📁 backend/                     ← API Node.js/Express
│   ├── app.js                      ← Application Express
│   ├── server.js                   ← Serveur (optionnel)
│   ├── package.json
│   ├── tests/
│   │   └── app.test.js             ← 6 tests Jest + Supertest
│   └── docs/
│       └── EXPLICATION_TESTS_BACKEND.md
│
├── 📁 frontend/                    ← Application Angular 20
│   └── atelier-angular/
│       ├── src/
│       │   └── app/
│       │       ├── services/
│       │       │   ├── prix.ts
│       │       │   └── prix.spec.ts    ← 4 tests PrixService
│       │       └── components/
│       │           ├── greeting/
│       │           │   └── greeting.spec.ts   ← 4 tests GreetingComponent
│       │           └── product/
│       │               └── product.spec.ts    ← 8 tests ProductComponent
│       ├── package.json
│       └── docs/
│           ├── EXPLICATION_TESTS_ANGULAR.md
│           └── GUIDE_TESTS_INTEGRATION_ANGULAR.md
│
└── 📁 docs/                        ← Documentation globale
    └── ATELIER_TESTS_LOGICIELS_COMPLET.md
```

---

## <a name="installation"></a>⚙️ Installation

### Prérequis

- Node.js v18+ 
- npm v9+
- Angular CLI v20+

### Backend

```bash
cd backend
npm install
```

**Dépendances installées** :
- `express` : Framework web
- `jest` : Framework de tests
- `supertest` : Tests API HTTP

### Frontend

```bash
cd frontend/atelier-angular
npm install
```

**Dépendances installées** :
- Angular 20
- Jasmine + Karma (inclus par défaut)

---

## <a name="tests"></a>🧪 Lancer les tests

### Backend - Jest + Supertest

```bash
cd backend

# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec couverture de code
npm test -- --coverage
```

**Résultat attendu** :
```
PASS  tests/app.test.js
  GET /hello
    ✓ devrait retourner Hello World
  GET /hello/:name
    ✓ devrait retourner un message personnalisé
    ✓ devrait gérer les noms avec espaces
  POST /calculate
    ✓ devrait additionner deux nombres
    ✓ devrait retourner une erreur pour entrées invalides
    ✓ devrait gérer les nombres négatifs

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        1.047 s
```

---

### Frontend - Jasmine + Karma

```bash
cd frontend/atelier-angular

# Lancer tous les tests (ouvre Chrome)
ng test

# Mode headless (sans navigateur)
ng test --no-watch --browsers=ChromeHeadless

# Avec couverture de code
ng test --code-coverage
```

**Résultat attendu** :
```
Chrome 142.0.0.0 (Windows 10): Executed 18 of 18 SUCCESS (0.191 secs)
TOTAL: 18 SUCCESS

Tests répartis :
- PrixService        : 4 tests
- GreetingComponent  : 4 tests  
- ProductComponent   : 8 tests (intégration)
- AppComponent       : 2 tests (défaut)
```

---

## <a name="documentation"></a>📚 Documentation

### Documentation globale

- **[ATELIER_TESTS_LOGICIELS_COMPLET.md](docs/ATELIER_TESTS_LOGICIELS_COMPLET.md)**
  - Vue d'ensemble complète de l'atelier
  - Tous les types de tests expliqués
  - Exemples backend + frontend
  - 1720 lignes de documentation

### Documentation Backend

- **[EXPLICATION_TESTS_BACKEND.md](backend/docs/EXPLICATION_TESTS_BACKEND.md)**
  - Tests Node.js + Express en détail
  - Jest + Supertest expliqué
  - Chaque test annoté ligne par ligne
  - Architecture et bonnes pratiques

### Documentation Frontend

- **[EXPLICATION_TESTS_ANGULAR.md](frontend/atelier-angular/docs/EXPLICATION_TESTS_ANGULAR.md)**
  - Tests Angular 20 en détail
  - Jasmine + Karma expliqué
  - Problèmes rencontrés et solutions
  - Composants standalone

- **[GUIDE_TESTS_INTEGRATION_ANGULAR.md](frontend/atelier-angular/docs/GUIDE_TESTS_INTEGRATION_ANGULAR.md)**
  - Tests d'intégration expliqués
  - Différence unitaire vs intégration
  - ProductComponent + PrixService
  - Pyramide des tests

---

## <a name="resultats"></a>📊 Résultats

### Statistiques des tests

| Type | Nombre | Framework |
|------|--------|-----------|
| **Backend** | 6 tests | Jest + Supertest |
| **Frontend Unitaire** | 10 tests | Jasmine + Karma |
| **Frontend Intégration** | 8 tests | Jasmine + Karma |
| **TOTAL** | **24 tests** | - |

### Couverture

- ✅ **Backend** : 3 routes testées (100%)
- ✅ **Frontend** : 3 services/composants testés
- ✅ **Types de tests** : Unitaires + Intégration
- ✅ **Cas testés** : Nominaux + Erreurs + Limites

---

## 🎯 Objectifs de l'atelier

### Objectifs atteints

- [x] Comprendre les différents types de tests
- [x] Installer et configurer des frameworks de tests
- [x] Écrire des tests unitaires (backend + frontend)
- [x] Écrire des tests d'intégration (frontend)
- [x] Tester des routes API REST
- [x] Tester des services Angular
- [x] Tester des composants Angular
- [x] Tester des interactions utilisateur
- [x] Documenter le processus complet

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** v18+
- **Express** v4.18 - Framework web
- **Jest** v29.7 - Framework de tests
- **Supertest** v6.3 - Tests API HTTP

### Frontend
- **Angular** v20 - Framework frontend
- **TypeScript** - Langage
- **Jasmine** - Framework de tests
- **Karma** - Test runner
- **Chrome Headless** - Navigateur de test

---

## 📖 Concepts clés appris

### Tests unitaires
- Isolation d'une seule unité (fonction, service, composant)
- Utilisation de mocks pour les dépendances
- Vérification de la logique interne

### Tests d'intégration
- Test de plusieurs unités ensemble
- Utilisation des vraies dépendances
- Vérification des interactions

### Pattern AAA
- **Arrange** : Préparer les données
- **Act** : Exécuter l'action
- **Assert** : Vérifier le résultat

### Bonnes pratiques
- Nommage explicite des tests
- Un test = une responsabilité
- Tests isolés (pas de dépendances)
- Tester les cas nominaux ET les erreurs
- Cas limites (valeurs extrêmes)

---

## 🚀 Pour aller plus loin

### Tests non implémentés (exemples)

- **Tests E2E** : Cypress, Playwright
- **Tests de performance** : Artillery, k6
- **Tests de sécurité** : OWASP ZAP
- **Tests de régression visuelle** : Percy, Chromatic

### Améliorations possibles

- Ajouter une base de données (avec tests)
- Implémenter l'authentification (avec tests)
- Créer des tests E2E complets
- Mesurer la couverture de code (>80%)
- Intégration continue (CI/CD)

---

## 👥 Auteur

**Projet pédagogique** - Atelier de tests logiciels  
Novembre 2024

---

## 📝 Licence

Ce projet est à but éducatif.

---

## 🎓 Présentation

Ce projet peut être présenté pour démontrer :
1. Compréhension des tests logiciels
2. Maîtrise de Jest (backend)
3. Maîtrise de Jasmine/Karma (frontend)
4. Bonnes pratiques de tests
5. Documentation complète

**Temps de présentation recommandé** : 10-15 minutes
- 2 min : Introduction
- 3 min : Démo tests backend
- 3 min : Démo tests frontend
- 2 min : Tests d'intégration
- 2 min : Documentation
- 3 min : Questions/réponses

---

**🎉 Projet complet et prêt pour présentation !**
