import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
// @ts-ignore
import {TaskModel} from '../shared/entities/task-model';
import {UserModel} from "../shared/entities/user-model";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
 test: TaskModel[] = [
   {items: [ 'Get to work',
       'Pick up groceries',
       'Go home',
       'Fall asleep'],
   name: 'todo'},
   {name: 'done',
   items: [
     'Get up',
     'Brush teeth',
     'Take a shower',
     'Check e-mail',
     'Walk dog'
   ]}
 ];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  constructor() {

  }

  ngOnInit(): void {
  }
//create new task
  saveTask(newTask: any, name: string) {
    if (name && newTask && newTask.target.value) {
      const index = this.test.findIndex(t => t.name === name);
      if ( this.test[index].items) {
        const item = this.test[index];
        item.items[item.items.length] = newTask.target.value;
      } else {
        this.test[index].items = [newTask.target.value];
      }
      newTask.target.value = '';
    }
  }
// add new title
  newTitle(event: any) {

    if (event && event.target.value) {
     const index = this.test.length;
     this.test[index] = {name: event.target.value};
     event.target.value = '';
    }
  }

}
