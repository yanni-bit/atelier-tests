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
  
  /**
   * Récupère tous les utilisateurs
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  /**
   * Récupère un utilisateur par ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Crée un nouvel utilisateur
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  /**
   * Met à jour un utilisateur
   */
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  
  /**
   * Supprime un utilisateur
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Recherche des utilisateurs avec paramètres
   */
  searchUsers(name: string, age?: number): Observable<User[]> {
    let params = new HttpParams().set('name', name);
    
    if (age) {
      params = params.set('age', age.toString());
    }
    
    return this.http.get<User[]>(this.apiUrl, { params });
  }
  
  /**
   * Récupère des utilisateurs avec token d'authentification
   */
  getUsersWithAuth(token: string): Observable<User[]> {
    const headers = { Authorization: token };
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}
