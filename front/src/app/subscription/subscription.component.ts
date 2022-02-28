import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { SubscriptionService } from '../_service/subscription.service';
import { SnackBarComponent } from '../_ui/snack-bar/snack-bar.component';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  hide = true;
  userSubscription: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    public datepipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userSubscription = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      birthday: ['', Validators.required],
    });
  }

  async onSubmitSub() {
    const formValue = this.userSubscription.value;

    let date = formValue['birthday'];
    const formatDate = this.datepipe.transform(date, 'yyyy-MM-dd');

    const newUser: User = new User(
      0,
      formValue['lastName'],
      formValue['firstName'],
      formValue['email'],
      formValue['password'],
      formatDate
    );

    const result = await this.subscriptionService.addUser(newUser.getApiData());
    if (result) {
        this.router.navigate(['/home']);
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: 'Votre compte a bien été créé !',
          duration: 2000
        });
      
    }else{
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Cette adresse Email existe déjà !',
        duration: 2000
      });
    }
  }
}
