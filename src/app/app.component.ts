import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Car } from './shared/car';
import { Road } from './shared/road';
import { UtilsService } from './shared/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  car: Car;
  road: Road;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(private utils: UtilsService) {}


  ngAfterViewInit() {
    // set up canvas and ctx
    this.canvas = <HTMLCanvasElement> document.getElementById("display-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width=200;

    // set up car and road
    this.road = new Road(this.canvas.width / 2, this.canvas.width * 0.9);
    this.car = new Car(this.road.getLaneCenter(Math.floor(this.road.numLanes / 2)),100,30,50);
    this.road.utils = this.utils;
    this.car.sensor.utils = this.utils;


    setInterval(()=> { this.animate() }, 15);
  }

  animate() {
    this.car.update(this.road.borders);
    this.canvas.height = window.innerHeight;

    this.ctx.save();
    this.ctx.translate(0, -this.car.y + this.canvas.height * 0.75);

    this.road.draw(this.ctx);
    this.car.draw(this.ctx);

    this.ctx.restore();
    requestAnimationFrame(animate);
  }
}
