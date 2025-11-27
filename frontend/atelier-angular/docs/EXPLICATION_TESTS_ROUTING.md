# 🔀 Explication des tests de routing Angular

**Projet** : atelier-tests  
**Fichier testé** : routing.spec.ts  
**Framework** : Jasmine + Karma  
**Type** : Tests de navigation et guards

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-ensemble)
2. [Architecture routing](#architecture)
3. [Tests de navigation](#tests-navigation)
4. [Tests AuthService](#tests-authservice)
5. [Concepts clés](#concepts)
6. [Bonnes pratiques](#bonnes-pratiques)

---

## <a name="vue-ensemble"></a>🎯 Vue d'ensemble

### Fichiers impliqués

```
src/app/
├── app.routes.ts          ← Configuration des routes
├── auth.ts                ← Service d'authentification
├── auth.guard.ts          ← Guard de protection
├── tests/
│   └── routing.spec.ts    ← 13 TESTS ✅
└── components/
    ├── home/              ← Composant Home
    ├── about/             ← Composant About
    ├── user-detail/       ← Composant UserDetail
    ├── login/             ← Composant Login
    └── greeting/          ← Composant protégé
```

### Résultat des tests

```
✅ 13/13 tests réussis
⏱️ Temps d'exécution : ~0.20 secondes
```

---

## <a name="architecture"></a>🏗️ Architecture routing

### Configuration des routes (app.routes.ts)

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { UserDetailComponent } from './components/user-detail/user-detail';
import { LoginComponent } from './components/login/login';
import { GreetingComponent } from './components/greeting/greeting';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { 
    path: 'protected', 
    component: GreetingComponent,
    canActivate: [authGuard]  // ← Route protégée par le guard
  },
  { path: '**', redirectTo: '' }  // ← Wildcard : toute route invalide
];
```

**Éléments clés** :
- `path` : URL de la route
- `component` : Composant à afficher
- `:id` : Paramètre dynamique dans l'URL
- `canActivate` : Guard qui contrôle l'accès
- `**` : Wildcard pour routes non trouvées

---

### Service AuthService (auth.ts)

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;  // ← État privé
  
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  
  login(): void {
    this.loggedIn = true;
  }
  
  logout(): void {
    this.loggedIn = false;
  }
}
```

**Points clés** :
- Variable `loggedIn` privée (encapsulation)
- Méthodes publiques pour contrôler l'état
- Service simple sans dépendances externes
- Pas de vraie API (simulé en mémoire)

---

### Guard d'authentification (auth.guard.ts)

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;  // ← Autoriser l'accès
  } else {
    router.navigate(['/login']);  // ← Rediriger vers login
    return false;  // ← Bloquer l'accès
  }
};
```

**Points clés** :
- `CanActivateFn` : Type pour les functional guards (Angular 15+)
- `inject()` : Injection de dépendances dans une fonction
- Retourne `true` pour autoriser, `false` pour bloquer
- Redirige vers `/login` si non authentifié

**Différence avec class guards (ancien style)** :
```typescript
// ❌ Ancien style (Angular <15)
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean { ... }
}

// ✅ Nouveau style (Angular 15+)
export const authGuard: CanActivateFn = () => { ... };
```

---

## <a name="tests-navigation"></a>🧪 Tests de navigation (8 tests)

### Configuration du TestBed

```typescript
describe('Tests de Routing', () => {
  let router: Router;
  let location: Location;
  let authService: AuthService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),  // ← Fournit le router avec les routes
        AuthService
      ]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    
    // Initialiser le router
    await router.navigate(['']);
  });
```

**Ligne par ligne** :

```typescript
provideRouter(routes)
// → Fonction Angular 15+ pour configurer le routing
// → Remplace RouterModule.forRoot(routes)
// → Injecte Router et Location automatiquement

router = TestBed.inject(Router);
// → Récupère le service Router pour naviguer
// → Type : Router (classe d'Angular)

location = TestBed.inject(Location);
// → Récupère le service Location pour lire l'URL
// → Type : Location (service d'Angular)
// → Utilisé pour vérifier où on est

authService = TestBed.inject(AuthService);
// → Récupère le service d'authentification
// → On pourra appeler login()/logout() dans les tests

await router.navigate(['']);
// → Navigue vers la route par défaut (/)
// → await : La navigation est asynchrone
// → Initialise le router avant les tests
```

---

### TEST 1 : Route par défaut

```typescript
it('devrait charger la route par défaut /', async () => {
  await router.navigate(['']);
  expect(location.path()).toBe('');
});
```

**Ce qui est testé** :
- La route `/` (racine) existe
- La navigation réussit
- L'URL est bien vide (représente `/`)

**Concepts** :
- `router.navigate([])` : Méthode pour changer de route
- `location.path()` : Retourne l'URL actuelle
- `''` = `/` (route racine)

---

### TEST 2 : Navigation simple

```typescript
it('devrait naviguer vers /about', async () => {
  await router.navigate(['/about']);
  expect(location.path()).toBe('/about');
});
```

**Ligne par ligne** :

```typescript
await router.navigate(['/about']);
// → Navigue vers la route /about
// → Paramètre : Array de segments d'URL
// → await : Attend que la navigation soit terminée
// → Retourne une Promise<boolean> (true si succès)

