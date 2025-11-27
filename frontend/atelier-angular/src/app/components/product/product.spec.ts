import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product';
import { PrixService } from '../../services/prix';

// ==========================================================
// TESTS D'INTÉGRATION
// Teste le composant ProductComponent + le service PrixService
// ==========================================================

describe('ProductComponent - Tests d\'intégration', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let prixService: PrixService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [PrixService]  // ← Service RÉEL (pas de mock)
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    prixService = TestBed.inject(PrixService);  // Récupère l'instance réelle
    fixture.detectChanges();
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 1 : Initialisation
  // Vérifie que le composant ET le service fonctionnent ensemble
  // ==========================================================
  
  it('devrait calculer le prix TTC à l\'initialisation via le service', () => {
    // Le composant appelle prixService.calculTTC() dans le constructor
    
    expect(component.prixHT).toBe(1000);
    expect(component.prixTTC).toBe(1200);  // 1000 * 1.2
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 2 : Interaction complète
  // Simule le parcours utilisateur : affichage → clic → calcul
  // ==========================================================
  
  it('devrait afficher le prix TTC calculé par le service dans le DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Vérifie que le DOM affiche le prix calculé par le service
    expect(compiled.textContent).toContain('Prix HT : 1000€');
    expect(compiled.textContent).toContain('Prix TTC : 1200€');
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 3 : Interaction bouton → service → DOM
  // Teste le flux complet : clic → appel service → mise à jour DOM
  // ==========================================================
  
  it('devrait appliquer une remise via le service et mettre à jour le DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    
    // État initial
    expect(component.remise).toBe(0);
    expect(component.prixApresRemise).toBe(0);
    
    // Simule le clic utilisateur
    button.click();
    fixture.detectChanges();
    
    // Vérifie que le service a été appelé et le résultat est correct
    expect(component.remise).toBe(10);
    expect(component.prixApresRemise).toBe(1080);  // 1200 - 10% = 1080
    
    // Vérifie que le DOM est mis à jour
    expect(compiled.textContent).toContain('Remise : 10%');
    expect(compiled.textContent).toContain('Prix après remise : 1080€');
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 4 : Enchaînement de plusieurs actions
  // Teste un scénario réel complet
  // ==========================================================
  
  it('devrait gérer un scénario complet : initialisation → remise → affichage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // ÉTAPE 1 : Vérifier l'initialisation
    expect(component.prixTTC).toBe(1200);
    
    // ÉTAPE 2 : Appliquer une première remise
    component.appliquerRemise(10);
    fixture.detectChanges();
    expect(component.prixApresRemise).toBe(1080);
    
    // ÉTAPE 3 : Appliquer une deuxième remise (sur le prix TTC initial)
    component.appliquerRemise(20);
    fixture.detectChanges();
    expect(component.prixApresRemise).toBe(960);  // 1200 - 20% = 960
    
    // ÉTAPE 4 : Vérifier l'affichage final
    expect(compiled.textContent).toContain('Prix après remise : 960€');
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 5 : Vérifier que le vrai service est utilisé
  // Pas de mock = on teste la vraie intégration
  // ==========================================================
  
  it('devrait utiliser le vrai PrixService (pas un mock)', () => {
    // Espionner la méthode du service
    const spy = spyOn(prixService, 'calculTTC').and.callThrough();
    
    // Appeler la méthode du composant qui utilise le service
    component.calculerPrixTTC();
    
    // Vérifier que le vrai service a été appelé
    expect(spy).toHaveBeenCalledWith(1000);
    expect(component.prixTTC).toBe(1200);
  });
  
  // ==========================================================
  // TEST D'INTÉGRATION 6 : Changement d'input et recalcul
  // Teste la réactivité composant ↔ service
  // ==========================================================
  
  it('devrait recalculer les prix quand le prixHT change', () => {
    // Changer le prix HT
    component.prixHT = 500;
    component.calculerPrixTTC();
    
    // Vérifier que le service a bien recalculé
    expect(component.prixTTC).toBe(600);  // 500 * 1.2
    
    // Appliquer une remise sur le nouveau prix
    component.appliquerRemise(10);
    expect(component.prixApresRemise).toBe(540);  // 600 - 10%
  });
});


// ==========================================================
// DIFFÉRENCE ENTRE TESTS UNITAIRES ET TESTS D'INTÉGRATION
// ==========================================================

describe('ProductComponent - Test UNITAIRE (avec mock)', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockPrixService: jasmine.SpyObj<PrixService>;
  
  beforeEach(async () => {
    // Créer un MOCK du service
    mockPrixService = jasmine.createSpyObj('PrixService', ['calculTTC', 'appliquerRemise']);
    
    // Configurer les valeurs de retour du mock
    mockPrixService.calculTTC.and.returnValue(1500);
    mockPrixService.appliquerRemise.and.returnValue(1350);
    
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: PrixService, useValue: mockPrixService }  // ← Mock au lieu du vrai service
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  // ==========================================================
  // TEST UNITAIRE : Teste SEULEMENT le composant
  // Le service est mocké → on ne teste pas son implémentation
  // ==========================================================
  
  it('devrait appeler le service avec les bons paramètres (test unitaire)', () => {
    // Vérifier que le service a été appelé
    expect(mockPrixService.calculTTC).toHaveBeenCalledWith(1000);
    
    // Vérifier que le composant utilise la valeur retournée par le mock
    expect(component.prixTTC).toBe(1500);  // Valeur du mock, pas le vrai calcul
  });
  
  it('devrait utiliser la valeur retournée par le service mocké', () => {
    component.appliquerRemise(10);
    
    // Vérifie que le mock a été appelé
    expect(mockPrixService.appliquerRemise).toHaveBeenCalledWith(1500, 10);
    
    // Vérifie que le composant utilise la valeur mockée
    expect(component.prixApresRemise).toBe(1350);  // Valeur du mock
  });
});


// ==========================================================
// RÉSUMÉ DES DIFFÉRENCES
// ==========================================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ TEST UNITAIRE                                                   │
├─────────────────────────────────────────────────────────────────┤
│ - Teste UN seul composant/service isolé                        │
│ - Utilise des MOCKS pour les dépendances                       │
│ - Rapide (pas de vraies dépendances)                           │
│ - Vérifie la logique interne du composant                      │
│ - Exemple : "Le composant appelle-t-il le service ?"           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TEST D'INTÉGRATION                                              │
├─────────────────────────────────────────────────────────────────┤
│ - Teste PLUSIEURS composants/services ensemble                 │
│ - Utilise les VRAIES dépendances (pas de mock)                 │
│ - Plus lent (vraies instanciations)                            │
│ - Vérifie que tout fonctionne ensemble                         │
│ - Exemple : "Le composant + service calculent-ils bien ?"      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ QUAND UTILISER QUOI ?                                           │
├─────────────────────────────────────────────────────────────────┤
│ Tests unitaires :                                               │
│   - Développement (TDD)                                         │
│   - Tests rapides et nombreux                                   │
│   - Logique métier complexe                                     │
│                                                                 │
│ Tests d'intégration :                                           │
│   - Vérifier que tout fonctionne ensemble                       │
│   - Avant le déploiement                                        │
│   - Flux utilisateur critiques                                  │
└─────────────────────────────────────────────────────────────────┘
*/