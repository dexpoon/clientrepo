import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { IUser } from './iuser';

@Pipe({
  name: 'sortUserPipe'
})
export class SortUserPipe implements PipeTransform {

    constructor() {}

    transform(users: IUser[], path: string[], order: number): IUser[] {

      // Check if is not null
      if (!users || !path || !order) return users;

        return users.sort((a: IUser, b: IUser) => {
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

}

