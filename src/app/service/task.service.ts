import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API = `${environment.API}/task`;

  constructor(
    private localStorageService: LocalStorageService,
    private $http: HttpClient
  ) {}

  update(id: string, update: object) {
    const token = this.localStorageService.getTokenFromLocalStorage();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.$http.put(`${this.API}/${id}`, update, httpOptions);
  }

  create(title: string) {
    const token = this.localStorageService.getTokenFromLocalStorage();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    console.log(httpOptions);

    return this.$http.post(`${this.API}`, { title }, httpOptions);
  }
}
