import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="user-detail">
      <h1>Détail de l'utilisateur</h1>
      <p>ID de l'utilisateur : <strong>{{ userId }}</strong></p>
      <a routerLink="/">Retour à l'accueil</a>
    </div>
  `,
  styles: [`
    .user-detail {
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
export class UserDetailComponent implements OnInit {
  userId: string = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Récupérer le paramètre 'id' de l'URL
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }
}