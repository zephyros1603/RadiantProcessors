const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const pty = require('node-pty');
const os = require('os');
// const logCommand = require('./scrapeTerminal');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active terminal sessions
const terminals = new Map();

// Use zsh as the default shell on macOS
const shell = os.platform() === 'darwin' ? '/bin/zsh' : 
              os.platform() === 'win32' ? 'powershell.exe' : '/bin/bash';
const shellArgs = os.platform() === 'win32' ? [] : ['-l'];

app.use(express.static(path.join(__dirname, '../frontend')));

wss.on('connection', (ws) => {
  try {
    const terminalId = Date.now().toString();
    console.log(`Attempting to create terminal session: ${terminalId}`);

    // Create or retrieve existing terminal session
    let ptyProcess;
    if (!terminals.has(terminalId)) {
      ptyProcess = pty.spawn(shell, shellArgs, {
        name: 'xterm-256color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor',
          LANG: 'en_US.UTF-8',
          PS1: '%~ %# '  // zsh prompt
        }
      });

      if (!ptyProcess) {
        throw new Error('Failed to spawn PTY process');
      }

      console.log(`New terminal process spawned with PID: ${ptyProcess.pid}`);
      terminals.set(terminalId, ptyProcess);

      // Send initial command to set up the shell
      ptyProcess.write('export TERM=xterm-256color\n');
      ptyProcess.write('clear\n');
    } else {
      ptyProcess = terminals.get(terminalId);
      console.log(`Retrieved existing terminal process: ${ptyProcess.pid}`);
    }

    // Send terminal output to WebSocket
    const dataHandler = (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(data);
          console.log(`Data sent to WebSocket: ${data}`);
        } catch (error) {
          console.error('Error sending data to WebSocket:', error);
        }
      }
    };

    ptyProcess.on('data', dataHandler);

    // Handle input from WebSocket
    ws.on('message', (msg) => {
      try {
        if (ptyProcess && ptyProcess.pid) {
          const input = msg.toString();
          console.log(`Received input: ${input}`);

          // Log the command if it is not an initial setup command
          // if (input !== 'export TERM=xterm-256color' && input !== 'clear') {
          //   logCommand(input);
          // }

          // Write the input to the terminal
          ptyProcess.write(input === '\r' ? '\n' : input);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    // Handle WebSocket close
    ws.on('close', () => {
      console.log(`Client disconnected: ${terminalId}`);
      if (ptyProcess) {
        ptyProcess.removeListener('data', dataHandler);
      }
    });

    // Handle terminal exit
    ptyProcess.on('exit', (exitCode) => {
      console.log(`Terminal exited with code ${exitCode}: ${terminalId}`);
      terminals.delete(terminalId);
    });

  } catch (error) {
    console.error('Error initializing terminal session:', error);
    ws.close();
  }
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Terminal server running at http://localhost:${PORT}`);
});