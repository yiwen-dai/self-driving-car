# Self Driving Car
The application simulates a car driving in randomly generated traffic.

The self driving cars are attached to artificial neural networks that uses a genetic algorithm to learn.

The sensors and the neural network of the best car (currently determined by distance travelled) are shown until it has collided and/or there is a new best car. At which point the new best car's sensors and neural network will be shown. 

The neural network of the best car can be saved and used for future generations by clicking the save button in the middle of the screen. If a neural network was saved, upon page refresh, new generations of cars will be created by slightly mutating the existing neural network. If there is no neural networks saved (or if saved neural networks were deleted using the delete button), the cars will have randomly generated neural networks. 

All components of the project, including the neural network, collision detection, environments creation, and sensor simulation are all created from scratch using TypeScript and without the use of external libraries. UI and components built following the Angular architecture.


## How to run

Run `ng serve` in the CLI to run the application locally. Navigate to `http://localhost:4200/` to view. 

Use the save and delete button to control what the neural networks will be based upon. 

Refresh the page to create a new generation of cars as well as new randomly generated traffic.

## Future plans
1. Update fitness function. Consider potential additions: choose cars that can stay in lanes, fewer key presses, faster speed
2. Allow option for selecting whether to use training data (static, preset traffic info) or randomly generating traffic
3. Allow option for selecting manual control mode (no neural networks, no parallelization, straightforward driving simulation using up down left right)
4. Fix bug with overlapping traffic 
5. More variations in road layout 
