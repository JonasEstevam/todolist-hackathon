import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../objects/User';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API = `${environment.API}/user`;
  constructor(
    private $http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  create(user: User) {
    return this.$http.post(this.API, user);
  }

  me() {
    const token = this.localStorageService.getTokenFromLocalStorage();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.$http.get(`${environment.API}/me`, httpOptions);
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      }),
    };
    return this.$http.get(`${environment.API}/auth`, httpOptions);
  }
}
