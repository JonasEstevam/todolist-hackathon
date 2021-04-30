import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { User } from '../objects/User';
import { Task } from '../objects/Task';
import { LocalStorageService } from '../service/local-storage.service';
import { UserService } from '../service/user.service';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: User;
  options: AnimationOptions = {
    path: '../../assets/loading.json',
  };
  completedTasks = [];
  notCompletedTasks = [];
  isLoading = true;
  newTaskTitle: string;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private userService: UserService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.checkIsLoggedIn();
  }

  checkIsLoggedIn() {
    const token: string = this.localStorageService.getTokenFromLocalStorage();
    if (!token) {
      this.router.navigate(['register']);
    } else {
      interface ISuccessfulUserInfoResponse {
        user: {
          username: string;
        };
        tasks: [Task];
      }
      this.userService.me().subscribe(
        (res: ISuccessfulUserInfoResponse) => {
          this.user = new User(res.user.username);
          this.notCompletedTasks = res.tasks.filter((task) => !task.completed);
          this.completedTasks = res.tasks.filter((task) => task.completed);
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }
  }

  finishTask(id: string, index: any) {
    this.taskService
      .update(id, { update: { completed: true } })
      .subscribe((res) => {
        const task = this.notCompletedTasks[index];
        this.notCompletedTasks.splice(index, 1);
        this.completedTasks.push(task);
      });
  }

  restoreTask(id: string, index: any) {
    this.taskService
      .update(id, { update: { completed: false } })
      .subscribe((res) => {
        const task = this.completedTasks[index];
        this.completedTasks.splice(index, 1);
        this.notCompletedTasks.push(task);
      });
  }

  logout() {
    this.localStorageService.removeTokenFromLocalStorage();
    this.router.navigate(['login']);
  }

  addTask() {
    interface ISucessfulResponseOnCreateTask {
      message: string;
      task: object;
    }

    if (!this.newTaskTitle) return;
    this.taskService
      .create(this.newTaskTitle)
      .subscribe((res: ISucessfulResponseOnCreateTask) => {
        this.notCompletedTasks.push(res.task);
        this.newTaskTitle = '';
      });
  }
}
