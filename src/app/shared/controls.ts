export class Controls {
    
    constructor(
        public forward: boolean = false,
        public reverse: boolean = false,
        public left: boolean = false,
        public right: boolean = false,) {
        this.addKeyboardListeners();
    }

    private addKeyboardListeners() {
        // detect when arrrow keys are pressed
        document.onkeydown = (event) => {
            switch (event.keyCode) {
                case 37:   // left
                    this.left = true;
                    break;
                case 38:   // up
                    this.forward = true;
                    break;
                case 39:   // right
                    this.right = true;
                    break;
                case 40:   // down
                    this.reverse = true;
                    break;
            }
        }

        // detect when arrow keys are released
        document.onkeyup = (event) => {
            switch (event.keyCode) {
                case 37:   // left
                    this.left = false;
                    break;
                case 38:   // up
                    this.forward = false;
                    break;
                case 39:   // right
                    this.right = false;
                    break;
                case 40:   // down
                    this.reverse = false;
                    break;
            }
        }
    }
}