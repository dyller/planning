import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {BoardModel} from "../../shared/entities/board-model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.scss']
})
export class BoardUpdateComponent implements OnInit {
  boardFormGroup: FormGroup;
  change = false;
  boardNameMinLength: number = environment.boardNameMinLength;
  boardNameMaxLength: number = environment.boardNameMaxLength;

  constructor(
    public dialogRef: MatDialogRef<BoardUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardModel) {
    this.boardFormGroup = new FormGroup({
      boardName: new FormControl(data.boardName)
    });
  }

  // Validate error from errorname and the form controller name, so less code
  public hasError = (controlName: string, errorName: string) => {
    return this.boardFormGroup.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  updateBoardInformation() {
    console.log(this.change);
  }
    // Tell if someone change so we update if something change. 
  readyToUpdate() {
    this.change = true;
  }
}
