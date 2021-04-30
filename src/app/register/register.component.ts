import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { User } from '../objects/User';
import { LocalStorageService } from '../service/local-storage.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  options: AnimationOptions = {
    path: '../../assets/loginanimation.json',
  };
  user = new User('', '');
  haveError: boolean = false;
  errorText: string = 'Texto do alerta';
  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router
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
  create = () => {
    if (!this.user.username) {
      return this.showError('Insira um nome de usuário!');
    }

    if (!this.user.password) {
      return this.showError('Insira uma senha!');
    }
    if (this.user.username.length < 3) {
      return this.showError('Nome de usuário deve ter ao menos 3 caracteres!');
    }
    if (this.user.username.length > 20) {
      return this.showError(
        'Nome de usuário pode ter no máximo 20 caracteres!'
      );
    }
    if (this.user.password.length < 6) {
      return this.showError('Senha precisa ter ao menos 6 caracteres!');
    }
    interface ISucessfullUserCreationResponse {
      message: string;
      token: string;
      user: object;
    }
    this.userService.create(this.user).subscribe(
      (res: ISucessfullUserCreationResponse) => {
        this.localStorageService.saveTokenToLocalStorage(res.token);
        this.router.navigate(['/']);
      },
      (res) => {
        return this.showError(res.error.message);
      }
    );
  };

  checkIsLoggedIn() {
    const token = this.localStorageService.getTokenFromLocalStorage();
    if (token) {
      this.router.navigate(['/']);
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
