// src/components/RequestDetails.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { type HTTPRequest } from './types';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '';

interface Props {
  request: HTTPRequest | null;
  onSend: (updated: HTTPRequest) => void;
}

const RequestDetails: React.FC<Props> = ({ request, onSend }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<{[k: string]: string}>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (!request) return;
    setMethod(request.method);
    setUrl(request.url);
    setHeaders(request.headers || {});
    setBody(request.body || '');
    setResponse(request.response || null);
  }, [request]);

  const handleSend = async () => {
    if (!request) return;
    try {
      const res = await fetch(`${API_BASE}/api/requests/${request.id}/send`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ method, url, headers, body }),
      });
      if (!res.ok) console.error('HTTP error', await res.text());
      const updated = await res.json();
      setResponse(updated.response);
      onSend(updated);
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };

  if (!request) return <div className="flex-1 p-4">Select or create a request</div>;

  return (
    <div className="flex-1 flex flex-col p-4 overflow-auto">
      <div className="flex gap-2 mb-4">
        <select value={method} onChange={e => setMethod(e.target.value)} className="bg-[#252526] p-1">
          {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m}>{m}</option>)}
        </select>
        <input
          className="flex-1 bg-[#1e1e1e] p-1"
          value={url}
          placeholder="https://api.example.com"
          onChange={e => setUrl(e.target.value)}
        />
        <Button onClick={handleSend}><Send size={16}/> Send</Button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* Request Headers */}
        <div>
          <h3 className="font-semibold mb-2">Headers</h3>
          <pre className="bg-[#252526] p-2 overflow-auto text-sm">{JSON.stringify(headers, null, 2)}</pre>
        </div>

        {/* Request Body */}
        <div>
          <h3 className="font-semibold mb-2">Body</h3>
          <pre className="bg-[#252526] p-2 overflow-auto text-sm">{body || '<empty>'}</pre>
        </div>

        {/* Response */}
        <div>
          <h3 className="font-semibold mb-2">Response</h3>
          {response ? (
            <div className="space-y-2 overflow-auto text-sm">
              <div><strong>Status:</strong> {response.status} {response.statusText}</div>
              <div><strong>Duration:</strong> {response.duration} ms</div>
              <div><strong>Headers:</strong>
                <pre className="bg-[#252526] p-2">{JSON.stringify(response.headers, null, 2)}</pre>
              </div>
              <div><strong>Body:</strong>
                <pre className="bg-[#252526] p-2 overflow-auto">{response.body}</pre>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No response yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;

