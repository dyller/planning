import {TaskModel} from '../entities/task-model';


export class ChangeTask {
  static readonly type = '[task] Change';

  constructor(public taskModel: TaskModel) {}
}

