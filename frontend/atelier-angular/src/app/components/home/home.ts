import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <h1>Page d'accueil</h1>
      <nav>
        <a routerLink="/about">Aller à About</a>
        <a routerLink="/user/123">Profil utilisateur</a>
        <a routerLink="/protected">Page protégée</a>
      </nav>
    </div>
  `,
  styles: [`
    .home {
      padding: 20px;
    }
    nav {
      margin-top: 20px;
      display: flex;
      gap: 15px;
    }
    a {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    a:hover {
      background-color: #0056b3;
    }
  `]
})
export class HomeComponent {}