import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUser } from '../model/user.model';
import { AppConfigService } from './app-config.service';
import { AxiosClientService } from './axios-client.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  baseUsers: any;
  constructor(
    private axios: AxiosClientService,
    private appConfig: AppConfigService,
    private router: Router
  ) {
    this.baseUsers = `${this.appConfig.config.baseUsers}`;
  }

  get isSub() { return !(localStorage.getItem('token') === null) }

  async addUser(userData: ApiUser) {
    const data: any = await this.axios.post({
      path: this.baseUsers,
      params: userData
    });
    return data;
  }
}
