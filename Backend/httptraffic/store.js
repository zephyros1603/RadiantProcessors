class RequestStore {
  constructor() {
    this.requests = [];
  }

  addRequest(request) {
    const record = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      response: request.response || null
    };
    this.requests.unshift(record);
    return record;
  }

  getRequests(filters = {}) {
    return this.requests.filter(req => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        switch (key) {
          case 'searchTerm':
            return JSON.stringify(req)
              .toLowerCase()
              .includes(value.toLowerCase());
          case 'method':
            return req.method === value.toUpperCase();
          default:
            return true;
        }
      });
    });
  }

  clear() {
    this.requests = [];
  }
}

module.exports = RequestStore;