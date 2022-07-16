import { Controls } from "./controls";
import { ControlTypes, Pair } from "./interfaces";
import { NeuralNetwork } from "./neural network/neural-network";
import { Sensor } from "./sensor";
import { Utils } from "./utils.service";

export class Car{
    public sensor: Sensor;
    private controls: Controls;
    public utils: Utils = new Utils();

    private speed: number = 0;
    private acceleration: number = 0.2;
    private friction: number = 0.05;
    public angle: number = 0;

    private damaged: boolean = false;
    private carColor: string = "black";
    
    public carCoors: Pair[];
    
    public neuralNetwork: NeuralNetwork;
    private useNeuralNetwork: boolean = false;

    constructor(
        public x: number,
        public y: number,
        private width: number,
        private height: number,
        private controlType: ControlTypes,
        private maxSpeed: number = 3
    ) {
        this.controls = new Controls(this.controlType);
        this.useNeuralNetwork = controlType === ControlTypes.AI;
        if (this.controlType !== ControlTypes.Dummy) {
            this.sensor = new Sensor(this);
            this.neuralNetwork = new NeuralNetwork(
                [this.sensor.numRays, 6, 4]
            );
        } else {
            this.carColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        }
    }


    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.damaged ? 'red' : this.carColor;

        ctx.beginPath();
        ctx.moveTo(this.carCoors[0].x, this.carCoors[0].y);
        for (let i: number = 1; i < this.carCoors.length; ++i) {
            ctx.lineTo(this.carCoors[i].x, this.carCoors[i].y);
        }
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }

    private move() {
        
        // FORWARD AND BACK
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed / 2){
            this.speed = -this.maxSpeed / 2;
        }

        // FRICTION
        if(this.speed>0){
            this.speed -= this.friction;
        }
        if(this.speed<0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        // FLIP FOR BACKWARDS
        if(this.speed != 0){
            const flip: number = this.speed > 0 ? 1 : -1;
            // LEFT AND RIGHT
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }

        // UPDATE
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    private getCoordinates() {
        const coors: Pair[] = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        coors.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        coors.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        coors.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        coors.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return coors;
    }

    private checkDamage(roadBorders: Pair[][], traffic: Car[]) {
        for(let i: number = 0; i < roadBorders.length ; i++){
            if (this.utils.polysIntersect(this.carCoors, roadBorders[i])){
                this.damaged = true;
                return;
            }
        }

        for(let i: number = 0; i < traffic.length ; i++){
            if (this.utils.polysIntersect(this.carCoors, traffic[i].carCoors)) {
                this.damaged = true;
                return;
            }
        }
        this.damaged = false;
        return;
    }

    update(roadBorders: Pair[][], traffic: Car[]) {
        if (!this.damaged) {
            this.move();
            this.carCoors = this.getCoordinates();
            this.checkDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => 
                // receives high values if distance to other things is close 
                // and low values if distance to other things is far
                s == null ? 0 : 1 - s.distance
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.neuralNetwork);

            if (this.useNeuralNetwork) {
                this.controls.forward = outputs[0] === 1;
                this.controls.left = outputs[1] === 1;
                this.controls.right = outputs[2] === 1;
                this.controls.reverse = outputs[3] === 1;
            }
        }
    }
}