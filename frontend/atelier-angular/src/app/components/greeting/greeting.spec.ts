import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting';

describe('GreetingComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreetingComponent]  // ← IMPORTS au lieu de declarations
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre dans un h1', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    
    expect(h1?.textContent).toContain('Application de test');
  });

  it('devrait afficher le message de bienvenue si userName est défini', () => {
    component.userName = 'Alice';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');
    
    expect(paragraph?.textContent).toContain('Bienvenue, Alice !');
  });

  it('devrait incrémenter clickCount lors du clic', () => {
    const button = fixture.nativeElement.querySelector('button');
    
    expect(component.clickCount).toBe(0);
    button.click();
    expect(component.clickCount).toBe(1);
  });
});