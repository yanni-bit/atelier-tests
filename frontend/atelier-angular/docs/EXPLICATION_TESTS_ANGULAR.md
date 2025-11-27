# 🅰️ Explication des tests Angular - Ce qui s'est passé

**Projet** : atelier-angular  
**Framework de tests** : Jasmine + Karma  
**Version Angular** : 20  
**Date** : 27 novembre 2024

> **Note** : Angular 20 utilise une nomenclature simplifiée :
> - `greeting.ts` au lieu de `greeting.component.ts`
> - `greeting.html` au lieu de `greeting.component.html`
> - `greeting.css` au lieu de `greeting.component.css`
> - `greeting.spec.ts` au lieu de `greeting.component.spec.ts`

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-ensemble)
2. [Processus de création](#processus-creation)
3. [Problèmes rencontrés et solutions](#problemes)
4. [Architecture finale](#architecture)
5. [Explication détaillée des tests](#tests-detailles)
6. [Ce que Karma et Jasmine font en coulisses](#coulisses)

---

## <a name="vue-ensemble"></a>🎯 Vue d'ensemble

### Résultat final

```
✅ 10 tests exécutés
✅ 10 tests réussis
✅ 0 échec
⏱️  Temps d'exécution : 0.121 secondes
```

### Fichiers testés

1. **Service Prix** : `src/app/services/prix.ts`
   - 4 tests sur le service de calcul de prix

2. **Composant Greeting** : `src/app/components/greeting/greeting.ts`
   - 4 tests sur le composant d'accueil (+ 2 tests par défaut du projet)

---

## <a name="processus-creation"></a>🏗️ Processus de création du projet Angular

### Étape 1 : Création du projet

```powershell
ng new atelier-angular --routing=false --style=css
```

**Ce qui se passe** :
- Angular CLI crée la structure du projet
- Installe automatiquement Jasmine et Karma
- Configure le fichier `karma.conf.js`
- Crée `src/test.ts` (point d'entrée des tests)

### Étape 2 : Génération du service

```powershell
ng generate service services/prix
```

**Fichiers créés automatiquement** :
```
src/app/services/
├── prix.ts        ← Service (Angular 20 : nom simplifié)
└── prix.spec.ts   ← Tests (générés automatiquement !)
```

**Ce qui est généré dans `prix.spec.ts`** :
```typescript
import { TestBed } from '@angular/core/testing';
import { PrixService } from './prix.service';

describe('PrixService', () => {
  let service: PrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Étape 3 : Génération du composant

```powershell
ng generate component components/greeting
```

**Fichiers créés automatiquement** :
```
src/app/components/greeting/
├── greeting.ts         ← Composant (Angular 20 : nom simplifié)
├── greeting.html       ← Template
├── greeting.css        ← Styles
└── greeting.spec.ts    ← Tests (générés automatiquement !)
```

---

## <a name="problemes"></a>🔧 Problèmes rencontrés et solutions

### Problème 1 : Composant standalone vs module

**Erreur rencontrée** :
```
Error: Unexpected "GreetingComponent" found in the "declarations" array
GreetingComponent is marked as standalone and can't be declared in any NgModule
```

**Cause** :
Angular 19 génère par défaut des **composants standalone** (autonomes), pas des composants de module.

**Solution appliquée** :

Dans `greeting.ts` (Angular 20 : nomenclature simplifiée) :
```typescript
@Component({
  selector: 'app-greeting',
  standalone: true,              // ← Marqué comme standalone
  imports: [CommonModule],       // ← Import des dépendances ici
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.css'
})
```

Dans `greeting.spec.ts` :
```typescript
await TestBed.configureTestingModule({
  imports: [GreetingComponent]   // ← IMPORTS (pas declarations)
})
```

**Explication** :
- **Avant Angular 15** : Les composants devaient être déclarés dans un `NgModule`
- **Après Angular 15** : Les composants peuvent être **standalone** (autonomes)
- **Standalone** = Le composant importe directement ses propres dépendances

---

### Problème 2 : Directive *ngIf non reconnue

**Erreur rencontrée** :
```
Error: Can't bind to 'ngIf' since it isn't a known property of 'p'
```

**Cause** :
Le composant utilise `*ngIf` dans son template mais n'importe pas `CommonModule`.

**Template HTML** :
```html
<p *ngIf="userName">Bienvenue, {{ userName }} !</p>
```

**Solution** :
```typescript
import { CommonModule } from '@angular/common';

@Component({
  // ...
  imports: [CommonModule],  // ← Nécessaire pour *ngIf, *ngFor, pipes...
})
```

**Pourquoi ?**
- `*ngIf` fait partie des directives du `CommonModule`
- Les composants standalone doivent importer explicitement leurs dépendances
- Avant (modules) : CommonModule importé dans AppModule → disponible partout
- Maintenant (standalone) : Chaque composant importe ce dont il a besoin

---

### Problème 3 : Template par défaut

**Erreur de test** :
```
Expected 'greeting works!' to contain 'Bienvenue, Alice !'
```

**Cause** :
Angular CLI génère automatiquement un template par défaut :
```html
<p>greeting works!</p>
```

**Solution** :
Remplacer le contenu par notre template personnalisé sans garder la ligne générée automatiquement.

---

## <a name="architecture"></a>🏛️ Architecture finale des tests

### Structure du TestBed

**TestBed** = Environnement de test Angular qui simule un module Angular

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [GreetingComponent]  // Import du composant standalone
  })
  .compileComponents();           // Compile les templates
  
  fixture = TestBed.createComponent(GreetingComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();        // Lance la détection de changements
});
```

**Explication ligne par ligne** :

1. **`TestBed.configureTestingModule({})`**
   - Crée un module de test isolé
   - Configure les imports/providers nécessaires
   - Équivalent à un `@NgModule` pour les tests

2. **`imports: [GreetingComponent]`**
   - Importe le composant standalone
   - Le composant apporte ses propres dépendances (CommonModule)

3. **`.compileComponents()`**
   - Compile les templates HTML
   - Traite les fichiers externes (templateUrl, styleUrl)
   - Retourne une Promise (d'où le `await`)

4. **`TestBed.createComponent(GreetingComponent)`**
   - Crée une instance du composant
   - Retourne un `ComponentFixture` (wrapper de test)

5. **`fixture.componentInstance`**
   - Accède à l'instance réelle du composant
   - Permet de tester les propriétés et méthodes

6. **`fixture.detectChanges()`**
   - Lance le cycle de détection de changements Angular
   - Met à jour le DOM avec les données du composant
   - Équivalent au lifecycle `ngOnInit()`

---

## <a name="tests-detailles"></a>🧪 Explication détaillée des tests

### Test 1 : Service - Création

```typescript
it('devrait être créé', () => {
  expect(service).toBeTruthy();
});
```

**Ce qui se passe** :
1. `beforeEach()` a injecté le service via `TestBed.inject(PrixService)`
2. Le test vérifie que `service` n'est pas `null`, `undefined`, `false`, `0`, ou `""`
3. `.toBeTruthy()` passe si la valeur est "truthy" (vraie en contexte booléen)

**Pourquoi ce test ?**
- Vérifie que l'injection de dépendances fonctionne
- Confirme que le service est correctement configuré
- Test de base obligatoire dans Angular

---

### Test 2 : Service - Calcul TTC

```typescript
it('devrait calculer le prix TTC correctement', () => {
  const resultat = service.calculTTC(100);
  expect(resultat).toBe(120);
});
```

**Ce qui se passe** :
1. Appelle la méthode `calculTTC(100)` du service
2. Le service fait : `100 * 1.2 = 120`
3. Compare le résultat avec `.toBe(120)`

**Pattern AAA appliqué** :
- **Arrange** : `const resultat =` (préparation)
- **Act** : `service.calculTTC(100)` (action)
- **Assert** : `expect(resultat).toBe(120)` (vérification)

---

### Test 3 : Service - Remise

```typescript
it('devrait appliquer une remise de 10%', () => {
  const resultat = service.appliquerRemise(100, 10);
  expect(resultat).toBe(90);
});
```

**Calcul effectué** :
```javascript
prix * (1 - remise / 100)
100 * (1 - 10 / 100)
100 * (1 - 0.1)
100 * 0.9
= 90
```

---

### Test 4 : Service - Cas limite

```typescript
it('devrait retourner le prix initial si remise = 0', () => {
  expect(service.appliquerRemise(100, 0)).toBe(100);
});
```

**Pourquoi tester ce cas ?**
- Vérifie le comportement avec une valeur extrême (0%)
- Confirme qu'aucune erreur ne se produit
- Important pour la robustesse du code

---

### Test 5 : Composant - Création

```typescript
it('devrait être créé', () => {
  expect(component).toBeTruthy();
});
```

**Ce qui se passe** :
1. `beforeEach()` a créé le composant via `TestBed.createComponent()`
2. Vérifie que l'instance du composant existe
3. Confirme que le composant s'initialise sans erreur

---

### Test 6 : Composant - Affichage du titre

```typescript
it('devrait afficher le titre dans un h1', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  const h1 = compiled.querySelector('h1');
  
  expect(h1?.textContent).toContain('Application de test');
});
```

**Ce qui se passe étape par étape** :

1. **`fixture.nativeElement`**
   - Accède au DOM réel généré par le composant
   - Type : `HTMLElement` (élément HTML natif)

2. **`compiled.querySelector('h1')`**
   - Cherche le premier élément `<h1>` dans le DOM
   - Retourne l'élément ou `null` si non trouvé

3. **`h1?.textContent`**
   - `?` = optional chaining (évite l'erreur si h1 est null)
   - `.textContent` = contenu texte de l'élément
   - Exemple : `<h1>Mon titre</h1>` → textContent = "Mon titre"

4. **`.toContain('Application de test')`**
   - Vérifie que la chaîne contient le texte recherché
   - Passe si "Application de test" est présent n'importe où dans le texte

**Flux complet** :
```
Component → Template → DOM → Vérification
   ↓           ↓        ↓         ↓
title    {{ title }}   <h1>    textContent
```

---

### Test 7 : Composant - Affichage conditionnel

```typescript
it('devrait afficher le message de bienvenue si userName est défini', () => {
  component.userName = 'Alice';
  fixture.detectChanges();
  
  const compiled = fixture.nativeElement as HTMLElement;
  const paragraph = compiled.querySelector('p');
  
  expect(paragraph?.textContent).toContain('Bienvenue, Alice !');
});
```

**Ce qui se passe** :

1. **`component.userName = 'Alice'`**
   - Modifie directement la propriété du composant
   - À ce stade, le DOM n'est PAS encore mis à jour

2. **`fixture.detectChanges()`**
   - **CRUCIAL** : Force Angular à mettre à jour le DOM
   - Exécute le cycle de détection de changements
   - Le `*ngIf` est réévalué
   - Le template est re-rendu

3. **Vérification du DOM**
   - Cherche le `<p>` qui devrait maintenant être visible
   - Vérifie que le texte contient "Bienvenue, Alice !"

**Template correspondant** :
```html
<p *ngIf="userName">Bienvenue, {{ userName }} !</p>
```

**Avant `detectChanges()`** :
- `userName` = `""` (vide)
- `*ngIf="userName"` = `false`
- Le `<p>` n'existe pas dans le DOM

**Après `detectChanges()`** :
- `userName` = `"Alice"`
- `*ngIf="userName"` = `true`
- Le `<p>` est créé avec "Bienvenue, Alice !"

---

### Test 8 : Composant - Interaction utilisateur

```typescript
it('devrait incrémenter clickCount lors du clic', () => {
  const button = fixture.nativeElement.querySelector('button');
  
  expect(component.clickCount).toBe(0);
  
  button.click();
  
  expect(component.clickCount).toBe(1);
});
```

**Ce qui se passe** :

1. **`querySelector('button')`**
   - Récupère le bouton du DOM
   - Type : `HTMLButtonElement`

2. **`expect(component.clickCount).toBe(0)`**
   - Vérifie l'état initial
   - `clickCount` devrait être à 0 au départ

3. **`button.click()`**
   - **Simule un clic utilisateur**
   - Déclenche l'événement `(click)` du template
   - Angular appelle automatiquement `onButtonClick()`

4. **Méthode appelée dans le composant** :
   ```typescript
   onButtonClick(): void {
     this.clickCount++;
   }
   ```

5. **`expect(component.clickCount).toBe(1)`**
   - Vérifie que le compteur a bien été incrémenté
   - Confirme que l'événement a été traité

**Flux complet** :
```
Test → DOM → Angular → Composant → Vérification
 ↓      ↓       ↓         ↓            ↓
click  <button> (click)  method     clickCount++
```

---

## <a name="coulisses"></a>⚙️ Ce que Karma et Jasmine font en coulisses

### Karma (Test Runner)

**Rôle** : Orchestrer l'exécution des tests

**Ce qui se passe quand tu lances `ng test`** :

1. **Compilation du projet**
   ```
   ✓ Compilation TypeScript → JavaScript
   ✓ Compilation SCSS/CSS
   ✓ Bundling avec Webpack
   ```

2. **Démarrage du serveur Karma**
   ```
   Karma v6.4.4 server started at http://localhost:9876/
   ```

3. **Lancement du navigateur**
   ```
   Launching browser Chrome
   Chrome 142.0.0.0 (Windows 10): Connected
   ```

4. **Injection des fichiers de test**
   - Karma injecte les fichiers compilés dans Chrome
   - Chrome exécute les tests JavaScript
   - Les résultats remontent à Karma

5. **Mode watch activé**
   ```
   Watch mode enabled. Watching for file changes...
   ```
   - Karma surveille les modifications de fichiers
   - Relance automatiquement les tests modifiés

---

### Jasmine (Framework de tests)

**Rôle** : Fournir la syntaxe et les assertions

**Fonctions principales** :

1. **`describe('Nom du groupe', () => {})`**
   - Crée un groupe de tests (suite)
   - Permet d'organiser les tests logiquement
   - Peut être imbriqué

2. **`it('Description du test', () => {})`**
   - Définit un test individuel (spec)
   - La description doit être claire et descriptive
   - Convention : commencer par "devrait..."

3. **`beforeEach(() => {})`**
   - Exécuté avant chaque test
   - Initialise l'environnement de test
   - Garantit l'isolation des tests

4. **`expect(valeur).matcher()`**
   - Crée une assertion
   - Compare la valeur avec le résultat attendu

**Matchers Jasmine utilisés** :

```typescript
expect(value).toBeTruthy()          // Vérifie que c'est "truthy"
expect(value).toBe(120)             // Comparaison stricte (===)
expect(text).toContain('Alice')     // Vérifie la présence d'une sous-chaîne
```

---

### Cycle d'exécution d'un test

```
┌─────────────────────────────────────────────────────┐
│ 1. COMPILATION                                      │
│    TypeScript → JavaScript                          │
│    Templates → JavaScript strings                   │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. KARMA DÉMARRE                                    │
│    - Lance le serveur                               │
│    - Ouvre Chrome                                   │
│    - Charge les fichiers                            │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. POUR CHAQUE FICHIER .spec.ts                     │
│    Jasmine exécute :                                │
│    - describe() → Groupe de tests                   │
│    - beforeEach() → Initialisation                  │
│    - it() → Test 1                                  │
│    - beforeEach() → Ré-initialisation               │
│    - it() → Test 2                                  │
│    - etc.                                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. POUR CHAQUE TEST it()                            │
│    Angular/TestBed :                                │
│    - Crée le module de test                         │
│    - Compile les composants                         │
│    - Injecte les services                           │
│    - Exécute les assertions                         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. RÉSULTATS                                        │
│    Karma affiche :                                  │
│    - Nombre de tests exécutés                       │
│    - Nombre de succès/échecs                        │
│    - Temps d'exécution                              │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 6. MODE WATCH                                       │
│    Karma surveille les fichiers :                   │
│    - Fichier modifié détecté                        │
│    - Recompilation                                  │
│    - Relance des tests modifiés                     │
│    - Retour à l'étape 3                             │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Résumé des concepts clés

### TestBed

| Méthode | Rôle |
|---------|------|
| `configureTestingModule()` | Configure l'environnement de test |
| `createComponent()` | Crée une instance du composant |
| `inject()` | Injecte un service pour les tests |

### ComponentFixture

| Propriété/Méthode | Rôle |
|-------------------|------|
| `.componentInstance` | Accède à l'instance du composant |
| `.nativeElement` | Accède au DOM HTML réel |
| `.detectChanges()` | Force la mise à jour du DOM |
| `.debugElement` | Version debug du DOM (plus de métadonnées) |

### Différences clés

| Concept | Composant Module | Composant Standalone |
|---------|-----------------|---------------------|
| Déclaration | `declarations: [Component]` | `imports: [Component]` |
| Dépendances | Héritées du module | Importées directement |
| Configuration | Dans `@NgModule` | Dans `@Component` |
| Portée | Module entier | Composant seul |

---

## 🎯 Pourquoi ces tests sont importants

### 1. Détection précoce des bugs

Sans tests :
```typescript
// Bug introduit par erreur
calculTTC(prix: number): number {
  return prix * 1.02; // ❌ TVA à 2% au lieu de 20%
}
```

Avec tests :
```
✗ devrait calculer le prix TTC correctement
  Expected 102 to be 120
```
→ **Bug détecté immédiatement** avant d'atteindre la production

### 2. Documentation vivante

Les tests documentent le comportement attendu :
```typescript
it('devrait appliquer une remise de 10%', () => {
  expect(service.appliquerRemise(100, 10)).toBe(90);
});
```
→ Un développeur sait immédiatement comment utiliser la méthode

### 3. Refactoring en confiance

Avec 100% de tests qui passent, tu peux :
- Refactoriser le code
- Optimiser les performances
- Changer l'implémentation interne

→ Si les tests passent toujours, le comportement est préservé

### 4. Régression zéro

Quand tu ajoutes une nouvelle fonctionnalité, les tests existants garantissent que tu n'as rien cassé.

---

## 💡 Bonnes pratiques appliquées

### ✅ 1. Nommage explicite

```typescript
// ✅ BON
it('devrait incrémenter clickCount lors du clic', () => {})

// ❌ MAUVAIS
it('test click', () => {})
```

### ✅ 2. Un test = une responsabilité

```typescript
// ✅ BON - Teste une seule chose
it('devrait calculer le prix TTC', () => {
  expect(service.calculTTC(100)).toBe(120);
});

// ❌ MAUVAIS - Teste plusieurs choses
it('devrait calculer prix et appliquer remise', () => {
  expect(service.calculTTC(100)).toBe(120);
  expect(service.appliquerRemise(100, 10)).toBe(90);
});
```

### ✅ 3. Tests isolés

Chaque test repart d'un état propre grâce à `beforeEach()`.

### ✅ 4. Pattern AAA

```typescript
it('test', () => {
  // Arrange (Préparer)
  const prix = 100;
  
  // Act (Agir)
  const resultat = service.calculTTC(prix);
  
  // Assert (Vérifier)
  expect(resultat).toBe(120);
});
```

---

## 🚀 Pour aller plus loin

### Tests non couverts dans cet atelier

1. **Tests d'intégration**
   - Tester plusieurs composants ensemble
   - Tester le routing Angular

2. **Tests E2E (End-to-End)**
   - Protractor (déprécié)
   - Cypress (recommandé)
   - Playwright

3. **Tests de performance**
   - Lighthouse CI
   - Bundle size analysis

4. **Tests de snapshots**
   - Capturer le HTML généré
   - Détecter les changements non intentionnels

### Commandes utiles

```bash
# Lancer les tests une seule fois (CI/CD)
ng test --no-watch --browsers=ChromeHeadless

# Générer un rapport de couverture
ng test --code-coverage

# Voir le rapport de couverture
open coverage/index.html
```

---

## 📝 Conclusion

### Ce que nous avons appris

1. ✅ Comment Angular génère automatiquement les tests
2. ✅ La différence entre composants module et standalone
3. ✅ Le rôle de Karma (runner) et Jasmine (framework)
4. ✅ Comment tester un service Angular
5. ✅ Comment tester un composant avec DOM
6. ✅ Comment simuler des interactions utilisateur
7. ✅ L'importance de `fixture.detectChanges()`

### Résultat final

```
🎉 10/10 tests passent
✅ Service Prix : 4 tests
✅ Composant Greeting : 4 tests
✅ Tests par défaut : 2 tests
⏱️  Temps d'exécution : 0.121s
```

---

**Document créé pour l'atelier de tests logiciels**  
*Projet atelier-angular - Novembre 2024*
