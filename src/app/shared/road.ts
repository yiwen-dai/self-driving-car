import { Pair } from "./interfaces";
import { Utils } from "./utils.service";

export class Road {
    readonly inf: number = 1000000;
    readonly top: number = -this.inf;
    readonly bottom: number = this.inf;

    left: number;
    right: number;
    width: number;
    numLanes: number = 3;
    borders: Pair[][] = [];

    public utils: Utils = new Utils();
    
    constructor(
        x: number,
        width: number,
        numLanes?: number,
    ) {
        this.width = width;
        this.left = x - this.width / 2;
        this.right = x + this.width / 2;
        numLanes? this.numLanes = numLanes : this.numLanes = this.numLanes;

        const topLeft: Pair = {x: this.left, y: this.top};
        const bottomLeft: Pair = {x: this.left, y: this.bottom};
        const topRight: Pair = {x: this.right, y: this.top};
        const bottomRight: Pair = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }
 
    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // draw lanes using linear interpolation from utils
        for (let i = 1; i < this.numLanes; ++i) {
            const x = this.utils.lerp(
                this.left,
                this.right,
                i / this.numLanes // percentage
            );

            // use dotted line for middle lanes
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, 
                this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // use solid line for outer lanes
        ctx.strokeStyle = "#f7ce17";
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
        
    }

    getLaneCenter(laneIndex: number) {
        const laneWidth = this.width / this.numLanes;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.numLanes - 1) * laneIndex * laneWidth;
    }
}