import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Car } from './shared/car';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  car: Car;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;


  ngAfterViewInit() {
    // set up canvas and car
    this.canvas = <HTMLCanvasElement> document.getElementById("display-canvas");
    this.car = new Car(100,100,30,50);
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width=200;

    setInterval(()=> { this.animate() }, 10);
  }

  animate() {
    this.car.update();
    this.canvas.height = window.innerHeight;
    this.car.draw(this.ctx);
    requestAnimationFrame(animate);
  }
}
