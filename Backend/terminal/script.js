const terminalContainer = document.getElementById("terminal");
const term = new Terminal({
  cursorBlink: true,
  theme: {
    background: "#111",
    foreground: "limegreen",
  },
  convertEol: true,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontSize: 14,
  cols: 80,
  rows: 24
});

const ws = new WebSocket(`ws://localhost:3002`);
let inputBuffer = "";

// Open the terminal
term.open(terminalContainer);

// Handle WebSocket connection
ws.onopen = () => {
  console.log("WebSocket connection established");
  term.write('\r\n$ ');
};

// Handle terminal output from the server
ws.onmessage = (event) => {
  term.write(event.data);
};

// Handle terminal input from the user
term.onData((data) => {
  if (data === '\r') { // Enter key pressed
    ws.send(inputBuffer + '\n');
    inputBuffer = "";
  } else if (data === '\u007F') { // Backspace key
    if (inputBuffer.length > 0) {
      inputBuffer = inputBuffer.slice(0, -1);
      term.write('\b \b');
    }
  } else if (data === '\u0003') { // Ctrl+C
    ws.send('\u0003');
    inputBuffer = "";
    term.write('^C\r\n$ ');
  } else {
    inputBuffer += data;
    term.write(data);
  }
});

// Handle terminal resize
term.onResize(size => {
  ws.send(JSON.stringify({
    type: 'resize',
    cols: size.cols,
    rows: size.rows
  }));
});

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
  term.write('\r\nConnection error\r\n');
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
  term.write('\r\nConnection closed\r\n');
};