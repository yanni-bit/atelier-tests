import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about">
      <h1>À propos</h1>
      <p>Ceci est la page À propos de notre application.</p>
      <a routerLink="/">Retour à l'accueil</a>
    </div>
  `,
  styles: [`
    .about {
      padding: 20px;
    }
    a {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 15px;
      background-color: #6c757d;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    a:hover {
      background-color: #5a6268;
    }
  `]
})
export class AboutComponent {}