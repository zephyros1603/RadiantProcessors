// src/components/HTTPTrafficAnalyzer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, Download, Plus } from 'lucide-react';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
import { type HTTPRequest } from './types';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '';

const HTTPTrafficAnalyzer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [requests, setRequests] = useState<HTTPRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HTTPRequest | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.hostname}:3001`);
    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'init':
          setRequests(msg.requests);
          setIsCapturing(msg.capturing);
          break;
        case 'status':
          setIsCapturing(msg.capturing);
          break;
        case 'request':
          setRequests(prev => [msg.request, ...prev.filter(r => r.id !== msg.request.id)]);
          if (selectedRequest?.id === msg.request.id) {
            setSelectedRequest(msg.request);
          }
          break;
      }
    };
    ws.onerror = err => console.error('WS error', err);

    wsRef.current = ws;
    return () => ws.close();
  }, [selectedRequest]);

  const startCapture = () => fetch(`${API_BASE}/api/capture/start`, { method: 'POST' }).catch(err => console.error(err));
  const stopCapture  = () => fetch(`${API_BASE}/api/capture/stop`,  { method: 'POST' }).catch(err => console.error(err));
  const clearRequests = () => {
    fetch(`${API_BASE}/api/requests`, { method: 'DELETE' })
      .then(() => setSelectedRequest(null))
      .catch(err => console.error(err));
  };
  const exportTraffic = () => window.open(`${API_BASE}/api/export`);

  const handleUpdate = (updated: HTTPRequest) => {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRequest(updated);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[#323232] bg-[#252526]">
        <Button variant="default" size="sm" className="mb-2 md:mb-0" onClick={() => {
          const newReq: HTTPRequest = {
            id: Date.now().toString(),
            method: 'GET',
            url: '',
            headers: {},
            body: '',
            timestamp: new Date().toISOString(),
          };
          setRequests(prev => [newReq, ...prev]);
          setSelectedRequest(newReq);
        }}><Plus size={16}/> New</Button>

        {isCapturing ?
          <Button variant="destructive" size="sm" className="mb-2 md:mb-0" onClick={stopCapture}><Pause size={16}/> Stop</Button>
          : <Button variant="default" size="sm" className="mb-2 md:mb-0" onClick={startCapture}><Play size={16}/> Start</Button>}

        <Button variant="outline" size="sm" className="mb-2 md:mb-0" onClick={clearRequests}><Trash2 size={16}/> Clear</Button>
        <Button variant="outline" size="sm" className="mb-2 md:mb-0" onClick={exportTraffic}><Download size={16}/> Export</Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Request List */}
        <div className="w-full md:w-1/3 border-r border-[#323232] overflow-y-auto">
          <RequestList
            requests={requests}
            selectedRequest={selectedRequest}
            onRequestSelect={setSelectedRequest}
          />
        </div>

        {/* Request Details */}
        <div className="w-full md:flex-1 overflow-auto">
          <RequestDetails
            key={selectedRequest?.id}
            request={selectedRequest}
            onSend={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default HTTPTrafficAnalyzer;

