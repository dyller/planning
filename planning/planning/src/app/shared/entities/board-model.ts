import {RowModel} from './row-model';

export interface BoardModel {
  boardId?: string ;
  boardName: string;
  task?: RowModel[];
}
