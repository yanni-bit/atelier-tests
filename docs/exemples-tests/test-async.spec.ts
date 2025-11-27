// ==========================================================
// TESTS ASYNCHRONES / OBSERVABLES ANGULAR
// Teste les appels HTTP et streams de données
// ==========================================================

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService - Tests HTTP', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes en attente
    httpMock.verify();
  });
  
  // ==========================================================
  // TEST 1 : GET - Récupérer une liste
  // ==========================================================
  
  it('devrait récupérer une liste d\'utilisateurs', () => {
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    
    // Appel du service
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Alice');
    });
    
    // Intercepter la requête HTTP
    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    
    // Simuler la réponse
    req.flush(mockUsers);
  });
  
  // ==========================================================
  // TEST 2 : GET - Récupérer un élément par ID
  // ==========================================================
  
  it('devrait récupérer un utilisateur par ID', () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
    
    service.getUserById(1).subscribe(user => {
      expect(user.id).toBe(1);
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
    });
    
    const req = httpMock.expectOne('https://api.example.com/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
  
  // ==========================================================
  // TEST 3 : POST - Créer un élément
  // ==========================================================
  
  it('devrait créer un nouvel utilisateur', () => {
    const newUser = { name: 'Charlie', email: 'charlie@example.com' };
    const mockResponse = { id: 3, ...newUser };
    
    service.createUser(newUser).subscribe(user => {
      expect(user.id).toBe(3);
      expect(user.name).toBe('Charlie');
    });
    
    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });
  
  // ==========================================================
  // TEST 4 : PUT - Mettre à jour un élément
  // ==========================================================
  
  it('devrait mettre à jour un utilisateur', () => {
    const updatedUser = { id: 1, name: 'Alice Updated', email: 'alice.new@example.com' };
    
    service.updateUser(1, updatedUser).subscribe(user => {
      expect(user.name).toBe('Alice Updated');
      expect(user.email).toBe('alice.new@example.com');
    });
    
    const req = httpMock.expectOne('https://api.example.com/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });
  
  // ==========================================================
  // TEST 5 : DELETE - Supprimer un élément
  // ==========================================================
  
  it('devrait supprimer un utilisateur', () => {
    service.deleteUser(1).subscribe(response => {
      expect(response).toEqual({ success: true });
    });
    
    const req = httpMock.expectOne('https://api.example.com/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
  
  // ==========================================================
  // TEST 6 : Gestion d'erreur HTTP
  // ==========================================================
  
  it('devrait gérer une erreur 404', () => {
    service.getUserById(999).subscribe({
      next: () => fail('Ne devrait pas réussir'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe('Utilisateur non trouvé');
      }
    });
    
    const req = httpMock.expectOne('https://api.example.com/users/999');
    req.flush('Utilisateur non trouvé', { status: 404, statusText: 'Not Found' });
  });
  
  // ==========================================================
  // TEST 7 : Gestion d'erreur réseau
  // ==========================================================
  
  it('devrait gérer une erreur réseau', () => {
    service.getUsers().subscribe({
      next: () => fail('Ne devrait pas réussir'),
      error: (error) => {
        expect(error.error.type).toBe('error');
      }
    });
    
    const req = httpMock.expectOne('https://api.example.com/users');
    
    // Simuler une erreur réseau
    req.error(new ProgressEvent('error'), { status: 0 });
  });
  
  // ==========================================================
  // TEST 8 : Headers personnalisés
  // ==========================================================
  
  it('devrait envoyer un token d\'authentification', () => {
    const token = 'Bearer abc123';
    
    service.getUsersWithAuth(token).subscribe();
    
    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.headers.get('Authorization')).toBe(token);
    req.flush([]);
  });
  
  // ==========================================================
  // TEST 9 : Query parameters
  // ==========================================================
  
  it('devrait envoyer des query parameters', () => {
    service.searchUsers('Alice', 25).subscribe();
    
    const req = httpMock.expectOne(
      req => req.url === 'https://api.example.com/users' &&
             req.params.get('name') === 'Alice' &&
             req.params.get('age') === '25'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});


// ==========================================================
// TESTS D'OBSERVABLES / RXJS
// ==========================================================

import { of, throwError, delay } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('Tests Observables / RxJS', () => {
  
  // ==========================================================
  // TEST 10 : Observable simple
  // ==========================================================
  
  it('devrait émettre une valeur', (done) => {
    const observable$ = of('Hello');
    
    observable$.subscribe(value => {
      expect(value).toBe('Hello');
      done();  // Signale que le test asynchrone est terminé
    });
  });
  
  // ==========================================================
  // TEST 11 : Observable avec délai (fakeAsync)
  // ==========================================================
  
  it('devrait émettre après 1000ms', fakeAsync(() => {
    const observable$ = of('Delayed').pipe(delay(1000));
    let result = '';
    
    observable$.subscribe(value => {
      result = value;
    });
    
    // Avance le temps de 1000ms
    tick(1000);
    
    expect(result).toBe('Delayed');
  }));
  
  // ==========================================================
  // TEST 12 : Observable avec erreur
  // ==========================================================
  
  it('devrait gérer une erreur', (done) => {
    const observable$ = throwError(() => new Error('Erreur test'));
    
    observable$.subscribe({
      next: () => fail('Ne devrait pas émettre de valeur'),
      error: (error) => {
        expect(error.message).toBe('Erreur test');
        done();
      }
    });
  });
});


// ==========================================================
// SERVICE EXEMPLE : user.service.ts
// ==========================================================

/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
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
  
  getUsersWithAuth(token: string): Observable<User[]> {
    const headers = { Authorization: token };
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
  
  searchUsers(name: string, age: number): Observable<User[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('age', age.toString());
    
    return this.http.get<User[]>(this.apiUrl, { params });
  }
}
*/
