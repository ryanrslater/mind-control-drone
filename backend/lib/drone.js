import dgram from 'dgram';

/** Tello Ryze controlling drone, you must connect to their network */
class Drone {
  constructor() {
    this.localIp = '';
    this.localPort = 8889;
    this.socket = dgram.createSocket('udp4');
    this.socket.bind(this.localPort, this.localIp);

    this.telloIp = '192.168.10.1';
    this.telloPort = 8889;
    this.telloAddress = { address: this.telloIp, port: this.telloPort };
    this.log = [];
    this.MAX_TIMEOUT = 15000;

    this._startReceiveThread();
  }

  _startReceiveThread() {
    this.socket.on('message', (msg, rinfo) => {
      console.log(`From ${rinfo.address}: ${msg}`);
      if (this.log.length > 0) {
        this.log[this.log.length - 1].addResponse(msg.toString());
      }
    });
    this.socket.on('error', (err) => {
      console.log(`Socket error: ${err}`);
    });
  }

  async sendCommand(command) {
    return new Promise((resolve, reject) => {
      const stats = new Stats(command, this.log.length);
      this.log.push(stats);
      this.socket.send(command, this.telloPort, this.telloIp, (err) => {
        if (err) {
          reject(`Error sending command: ${err}`);
          return;
        }
        console.log(`Sending command: ${command} to ${this.telloIp}`);
      });

      const start = Date.now();
      const interval = setInterval(() => {
        if (stats.gotResponse()) {
          clearInterval(interval);
          console.log(`Done!!! Sent command: ${command} to ${this.telloIp}`);
          resolve(stats.getResponse());
        } else if (Date.now() - start > this.MAX_TIMEOUT) {
          clearInterval(interval);
          console.log(`Max timeout exceeded... command: ${command}`);
          reject(`Timeout waiting for command response: ${command}`);
        }
      }, 100); // Check every 100ms
    });
  }

  onClose() {
    this.socket.close(() => {
      console.log('Socket closed.');
    });
  }

  getLog() {
    return this.log;
  }

  formatter = (msg) => {
    const m = JSON.parse(msg);
    switch (m.com[0]) {
      case 'neutral':
        return '';
      case 'takeoff':
        return 'takeoff';
      case 'disappear':
        return 'land';
      case 'push':
        return 'forward';
      case 'pull':
        return 'back';
      case 'lift':
        return 'up';
      case 'drop':
        return 'down';
      case 'left':
        return 'left';
      case 'right':
        return 'right';
      case 'rotateLeft':
        return '';
      case 'rotateRight':
        return '';
      case 'command':
        return 'command';
      default:
        return '';
    }
  };
}

class Stats {
  constructor(command, index) {
    this.command = command;
    this.index = index;
    this.response = null;
  }

  gotResponse() {
    return this.response !== null;
  }

  addResponse(response) {
    this.response = response;
  }

  getResponse() {
    return this.response;
  }
}

export default Drone;
