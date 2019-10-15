import { Injectable } from '@angular/core';

@Injectable()
export class ValidationUtilService {

  constructor() { }

  isEmptyStr(str) {
    return (!str || 0 === str.length || str === undefined || str === null || str === 'null');
  }

  isEmptyStrArr(x, y, ...z) {
    for (let index = 0; index < z.length; index++) {
      const element = z[index];
      return this.isEmptyStr(element);
    }
  }

   isNaN(str) {
    return isNaN(parseInt(str));
  }

   isNaNs(x, y, ...z) {
    for (let index = 0; index < z.length; index++) {
      const element = z[index];
      return this.isNaN(element);
    }
  }

   isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

   isCollectionEmpty(array) {
    return (array === undefined || array.length === 0);
  }
}
