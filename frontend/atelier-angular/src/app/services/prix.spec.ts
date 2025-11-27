import { TestBed } from '@angular/core/testing';
import { PrixService } from './prix';

describe('PrixService', () => {
  let service: PrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrixService]
    });
    service = TestBed.inject(PrixService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait calculer le prix TTC correctement', () => {
    const resultat = service.calculTTC(100);
    expect(resultat).toBe(120);
  });

  it('devrait appliquer une remise de 10%', () => {
    const resultat = service.appliquerRemise(100, 10);
    expect(resultat).toBe(90);
  });

  it('devrait retourner le prix initial si remise = 0', () => {
    expect(service.appliquerRemise(100, 0)).toBe(100);
  });
});