import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
import {TaskModel} from '../shared/entities/task-model';

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

  drop(event: CdkDragDrop<string[]>) {
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

  saveTask(newTask: any, name: string) {
    console.log(newTask.target.value);
    const index = this.test.findIndex(t => t.name === name);
    const item = this.test[index];
    item.items[item.items.length] = newTask.target.value;
    newTask.target.value = '';

  }
}
