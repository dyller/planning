import {TaskModel} from '../entities/task-model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChangeTask} from "./board-actions";
import {RowModel} from "../entities/row-model";

export interface BoardStateModel {
  rowModel: RowModel[];

}

@State<BoardStateModel>({

  name: 'cartModel',
  defaults: {
    rowModel: []
  }
})


export class BoardState  {
  @Selector()
  static getRows(state: BoardStateModel): RowModel[] {
    if (state) {
      return state.rowModel;
    } else {
      return [];
    }
  }

  @Action(ChangeTask)
  AddToCart(ctx: StateContext<BoardStateModel>, action: ChangeTask ) {

  }


}
