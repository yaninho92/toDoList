import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../services/list.service';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { Task } from '../interfaces/task';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  taskForm: FormGroup;

  tasks: Task[] = [];

  editMode: boolean;
  editIndex: number;

  tasksSubscription: Subscription;

  userId: string;

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService
  ) { }

  ngOnInit() {
    this.initTaskForm();

    firebase.auth().onAuthStateChanged(
      (user) => {
          if (user) {
            this.userId = user.uid;
            console.log(user.uid);
            this.tasksSubscription = this.listService.tasksSubject.subscribe(
              (data: Task[]) => {
                this.tasks = data ? data : [];
              }
            );
            this.listService.getTasks(user.uid);
          }
      }
    );

    // this.listService.getTasks().subscribe(
    //   (data: any) => {
    //     this.tasks = data;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    // this.listService.getTasks().then(
    //   (data: any) => {
    //     this.tasks = data;
    //   }
    // ).catch(
    //   (error) => {
    //     console.error(error);
    //   }
    // );

  }

  initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      description: ''
    });
  }

  onCheckTask(index) {
    if (this.tasks[index].done) {
      this.tasks[index].done = false;
    } else {
      this.tasks[index].done = true;
    }
    this.listService.updateTask(this.tasks[index], index, this.userId);
  }

  onDisplayModal() {
    $('#newTaskModalCenter').modal('show');
    this.taskForm.reset();
    this.editMode = false;
  }

  onSubmitTaskForm() {
    const newTask: Task = {
      title: this.taskForm.get('title').value,
      description: this.taskForm.get('description').value,
      done: false
    };
    $('#newTaskModalCenter').modal('hide');
    if (this.editMode) {
      newTask.done = this.tasks[this.editIndex].done;
      this.listService.updateTask(newTask, this.editIndex, this.userId);
    } else {
      this.listService.createTask(newTask, this.userId);
    }
  }

  onDeleteTask(index) {
    this.listService.deleteTask(index, this.userId);
  }

  onEditTask(index) {
    $('#newTaskModalCenter').modal('show');
    this.taskForm.get('title').setValue(this.tasks[index].title);
    this.taskForm.get('description').setValue(this.tasks[index].description);
    this.editMode = true;
    this.editIndex = index;
  }

  ngOnDestroy() {
    this.tasksSubscription.unsubscribe();
  }

}
