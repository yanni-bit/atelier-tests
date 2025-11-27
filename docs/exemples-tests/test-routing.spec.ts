// ==========================================================
// TESTS DE ROUTING ANGULAR
// Teste la navigation, guards et paramètres
// ==========================================================

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// Composants de test
@Component({ template: 'Home' })
class HomeComponent {}

@Component({ template: 'About' })
class AboutComponent {}

@Component({ template: 'User {{id}}' })
class UserComponent {}

// Routes de test
const routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'user/:id', component: UserComponent }
];

describe('Tests de Routing', () => {
  let router: Router;
  let location: Location;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });
  
  // ==========================================================
  // TEST 1 : Navigation simple
  // ==========================================================
  
  it('devrait naviguer vers /about', async () => {
    await router.navigate(['/about']);
    
    expect(location.path()).toBe('/about');
  });
  
  // ==========================================================
  // TEST 2 : Navigation avec paramètre
  // ==========================================================
  
  it('devrait naviguer vers /user/123', async () => {
    await router.navigate(['/user', 123]);
    
    expect(location.path()).toBe('/user/123');
  });
  
  // ==========================================================
  // TEST 3 : Redirection
  // ==========================================================
  
  it('devrait rediriger vers home si route invalide', async () => {
    try {
      await router.navigate(['/invalid-route']);
    } catch (error) {
      // Route non trouvée
    }
    
    // Devrait rester sur la route actuelle ou rediriger
    expect(location.path()).not.toBe('/invalid-route');
  });
});


// ==========================================================
// TESTS DE GUARDS (AuthGuard)
// ==========================================================

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

// Service d'authentification mock
class AuthService {
  private loggedIn = false;
  
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

// Guard
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn();
};

describe('AuthGuard', () => {
  let authService: AuthService;
  let router: Router;
  
  beforeEach(() => {
    authService = new AuthService();
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([
          { path: 'login', component: HomeComponent },
          { path: 'protected', component: AboutComponent, canActivate: [authGuard] }
        ])
      ]
    });
    
    router = TestBed.inject(Router);
  });
  
  // ==========================================================
  // TEST 4 : Bloquer accès si non connecté
  // ==========================================================
  
  it('devrait bloquer l\'accès à une route protégée', async () => {
    authService.logout();
    
    const canActivate = await router.navigate(['/protected']);
    
    expect(canActivate).toBeFalsy();
  });
  
  // ==========================================================
  // TEST 5 : Autoriser accès si connecté
  // ==========================================================
  
  it('devrait autoriser l\'accès si connecté', async () => {
    authService.login();
    
    const canActivate = await router.navigate(['/protected']);
    
    expect(canActivate).toBeTruthy();
  });
});


// ==========================================================
// TESTS D'ACTIVATION DE ROUTE
// ==========================================================

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ActivatedRoute - Paramètres', () => {
  
  it('devrait récupérer les paramètres de route', () => {
    const route = {
      params: of({ id: '123' }),
      queryParams: of({ search: 'test' })
    } as unknown as ActivatedRoute;
    
    route.params.subscribe(params => {
      expect(params['id']).toBe('123');
    });
    
    route.queryParams.subscribe(queryParams => {
      expect(queryParams['search']).toBe('test');
    });
  });
});


// ==========================================================
// EXEMPLE : Composant qui utilise ActivatedRoute
// ==========================================================

/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h2>Utilisateur #{{ userId }}</h2>
      <p>Recherche : {{ searchTerm }}</p>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  userId: string = '';
  searchTerm: string = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Récupérer le paramètre d'URL
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    
    // Récupérer les query params
    this.route.queryParams.subscribe(queryParams => {
      this.searchTerm = queryParams['search'] || '';
    });
  }
}
*/
