import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: Storage;
  constructor() {
    this.storage = window.localStorage;
  }

  saveTokenToLocalStorage(value: string) {
    this.storage.setItem('token', value);
  }

  removeTokenFromLocalStorage() {
    this.storage.removeItem('token');
  }

  getTokenFromLocalStorage() {
    return this.storage.getItem('token');
  }
}