expect(location.path()).toBe('/about');
// → Vérifie que l'URL actuelle est '/about'
// → location.path() retourne l'URL sans le domaine
// → '/about' exactement, pas 'about' (commence par /)
```

**Pourquoi async/await ?**
```typescript
// Navigation est asynchrone (peut charger des données, guards, etc.)
await router.navigate(['/about']);  // Attend la fin
expect(location.path()).toBe('/about');  // URL mise à jour

// ❌ Sans await
router.navigate(['/about']);  // Lance la navigation
expect(location.path()).toBe('/about');  // Peut échouer (pas fini)
```

---

### TEST 3 : Paramètre numérique

```typescript
it('devrait naviguer vers /user/123', async () => {
  await router.navigate(['/user', 123]);
  expect(location.path()).toBe('/user/123');
});
```

**Ce qui est testé** :
- Routes avec paramètres dynamiques
- Conversion automatique nombre → string dans l'URL

**Syntaxe du paramètre** :
```typescript
// Méthode 1 : Array avec segments séparés
router.navigate(['/user', 123])
// → URL : /user/123

// Méthode 2 : String complète
router.navigate(['/user/123'])
// → URL : /user/123

// Méthode 3 : Objet (pour query params)
router.navigate(['/user', 123], { queryParams: { tab: 'profile' } })
// → URL : /user/123?tab=profile
```

**Configuration de la route** :
```typescript
{ path: 'user/:id', component: UserDetailComponent }
//            ↑
//            Paramètre dynamique nommé 'id'
```

---

### TEST 4 : Paramètre string

```typescript
it('devrait naviguer vers /user/alice', async () => {
  await router.navigate(['/user', 'alice']);
  expect(location.path()).toBe('/user/alice');
});
```

**Ce qui est testé** :
- Les paramètres peuvent être des strings
- La même route accepte différents types de valeurs

**Récupération dans le composant** :
```typescript
// UserDetailComponent
ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.userId = params['id'];  // ← Récupère 'alice' ou '123'
  });
}
```

---

### TEST 5 : Route invalide

```typescript
it('devrait rediriger vers / si route invalide', async () => {
  await router.navigate(['/route-qui-nexiste-pas']);
  expect(location.path()).toBe('');
});
```

**Ce qui est testé** :
- La wildcard `**` fonctionne
- Redirection vers `/` si route inconnue

**Configuration** :
```typescript
{ path: '**', redirectTo: '' }
// path: '**' → Capture toutes les routes non matchées
// redirectTo: '' → Redirige vers la route racine
```

**Pourquoi c'est important** :
- Évite les pages 404 non gérées
- Améliore l'UX (utilisateur pas perdu)
- Peut rediriger vers une page d'erreur custom

---

### TEST 6 : Guard bloque sans auth

```typescript
it('devrait bloquer l\'accès à /protected sans authentification', async () => {
  authService.logout();  // ← S'assure qu'on est déconnecté
  
  const result = await router.navigate(['/protected']);
  
  // La navigation échoue
  expect(result).toBeFalsy();
  // Redirigé vers /login
  expect(location.path()).toBe('/login');
});
```

**Ligne par ligne** :

```typescript
authService.logout();
// → Met loggedIn à false
// → Simule un utilisateur non connecté

const result = await router.navigate(['/protected']);
// → Tente de naviguer vers une route protégée
// → Le guard authGuard est exécuté
// → result : boolean (true si succès, false si bloqué)

expect(result).toBeFalsy();
// → Vérifie que la navigation a échoué
// → Le guard a retourné false

