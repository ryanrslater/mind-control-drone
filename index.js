import readline from 'readline'
import Drone from './src/drone.js';


const drone = new Drone()

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);


console.log('press q to exit, or any key to print log');

process.stdin.on('keypress', async (chunk, key) => {
  if (key && key.name == 'q'){
    drone.onClose();
    process.exit();
  }
  if (key && key.name == "return") {
    await drone.sendCommand('command');
  }
  
  if (key && key.name == "space") {
    await drone.sendCommand('takeoff');
  }
  if (key && key.name == "a") {
    await drone.sendCommand('land');
  }

  console.log(key.name)
});


