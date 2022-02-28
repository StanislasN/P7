import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../_service/auth.service';
import { UserService } from '../_service/user.service';
import { SnackBarComponent } from '../_ui/snack-bar/snack-bar.component';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent implements OnInit {
  form: string = '';
  lastName: string = '';
  firstName: string = '';
  mail: string = '';
  birthday: any = '';

  updateUserInfo: FormGroup

  constructor(
    private authService: AuthService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {


    this.initForm()
    this.userLogged()


  }

  initForm() {
    this.updateUserInfo = this.fb.group({
      lastName: [this.authService.loggedInUser.users_lastName, Validators.required],
      firstName: [this.authService.loggedInUser.users_firstName, Validators.required],
      email: [this.authService.loggedInUser.users_mail, Validators.required],
      birthday: [this.authService.loggedInUser.users_birthday, Validators.required],
    });
  }
  userLogged() {

    let date = this.authService.loggedInUser.users_birthday;
    const formatDate = this.datepipe.transform(date, 'dd-MM-yyyy');
    this.lastName = this.authService.loggedInUser.users_lastName;
    this.firstName = this.authService.loggedInUser.users_firstName;
    this.mail = this.authService.loggedInUser.users_mail;
    this.birthday = formatDate;
  }

  async updateOnSubmit() {
    const formValue = this.updateUserInfo.value;
    let date = formValue['birthday'];
    const formatDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    const newUser: User = new User(
      this.authService.loggedInUser.users_id,
      formValue['lastName'],
      formValue['firstName'],
      formValue['email'],
      formatDate
    );
    const apiData = newUser.getApiData()
    delete apiData.users_pwd
    const result = await this.userService.updateUser(apiData);

    if (result) {
      this.authService.loggedInUser = result[0]
    }

    this.setForm('')
    this.userLogged()
  }


  setForm(form: string) {
    this.form = form;
  }

  async deleteUser() {
    const userId = this.authService.loggedInUser.users_id
    const result = await this.userService.deleteUser(userId)
    this.router.navigate(['/'])
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: 'Le compte à bien été supprimé !',
      duration: 2000
    });
  }
}
