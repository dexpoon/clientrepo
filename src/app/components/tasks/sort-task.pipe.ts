import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from './itask';
import * as _ from 'lodash';

@Pipe({
  name: 'sortTaskPipe'
})
export class SortTaskPipe implements PipeTransform {

  CUSTOM_MAP : Map<string, number>;

  constructor() {
    this.CUSTOM_MAP = new Map();
    this.CUSTOM_MAP.set('New',     1);
    this.CUSTOM_MAP.set('Pending',     2);
    this.CUSTOM_MAP.set('Completed',        3);
    this.CUSTOM_MAP.set('On Hold',   4);

    this.CUSTOM_MAP.set('NA',         50);
    this.CUSTOM_MAP.set('Low',      60);
    this.CUSTOM_MAP.set('Normal',    70);
    this.CUSTOM_MAP.set('High',      80);
    this.CUSTOM_MAP.set('Critical',   90);

    /* English
    this.CUSTOM_MAP.set('New',              1);
    this.CUSTOM_MAP.set('Started',          2);
    this.CUSTOM_MAP.set('Completed',        3);
    this.CUSTOM_MAP.set('OnHold',           4);
    this.CUSTOM_MAP.set('Low',            10);
    this.CUSTOM_MAP.set('Normal',         20);
    this.CUSTOM_MAP.set('High',           30);
    this.CUSTOM_MAP.set('Critical',       40);
    */
  }


  transform(tasks: ITask[], path: string[], order: number): ITask[] {

    // Check if is not null
    if (!tasks || !path || !order) return tasks;

    // Prepare for sorting: Fill in the statusNum and priorityNum
    for(var i = 0; i < tasks.length; i++) {
      tasks[i].statusSorter   = this.CUSTOM_MAP.get(this.trimIt(tasks[i].status));
      tasks[i].prioritySorter = this.CUSTOM_MAP.get(this.trimIt(tasks[i].priority));

      //logit('\n\nTRIMMED-PRIORITY:: '+ this.trimIt(tasks[i].priority));
      //logit('\nPRIORITY-SORTER:: '+ tasks[i].prioritySorter);
      tasks[i].descSorter     = _.lowerCase(_.replace(tasks[i].description, new RegExp(" ","g"),"]["));
    }

      return tasks.sort((a: ITask, b: ITask) => {
      // We go for each property followed by path
      path.forEach(property => {
      a = a[property];
          b = b[property];
      })

      //logit('SORTING::a ' + a + ' SORTING::b ' + b);
      // Order * (-1): We change our order
      return a > b ? order : order * (- 1);
  })
}

trimIt(str) {
  var newStr = str.replace(/\s+/g, '');
  return newStr;
}
} // SortTaskPipe
