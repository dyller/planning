import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
// @ts-ignore
import {TaskModel} from '../shared/entities/task-model';
import {UserModel} from '../shared/entities/user-model';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {RowModel} from '../shared/entities/row-model';
import {BoardServiceService} from '../shared/service/board-service.service';
import {MatMenuTrigger} from "@angular/material/menu";
import {stringify} from "querystring";
import {MatDialog} from "@angular/material/dialog";
import {DialogRowDeleteComponent} from "./dialogs/dialog-row-delete/dialog-row-delete.component";
import {TaskInfomationComponent} from "./dialogs/task-infomation/task-infomation.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  // Used for controlling so it only post one time.
  done = true;
  board: RowModel[] ;
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  contextMenuPosition = { x: '0px', y: '0px' };
  constructor(private boardServiceService: BoardServiceService,
              public dialog: MatDialog) {

  }
  onContextMenuRow(event: MouseEvent, item: RowModel) {
    this.contextPosition(event);
    this.trigger.toArray()[0].menuData ={'row': item};
    this.trigger.toArray()[0].menu.focusFirstItem('mouse');
    this.trigger.toArray()[0].openMenu();
  }
  contextPosition(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
  }
  onContextMenuTask(event: MouseEvent, item: TaskModel, row: RowModel) {
    console.log('here' + this.contextMenuPosition.x);
    this.contextPosition(event);
    this.trigger.toArray()[1].menuData ={'task': item,
                                          'row': row};
    this.trigger.toArray()[1].menu.focusFirstItem('mouse');
    this.trigger.toArray()[1].openMenu();
  }
  drop(event: CdkDragDrop<any[]>) {
    // move item in same row
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const split = event.container.id.split('-');
      const id = parseFloat(split[split.length - 1 ]);
      this.boardServiceService.updateRow(this.board[id]);
    } else {
      // move item to new row
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const splitPrev = event.previousContainer.id.split('-');
      const idPrev = parseFloat(splitPrev[splitPrev.length - 1 ]);
      const split = event.container.id.split('-');
      const id = parseFloat(split[split.length - 1 ]);
      // previous
      this.boardServiceService.updateRow(this.board[idPrev]);
      // moved to
      this.boardServiceService.updateRow(this.board[id]);
    }
  }


  ngOnInit(): void {
    this.getRows();
  }
// create new task
  saveTask(newTask: any, name: string) {
    if (name && newTask && newTask.target.value && this.done) {
      this.done = false;
      const index = this.board.findIndex(t => t.rowId === name);
      this.boardServiceService.addTask(this.board[index],
                                  {title: newTask.target.value}).subscribe(task => {

          if ( this.board[index].task) {
          const item = this.board[index];
          item.task[item.task.length] = task;
        } else {
          this.board[index].task = [task];
        }
          this.done = true;
      });
      newTask.target.value = '';
    }
  }
// add new row
  newRow(event: any) {

    if (event && event.target.value && this.done) {
       this.done = false;
       this.boardServiceService.addRow({name: event.target.value,
       task: []}).subscribe( rowData => {
         // does not look like i need this because it subscribe.
         /* const index = this.board.length;
            console.log('so');
          this.board[index] = {rowId: rowData.rowId,
                               name: rowData.name};*/
       event.target.value = '';
       this.done = true;
     });
    }
  }
  // read Rows.
  getRows() {
    this.boardServiceService.readRows().subscribe(rows => {
      for (let i = 0; i < rows.length ; i++) {
        for (let j = 0; j < rows[i].task.length; j++) {
          this.boardServiceService.readTaskById(rows[i].task[j].taskId).subscribe(taskResponse => {
            rows[i].task[j] = taskResponse;
          });
        }
      }

      this.board = rows;
    });
  }


  onRightClickRow(rowModel: RowModel) {
    if (rowModel) {
      const dialogRef = this.dialog.open(DialogRowDeleteComponent, {
        data: {name: rowModel.name}
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.boardServiceService.deleteRow(rowModel.rowId).subscribe(rowModelResponse => {
           alert(`row "${rowModelResponse.name}" is deleted`);
         });
       }
      });
    } else {
      alert('Error happen contact support pls.');
    }
  }


  onRightClickTask(taskModel: TaskModel, row: RowModel) {
    if (taskModel) {
      const dialogRef = this.dialog.open(DialogRowDeleteComponent, {
        data: {name: taskModel.title}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.boardServiceService.deleteTask(taskModel.taskId, row).subscribe(taskModelResponse => {
            alert(`row "${taskModelResponse.title}" is deleted`);
          });
        }
      });
    } else {
      alert('Error happen contact support pls.');
    }
  }
  openTaskInformation(taskModel: TaskModel) {
    if (taskModel) {
      const dialogRef = this.dialog.open(TaskInfomationComponent, {
        data: taskModel
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          alert('Result changed');
        }
      });
    } else {
      alert('Error happen contact support pls.');
    }
    }
}
