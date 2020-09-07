import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {BoardModel} from '../../shared/entities/board-model';
import {environment} from '../../../environments/environment';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {ImageMetadata} from "../../shared/entities/image-metadata";
import {BoardServiceService} from "../../shared/service/board-service.service";



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
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedBlob: Blob;

  constructor(
    public dialogRef: MatDialogRef<BoardUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardModel,
    private boardService: BoardServiceService) {
    this.boardFormGroup = new FormGroup({
      boardName: new FormControl(data.boardName)
    });
    this.dialogRef.afterClosed().subscribe( () => {

      if (this.change) {
        const boardData = this.boardFormGroup.value as BoardModel;
        boardData.boardId = data.boardId;
        this.boardService.updateBoard(boardData, this.getMetaDataForImage()).subscribe();
      }
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

    // Tell if someone change so we update if something change.
  readyToUpdate() {
    this.change = true;
  }
  // get meta data from image. so we can sve that.
  private getMetaDataForImage(): ImageMetadata {
    if (this.imageChangedEvent && this.imageChangedEvent.target &&
      this.imageChangedEvent.target.files &&
      this.imageChangedEvent.target.files.length > 0) {
      const fileBeforeCrop = this.imageChangedEvent.target.files[0];
      return {
        base64Image: this.croppedImage,
        imageBlob: this.croppedBlob,
        fileMeta: {
          name: fileBeforeCrop.name,
          type: 'image/png',
          size: fileBeforeCrop.size
        }
      };
    }
    return undefined;
  }
  // save file local.
  uploadFile(event) {
    this.change = true;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    // Preview
    this.change = true;
    this.croppedImage = event.base64;
    this.croppedBlob = this.dataURItoBlob(this.croppedImage);
  }
  // update board
  updateBoard() {

  }
  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  doneChangingImage() {
    console.log('here');
  }
}
