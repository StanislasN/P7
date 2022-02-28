import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  mdp = new FormControl('', [Validators.required])

  hide = true;

  constructor(private authService: AuthService) {}

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Le champs est invalide.';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }



  ngOnInit(): void {}

  async onSubmit(form: NgForm) {
    const mail = form.value.email;
    const pwd = form.value.password;
    await this.authService.login(mail, pwd);
  }
}
