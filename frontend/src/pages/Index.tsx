
import React, { useState, useRef } from 'react';
import BrowserView from '@/components/BrowserView';
import Terminal from '@/components/Terminal';
import AIAutomationPanel from '@/components/panels/AIAutomationPanel';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [terminalCommand, setTerminalCommand] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState('ai');
  const terminalRef = useRef<any>(null);

  const handleAiCommandSelect = (command: string) => {
    setTerminalCommand(command);
    if (terminalRef.current && terminalRef.current.executeCommand) {
      terminalRef.current.executeCommand(command);
    }
  };

  // Render the active panel based on the selected sidebar item
  const renderActivePanel = () => {
    switch (activeSidebarItem) {
      // Main menu items
      case 'ai':
        return <AIAutomationPanel />;    
      default:
        return <AIAutomationPanel />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={65} className="rounded-none">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} className="rounded-none">
                <BrowserView />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} className="rounded-none">
                <Terminal ref={terminalRef} onExecuteCommand={(cmd) => console.log('Executed:', cmd)} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} className="rounded-none">
            <div className="flex h-full">
              <div className="flex-1">
                {renderActivePanel()}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  );
};

export default Index;
