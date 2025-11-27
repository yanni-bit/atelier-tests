# 📘 README_ELEVE.md

*(version minimale -- uniquement ce qui est nécessaire pour que tout
fonctionne)*

## 🔧 Versions nécessaires

-   **Node.js : 18.x ou 20.x**
-   **npm : version incluse avec Node**
-   **Angular CLI : 20.x (global)**
-   **Google Chrome** *(nécessaire pour Karma)*

------------------------------------------------------------------------

## 🟦 Installation backend

Dans le dossier :

    backend/

Installer les dépendances :

``` bash
npm install
```

Prérequis déjà présents dans `package.json` :\
- jest\
- supertest

> **Rien à installer manuellement.**\
> Si Jest ne se lance pas → vérifier que Node = **18 ou 20**.

------------------------------------------------------------------------

## 🟩 Installation frontend Angular

Dans :

    frontend/atelier-angular/

Installer les dépendances :

``` bash
npm install
```

Angular CLI doit être installé globalement :

``` bash
npm install -g @angular/cli
```

Chrome doit être installé pour que les tests Angular fonctionnent.

------------------------------------------------------------------------

## 📂 Structure utile

    backend/
        package.json     → Jest + Supertest
        docs/

    frontend/
        atelier-angular/
            package.json → Angular 20 + Karma + Jasmine
            docs/

    docs/                → documentation générale

------------------------------------------------------------------------

## 🟠 Points qui bloquent si non installés

-   Node \< 18 → Jest ou Angular plante\
-   Angular CLI manquant → `ng` non reconnu\
-   Chrome absent → tests Angular impossibles\
-   npm install non fait dans backend ou frontend

------------------------------------------------------------------------

## ✔️ Une fois ces prérequis installés, tout fonctionne.
