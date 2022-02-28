import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../_service/auth.service';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  witchCompo: string = '';
  firstName: string = '';

  users: Array<User> = [];
  collaborateur: any;
  selectedCollaborateur: User;
  userId: number = 0;
  isAdmin: boolean = false;
  isModerator: boolean = false;

  constructor(
    public router: Router,
    public authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.firstName = this.authService.loggedInUser.users_firstName;
    this.isAdmin = this.authService.loggedInUser.users_isAdmin == '1' ? true : false;
    this.isModerator = this.authService.loggedInUser.users_isAdmin == '2' ? true : false;

    const usersList = await this.userService.getAllUsers();
    this.users = usersList.filter(e => e.lastName !== this.authService.loggedInUser.users_lastName)
  }

  onClick(user: User) {
    this.setWitchCompo('userInfos');
    this.selectedCollaborateur = user;
  }

  setWitchCompo(compo: string) {
    this.witchCompo = compo;
  }
}
