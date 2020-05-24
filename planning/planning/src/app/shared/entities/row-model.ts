import {TaskModel} from './task-model';

export interface RowModel {
  rowId?: string ;
  name: string;
  task?: TaskModel[];
}