expect(location.path()).toBe('/login');
// → Vérifie qu'on a été redirigé vers /login
// → C'est le guard qui fait cette redirection
```

**Flow complet** :
```
1. Utilisateur déconnecté (logout())
2. Tente d'accéder à /protected
3. Router appelle authGuard
4. authGuard vérifie : isLoggedIn() → false
5. authGuard redirige : router.navigate(['/login'])
6. authGuard retourne false
7. Navigation vers /protected échoue
8. On se retrouve sur /login
```

---

### TEST 7 : Guard autorise avec auth

```typescript
it('devrait autoriser l\'accès à /protected avec authentification', async () => {
  authService.login();  // ← S'assure qu'on est connecté
  
  const result = await router.navigate(['/protected']);
  
  // La navigation réussit
  expect(result).toBeTruthy();
  // On est bien sur /protected
  expect(location.path()).toBe('/protected');
});
```

**Ce qui est testé** :
- Le guard laisse passer si authentifié
- Pas de redirection
- Navigation réussit

**Flow complet** :
```
1. Utilisateur connecté (login())
2. Tente d'accéder à /protected
3. Router appelle authGuard
4. authGuard vérifie : isLoggedIn() → true
5. authGuard retourne true
6. Navigation vers /protected réussit
7. On se retrouve sur /protected
```

---

### TEST 8 : Navigation multiple

```typescript
it('devrait naviguer entre plusieurs pages', async () => {
  // Départ : /
  expect(location.path()).toBe('');
  
  // Aller à /about
  await router.navigate(['/about']);
  expect(location.path()).toBe('/about');
  
  // Aller à /user/456
  await router.navigate(['/user', 456]);
  expect(location.path()).toBe('/user/456');
  
  // Retour à /
  await router.navigate(['']);
  expect(location.path()).toBe('');
});
```

**Ce qui est testé** :
- Plusieurs navigations successives
- Chaque navigation met à jour l'URL correctement
- Pas de conflit entre les navigations

**Pourquoi ce test ?**
- Vérifie que le router maintient un état cohérent
- Détecte les bugs de navigation
- Simule un parcours utilisateur réel

---

## <a name="tests-authservice"></a>🧪 Tests AuthService (5 tests)

### Configuration

```typescript
describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });
```

---

### TEST 9 : Service créé

```typescript
it('devrait être créé', () => {
  expect(service).toBeTruthy();
});
```

**Ce qui est testé** :
- Le service s'instancie correctement
- Pas d'erreur dans le constructeur

---

### TEST 10 : État initial

```typescript
it('devrait être déconnecté par défaut', () => {
  expect(service.isLoggedIn()).toBeFalsy();
});
```

**Ce qui est testé** :
- L'état initial est `loggedIn = false`
- Comportement par défaut correct

**Pourquoi c'est important** :
- Par défaut, un utilisateur n'est PAS authentifié
- Principe de sécurité : deny by default

---

### TEST 11 : Connexion

```typescript
it('devrait connecter l\'utilisateur', () => {
  service.login();
  expect(service.isLoggedIn()).toBeTruthy();
});
```

**Ce qui est testé** :
- La méthode `login()` change l'état
- `isLoggedIn()` retourne true après login

**Méthode login()** :
```typescript
login(): void {
  this.loggedIn = true;  // ← Change l'état interne
}
```

---

### TEST 12 : Déconnexion

```typescript
it('devrait déconnecter l\'utilisateur', () => {
  service.login();
  expect(service.isLoggedIn()).toBeTruthy();
  
  service.logout();
  expect(service.isLoggedIn()).toBeFalsy();
});
```

**Ce qui est testé** :
- La méthode `logout()` change l'état
- Retour à l'état déconnecté

**Flow** :
```
1. État initial : déconnecté (false)
2. login() → connecté (true)
3. logout() → déconnecté (false)
```

---

### TEST 13 : Cycles multiples

```typescript
it('devrait gérer plusieurs cycles connexion/déconnexion', () => {
  // Connexion 1
  service.login();
  expect(service.isLoggedIn()).toBeTruthy();
  
  // Déconnexion 1
  service.logout();
  expect(service.isLoggedIn()).toBeFalsy();
  
  // Connexion 2
  service.login();
  expect(service.isLoggedIn()).toBeTruthy();
  
  // Déconnexion 2
  service.logout();
  expect(service.isLoggedIn()).toBeFalsy();
});
```

**Ce qui est testé** :
- Le service peut être utilisé plusieurs fois
- Pas de bug sur cycles répétés
- État cohérent à chaque cycle

**Pourquoi ce test ?**
- Détecte les bugs d'état persistant
- Vérifie qu'on peut login/logout plusieurs fois
- Simule une session utilisateur complète

---

## <a name="concepts"></a>🔑 Concepts clés

### Router vs Location

```typescript
// Router : Pour NAVIGUER
router.navigate(['/about'])           // Change de page
router.navigateByUrl('/about')        // Idem avec URL string
router.navigate(['/user', 123])       // Avec paramètres

// Location : Pour LIRE l'URL
location.path()                       // → '/about'
location.back()                       // Retour arrière (history)
location.forward()                    // Avance (history)
```

---

### Configuration des routes

```typescript
// Route simple
{ path: 'about', component: AboutComponent }

// Route avec paramètre
{ path: 'user/:id', component: UserDetailComponent }

// Route par défaut
{ path: '', component: HomeComponent }

// Route protégée
{ 
  path: 'admin', 
  component: AdminComponent,
  canActivate: [authGuard]
}

