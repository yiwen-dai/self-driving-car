import { Utils } from "../utils.service";

export class Visualizer{
    static drawNetwork(ctx, network, utils: Utils){
        const margin: number = 50;
        const left: number = margin;
        const top: number  =margin;
        const width: number = ctx.canvas.width - margin * 2;
        const height: number = ctx.canvas.height - margin * 2;

        const levelHeight: number = height / network.levels.length;

        for(let i = network.levels.length - 1; i >= 0; --i) {
            const levelTop = top +
                utils.lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5
                        : i / (network.levels.length - 1)
                );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx,network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length - 1
                    ? ['🠉', '🠈', '🠊', '🠋']
                    : [],
                utils
            );
        }
    }

    static drawLevel(ctx, level, left,top,width,height,outputLabels, utils){
        const right=left+width;
        const bottom=top+height;

        const {inputs,outputs,weights,biases}=level;

        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.getNodeX(inputs,i,left,right, utils),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.getNodeX(outputs,j,left,right, utils),
                    top
                );
                ctx.lineWidth=2;
                ctx.strokeStyle=utils.getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }
 
        const nodeRadius=18;
        for(let i=0;i<inputs.length;i++){
            const x=Visualizer.getNodeX(inputs,i,left,right, utils);
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=utils.getRGBA(inputs[i]);
            ctx.fill();
        }
        
        for(let i=0;i<outputs.length;i++){
            const x=Visualizer.getNodeX(outputs,i,left,right, utils);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=utils.getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle=utils.getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*1.5)+"px Arial";
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }
    }

    private static getNodeX(nodes,index,left,right, utils){
        return utils.lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }
}