import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  tasks: Task[] = [];

  tasksSubject = new Subject<Task[]>();

  constructor() { }

  emitTasks() {
    this.tasksSubject.next(this.tasks);
  }

  saveTasks(userId: string) {
    firebase.database().ref('/users/' + userId + '/list/').set(this.tasks);
  }

  getTasks(userId: string) {
    firebase.database().ref('/users/' + userId + '/list/').on('value', (data: any) => {
      this.tasks = data.val() ? data.val() : [];
      this.emitTasks();
    });
    // return new Observable((observer) => {
    //   if (this.tasks && this.tasks.length > 0) {
    //     observer.next(this.tasks);
    //     observer.complete();
    //   } else {
    //     const error = new Error('Tasks is not defined or is empty');
    //     observer.error(error);
    //   }
    // });
  }

  createTask(newTask: Task, userId: string) {
    this.tasks.push(newTask);
    this.saveTasks(userId);
  }

  updateTask(task: Task, index: number, userId: string) {
    this.tasks[index] = task;
    this.saveTasks(userId);
  }

  deleteTask(index: number, userId: string) {
    this.tasks.splice(index, 1);
    this.saveTasks(userId);
  }

}
