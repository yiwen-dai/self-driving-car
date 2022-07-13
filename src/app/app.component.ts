import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Car } from './shared/car';
import { ControlTypes } from './shared/interfaces';
import { Road } from './shared/road';

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
  traffic: Car[] = [];

  constructor() {}


  ngAfterViewInit() {
    // set up canvas and ctx
    this.canvas = <HTMLCanvasElement> document.getElementById("display-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width=200;

    // set up car and road
    this.road = new Road(this.canvas.width / 2, this.canvas.width * 0.9);
    this.car = new Car(
      this.road.getLaneCenter(Math.floor(this.road.numLanes / 2)), 
      100,
      30,
      50, 
      ControlTypes.Real
    );

    // set up traffic
    this.generateTraffic(Math.floor(Math.random() * 30));
    console.log(this.traffic);

    setInterval(()=> { this.animate() }, 15);
  }

  animate() {
    this.traffic.forEach(car => {
      car.update(this.road.borders, []);
    })
    this.car.update(this.road.borders, this.traffic);
    this.canvas.height = window.innerHeight;

    this.ctx.save();
    this.ctx.translate(0, -this.car.y + this.canvas.height * 0.75);

    this.road.draw(this.ctx);
    this.traffic.forEach(car => {
      car.draw(this.ctx);
    })
    this.car.draw(this.ctx);

    this.ctx.restore();
    requestAnimationFrame(animate);
  }

  private generateTraffic(numCars: number) {
    for (let i: number = 0; i < numCars; ++i) {
      const random = Math.random();
      const trafficCar = new Car(
        this.road.getLaneCenter(Math.floor(random * this.road.numLanes)),   // random lane
        Math.floor(random * 10) * -100,   // random y position
        30, 
        50, ControlTypes.Dummy, 
        random > 0.5 ? random * 3 : 2   // random speed
      );
      this.traffic.push(trafficCar);
    }
  }
}
