// api.js
const express = require('express');
const cors = require('cors');

class APIServer {
  constructor(store, proxy) {
    this.app = express();
    this.store = store;
    this.proxy = proxy;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  setupRoutes() {
    // Get filtered requests
    this.app.get('/api/requests', (req, res) => {
      const { search, method } = req.query;
      res.json(this.store.getRequests({
        searchTerm: search,
        method: method
      }));
    });

    // Clear all requests
    this.app.delete('/api/requests', (req, res) => {
      this.store.clear();
      res.sendStatus(204);
    });

    // Start proxy
    this.app.post('/api/capture/start', (req, res) => {
      this.proxy.start(req.body.port || 8080);
      res.json({ status: 'capturing', port: this.proxy.server.address().port });
    });

    // Stop proxy
    this.app.post('/api/capture/stop', (req, res) => {
      this.proxy.stop();
      res.json({ status: 'stopped' });
    });

    // Export data
    this.app.get('/api/export', (req, res) => {
      const data = JSON.stringify(this.store.getRequests(), null, 2);
      res.setHeader('Content-Disposition', 'attachment; filename=requests.json');
      res.send(data);
    });

    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok',
        proxy: this.proxy.server ? 'running' : 'stopped'
      });
    });
  }

  start(port = 3001) {
    this.app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  }
}

module.exports = APIServer;