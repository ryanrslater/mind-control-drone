import Tello from './tello.js';
import { SerialPort } from 'serialport'

const tello = new Tello()

const port = new SerialPort({
    path: '/dev/serial0', // Ensure this matches your Raspberry Pi's serial port
    baudRate: 9600
  });

  port.on('data', async(data) => {
    tello.sendCommand(data)
  })

  port.on('close', () => {
    tello.onClose();
  })


/**
 * command
 * takeoff
 * delay 5
 * land
 * streamon
 * streamoff
 * move, format(direction, x: 20-500 cm)
 * up, x: 20-500 cm
 * down, x: 20-500 cm
 * left, x: 20-500 cm
 * right, x: 20-500 cm
 * forward, x: 20-500 cm
 * back, x: 20-500 cm
 * flip, x: l, r, f, b
 */
