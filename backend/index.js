import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import Drone from './lib/drone.js';
import Eeg from './lib/eeg.js';

let socketUrl = 'wss://localhost:6868';
let user = {
  license: process.env.EEG_LICENCE,
  clientId: process.env.EEG_CLIENT_ID,
  clientSecret: process.env.EEG_CLIENT_SECRET,
  debit: 1
};

const drone = new Drone();
const eeg = new Eeg(user, socketUrl);
const server = createServer();
const wss = new WebSocketServer({ server });

eeg.listenForWarnings();
eeg.sub(['eeg']);

eeg.socket.on('message', async (data) => {
  const command = drone.formatter(data);
  try {
    await drone.sendCommand(command);
  } catch (e) {
    console.log(e);
  }
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', async (data) => {
    const command = drone.formatter(data);
    try {
      await drone.sendCommand(command);
    } catch (e) {
      console.log(e);
    }
  });
  ws.send(JSON.stringify({ tello: tello.getLog() }));
});

drone.socket.on('message', () => {
  const logs = drone.getLog();
  wss.clients.forEach((w) => {
    w.send(JSON.stringify({ tello: logs }));
  });
});

wss.on('close', () => {
  tello.onClose();
});
server.listen(3000);
