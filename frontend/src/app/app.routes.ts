import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {ProfessionalDashboardComponent} from "./professionals/dashboard/dashboard.component";
import { ClientDashboardComponent } from './clients/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path:'professionals/dashboard', component: ProfessionalDashboardComponent},
  { path: 'client/dashboard', component: ClientDashboardComponent }

];
