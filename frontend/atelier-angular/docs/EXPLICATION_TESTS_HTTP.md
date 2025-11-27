# 🔄 Explication des tests HTTP et asynchrones Angular

**Projet** : atelier-tests  
**Service testé** : UserService  
**Framework** : Jasmine + Karma  
**Type** : Tests HTTP avec HttpTestingController

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-ensemble)
2. [Architecture du service](#architecture)
3. [HttpTestingController](#http-testing)
4. [Tests GET](#tests-get)
5. [Tests POST/PUT/DELETE](#tests-crud)
6. [Tests d'erreurs](#tests-erreurs)
7. [Tests avancés](#tests-avances)
8. [Concepts clés](#concepts)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## <a name="vue-ensemble"></a>🎯 Vue d'ensemble

### Fichiers impliqués

```
src/app/services/
├── user.ts           ← Service avec HttpClient
└── user.spec.ts      ← 13 TESTS ✅
```

### Résultat des tests

```
✅ 13/13 tests réussis
⏱️ Temps d'exécution : ~0.18 secondes
```

---

## <a name="architecture"></a>🏗️ Architecture du service

### UserService (user.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  searchUsers(name: string, age?: number): Observable<User[]> {
    let params = new HttpParams().set('name', name);
    if (age) {
      params = params.set('age', age.toString());
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }
  
  getUsersWithAuth(token: string): Observable<User[]> {
    const headers = { Authorization: token };
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}
```

### Points clés

1. **HttpClient** : Service Angular pour requêtes HTTP
2. **Observable** : Pattern réactif (RxJS)
3. **Generic types** : `<User[]>`, `<User>` pour typage
4. **HttpParams** : Gestion des query parameters
5. **Headers** : Authorization, Content-Type, etc.

---

## <a name="http-testing"></a>🧪 HttpTestingController

### Configuration du TestBed

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user';

describe('UserService - Tests HTTP', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // ← Module de test HTTP
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();  // ← Vérifie qu'il n'y a pas de requêtes en attente
  });
```

**Ligne par ligne** :

```typescript
imports: [HttpClientTestingModule]
// → Module Angular pour tester HttpClient
// → Fournit HttpTestingController
// → Remplace HttpClient par une version mockée
// → Pas de vraies requêtes HTTP !

httpMock = TestBed.inject(HttpTestingController);
// → Récupère le contrôleur de test
// → Permet d'intercepter et de mocker les requêtes
// → Type : HttpTestingController

httpMock.verify();
// → Vérifie qu'il n'y a pas de requêtes HTTP non gérées
// → Appelé dans afterEach()
// → Détecte les requêtes oubliées (bugs)
```

### Pourquoi HttpTestingController ?

**Sans HttpTestingController** ❌ :
```typescript
// ❌ Vraie requête HTTP
service.getUsers().subscribe(users => {
  // Appel réseau réel
  // Lent (500ms+)
  // Dépend d'une API externe
  // Peut échouer si pas de connexion
});
```

**Avec HttpTestingController** ✅ :
```typescript
// ✅ Requête mockée
service.getUsers().subscribe(users => {
  // Pas d'appel réseau
  // Très rapide (<1ms)
  // Pas de dépendance externe
  // 100% fiable
});

const req = httpMock.expectOne('https://api.example.com/users');
req.flush(mockData);  // Simule la réponse
```

---

## <a name="tests-get"></a>🧪 Tests GET

### TEST 1 : Service créé

```typescript
it('devrait être créé', () => {
  expect(service).toBeTruthy();
});
```

**Ce qui est testé** :
- Le service s'instancie correctement
- HttpClient est injecté sans erreur

---

### TEST 2 : GET - Liste complète

```typescript
it('devrait récupérer une liste d\'utilisateurs', () => {
  const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  
  // S'abonner à l'Observable
  service.getUsers().subscribe(users => {
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('Alice');
    expect(users[1].name).toBe('Bob');
  });
  
  // Intercepter la requête HTTP
  const req = httpMock.expectOne('https://api.example.com/users');
  
  // Vérifier la méthode HTTP
  expect(req.request.method).toBe('GET');
  
  // Simuler la réponse
  req.flush(mockUsers);
});
```

**Ligne par ligne détaillée** :

```typescript
const mockUsers: User[] = [...]
// → Données simulées (pas de vraie API)
// → Type : User[] (tableau d'utilisateurs)
// → Ces données seront retournées par le mock

service.getUsers().subscribe(users => {
  // → Appelle la méthode du service
  // → getUsers() retourne un Observable<User[]>
  // → subscribe() : S'abonne à l'Observable
  // → La callback reçoit les données quand disponibles
  
  expect(users.length).toBe(2);
  // → Vérifie qu'on a 2 utilisateurs
  
  expect(users[0].name).toBe('Alice');
  // → Vérifie le premier utilisateur
});
// ⚠️ À ce stade, la callback n'a PAS encore été exécutée !
// La requête HTTP est en attente

const req = httpMock.expectOne('https://api.example.com/users');
// → expectOne() : Attend qu'UNE requête soit faite vers cette URL
// → Retourne un TestRequest (objet représentant la requête)
// → Si 0 ou 2+ requêtes → Erreur
// → Type : TestRequest

expect(req.request.method).toBe('GET');
// → Vérifie que c'est bien une requête GET
// → req.request : HttpRequest (objet Angular)
// → req.request.method : 'GET', 'POST', 'PUT', 'DELETE'

req.flush(mockUsers);
// → Simule la réponse du serveur
// → Envoie mockUsers comme réponse
// → Déclenche l'exécution de la callback dans subscribe()
// → C'est MAINTENANT que les expect() dans subscribe() sont exécutés
```

**Flow complet** :
```
1. service.getUsers() est appelé
   → HttpClient prépare une requête GET

2. subscribe() enregistre une callback
   → La callback attend des données

3. httpMock.expectOne() intercepte la requête
   → La requête n'est pas envoyée au réseau
   → Elle est capturée par le mock

4. req.flush(mockUsers) simule la réponse
   → Les mockUsers sont envoyés à l'Observable
   → La callback dans subscribe() est exécutée
   → Les expect() sont vérifiés
```

---

### TEST 3 : GET - Par ID

```typescript
it('devrait récupérer un utilisateur par ID', () => {
  const mockUser: User = { 
    id: 1, 
    name: 'Alice', 
    email: 'alice@example.com' 
  };
  
  service.getUserById(1).subscribe(user => {
    expect(user.id).toBe(1);
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@example.com');
  });
  
  const req = httpMock.expectOne('https://api.example.com/users/1');
  expect(req.request.method).toBe('GET');
  req.flush(mockUser);
});
```

**Ce qui est testé** :
- Requête GET vers `/users/1`
- L'ID est bien dans l'URL
- Retourne un seul utilisateur (pas un tableau)

**Méthode du service** :
```typescript
getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
  //                          ↑
  //                          Template literal : interpolation
}
```

---

## <a name="tests-crud"></a>🧪 Tests POST/PUT/DELETE

### TEST 4 : POST - Créer

```typescript
it('devrait créer un nouvel utilisateur', () => {
  const newUser: Partial<User> = { 
    name: 'Charlie', 
    email: 'charlie@example.com' 
  };
  
  const mockResponse: User = { 
    id: 3, 
    name: 'Charlie', 
    email: 'charlie@example.com' 
  };
  
  service.createUser(newUser).subscribe(user => {
    expect(user.id).toBe(3);
    expect(user.name).toBe('Charlie');
  });
  
  const req = httpMock.expectOne('https://api.example.com/users');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(newUser);
  req.flush(mockResponse);
});
```

**Ligne par ligne** :

```typescript
const newUser: Partial<User> = { ... }
// → Partial<User> : Tous les champs sont optionnels
// → Pas d'ID car créé par le serveur
// → Type utility de TypeScript

expect(req.request.body).toEqual(newUser);
// → Vérifie que le body de la requête contient newUser
// → req.request.body : Données envoyées au serveur
// → toEqual() : Égalité profonde (objets)

req.flush(mockResponse);
// → Le serveur renvoie l'utilisateur créé avec un ID
```

**Méthode du service** :
```typescript
createUser(user: Partial<User>): Observable<User> {
  return this.http.post<User>(this.apiUrl, user);
  //                                         ↑
  //                                         Body de la requête
}
```

---

### TEST 5 : PUT - Mettre à jour

```typescript
it('devrait mettre à jour un utilisateur', () => {
  const updatedUser: User = { 
    id: 1, 
    name: 'Alice Updated', 
    email: 'alice.new@example.com' 
  };
  
  service.updateUser(1, updatedUser).subscribe(user => {
    expect(user.name).toBe('Alice Updated');
    expect(user.email).toBe('alice.new@example.com');
  });
  
  const req = httpMock.expectOne('https://api.example.com/users/1');
  expect(req.request.method).toBe('PUT');
  expect(req.request.body).toEqual(updatedUser);
  req.flush(updatedUser);
});
```

**Ce qui est testé** :
- Requête PUT vers `/users/1`
- Le body contient l'utilisateur mis à jour
- L'ID est dans l'URL ET dans le body

**PUT vs PATCH** :
- `PUT` : Remplace complètement la ressource
- `PATCH` : Modification partielle
- Ici on utilise PUT (convention REST)

---

### TEST 6 : DELETE - Supprimer

```typescript
it('devrait supprimer un utilisateur', () => {
  service.deleteUser(1).subscribe(response => {
    expect(response).toEqual({ success: true });
  });
  
  const req = httpMock.expectOne('https://api.example.com/users/1');
  expect(req.request.method).toBe('DELETE');
  req.flush({ success: true });
});
```

**Ce qui est testé** :
- Requête DELETE vers `/users/1`
- Retourne une confirmation de suppression
- Pas de body dans la requête (DELETE n'a pas de body)

**Méthode du service** :
```typescript
deleteUser(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
  // Pas de body pour DELETE
}
```

---

## <a name="tests-erreurs"></a>🧪 Tests d'erreurs

### TEST 7 : Erreur 404

```typescript
it('devrait gérer une erreur 404', () => {
  service.getUserById(999).subscribe({
    next: () => fail('Ne devrait pas réussir'),
    error: (error) => {
      expect(error.status).toBe(404);
    }
  });
  
  const req = httpMock.expectOne('https://api.example.com/users/999');
  
  // Simuler une erreur 404
  req.flush('Utilisateur non trouvé', { 
    status: 404, 
    statusText: 'Not Found' 
  });
});
```

**Ligne par ligne** :

```typescript
service.getUserById(999).subscribe({
  next: () => fail('Ne devrait pas réussir'),
  // → next : Callback si succès
  // → fail() : Force le test à échouer
  // → Si on arrive ici, c'est un bug (on attendait une erreur)
  
  error: (error) => {
    // → error : Callback si erreur
    // → error : HttpErrorResponse
    expect(error.status).toBe(404);
    // → Vérifie le code HTTP
  }
});

req.flush('Utilisateur non trouvé', { 
  status: 404, 
  statusText: 'Not Found' 
});
// → flush() avec status != 2xx simule une erreur
// → 'Utilisateur non trouvé' : Message d'erreur
// → status: 404 : Code HTTP
// → statusText: 'Not Found' : Texte du statut
```

**Syntaxe subscribe()** :
```typescript
// Ancienne syntaxe (deprecated)
observable.subscribe(
  (data) => { /* success */ },
  (error) => { /* error */ }
);

// Nouvelle syntaxe (recommandée)
observable.subscribe({
  next: (data) => { /* success */ },
  error: (error) => { /* error */ },
  complete: () => { /* complete */ }
});
```

---

### TEST 8 : Erreur 500

```typescript
it('devrait gérer une erreur 500', () => {
  service.getUsers().subscribe({
    next: () => fail('Ne devrait pas réussir'),
    error: (error) => {
      expect(error.status).toBe(500);
    }
  });
  
  const req = httpMock.expectOne('https://api.example.com/users');
  
  // Simuler une erreur serveur
  req.flush('Erreur serveur', { 
    status: 500, 
    statusText: 'Internal Server Error' 
  });
});
```

**Ce qui est testé** :
- Gestion des erreurs serveur (5xx)
- Le code d'erreur est bien 500

**Codes HTTP** :
- `2xx` : Succès (200 OK, 201 Created)
- `3xx` : Redirection
- `4xx` : Erreur client (404 Not Found, 400 Bad Request)
- `5xx` : Erreur serveur (500 Internal Server Error, 503 Service Unavailable)

---

### TEST 9 : Erreur réseau

```typescript
it('devrait gérer une erreur réseau', () => {
  service.getUsers().subscribe({
    next: () => fail('Ne devrait pas réussir'),
    error: (error) => {
      expect(error.error.type).toBe('error');
    }
  });
  
  const req = httpMock.expectOne('https://api.example.com/users');
  
  // Simuler une erreur réseau (pas de connexion)
  req.error(new ProgressEvent('error'), { status: 0 });
});
```

**Ligne par ligne** :

```typescript
req.error(new ProgressEvent('error'), { status: 0 });
// → error() : Simule une erreur réseau (pas HTTP)
// → ProgressEvent('error') : Événement d'erreur générique
// → status: 0 : Code spécial = pas de réponse HTTP
// → Exemples : pas de connexion, timeout, CORS
```

**Différence erreur HTTP vs réseau** :
```typescript
// Erreur HTTP (serveur répond)
req.flush('Error', { status: 404 })
// → status: 404
// → error.error: 'Error'

// Erreur réseau (serveur ne répond pas)
req.error(new ProgressEvent('error'), { status: 0 })
// → status: 0
// → error.error.type: 'error'
```

---

## <a name="tests-avances"></a>🧪 Tests avancés

### TEST 10 : Headers personnalisés

```typescript
it('devrait envoyer un token d\'authentification', () => {
  const token = 'Bearer abc123xyz';
  
  service.getUsersWithAuth(token).subscribe();
  
  const req = httpMock.expectOne('https://api.example.com/users');
  
  // Vérifier que le header Authorization est présent
  expect(req.request.headers.get('Authorization')).toBe(token);
  
  req.flush([]);
});
```

**Ligne par ligne** :

```typescript
expect(req.request.headers.get('Authorization')).toBe(token);
// → req.request.headers : HttpHeaders
// → .get('Authorization') : Récupère la valeur du header
// → Vérifie que le token est bien envoyé
```

**Méthode du service** :
```typescript
getUsersWithAuth(token: string): Observable<User[]> {
  const headers = { Authorization: token };
  //              ↑
  //              Objet simple converti en HttpHeaders
  return this.http.get<User[]>(this.apiUrl, { headers });
}
```

**Headers courants** :
```typescript
const headers = {
  'Authorization': 'Bearer token123',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Custom-Header': 'value'
};
```

---

### TEST 11 : Query parameters

```typescript
it('devrait envoyer des query parameters', () => {
  service.searchUsers('Alice', 25).subscribe();
  
  // Vérifier l'URL avec les paramètres
  const req = httpMock.expectOne(
    req => req.url === 'https://api.example.com/users' &&
           req.params.get('name') === 'Alice' &&
           req.params.get('age') === '25'
  );
  
  expect(req.request.method).toBe('GET');
  req.flush([]);
});
```

**Ligne par ligne** :

```typescript
const req = httpMock.expectOne(
  req => req.url === 'https://api.example.com/users' &&
         req.params.get('name') === 'Alice' &&
         req.params.get('age') === '25'
);
// → expectOne() avec fonction prédicat
// → Vérifie URL ET paramètres
// → req.params : HttpParams
// → .get('name') : Récupère la valeur du paramètre
```

**Méthode du service** :
```typescript
searchUsers(name: string, age?: number): Observable<User[]> {
  let params = new HttpParams().set('name', name);
  //                            ↑
  //                            Crée HttpParams et ajoute 'name'
  
  if (age) {
    params = params.set('age', age.toString());
    //              ↑
    //              HttpParams est immutable, on doit réassigner
  }
  
  return this.http.get<User[]>(this.apiUrl, { params });
}
```

**URL résultante** :
```
https://api.example.com/users?name=Alice&age=25
```

---

### TEST 12 : Query parameters optionnels

```typescript
it('devrait gérer les query parameters optionnels', () => {
  service.searchUsers('Bob').subscribe();
  
  const req = httpMock.expectOne(
    req => req.url === 'https://api.example.com/users' &&
           req.params.get('name') === 'Bob' &&
           req.params.get('age') === null  // Age non fourni
  );
  
  expect(req.request.method).toBe('GET');
  req.flush([]);
});
```

**Ce qui est testé** :
- Les paramètres optionnels ne sont pas ajoutés
- `params.get('age')` retourne `null` si absent

**URL résultante** :
```
https://api.example.com/users?name=Bob
```

---

### TEST 13 : Requêtes simultanées

```typescript
it('devrait gérer plusieurs requêtes HTTP simultanées', () => {
  const mockUser1: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
  const mockUser2: User = { id: 2, name: 'Bob', email: 'bob@example.com' };
  
  // Lancer 2 requêtes en parallèle
  service.getUserById(1).subscribe(user => {
    expect(user.name).toBe('Alice');
  });
  
  service.getUserById(2).subscribe(user => {
    expect(user.name).toBe('Bob');
  });
  
  // Récupérer les 2 requêtes
  const req1 = httpMock.expectOne('https://api.example.com/users/1');
  const req2 = httpMock.expectOne('https://api.example.com/users/2');
  
  // Répondre aux 2 requêtes
  req1.flush(mockUser1);
  req2.flush(mockUser2);
});
```

**Ce qui est testé** :
- Plusieurs requêtes en même temps
- Chaque requête est indépendante
- Les réponses sont correctement associées

**Pourquoi ce test ?**
- Dans une vraie app, plusieurs requêtes peuvent être lancées simultanément
- Vérifie qu'il n'y a pas de conflit
- Détecte les bugs de concurrence

---

## <a name="concepts"></a>🔑 Concepts clés

### Observables (RxJS)

```typescript
// Création d'un Observable
const observable$ = this.http.get<User[]>('/users');
// observable$ : Observable<User[]>
// $ : Convention de nommage pour les Observables

// Souscription (pour recevoir les données)
observable$.subscribe({
  next: (data) => console.log('Données', data),
  error: (err) => console.error('Erreur', err),
  complete: () => console.log('Terminé')
});

// Méthodes de transformation
observable$.pipe(
  map(users => users.filter(u => u.age > 18)),
  take(5),
  catchError(err => of([]))
).subscribe();
```

---

### HttpClient

```typescript
// GET
this.http.get<T>(url, options)

// POST
this.http.post<T>(url, body, options)

// PUT
this.http.put<T>(url, body, options)

// DELETE
this.http.delete<T>(url, options)

// PATCH
this.http.patch<T>(url, body, options)

// Options
const options = {
  headers: new HttpHeaders({ 'Authorization': 'Bearer token' }),
  params: new HttpParams().set('page', '1'),
  observe: 'response',  // Reçoit HttpResponse complet
  responseType: 'text'  // Pour réponses non-JSON
};
```

---

### HttpTestingController

```typescript
// Attendre une seule requête
const req = httpMock.expectOne(url);
const req = httpMock.expectOne(req => req.url === url);

// Attendre plusieurs requêtes
const reqs = httpMock.match(url);

// Simuler une réponse
req.flush(data);
req.flush(data, { status: 200, statusText: 'OK' });

// Simuler une erreur
req.flush('Error', { status: 404, statusText: 'Not Found' });
req.error(new ProgressEvent('error'), { status: 0 });

// Vérifier qu'il n'y a pas de requêtes en attente
httpMock.verify();
```

---

### Types TypeScript

```typescript
// Interface
export interface User {
  id?: number;      // ?: Propriété optionnelle
  name: string;
  email: string;
}

// Partial : Tous les champs optionnels
Partial<User>
// → { id?: number; name?: string; email?: string; }

// Required : Tous les champs obligatoires
Required<User>
// → { id: number; name: string; email: string; }

// Pick : Sélectionner certains champs
Pick<User, 'name' | 'email'>
// → { name: string; email: string; }

// Omit : Exclure certains champs
Omit<User, 'id'>
// → { name: string; email: string; }
```

---

## <a name="bonnes-pratiques"></a>✅ Bonnes pratiques

### 1. Toujours utiliser httpMock.verify()

```typescript
afterEach(() => {
  httpMock.verify();  // ← Détecte les requêtes oubliées
});
```

---

### 2. Typer les Observables

```typescript
// ✅ BON : Type explicite
getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}

// ❌ MAUVAIS : Pas de type
getUsers(): Observable<any> {
  return this.http.get(this.apiUrl);
}
```

---

### 3. Tester les erreurs

```typescript
// ✅ Toujours tester les cas d'erreur
it('devrait gérer une erreur 404', () => {
  service.getUserById(999).subscribe({
    next: () => fail('Ne devrait pas réussir'),
    error: (error) => {
      expect(error.status).toBe(404);
    }
  });
  
  const req = httpMock.expectOne('...');
  req.flush('Not Found', { status: 404, statusText: 'Not Found' });
});
```

---

### 4. Vérifier les headers et params

```typescript
// ✅ Vérifier que les bons headers sont envoyés
expect(req.request.headers.get('Authorization')).toBe('Bearer token');

// ✅ Vérifier que les bons params sont envoyés
expect(req.request.params.get('name')).toBe('Alice');
```

---

### 5. Tester les requêtes simultanées

```typescript
// ✅ Simuler plusieurs requêtes en même temps
service.getUserById(1).subscribe();
service.getUserById(2).subscribe();

const req1 = httpMock.expectOne('/users/1');
const req2 = httpMock.expectOne('/users/2');

req1.flush(mockUser1);
req2.flush(mockUser2);
```

---

## 📊 Couverture des tests

| Aspect | Tests |
|--------|-------|
| **Service créé** | Test 1 |
| **GET liste** | Test 2 |
| **GET par ID** | Test 3 |
| **POST** | Test 4 |
| **PUT** | Test 5 |
| **DELETE** | Test 6 |
| **Erreur 404** | Test 7 |
| **Erreur 500** | Test 8 |
| **Erreur réseau** | Test 9 |
| **Headers** | Test 10 |
| **Query params** | Tests 11, 12 |
| **Requêtes simultanées** | Test 13 |

**Couverture** : 100% ✅

---

## 🎓 Résumé

### Ce qu'on a appris

1. ✅ Utiliser HttpClient pour requêtes HTTP
2. ✅ Créer des Observables avec RxJS
3. ✅ Tester avec HttpTestingController
4. ✅ Mocker les réponses HTTP
5. ✅ Tester les erreurs (404, 500, réseau)
6. ✅ Gérer les headers (Authorization)
7. ✅ Gérer les query parameters
8. ✅ Tester des requêtes simultanées
9. ✅ Typer correctement avec TypeScript

### Points clés à retenir

- **HttpClientTestingModule** : Indispensable pour tests HTTP
- **httpMock.verify()** : TOUJOURS dans afterEach()
- **req.flush()** : Simule la réponse du serveur
- **Observables** : Pattern asynchrone de RxJS
- **subscribe()** : Nécessaire pour déclencher la requête
- **Typage** : `Observable<User[]>` pour typage fort
- **Erreurs** : Tester 404, 500, et erreurs réseau

---

**Document créé pour l'atelier de tests logiciels**  
*Explication complète des tests HTTP et asynchrones - 13 tests - Novembre 2024*
