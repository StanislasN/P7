import { Injectable } from '@angular/core';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { AppConfigService } from './app-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../_ui/snack-bar/snack-bar.component';

export interface Params {
  [key: string]: any;
}
export interface GetOptions {
  path: string;
  params?: Params;
}

export interface PostOptions {
  path: string;
  params: Params;
}

@Injectable({
  providedIn: 'root',
})
export class AxiosClientService {
  private axiosClient: AxiosInstance;
  private baseUrl: string;
  constructor(private appConfig: AppConfigService, private snackBar: MatSnackBar) {
    this.axiosClient = axios.create({
      timeout: this.appConfig.config.apiTimeout,
    });
    this.baseUrl = `${this.appConfig.config.baseUrl}`;

    // Add a request interceptor
    this.axiosClient.interceptors.request.use((config) => {
      if (!(localStorage.getItem('token') === null)) {
        const userId = JSON.parse(localStorage.getItem('userId') || '{}')
        config.headers = {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'user-id': userId
        }
      }
      return config
    },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this.axiosClient.interceptors.response.use(
      (response: AxiosResponse) => {
        this._handleResponse(response);
        return response;
      },
      (error: AxiosError) => {
        this._handleError(error);
        return Promise.reject(error.response);
      }
    );
  }

  protected async axiosCall<T>(
    method: Method,
    options: GetOptions | PostOptions
  ): Promise<T> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method,
        url: `${this.baseUrl}${options.path}`,
      };

      const paramsMethod = ['get', 'delete'];
      paramsMethod.includes(method)
        ? (requestConfig.params = options.params)
        : (requestConfig.data = options.params);

      const axiosResponse = await this.axiosClient.request<T>(requestConfig);
      return axiosResponse.data;
    } catch (error) {
      return error;
    }
  }

  public async get<T>(options: GetOptions): Promise<T> {
    return this.axiosCall('get', options);
  }
  public async post<T>(options: PostOptions): Promise<T> {
    return this.axiosCall('post', options);
  }
  public async put<T>(options: PostOptions): Promise<T> {
    return this.axiosCall('put', options);
  }
  public async delete<T>(options: GetOptions): Promise<T> {
    return this.axiosCall('delete', options);
  }
  public getAxiosClient(): AxiosInstance {
    return this.axiosClient;
  }

  private _handleResponse = (data: AxiosResponse): void => {
    console.log('_handleResponse', data);
  };

  private _handleError = (error: AxiosError): void => {
    const errMsg = error.response.data
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: errMsg,
      duration: 2000
    });
  };


}
