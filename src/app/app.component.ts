import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Car } from './shared/car';
import { ControlTypes } from './shared/interfaces';
import { NeuralNetwork } from './shared/neural network/neural-network';
import { Visualizer } from './shared/neural network/visualizer';
import { Road } from './shared/road';
import { Utils } from './shared/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  cars: Car [];
  bestCar: Car;
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
    this.networkCtx = this.networkCanvas.getContext("2d");
    this.networkCanvas.width=500;

    // set up car and road
    this.road = new Road(this.carCanvas.width / 2, this.carCanvas.width * 0.9);
    this.cars = this.generateCars(300);
    this.bestCar = this.cars[0];
    if (localStorage.getItem("bestNeuralNetwork")) {
      for (let i = 0; i < this.cars.length; ++i) {
        this.cars[i].neuralNetwork = JSON.parse(
          localStorage.getItem("bestNeuralNetwork")
        )
        if (i) {
          NeuralNetwork.mutate(this.cars[i].neuralNetwork, 0.1);
        }
      }
    }

    // set up traffic
    // uncomment for randomly generated traffic
    this.generateTraffic(Math.floor(Math.random() * 30));
    // training data
    // this.traffic = [
    //   new Car(this.road.getLaneCenter(1), -100, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(0), -300, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(2), -300, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(0), -500, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(1), -500, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(1), -700, 30, 50, ControlTypes.Dummy, 2),
    //   new Car(this.road.getLaneCenter(2), -700, 30, 50, ControlTypes.Dummy, 2),
    // ]

    setInterval(()=> { this.animate() }, 15);
  }

  animate() {
    // update cars
    this.traffic.forEach(car => {
      car.update(this.road.borders, []);
    })
    this.cars.forEach(car => 
      car.update(this.road.borders, this.traffic)
    );

    // determine best car to show (furthest = lowest y value) 
    this.bestCar = this.cars.find(car => 
      car.y == Math.min(...this.cars.map(c=>c.y))
    )

    // update canvas
    this.carCanvas.height = window.innerHeight;
    this.networkCanvas.height = window.innerHeight;
    this.carCtx.save();
    this.carCtx.translate(0, -this.bestCar.y + this.carCanvas.height * 0.75);

    // draw road, cars, and traffic
    this.road.draw(this.carCtx);
    this.traffic.forEach(car => {
      car.draw(this.carCtx);
    })
    this.carCtx.globalAlpha = 0.2;
    this.cars.forEach(car => 
      car.draw(this.carCtx)
    );
    this.carCtx.globalAlpha = 1;
    this.bestCar.draw(this.carCtx, true)
    
    this.carCtx.restore();

    // draw visualizer
    Visualizer.drawNetwork(this.networkCtx, this.bestCar.neuralNetwork, new Utils());

    requestAnimationFrame(animate);
  }

  private generateCars(numCars: number) {
    const cars: Car[] = [];
    for (let i = 1; i <= numCars; ++i) {
      cars.push(new Car(
        this.road.getLaneCenter(Math.floor(this.road.numLanes / 2)), 
        100,
        30,
        50,
        ControlTypes.AI
      ));
    }
    return cars;
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

  save() {
    localStorage.setItem("bestNeuralNetwork", JSON.stringify(this.bestCar?.neuralNetwork));
    console.log('saved');
  }

  discard() {
    localStorage.removeItem("bestNeuralNetwork");
    console.log('discarded');
  }
}
