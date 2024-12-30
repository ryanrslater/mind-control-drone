import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws'; 
import Tello from './lib/tello.js';

// const tello = new Tello();
const server = createServer()

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

  server.listen(3000)


