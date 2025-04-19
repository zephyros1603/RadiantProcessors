// src/components/RequestList.tsx
import React from 'react';
import { type HTTPRequest } from './types';

interface Props {
  requests: HTTPRequest[];
  selectedRequest: HTTPRequest | null;
  onRequestSelect: (req: HTTPRequest) => void;
}

const RequestList: React.FC<Props> = ({ requests, selectedRequest, onRequestSelect }) => (
  <div className="w-1/3 overflow-y-auto border-r border-[#323232]">
    {requests.map(req => (
      <div
        key={req.id}
        className={`p-2 hover:bg-[#2a2a2a] cursor-pointer ${req.id === selectedRequest?.id ? 'bg-[#333]' : ''}`}
        onClick={() => onRequestSelect(req)}
      >
        <div className="text-sm font-mono">[{req.method}] {req.url || '<no-url>'}</div>
        <div className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleTimeString()}</div>
      </div>
    ))}
  </div>
);

export default RequestList;


