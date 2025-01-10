import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws'; 
import Tello from './lib/tello.js';
import connector from './lib/connector.js'

const tello = new Tello()
const server = createServer()
const wss = new WebSocketServer({ server });
// const socket = new WebSocket('wss://localhost:6868')



wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', async(data) => {
    const message = JSON.parse(data)
    const command = connector(message.com[0], message.com[1])
    try {
      await tello.sendCommand(command)
    } catch (e) {
      console.log(e)
    }
    const logs = tello.getLog()
    wss.clients.forEach((w) => {
      w.send(JSON.stringify({tello: logs}))
    })
  });

  ws.send(JSON.stringify({tello: tello.getLog()}));
});

wss.on('close', () => {
  tello.onClose()
})
  server.listen(3000)


