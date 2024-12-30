import dgram from 'dgram';

class Tello {
  constructor() {
    this.localIp = '';
    this.localPort = 8889;
    this.socket = dgram.createSocket('udp4'); // socket for sending commands
    this.socket.bind(this.localPort, this.localIp);

    // Tello's IP and port
    this.telloIp = '192.168.10.1';
    this.telloPort = 8889;
    this.telloAddress = { address: this.telloIp, port: this.telloPort };
    this.log = [];
    this.MAX_TIMEOUT = 15000; // in milliseconds

    // Start listening for responses
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

      // Send the command
      this.socket.send(command, this.telloPort, this.telloIp, (err) => {
        if (err) {
          reject(`Error sending command: ${err}`);
          return;
        }
        console.log(`Sending command: ${command} to ${this.telloIp}`);
      });

      // Wait for a response or timeout
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
    // Clean up resources
    this.socket.close(() => {
      console.log('Socket closed.');
    });
  }

  getLog() {
    return this.log;
  }
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

export default Tello

