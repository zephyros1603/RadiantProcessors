const http = require('http');
const https = require('https');
const { URL } = require('url');
const forge = require('node-forge');

class ProxyServer {
  constructor(store, broadcast) {
    this.store = store;
    this.broadcast = broadcast;
    this.servers = {};
    this.caCert = this.generateCA();
  }

  generateCA() {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    const attrs = [
      { name: 'commonName', value: 'TrafficAnalyzerCA' },
      { name: 'organizationName', value: 'SecurityAI' }
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    return {
      key: forge.pki.privateKeyToPem(keys.privateKey),
      cert: forge.pki.certificateToPem(cert)
    };
  }

  async handleRequest(clientReq, clientRes) {
    const startTime = Date.now();
    // Log incoming request
    console.log(`↗️ [Proxy] ${clientReq.method} ${clientReq.url}`);
    console.log('   Request Headers:', clientReq.headers);

    const requestData = {
      method: clientReq.method,
      url: clientReq.url,
      headers: { ...clientReq.headers },
      body: []
    };

    try {
      const target = new URL(clientReq.url);
      const proxyReq = (target.protocol === 'https:' ? https : http).request({
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: target.pathname + target.search,
        method: clientReq.method,
        headers: clientReq.headers
      });

      clientReq.pipe(proxyReq);

      proxyReq.on('response', proxyRes => {
        const responseData = {
          status: proxyRes.statusCode,
          headers: proxyRes.headers,
          body: [],
          duration: Date.now() - startTime
        };

        proxyRes.on('data', chunk => responseData.body.push(chunk));
        proxyRes.on('end', () => {
          responseData.body = Buffer.concat(responseData.body).toString();
          const saved = this.store.addRequest({
            ...requestData,
            response: responseData
          });
          this.broadcast({ type: 'request', request: saved });

          // Log response details
          console.log(`↙️ [Proxy] ${clientReq.method} ${clientReq.url} → ${responseData.status} (${responseData.duration}ms)`);
          console.log('   Response Headers:', responseData.headers);

          clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
          clientRes.end(responseData.body);
        });
      });

      proxyReq.on('error', err => this.handleError(err, clientRes));
    } catch (err) {
      this.handleError(err, clientRes);
    }
  }

  start(httpPort = 8080, httpsPort = 8443) {
    this.servers.http = http
      .createServer(this.handleRequest.bind(this))
      .listen(httpPort, () => console.log(`HTTP proxy listening on ${httpPort}`));
    this.servers.https = https
      .createServer(this.caCert, this.handleRequest.bind(this))
      .listen(httpsPort, () =>
        console.log(`HTTPS proxy listening on ${httpsPort}`)
      );
  }

  stop() {
    Object.values(this.servers).forEach(server => server.close());
    this.servers = {};
  }
}

module.exports = ProxyServer;