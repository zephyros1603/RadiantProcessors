import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type HTTPRequest } from './types';

interface Props {
  requests: HTTPRequest[];
  selectedRequest: HTTPRequest | null;
  onRequestSelect: (req: HTTPRequest) => void;
}

const RequestList: React.FC<Props> = ({ requests, selectedRequest, onRequestSelect }) => {
  const methodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-red-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const statusColor = (s?: number) => {
    if (!s) return 'bg-gray-500';
    if (s < 300) return 'bg-green-500';
    if (s < 400) return 'bg-blue-500';
    if (s < 500) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div className="w-1/2 border-r border-[#323232] bg-[#1e1e1e]">
      <ScrollArea className="h-full">
        {requests.map(req => (
          <div
            key={req.id}
            onClick={() => onRequestSelect(req)}
            className={`p-3 border-b border-[#323232] cursor-pointer hover:bg-[#2a2a2a] ${selectedRequest?.id === req.id ? 'bg-[#2a2a2a]' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${methodColor(req.method)} text-xs`}>{req.method}</Badge>
              {req.response && <Badge className={`${statusColor(req.response.status)} text-xs`}>{req.response.status}</Badge>}
            </div>
            <div className="text-sm text-gray-300 truncate">{req.url}</div>
            <div className="text-xs text-gray-500 mt-1">{new Date(req.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default RequestList;