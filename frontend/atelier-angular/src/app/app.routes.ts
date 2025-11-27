import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { UserDetailComponent } from './components/user-detail/user-detail';
import { LoginComponent } from './components/login/login';
import { GreetingComponent } from './components/greeting/greeting';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { 
    path: 'protected', 
    component: GreetingComponent,
    canActivate: [authGuard]  // Route protégée
  },
  { path: '**', redirectTo: '' }  // Redirection si route invalide
];