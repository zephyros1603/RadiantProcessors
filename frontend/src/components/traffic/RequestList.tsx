import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type HTTPRequest } from './types';

interface RequestListProps {
  selectedRequest: HTTPRequest | null;
  onRequestSelect: (request: HTTPRequest) => void;
}

const RequestList: React.FC<RequestListProps> = ({ selectedRequest, onRequestSelect }) => {
  // Temporary mock data
  const requests: HTTPRequest[] = [
    {
      id: '1',
      method: 'GET',
      url: 'https://api.example.com/users',
      status: 200,
      timestamp: new Date().toISOString(),
      responseTime: 150,
    },
    {
      id: '2',
      method: 'POST',
      url: 'https://api.example.com/auth',
      status: 401,
      timestamp: new Date().toISOString(),
      responseTime: 250,
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-green-500';
    if (status < 400) return 'bg-yellow-500';
    if (status < 500) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-1/2 border-r border-[#323232] bg-[#1e1e1e]">
      <ScrollArea className="h-full">
        {requests.map((request) => (
          <div
            key={request.id}
            onClick={() => onRequestSelect(request)}
            className={`
              p-3 border-b border-[#323232] cursor-pointer hover:bg-[#2a2a2a]
              ${selectedRequest?.id === request.id ? 'bg-[#2a2a2a]' : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className={`${getMethodColor(request.method)} text-xs`}>
                {request.method}
              </Badge>
              <Badge variant="secondary" className={`${getStatusColor(request.status)} text-xs`}>
                {request.status}
              </Badge>
              <span className="text-xs text-gray-400">{request.responseTime}ms</span>
            </div>
            <div className="text-sm truncate text-gray-300">
              {request.url}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default RequestList;
