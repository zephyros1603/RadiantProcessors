import React, { useState } from 'react';
import { Search, Filter, Play, Pause, Trash2, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
import { type HTTPRequest } from './types';

const HTTPTrafficAnalyzer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<HTTPRequest | null>(null);
  
  const handleStartCapture = () => {
    setIsCapturing(true);
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  const handleClearRequests = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Control Panel */}
      <div className="flex items-center gap-3 p-3 border-b border-[#323232] bg-[#252526] rounded-t-lg">
        <div className="flex items-center space-x-2">
          {isCapturing ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStopCapture}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 border border-red-700 shadow-md"
            >
              <Pause size={16} />
              Stop Capture
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleStartCapture}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 border border-green-700 shadow-md"
            >
              <Play size={16} />
              Start Capture
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Filter requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-[#1e1e1e] border-[#323232] text-white h-9 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-[#3a3a3a] text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] transition-colors duration-200"
          >
            <Filter size={16} />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearRequests}
            className="flex items-center gap-2 border-[#3a3a3a] text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] transition-colors duration-200"
          >
            <Trash2 size={16} />
            Clear
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-[#3a3a3a] text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] transition-colors duration-200"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <RequestList
          onRequestSelect={setSelectedRequest}
          selectedRequest={selectedRequest}
        />
        <RequestDetails request={selectedRequest} />
      </div>
    </div>
  );
};

export default HTTPTrafficAnalyzer;
