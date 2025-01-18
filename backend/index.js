import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import Tello from './lib/tello.js';
import connector from './lib/connector.js';

const tello = new Tello();
const server = createServer();
const wss = new WebSocketServer({ server });
// const socket = new WebSocket('wss://localhost:6868')

let act = '';
let pow = '';

const setState = (cmd) => {
  if (cmd != act) {
    act = cmd;
  }
};

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    const command = connector(message);
    setState(command);
    try {
      await tello.sendCommand(command);
    } catch (e) {
      console.log(e);
    }
    const logs = tello.getLog();
    wss.clients.forEach((w) => {
      w.send(JSON.stringify({ tello: logs }));
    });
  });

  ws.send(JSON.stringify({ tello: tello.getLog() }));
});

wss.on('close', () => {
  tello.onClose();
});
server.listen(3000);
