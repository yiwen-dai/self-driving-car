import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() { }

  // linear interpolation
  lerp(left: number, right: number, percentage: number) {
    // when percentage is 0 or 1: the two end points are returned
    return left + (right - left) * percentage;
}
}
