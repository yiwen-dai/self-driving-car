import { Injectable } from '@angular/core';
import { Intersection } from './interfaces';

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

    // get all points of intersections
    getIntersection(A, B, C, D) : Intersection{
      const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
      const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
      const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
      
      if(bottom != 0){
          const t = tTop / bottom;
          const u = uTop / bottom;
          if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
              return {
                  x: this.lerp(A.x, B.x, t),
                  y: this.lerp(A.y, B.y, t),
                  distance: t
              }
          }
      }
  
      return null;
    }
}
