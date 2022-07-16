export class Level {
    inputs: number[] = [];
    outputs: number[] = [];
    biases: number[] = [];
    weights: number[][] = [];

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        // each output neuron has a bias: the value above which it will fire
        this.biases = new Array(outputCount);

        // weights for all connections between each input and output
        for (let i = 0; i < inputCount; ++i) {
            this.weights[i] = new Array(outputCount);
        }

        Level.randomize(this);
    }

    private static randomize(level: Level) {
        for (let i = 0; i < level.inputs.length; ++i) {
            for (let j = 0; j < level.outputs.length; ++j) {
                // random value between -1 and 1 (negative: don't, positive: do)
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; ++i) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs: number[], level: Level) {
        for (let i = 0; i < level.inputs.length; ++i) {
            level.inputs[i] = givenInputs[i];
        }

        // calculate output value based on input and weights
        for (let i = 0; i < level.outputs.length; ++i) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; ++j) {
                // ith output is the value of the jth input and the weight 
                // between the jth input and the ith output
                sum += level.inputs[j] * level.weights[j][i];
            }

            // fire (= 1) if value of sum is greater than the threshold (bias)
            level.outputs[i] = sum > level.biases[i] ? 1 : 0;
        }

        return level.outputs;
    }
}