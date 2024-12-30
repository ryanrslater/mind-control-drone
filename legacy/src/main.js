console.log('hello World')

let port;
let writer;

// Connect to the Raspberry Pi over serial
document.getElementById('connect').addEventListener('click', async () => {
  try {
    // Request access to a serial port
    port = await navigator.serial.requestPort();

    // Open the port with the desired baud rate
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();

    console.log("Connected to Raspberry Pi!");
  } catch (error) {
    console.error("Error connecting to serial port:", error);
  }
});

// Send a command to the Raspberry Pi
async function sendCommand(command) {
  if (!writer) {
    console.error("Not connected to a serial device!");
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(command + "\n"); // Append newline for the Raspberry Pi script
  await writer.write(data);
  console.log(`Sent command: ${command}`);
}

// // Add event listeners for each button
// document.getElementById('up').addEventListener('click', () => sendCommand('up'));
// document.getElementById('down').addEventListener('click', () => sendCommand('down'));
// document.getElementById('left').addEventListener('click', () => sendCommand('left'));
// document.getElementById('right').addEventListener('click', () => sendCommand('right'));
