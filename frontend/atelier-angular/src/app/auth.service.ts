import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  
  constructor() { }
  
  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  
  /**
   * Connecte l'utilisateur
   */
  login(): void {
    this.loggedIn = true;
  }
  
  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.loggedIn = false;
  }
}