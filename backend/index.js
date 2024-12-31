import { createServer } from 'http';
import { WebSocketServer } from 'ws'; 
import Tello from './lib/tello.js';
import connector from './lib/connector.js'

// const tello = new Tello()
const server = createServer()
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    const message = JSON.parse(data)
    console.log(message)
    const command = connector(message.com[0], message.com[1])
    // tello.send(command)
    wss.clients.forEach((w) => {
      w.send(command)
    })

  });

  ws.send('something');
});

wss.on('close', () => {
  // tello.onClose()
})
  server.listen(3000)