// Wildcard (404)
{ path: '**', redirectTo: '' }
```

---

### Guards

**Types de guards** :
```typescript
CanActivate        // Peut-on activer cette route ?
CanActivateChild   // Peut-on activer les routes enfants ?
CanDeactivate      // Peut-on quitter cette route ?
CanLoad            // Peut-on charger ce module lazy ?
Resolve            // Résoudre des données avant navigation
```

**Functional guard (Angular 15+)** :
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isLoggedIn();
};
```

**Class guard (ancien style)** :
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  
  canActivate(): boolean {
    return this.authService.isLoggedIn();
  }
}
```

---

### Navigation avec paramètres

```typescript
// Paramètres de route (/user/:id)
router.navigate(['/user', 123])
// URL : /user/123

// Query parameters (?search=test)
router.navigate(['/search'], { queryParams: { q: 'test' } })
// URL : /search?q=test

// Fragment (#section)
router.navigate(['/page'], { fragment: 'section2' })
// URL : /page#section2

// Combiné
router.navigate(['/user', 123], { 
  queryParams: { tab: 'profile' },
  fragment: 'details'
})
// URL : /user/123?tab=profile#details
```

---

### Récupérer les paramètres

```typescript
// Dans un composant
import { ActivatedRoute } from '@angular/router';

export class UserDetailComponent implements OnInit {
  userId: string = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Paramètres de route
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    
    // Query parameters
    this.route.queryParams.subscribe(queryParams => {
      const search = queryParams['search'];
    });
    
    // Fragment
    this.route.fragment.subscribe(fragment => {
      console.log(fragment);  // 'section2'
    });
  }
}
```

---

## <a name="bonnes-pratiques"></a>✅ Bonnes pratiques

### 1. Toujours await les navigations

```typescript
// ✅ BON
await router.navigate(['/about']);
expect(location.path()).toBe('/about');

// ❌ MAUVAIS
router.navigate(['/about']);
expect(location.path()).toBe('/about');  // Peut échouer
```

---

### 2. Initialiser l'état dans beforeEach

```typescript
beforeEach(async () => {
  // Initialiser le router
  await router.navigate(['']);
  
  // Réinitialiser l'authentification
  authService.logout();
});
```

---

### 3. Tester les cas d'échec

```typescript
// ✅ Tester que la navigation ÉCHOUE quand elle doit échouer
it('devrait bloquer l\'accès', async () => {
  authService.logout();
  const result = await router.navigate(['/protected']);
  expect(result).toBeFalsy();  // ← Navigation échoue
});
```

---

### 4. Vérifier les redirections

```typescript
// ✅ Vérifier qu'on est redirigé au bon endroit
it('devrait rediriger vers login', async () => {
  authService.logout();
  await router.navigate(['/protected']);
  expect(location.path()).toBe('/login');  // ← Redirection
});
```

---

### 5. Tester des parcours complets

```typescript
// ✅ Simuler un parcours utilisateur
it('devrait naviguer du login au dashboard', async () => {
  // 1. Aller au login
  await router.navigate(['/login']);
  
  // 2. Se connecter
  authService.login();
  
  // 3. Accéder au dashboard
  const result = await router.navigate(['/dashboard']);
  expect(result).toBeTruthy();
  expect(location.path()).toBe('/dashboard');
});
```

---

## 📊 Couverture des tests

| Aspect | Tests |
|--------|-------|
| **Navigation simple** | Tests 1, 2 |
| **Paramètres de route** | Tests 3, 4 |
| **Wildcard / 404** | Test 5 |
| **Guard bloque** | Test 6 |
| **Guard autorise** | Test 7 |
| **Navigation multiple** | Test 8 |
| **AuthService état** | Tests 9, 10 |
| **AuthService login** | Test 11 |
| **AuthService logout** | Test 12 |
| **AuthService cycles** | Test 13 |

**Couverture** : 100% ✅

---

## 🎓 Résumé

### Ce qu'on a appris

1. ✅ Configurer le routing avec `provideRouter()`
2. ✅ Tester la navigation avec `Router` et `Location`
3. ✅ Créer un guard fonctionnel avec `CanActivateFn`
4. ✅ Tester qu'un guard bloque/autorise correctement
5. ✅ Gérer les paramètres de route (`:id`)
6. ✅ Tester les redirections
7. ✅ Créer un service d'authentification simple
8. ✅ Tester les cycles connexion/déconnexion

### Points clés à retenir

- **async/await** : TOUJOURS pour `router.navigate()`
- **provideRouter()** : Nouvelle façon de configurer le routing (Angular 15+)
- **Guards fonctionnels** : Plus simples que les class guards
- **inject()** : Injection de dépendances dans les fonctions
- **location.path()** : Pour vérifier l'URL courante
- **result = await router.navigate()** : Vérifie si succès/échec

---

**Document créé pour l'atelier de tests logiciels**  
*Explication complète des tests de routing - 13 tests - Novembre 2024*
