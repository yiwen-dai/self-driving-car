import { Controls } from "./controls";

export class Car{
    constructor(
        private x: number,
        private y: number,
        private width: number,
        private height: number,

        private controls: Controls = new Controls(),

        private speed: number = 0,
        private acceleration: number = 0.2,
        private maxSpeed: number = 3,
        private friction: number = 0.05,
        private angle: number = 0,
    ) {}

    draw(ctx: CanvasRenderingContext2D ) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        
        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();
    }

    update() {
        this.move();
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
}