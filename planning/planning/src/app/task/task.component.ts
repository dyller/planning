import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
// @ts-ignore
import {TaskModel} from '../shared/entities/task-model';
import {UserModel} from "../shared/entities/user-model";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";
import {RowModel} from "../shared/entities/row-model";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
 test: RowModel[] = [{name: 'test',
   task: [{title: 'kage'}
   ]
 },
   {name: 'test',
     task: [{title: 'kage'}
     ]
   }
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
// create new task
  saveTask(newTask: any, name: string) {
    if (name && newTask && newTask.target.value) {
      const index = this.test.findIndex(t => t.name === name);

      if ( this.test[index].task) {
        const item = this.test[index];
        item.task[item.task.length] = newTask.target.value;
      } else {
        this.test[index].task = [newTask.target.value];
      }
      newTask.target.value = '';
    }
  }
// add new row
  newRow(event: any) {

    if (event && event.target.value) {
     const index = this.test.length;
     this.test[index] = {name: event.target.value,
     task: []};
     event.target.value = '';
    }
  }

}
