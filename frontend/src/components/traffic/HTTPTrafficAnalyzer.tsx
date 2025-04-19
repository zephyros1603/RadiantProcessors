import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, Download, Plus } from 'lucide-react';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
import { type HTTPRequest } from './types';

const HTTPTrafficAnalyzer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [requests, setRequests] = useState<HTTPRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HTTPRequest | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'init') {
        setRequests(msg.requests);
        setIsCapturing(msg.capturing);
      } else if (msg.type === 'status') {
        setIsCapturing(msg.capturing);
      } else if (msg.type === 'request') {
        setRequests(prev => [msg.request, ...prev]);
      }
    };
    wsRef.current = ws;
    return () => ws.close();
  }, []);

  const startCapture = () => fetch('/api/capture/start', { method: 'POST' });
  const stopCapture = () => fetch('/api/capture/stop', { method: 'POST' });
  const clearRequests = () => {
    fetch('/api/requests', { method: 'DELETE' });
    setSelectedRequest(null);
  };
  const exportTraffic = () => window.open('/api/export');

  const handleUpdate = (updated: HTTPRequest) => {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <div className="flex items-center gap-3 p-3 border-b border-[#323232] bg-[#252526] rounded-t-lg">
        <Button variant="default" size="sm" onClick={() => {
          const newReq: HTTPRequest = { id: Date.now().toString(), method: 'GET', url: '', headers: {}, body: '', timestamp: new Date().toISOString() };
          setRequests(prev => [newReq, ...prev]);
          setSelectedRequest(newReq);
        }}><Plus size={16}/>New</Button>

        {isCapturing ?
          <Button variant="destructive" size="sm" onClick={stopCapture}><Pause size={16}/>Stop</Button>
          : <Button variant="default" size="sm" onClick={startCapture}><Play size={16}/>Start</Button>}

        <Button variant="outline" size="sm" onClick={clearRequests}><Trash2 size={16}/>Clear</Button>
        <Button variant="outline" size="sm" onClick={exportTraffic}><Download size={16}/>Export</Button>
      </div>

      <div className="flex-1 flex">
        <RequestList
          requests={requests}
          selectedRequest={selectedRequest}
          onRequestSelect={setSelectedRequest}
        />
        <RequestDetails
          request={selectedRequest}
          onSend={handleUpdate}
        />
      </div>
    </div>
  );
};

export default HTTPTrafficAnalyzer;