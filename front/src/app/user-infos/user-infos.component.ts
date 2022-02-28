
import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../_service/user.service';
import { faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../_ui/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss'],
})
export class UserInfosComponent implements OnInit, OnChanges {
  @Input() user: User;

  faUserTimes = faUserTimes
  userAdmin: number
  moderator = false
  constructor(
    public datepipe: DatePipe,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,

  ) { }

  ngOnInit() {

  }

  ngOnChanges(change: SimpleChanges) {
  }

  async deleteUser() {
    const userId = this.user.id
    const result = await this.userService.deleteUser(userId)
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: 'Le compte à bien été supprimé !',
      duration: 2000
    });
    location.reload();
  }

  async setModerator(event) {
    console.log(event);
    let checkModerator = event.target.checked ? 2 : 0;
    const newUser: User = new User(
      this.user.id,
      this.user.lastName,
      this.user.firstName,
      this.user.email,
      this.user.birthday,
    );
    let apiData = newUser.getApiData()
    delete apiData.users_pwd
    apiData.users_isAdmin = checkModerator;
    const result = await this.userService.updateUser(apiData);
  }
}
