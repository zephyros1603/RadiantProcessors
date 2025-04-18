import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, RefreshCw, Star, Menu, Shield, ArrowRight, AlertTriangle, Settings, Plus, X, ZoomOut, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BrowserViewProps {
  className?: string;
}

const BrowserView: React.FC<BrowserViewProps> = ({ className }) => {
  // State for browser functionality
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showProxyWarning, setShowProxyWarning] = useState(false);
  
  // Browser tabs functionality
  const [tabs, setTabs] = useState<{id: string, url: string, title: string}[]>([
    {id: '1', url: '', title: 'New Tab'}
  ]);
  const [activeTab, setActiveTab] = useState('1');
  
  // Proxy settings
  const [proxyEnabled, setProxyEnabled] = useState(false);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const navigateTo = (newUrl: string) => {
    // Ensure URL has protocol
    let processedUrl = newUrl.trim();
    
    if (processedUrl === '') {
      // Show default browser page if empty
      setUrl('');
      setInputUrl('');
      return;
    }

    // Add protocol if not present
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      // Check if it's a valid domain or might be a search query
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      if (domainRegex.test(processedUrl)) {
        processedUrl = 'https://' + processedUrl;
      } else {
        // Treat as a search query
        processedUrl = 'https://www.google.com/search?q=' + encodeURIComponent(processedUrl);
      }
    }
    
    // Update the URL and history
    setUrl(processedUrl);
    setInputUrl(processedUrl);
    
    // Update tab information
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? {...tab, url: processedUrl, title: processedUrl.substring(0, 30)} : tab
    );
    setTabs(updatedTabs);
    
    // Add to history if it's a new URL
    if (historyIndex === history.length - 1) {
      setHistory([...history.slice(0, historyIndex + 1), processedUrl]);
      setHistoryIndex(historyIndex + 1);
    } else {
      // Cut off the future history if we're navigating from a point in the past
      setHistory([...history.slice(0, historyIndex + 1), processedUrl]);
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
      setInputUrl(history[historyIndex - 1]);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
      setInputUrl(history[historyIndex + 1]);
    }
  };
  
  const goHome = () => {
    navigateTo('');
  };
  
  const refresh = () => {
    // Just re-set the current URL to force a refresh
    const currentUrl = url;
    setUrl('');
    setTimeout(() => setUrl(currentUrl), 100);
  };
  
  const addNewTab = () => {
    const newTabId = String(Date.now());
    setTabs([...tabs, {id: newTabId, url: '', title: 'New Tab'}]);
    setActiveTab(newTabId);
    setUrl('');
    setInputUrl('');
  };
  
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Don't close the last tab, just clear it
      setTabs([{id: tabId, url: '', title: 'New Tab'}]);
      setUrl('');
      setInputUrl('');
      return;
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If we're closing the active tab, activate another one
    if (tabId === activeTab) {
      const indexOfClosedTab = tabs.findIndex(tab => tab.id === tabId);
      const newActiveIndex = indexOfClosedTab === 0 ? 0 : indexOfClosedTab - 1;
      setActiveTab(newTabs[newActiveIndex].id);
      setUrl(newTabs[newActiveIndex].url);
      setInputUrl(newTabs[newActiveIndex].url);
    }
  };
  
  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setUrl(tab.url);
      setInputUrl(tab.url);
    }
  };
  
  const toggleProxy = () => {
    setProxyEnabled(!proxyEnabled);
    // Show a temporary message when proxy is toggled
    setShowProxyWarning(true);
    setTimeout(() => setShowProxyWarning(false), 3000);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  return (
    <div className={cn("flex flex-col h-full border border-[#323232] bg-[#1e1e1e]", className)}>
      {/* Browser tabs */}
      <div className="flex items-center bg-[#252525] border-b border-[#323232] overflow-x-auto">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={cn(
              "flex items-center min-w-[120px] max-w-[200px] h-8 px-3 border-r border-[#323232] cursor-pointer",
              activeTab === tab.id ? "bg-[#1e1e1e]" : "bg-[#252525] hover:bg-[#2a2a2a]"
            )}
            onClick={() => switchTab(tab.id)}
          >
            <span className="truncate flex-1 text-sm text-gray-300">
              {tab.title || 'New Tab'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 text-gray-400 hover:text-white p-0"
              onClick={(e) => closeTab(tab.id, e)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={addNewTab}
        >
          <Plus size={16} />
        </Button>
      </div>
      
      {/* Browser controls */}
      <div className="bg-[#1e1e1e] px-2 py-1 flex items-center border-b border-[#323232]">
        <Button 
          className="p-1 text-gray-400 hover:text-white bg-transparent"
          onClick={goBack}
          disabled={historyIndex <= 0}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button 
          className="p-1 text-gray-400 hover:text-white bg-transparent"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ChevronRight size={18} />
        </Button>
        <Button 
          className="p-1 text-gray-400 hover:text-white bg-transparent"
          onClick={refresh}
        >
          <RefreshCw size={18} />
        </Button>
        <Button 
          className="p-1 text-gray-400 hover:text-white bg-transparent"
          onClick={goHome}
        >
          <Home size={18} />
        </Button>
        
        <form onSubmit={handleUrlSubmit} className="flex-1 px-2">
          <div className="flex items-center bg-[#1e1e1e] border border-[#323232] rounded">
            <Shield className={cn("ml-2", proxyEnabled ? "text-green-500" : "text-gray-400")} size={16} />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter website name"
              className="flex-1 bg-transparent text-sm px-2 py-1 text-white border-none focus:outline-none"
            />
            <Button 
              type="submit" 
              className="p-1 text-gray-400 hover:text-white bg-transparent"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
        
        <Button className="p-1 text-gray-400 hover:text-white bg-transparent">
          <Star size={18} />
        </Button>
        
        <Button 
          onClick={zoomOut}
          className="p-1 text-gray-400 hover:text-white bg-transparent"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </Button>
        
        <span className="text-white text-sm mx-2">{zoomLevel}%</span>
        
        <Button 
          onClick={zoomIn}
          className="p-1 text-gray-400 hover:text-white bg-transparent mr-2"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-1 text-gray-400 hover:text-white bg-transparent">
              <Settings size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#252525] border-[#323232] text-white w-56">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="proxy-toggle" className="cursor-pointer">FoxyProxy Enabled</Label>
                <Switch 
                  id="proxy-toggle" 
                  checked={proxyEnabled} 
                  onCheckedChange={toggleProxy} 
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {proxyEnabled ? "Proxy is active - traffic will be routed through proxy servers" : "Proxy is inactive - direct connection to sites"}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-[#323232]" />
            <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
              View History
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
              Clear Browsing Data
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
              Proxy Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Proxy Warning */}
      {showProxyWarning && (
        <Alert variant="default" className="m-2 bg-green-900 border-green-700 text-green-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Proxy Status Changed</AlertTitle>
          <AlertDescription>
            FoxyProxy is now {proxyEnabled ? 'enabled' : 'disabled'}. Your browsing traffic will be {proxyEnabled ? 'routed through proxy servers' : 'directly connected to websites'}.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Browser content */}
      <div className="flex-grow bg-white overflow-y-auto">
        {url ? (
          <iframe 
            src={url} 
            title="Browser View" 
            className="w-full h-full" 
            sandbox="allow-same-origin allow-scripts allow-forms"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#f9f9f9] text-[#333]">
            <div className="text-6xl font-light mb-4">New Tab</div>
            <div className="max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search the web"
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#333]"
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateTo(inputUrl);
                    }
                  }}
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#666] bg-transparent hover:bg-gray-100 p-2 rounded-full"
                  onClick={() => navigateTo(inputUrl)}
                >
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserView;
