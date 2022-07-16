import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Car } from './shared/car';
import { ControlTypes } from './shared/interfaces';
import { Visualizer } from './shared/neural network/visualizer';
import { Road } from './shared/road';
import { Utils } from './shared/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  car: Car;
  road: Road;
  traffic: Car[] = [];

  carCanvas: HTMLCanvasElement;
  carCtx: CanvasRenderingContext2D;
  networkCanvas: HTMLCanvasElement;
  networkCtx: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit() {
    // set up canvas and ctx
    this.carCanvas = <HTMLCanvasElement> document.getElementById("car-canvas");
    this.carCtx = this.carCanvas.getContext("2d");
    this.carCanvas.width=200;

    this.networkCanvas = <HTMLCanvasElement> document.getElementById("network-canvas");
    this.networkCtx = this.carCanvas.getContext("2d");
    this.networkCanvas.width=300;

    // set up car and road
    this.road = new Road(this.carCanvas.width / 2, this.carCanvas.width * 0.9);
    this.car = new Car(
      this.road.getLaneCenter(Math.floor(this.road.numLanes / 2)), 
      100,
      30,
      50, 
      ControlTypes.AI
    );

    // set up traffic
    this.generateTraffic(Math.floor(Math.random() * 30));

    setInterval(()=> { this.animate() }, 15);
  }

  animate() {
    this.traffic.forEach(car => {
      car.update(this.road.borders, []);
    })
    this.car.update(this.road.borders, this.traffic);
    this.carCanvas.height = window.innerHeight;
    this.networkCanvas.height = window.innerHeight;

    this.carCtx.save();
    this.carCtx.translate(0, -this.car.y + this.carCanvas.height * 0.75);

    this.road.draw(this.carCtx);
    this.traffic.forEach(car => {
      car.draw(this.carCtx);
    })
    this.car.draw(this.carCtx);

    this.carCtx.restore();

    Visualizer.drawNetwork(this.networkCtx, this.car.neuralNetwork, new Utils());

    requestAnimationFrame(animate);
  }

  private generateTraffic(numCars: number) {
    for (let i: number = 0; i < numCars; ++i) {
      const random = Math.random();
      const trafficCar = new Car(
        this.road.getLaneCenter(Math.floor(random * (this.road.numLanes + 1))),   // random lane
        Math.floor(random * 10) * -100,   // random y position
        30, 
        50, ControlTypes.Dummy, 
        random > 0.5 ? random * 3 : 1.5   // random speed
      );
      this.traffic.push(trafficCar);
    }
  }
}
