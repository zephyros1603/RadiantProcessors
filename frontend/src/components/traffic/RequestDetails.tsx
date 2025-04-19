import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type HTTPRequest } from './types';

interface Props {
  request: HTTPRequest | null;
  onSend?: (req: HTTPRequest) => void;
}

const RequestDetails: React.FC<Props> = ({ request, onSend }) => {
  const [local, setLocal] = useState<HTTPRequest | null>(null);
  const [resp, setResp] = useState<any>(null);

  useEffect(() => {
    if (request) {
      setLocal({ ...request });
      setResp(request.response || null);
    }
  }, [request]);

  const doSend = async () => {
    if (!local) return;
    const start = performance.now();
    const res = await fetch(local.url, {
      method: local.method,
      headers: local.headers,
      body: local.body || undefined
    });
    const text = await res.text();
    const duration = Math.round(performance.now() - start);
    const data = { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: text, duration };
    setResp(data);
    const updated = { ...local, response: data } as HTTPRequest;
    onSend?.(updated);
  };

  if (!local) return <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#1e1e1e]">Select a request</div>;

  return (
    <div className="flex-1 bg-[#1e1e1e] p-4 flex flex-col overflow-hidden">
      <div className="flex gap-2 mb-4">
        <select
          value={local.method}
          onChange={e => setLocal({ ...local, method: e.target.value })}
          className="bg-[#252526] border-[#323232] text-white p-2 h-9 rounded">
          {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <Input
          className="flex-1 bg-[#252526] border-[#323232] text-white h-9"
          value={local.url}
          onChange={e => setLocal({ ...local, url: e.target.value })}
          placeholder="URL" />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9" onClick={doSend}>Send</Button>
      </div>

      <Tabs defaultValue="headers" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-[#252526] border-b border-[#323232]">
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="headers" className="p-4">
            {Object.entries(local.headers).map(([k,v]) => (
              <div key={k} className="flex gap-2 mb-2">
                <Input value={k} readOnly className="bg-[#252526] border-[#323232] text-white" />
                <Input value={v} readOnly className="bg-[#252526] border-[#323232] text-white" />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="body" className="p-4">
            <pre className="bg-[#252526] p-3 rounded text-sm font-mono whitespace-pre-wrap break-words max-h-60 overflow-auto">{local.body}</pre>
          </TabsContent>

          <TabsContent value="response" className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
  {resp ? (
    <div className="space-y-4">
      <div>Status: {resp.status} ({resp.duration}ms)</div>
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Headers</h3>
        <pre className="bg-[#252526] p-3 rounded text-sm whitespace-pre-wrap break-words overflow-auto">
          {JSON.stringify(resp.headers, null, 2)}
        </pre>
      </div>
      <div>
        <h3 className="text-sm text-gray-400 mb-2">Body</h3>
        <pre className="bg-[#252526] p-3 rounded text-sm font-mono whitespace-pre-wrap break-words overflow-auto">
          {resp.body}
        </pre>
      </div>
    </div>
  ) : <div className="text-sm text-gray-400">No response yet.</div>}
</TabsContent>

        </div>
      </Tabs>
    </div>
  );
};

export default RequestDetails;