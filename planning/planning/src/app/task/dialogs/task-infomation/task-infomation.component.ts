import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TaskModel} from "../../../shared/entities/task-model";
import {FormControl, FormGroup} from "@angular/forms";
import {BoardServiceService} from "../../../shared/service/board-service.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-task-infomation',
  templateUrl: './task-infomation.component.html',
  styleUrls: ['./task-infomation.component.scss']
})
export class TaskInfomationComponent implements OnInit {
  @ViewChild('informationTextarea') taskInformationElement: ElementRef;
  taskFormGroup: FormGroup;
  changed = false;
  showInformation = false;
  taskTitleMaxLength: number = environment.taskTitleMaxLength;
  taskTitleMinLength: number = environment.taskTitleMinLength;
  taskInformationText: string[];
  constructor(
    public dialogRef: MatDialogRef<TaskInfomationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskModel,
    public boardServiceService: BoardServiceService) {

    this.taskFormGroup = new FormGroup({
      title: new FormControl(data.title),
      timeEstimated: new FormControl(data.timeEstimated),
      timeUsed: new FormControl(data.timeUsed),
      information: new FormControl()
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.convertInformationTohtmlObject();
  }

  saveTaskInformation() {
    if ( this.changed && this.taskFormGroup.invalid === false) {
      this.changed = false;
      const task: TaskModel = this.taskFormGroup.value;
      task.taskId = this.data.taskId;
      this.boardServiceService.updateTask(task).subscribe();
    }
  }
  // Validate error from errorname and the form controller name, so less code
  public hasError = (controlName: string, errorName: string) => {
    return this.taskFormGroup.controls[controlName].hasError(errorName);
  }
  changeDone() {
    this.changed = true;
  }

  showTextAreaInformation() {
    this.showInformation = !this.showInformation;
    if ( this.showInformation) {
      setTimeout(() => {
        this.taskInformationElement.nativeElement.focus();
      }, 0);
    }
    this.convertInformationTohtmlObject();
    this.saveTaskInformation();
  }
    // seperate task information to array of strings
  convertInformationTohtmlObject() {

    this.taskInformationText = this.data.information.split(/\r?\n/);
  }
  // change task information if you click checkboxes
  changeCheckBoxValue(lineNumber: number) {
    if (this.taskInformationText[lineNumber].startsWith('**')) {
     this.taskInformationText[lineNumber] =
       this.taskInformationText[lineNumber].substring(1 , this.taskInformationText[lineNumber].length);

    } else {
      this.taskInformationText[lineNumber] = '*' + this.taskInformationText[lineNumber];
    }
    this.data.information = '';
    this.taskInformationText.forEach(line => {
      this.data.information += line + '\n';
    });
    this.data.information = this.data.information.substring(0, this.data.information.length);
  }

  removeStarFromStart(line: string): string {
    let index = 1;
    if (line.charAt(1) === '*') {
      index = 2;
    }
    return line.slice(index);
  }
}
