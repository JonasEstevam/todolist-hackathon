import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API = `${environment.API}/task`;
  private token = this.localStorageService.getTokenFromLocalStorage();
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    }),
  };

  constructor(
    private localStorageService: LocalStorageService,
    private $http: HttpClient
  ) {}

  update(id: string, update: object) {
    return this.$http.put(`${this.API}/${id}`, update, this.httpOptions);
  }

  create(title: string) {
    return this.$http.post(`${this.API}`, { title }, this.httpOptions);
  }
}
