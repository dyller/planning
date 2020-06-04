import { Component, OnInit } from '@angular/core';
import {BoardServiceService} from "../../shared/service/board-service.service";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {
  done = true;
  constructor( private boardService: BoardServiceService) { }

  ngOnInit(): void {
  }
  // add new board to database
  saveBoard(newBoard: any) {
    if (newBoard && newBoard.target.value && this.done) {
        this.done = false;
        this.boardService.createNewBoard({boardName: newBoard.target.value,
          task: []}).subscribe();
        newBoard.target.value = '';
        this.done = true;
      }
  }
}
