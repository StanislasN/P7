import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AuthGuard } from './_service/auth-guard.service';

//Définition des routes de l'application
const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'profil', canActivate: [AuthGuard],component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
