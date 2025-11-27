import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { AuthService } from '../auth.service';

describe('Tests de Routing', () => {
  let router: Router;
  let location: Location;
  let authService: AuthService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        AuthService
      ]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    
    // Initialiser le router
    await router.navigate(['']);
  });
  
  // ==========================================================
  // TEST 1 : Route par défaut (/)
  // ==========================================================
  
  it('devrait charger la route par défaut /', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('');
  });
  
  // ==========================================================
  // TEST 2 : Navigation vers /about
  // ==========================================================
  
  it('devrait naviguer vers /about', async () => {
    await router.navigate(['/about']);
    expect(location.path()).toBe('/about');
  });
  
  // ==========================================================
  // TEST 3 : Navigation avec paramètre /user/:id
  // ==========================================================
  
  it('devrait naviguer vers /user/123', async () => {
    await router.navigate(['/user', 123]);
    expect(location.path()).toBe('/user/123');
  });
  
  // ==========================================================
  // TEST 4 : Navigation avec string comme paramètre
  // ==========================================================
  
  it('devrait naviguer vers /user/alice', async () => {
    await router.navigate(['/user', 'alice']);
    expect(location.path()).toBe('/user/alice');
  });
  
  // ==========================================================
  // TEST 5 : Route invalide redirige vers /
  // ==========================================================
  
  it('devrait rediriger vers / si route invalide', async () => {
    await router.navigate(['/route-qui-nexiste-pas']);
    expect(location.path()).toBe('');
  });
  
  // ==========================================================
  // TEST 6 : AuthGuard - Bloquer accès sans authentification
  // ==========================================================
  
  it('devrait bloquer l\'accès à /protected sans authentification', async () => {
    authService.logout();
    
    const result = await router.navigate(['/protected']);
    
    // La navigation échoue
    expect(result).toBeFalsy();
    // Redirigé vers /login
    expect(location.path()).toBe('/login');
  });
  
  // ==========================================================
  // TEST 7 : AuthGuard - Autoriser accès avec authentification
  // ==========================================================
  
  it('devrait autoriser l\'accès à /protected avec authentification', async () => {
    authService.login();
    
    const result = await router.navigate(['/protected']);
    
    // La navigation réussit
    expect(result).toBeTruthy();
    // On est bien sur /protected
    expect(location.path()).toBe('/protected');
  });
  
  // ==========================================================
  // TEST 8 : Navigation multiple
  // ==========================================================
  
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
});


// ==========================================================
// TESTS DU SERVICE AuthService
// ==========================================================

describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });
  
  // ==========================================================
  // TEST 9 : Service créé
  // ==========================================================
  
  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 10 : État initial - déconnecté
  // ==========================================================
  
  it('devrait être déconnecté par défaut', () => {
    expect(service.isLoggedIn()).toBeFalsy();
  });
  
  // ==========================================================
  // TEST 11 : Connexion
  // ==========================================================
  
  it('devrait connecter l\'utilisateur', () => {
    service.login();
    expect(service.isLoggedIn()).toBeTruthy();
  });
  
  // ==========================================================
  // TEST 12 : Déconnexion
  // ==========================================================
  
  it('devrait déconnecter l\'utilisateur', () => {
    service.login();
    expect(service.isLoggedIn()).toBeTruthy();
    
    service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });
  
  // ==========================================================
  // TEST 13 : Cycle connexion/déconnexion
  // ==========================================================
  
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
});