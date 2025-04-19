
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type HTTPRequest } from './types';

interface RequestDetailsProps {
  request: HTTPRequest | null;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request }) => {
  if (!request) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#1e1e1e]">
        Select a request to view details
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1e1e1e]">
      <Tabs defaultValue="headers" className="h-full">
        <TabsList className="bg-[#252526] border-b border-[#323232] w-full justify-start h-10 p-1">
          <TabsTrigger value="headers" className="h-8">Headers</TabsTrigger>
          <TabsTrigger value="body" className="h-8">Body</TabsTrigger>
          <TabsTrigger value="cookies" className="h-8">Cookies</TabsTrigger>
          <TabsTrigger value="timing" className="h-8">Timing</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100%-2.5rem)]">
          <TabsContent value="headers" className="p-4 m-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">General</h3>
                <div className="space-y-2 text-sm">
                  <div>Request URL: {request.url}</div>
                  <div>Request Method: {request.method}</div>
                  <div>Status Code: {request.status}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Response Headers</h3>
                <pre className="text-sm bg-[#252526] p-3 rounded">
                  {JSON.stringify({
                    'content-type': 'application/json',
                    'cache-control': 'no-cache',
                  }, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Request Headers</h3>
                <pre className="text-sm bg-[#252526] p-3 rounded">
                  {JSON.stringify({
                    'accept': 'application/json',
                    'user-agent': 'Mozilla/5.0',
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="body" className="p-4 m-0">
            <pre className="text-sm bg-[#252526] p-3 rounded">
              {JSON.stringify({ message: 'Response body will appear here' }, null, 2)}
            </pre>
          </TabsContent>
          
          <TabsContent value="cookies" className="p-4 m-0">
            <pre className="text-sm bg-[#252526] p-3 rounded">
              {JSON.stringify({ cookies: [] }, null, 2)}
            </pre>
          </TabsContent>
          
          <TabsContent value="timing" className="p-4 m-0">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">Total Time:</span> {request.responseTime}ms
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default RequestDetails;
