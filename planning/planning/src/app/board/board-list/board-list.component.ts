import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BoardServiceService} from "../../shared/service/board-service.service";
import {BoardModel} from "../../shared/entities/board-model";
import {RowModel} from "../../shared/entities/row-model";
import {DialogRowDeleteComponent} from "../../task/dialogs/dialog-row-delete/dialog-row-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {BoardUpdateComponent} from "../board-update/board-update.component";
import {MatMenuTrigger} from "@angular/material/menu";
import {forEachComment} from "tslint";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  done = true;
  boards: BoardModel[];
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  contextMenuPosition = { x: '0px', y: '0px' };
  constructor( private boardService: BoardServiceService,
               public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initBoard();
  }
  // add new board to database
  saveBoard(newBoard: any) {
    if (newBoard && newBoard.target.value && this.done) {
        this.done = false;
        this.boardService.createNewBoard({boardName: newBoard.target.value,
          row: []}).subscribe(returnBoardDatas => {
          this.openBoardInformation(returnBoardDatas);
        }, error => console.log('Error: ' + error.message));
        newBoard.target.value = '';
        this.done = true;
      }
  }

  initBoard() {
    this.boardService.readBoards().subscribe( boardsData => {
      boardsData.forEach( board => {
        if (board.imageId) {
          this.boardService.imageFile(board.imageId).subscribe(imageUrl => {
            board.imgPath = imageUrl;

          });
        }
      });
      this.boards = boardsData;

    });
  }
  // Open update board.
  openBoardInformation(boardModel: BoardModel) {
    if (boardModel) {
      const dialogRef = this.dialog.open(BoardUpdateComponent, {
        data: boardModel
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('All good');
      });
    } else {
      alert('Board data is empty');
    }
  }
  // What data will be passed dialog view. ( for removing board)
  onContextMenuBoard(event: MouseEvent, item: BoardModel) {
    this.contextPosition(event);
    this.trigger.toArray()[0].menuData = {board: item};
    this.trigger.toArray()[0].menu.focusFirstItem('mouse');
    this.trigger.toArray()[0].openMenu();
  }
  // position of popup from right click
  contextPosition(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
  }
    // If you right click you are able to delete a board, and you will get a dialog view
  onRightClickBoard(board: BoardModel) {
    if (board) {
      const dialogRef = this.dialog.open(DialogRowDeleteComponent, {
        data: {message: `Are you sure you will delete board  "${board.boardName}" ?`}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.boardService.deleteBoard(board.boardId).subscribe(boardModelReponse => {
            //alert(`row "${rowModelResponse.name}" is deleted`);
          });
        }
      });
    } else {
      alert('Error happen contact support pls.');
    }
  }

}
