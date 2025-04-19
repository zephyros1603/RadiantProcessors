import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import cors from 'cors';

const app = express();
const apiPort = 3000;
const wsPort = 3001;

// In-memory state
let capturing = false;
let requests = [];

// Express middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies :contentReference[oaicite:4]{index=4}

// --- REST API Endpoints ---

// Start capture
app.post('/api/capture/start', (_req, res) => {
  capturing = true;
  broadcast({ type: 'status', capturing });
  res.json({ capturing });
});

// Stop capture
app.post('/api/capture/stop', (_req, res) => {
  capturing = false;
  broadcast({ type: 'status', capturing });
  res.json({ capturing });
});

// Clear all recorded requests
app.delete('/api/requests', (_req, res) => {
  requests = [];
  broadcast({ type: 'init', capturing, requests });
  res.status(204).end();
});

// Export all recorded requests as JSON
app.get('/api/export', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
  res.json(requests);
});

// Execute/send a request (called by your React RequestDetails)
app.post('/api/requests/:id/send', async (req, res) => {
  const { id } = req.params;
  const { method, url, headers, body } = req.body;
  const timestamp = new Date().toISOString();
  const entry = { id, method, url, headers, body, timestamp };

  // Record initial request
  requests = [entry, ...requests];
  broadcast({ type: 'request', request: entry });

  try {
    const start = Date.now();
    const response = await axios({ method, url, headers, data: body, responseType: 'text' });
    const duration = Date.now() - start;
    const responseEntry = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      timestamp: new Date().toISOString(),
      duration,
    };
    const updated = { ...entry, response: responseEntry };

    // Update stored requests
    requests = [updated, ...requests.filter(r => r.id !== id)];
    broadcast({ type: 'request', request: updated });
    res.json(updated);
  } catch (err) {
    const responseEntry = {
      status: err.response?.status || 0,
      statusText: err.message,
      headers: err.response?.headers || {},
      body: err.response?.data ? JSON.stringify(err.response.data) : '',
      timestamp: new Date().toISOString(),
    };
    const updated = { ...entry, response: responseEntry, error: true };
    requests = [updated, ...requests.filter(r => r.id !== id)];
    broadcast({ type: 'request', request: updated });
    res.status(500).json(updated);
  }
});

// Start HTTP API server
app.listen(apiPort, () => {
  console.log(`REST API listening on http://localhost:${apiPort}`);
});

// --- WebSocket Server (broadcasts to React) ---

const wss = new WebSocketServer({ port: wsPort });
wss.on('connection', ws => {
  // On new client connect, send initial state
  ws.send(JSON.stringify({ type: 'init', capturing, requests }));
});

function broadcast(msg) {
  const data = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

console.log(`WebSocket server running on ws://localhost:${wsPort}`);
