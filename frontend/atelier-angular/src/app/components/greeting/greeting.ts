import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './greeting.html',
  styleUrl: './greeting.css'
})
export class GreetingComponent {
  @Input() title = 'Application de test';
  @Input() userName: string = '';
  
  clickCount = 0;
  
  onButtonClick(): void {
    this.clickCount++;
  }
}