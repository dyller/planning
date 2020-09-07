import {RowModel} from './row-model';

export interface BoardModel {
  boardId?: string ;
  boardName: string;
  row?: RowModel[];
  imgPath?: string;
  imageId?: string;
}
