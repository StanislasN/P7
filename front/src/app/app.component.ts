import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/user.model';
import { AuthService } from './_service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    //vérifier si l'utilisateur est déjà connecté 
    if (authService.isAuth) {
      //récupérer les données utlisateur du localStorage 
      authService.loggedInUser = JSON.parse(
        localStorage.getItem('user') as string
      );
      //set currentUser avec les données utilisateur trouvées
      authService.currentUser = new User(
        authService.loggedInUser.users_id,
        authService.loggedInUser.users_lastName,
        authService.loggedInUser.users_firstName,
        authService.loggedInUser.users_mail,
        authService.loggedInUser.users_pwd,
        authService.loggedInUser.users_birthday
      )
      //redirection vers la page HOME
      this.router.navigate(['/home']);
    }
  }
}
