import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrixService } from '../../services/prix';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product">
      <h2>{{ productName }}</h2>
      <p>Prix HT : {{ prixHT }}€</p>
      <p>Prix TTC : {{ prixTTC }}€</p>
      <p *ngIf="remise > 0">Remise : {{ remise }}%</p>
      <p *ngIf="remise > 0">Prix après remise : {{ prixApresRemise }}€</p>
      <button (click)="appliquerRemise(10)">Appliquer remise -10%</button>
    </div>
  `,
  styles: [`
    .product {
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 8px;
    }
    button {
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ProductComponent {
  @Input() productName = 'Ordinateur portable';
  @Input() prixHT = 1000;
  
  prixTTC = 0;
  remise = 0;
  prixApresRemise = 0;
  
  constructor(private prixService: PrixService) {
    this.calculerPrixTTC();
  }
  
  calculerPrixTTC(): void {
    this.prixTTC = this.prixService.calculTTC(this.prixHT);
  }
  
  appliquerRemise(pourcentage: number): void {
    this.remise = pourcentage;
    this.prixApresRemise = this.prixService.appliquerRemise(this.prixTTC, pourcentage);
  }
}