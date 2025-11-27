import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrixService {

  constructor() { }

  /**
   * Calcule le prix TTC (TVA 20%)
   */
  calculTTC(prix: number): number {
    return prix * 1.2;
  }

  /**
   * Applique une remise en pourcentage
   */
  appliquerRemise(prix: number, remise: number): number {
    return prix * (1 - remise / 100);
  }
}