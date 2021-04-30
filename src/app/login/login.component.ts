import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { User } from '../objects/User';
import { LocalStorageService } from '../service/local-storage.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  options: AnimationOptions = {
    path: '../../assets/loginanimation.json',
  };

  user: User = new User('', '');
  haveError: boolean = false;
  errorText: string = 'Texto do alerta';

  constructor(
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.checkIsLoggedIn();
  }

  showError(text: string) {
    this.errorText = text;
    this.haveError = true;
    setTimeout(() => {
      this.haveError = false;
    }, 5000);
  }

  login() {
    if (!this.user.username) {
      return this.showError('Insira um nome de usuário!');
    }

    if (!this.user.password) {
      return this.showError('Insira uma senha!');
    }
    interface ISuccessLoginResponse {
      token: string;
    }
    this.userService.login(this.user.username, this.user.password).subscribe(
      (res: ISuccessLoginResponse) => {
        this.localStorageService.saveTokenToLocalStorage(res.token);
        this.router.navigate(['/']);
      },
      (res) => {
        return this.showError(res.error.message);
      }
    );
  }

  checkIsLoggedIn() {
    const token = this.localStorageService.getTokenFromLocalStorage();
    if (token) {
      this.router.navigate(['/']);
    }
  }

  goToRegister() {
    this.router.navigate(['register']);
  }
}
