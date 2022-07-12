import { Car } from "./car";
import { Intersection, Pair } from "./interfaces";
import { UtilsService } from "./utils.service";

export class Sensor{
    private numRays: number = 5;
    private rayRange: number = 150;
    private raySpread: number = Math.PI / 2;

    private rays: Pair[][] = [];
    public readings = []

    public utils: UtilsService 

    constructor(private car: Car) {}

    private castRays() {
        this.rays = [];

        for (let i: number = 0; i < this.numRays; ++i) {
            const rayAngle = this.utils.lerp(
                this.raySpread / 2, 
                -this.raySpread / 2,
                this.numRays == 1 ? 1/2 : (i / (this.numRays - 1))
            ) + this.car.angle;
            
            const start: Pair = {x: this.car.x, y: this.car.y};
            const end: Pair = {
                x: this.car.x - Math.sin(rayAngle) * this.rayRange,
                y: this.car.y - Math.cos(rayAngle) * this.rayRange
            }

            this.rays.push([start, end]);

        }
    }

    private getReading(ray: Pair[], roadBorders: Pair[][]) {
        // find all points of intersection and get the closest point
        let touches = [];
        roadBorders.forEach(border => {
            const touch: Intersection = this.utils.getIntersection(
                ray[0], ray[1], border[0], border[1]
            );
            if (touch) {
                touches.push(touch);
            }
        })

        if (!touches.length) {
            // no POI's 
            return null;
        } else {
            // at least 1 POI, return closest POI
            const distances = touches.map(e => e.distance);
            const minDist = Math.min(...distances);
            return touches.find(e => e.distance == minDist);
        }
    }

    update(roadBorders: Pair[][]) {
        this.castRays();
        this.readings = [];
        this.rays.forEach(ray => {
            this.readings.push(
                this.getReading(ray, roadBorders)
            );
        })
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        for (let i: number = 0; i < this.numRays; ++i) {
            let end: Pair = this.readings[i] ? this.readings[i] : this.rays[i][1];

            // draw rays up to POI
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#0098dbBF";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // draw "blacked out" rays from POI
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#00000080";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

        }
    }
}