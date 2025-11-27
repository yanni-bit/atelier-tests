import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user';

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
    // Vérifie qu'il n'y a pas de requêtes HTTP en attente
    httpMock.verify();
  });
  
  // ==========================================================
  // TEST 1 : Service créé
  // ==========================================================
  
  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 2 : GET - Récupérer tous les utilisateurs
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 3 : GET - Récupérer un utilisateur par ID
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 4 : POST - Créer un utilisateur
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 5 : PUT - Mettre à jour un utilisateur
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 6 : DELETE - Supprimer un utilisateur
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
  // TEST 7 : Gestion d'erreur 404
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 8 : Gestion d'erreur 500
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 9 : Gestion d'erreur réseau
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 10 : Headers personnalisés (Authorization)
  // ==========================================================
  
  it('devrait envoyer un token d\'authentification', () => {
    const token = 'Bearer abc123xyz';
    
    service.getUsersWithAuth(token).subscribe();
    
    const req = httpMock.expectOne('https://api.example.com/users');
    
    // Vérifier que le header Authorization est présent
    expect(req.request.headers.get('Authorization')).toBe(token);
    
    req.flush([]);
  });
  
  // ==========================================================
  // TEST 11 : Query parameters
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 12 : Query parameters optionnels
  // ==========================================================
  
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
  
  // ==========================================================
  // TEST 13 : Plusieurs requêtes simultanées
  // ==========================================================
  
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
});