
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, StopCircle, Settings, RefreshCw, Download, Upload, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BurpSuitePanel: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [proxyRunning, setProxyRunning] = useState(false);
  const [dockerStatus, setDockerStatus] = useState('stopped');
  const [scanTarget, setScanTarget] = useState('');
  const [scanType, setScanType] = useState('active');
  const { toast } = useToast();
  
  const handleConnect = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter a Burp Suite API Key",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnected(true);
    toast({
      title: "Success",
      description: "Connected to Burp Suite instance",
    });
  };
  
  const handleStartProxy = () => {
    setProxyRunning(true);
    toast({
      title: "Proxy Started",
      description: "Burp Suite proxy is now intercepting traffic on 127.0.0.1:8080",
    });
  };
  
  const handleStopProxy = () => {
    setProxyRunning(false);
    toast({
      title: "Proxy Stopped",
      description: "Burp Suite proxy has been stopped",
    });
  };
  
  const handleStartDocker = () => {
    setDockerStatus('starting');
    toast({
      title: "Docker Container",
      description: "Starting Burp Suite Docker container...",
    });
    
    // Simulate Docker start process
    setTimeout(() => {
      setDockerStatus('running');
      toast({
        title: "Docker Container",
        description: "Burp Suite Docker container is now running",
      });
    }, 3000);
  };
  
  const handleStopDocker = () => {
    setDockerStatus('stopping');
    toast({
      title: "Docker Container",
      description: "Stopping Burp Suite Docker container...",
    });
    
    // Simulate Docker stop process
    setTimeout(() => {
      setDockerStatus('stopped');
      toast({
        title: "Docker Container",
        description: "Burp Suite Docker container has been stopped",
      });
    }, 2000);
  };
  
  const handleStartScan = () => {
    if (!scanTarget) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Scan Started",
      description: `${scanType} scan initiated against ${scanTarget}`,
    });
  };

  return (
    <div className="flex flex-col h-full p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Burp Suite Integration</h2>
      
      <Tabs defaultValue="proxy" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="proxy">Proxy</TabsTrigger>
          <TabsTrigger value="docker">Docker</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proxy" className="space-y-4">
          <div className="flex mb-4">
            <Input
              placeholder="Burp Suite API Key"
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-[#2d2d2d] text-white border-[#444] mr-2"
            />
            <Button 
              className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </Button>
          </div>
          
          <div className="bg-[#252526] rounded border border-[#444] p-4">
            <h3 className="text-lg font-medium mb-3">Proxy Status</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded ${proxyRunning ? 'bg-green-900 text-white' : 'bg-red-900 text-white'} text-xs`}>
                {proxyRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Proxy IP:</span>
              <span>127.0.0.1</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span>Proxy Port:</span>
              <span>8080</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-green-700 hover:bg-green-800" 
                disabled={proxyRunning}
                onClick={handleStartProxy}
              >
                <Play size={16} className="mr-1" /> Start
              </Button>
              <Button 
                className="flex-1 bg-red-700 hover:bg-red-800"
                disabled={!proxyRunning}
                onClick={handleStopProxy}
              >
                <StopCircle size={16} className="mr-1" /> Stop
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="docker" className="space-y-4">
          <div className="bg-[#252526] rounded border border-[#444] p-4">
            <h3 className="text-lg font-medium mb-3">Docker Container</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                dockerStatus === 'running' 
                  ? 'bg-green-900 text-white' 
                  : dockerStatus === 'stopped' 
                    ? 'bg-red-900 text-white'
                    : 'bg-yellow-900 text-white'
              }`}>
                {dockerStatus.charAt(0).toUpperCase() + dockerStatus.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Image:</span>
              <span>burpsuite/professional:latest</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span>Web Interface:</span>
              <span>http://localhost:8080/</span>
            </div>
            <div className="flex space-x-2 mb-4">
              <Button 
                className="flex-1 bg-green-700 hover:bg-green-800"
                disabled={dockerStatus === 'running' || dockerStatus === 'starting'}
                onClick={handleStartDocker}
              >
                <Play size={16} className="mr-1" /> Start Container
              </Button>
              <Button 
                className="flex-1 bg-red-700 hover:bg-red-800"
                disabled={dockerStatus === 'stopped' || dockerStatus === 'stopping'}
                onClick={handleStopDocker}
              >
                <StopCircle size={16} className="mr-1" /> Stop Container
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]">
                <Terminal size={16} className="mr-1" /> Container Console
              </Button>
              <Button className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]">
                <RefreshCw size={16} className="mr-1" /> Restart
              </Button>
            </div>
          </div>
          
          <div className="bg-[#252526] rounded border border-[#444] p-4">
            <h3 className="text-lg font-medium mb-3">Project Management</h3>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]">
                <Upload size={16} className="mr-1" /> Load Project
              </Button>
              <Button className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]">
                <Download size={16} className="mr-1" /> Save Project
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="scanner" className="space-y-4">
          <div className="bg-[#252526] rounded border border-[#444] p-4">
            <h3 className="text-lg font-medium mb-3">Vulnerability Scanner</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Target URL</label>
              <Input 
                placeholder="https://example.com" 
                value={scanTarget}
                onChange={(e) => setScanTarget(e.target.value)}
                className="bg-[#2d2d2d] text-white border-[#444]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Scan Type</label>
              <select 
                className="w-full bg-[#2d2d2d] border border-[#444] rounded p-2 text-white"
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
              >
                <option value="active">Active Scan</option>
                <option value="passive">Passive Scan</option>
                <option value="crawl">Spider Crawl</option>
              </select>
            </div>
            <Button 
              className="w-full bg-[#0e639c] hover:bg-[#1177bb]"
              onClick={handleStartScan}
            >
              Start Scan
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex-1 bg-[#252526] rounded border border-[#444] overflow-hidden mt-4">
        <div className="flex items-center justify-between p-3 border-b border-[#444]">
          <h3 className="font-medium">Recent Activity</h3>
          <Button variant="ghost" size="sm">
            <Settings size={16} />
          </Button>
        </div>
        <div className="p-3 h-[calc(100%-48px)] overflow-auto">
          <div className="space-y-2 text-sm">
            <div className="bg-[#2d2d2d] p-2 rounded">
              <div className="flex justify-between mb-1">
                <span className="font-medium">GET /index.html</span>
                <span className="text-green-500">200 OK</span>
              </div>
              <div className="text-xs text-gray-400">example.com | 10:23:45</div>
            </div>
            <div className="bg-[#2d2d2d] p-2 rounded">
              <div className="flex justify-between mb-1">
                <span className="font-medium">POST /login</span>
                <span className="text-green-500">302 Found</span>
              </div>
              <div className="text-xs text-gray-400">example.com | 10:23:40</div>
            </div>
            <div className="bg-[#2d2d2d] p-2 rounded">
              <div className="flex justify-between mb-1">
                <span className="font-medium">GET /api/users</span>
                <span className="text-yellow-500">403 Forbidden</span>
              </div>
              <div className="text-xs text-gray-400">example.com | 10:23:30</div>
            </div>
            <div className="bg-[#2d2d2d] p-2 rounded">
              <div className="flex justify-between mb-1">
                <span className="font-medium">GET /images/logo.png</span>
                <span className="text-green-500">200 OK</span>
              </div>
              <div className="text-xs text-gray-400">example.com | 10:23:25</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurpSuitePanel;
