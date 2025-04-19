
import React, { useState, useRef } from 'react';
import HTTPTrafficAnalyzer from '@/components/traffic/HTTPTrafficAnalyzer';
import Terminal from '@/components/Terminal';
import SidebarMenu from '@/components/SidebarMenu';
import AIAutomationPanel from '@/components/panels/AIAutomationPanel';
import CodeAutomationPanel from '@/components/panels/CodeAutomationPanel';
import ReportPanel from '@/components/panels/ReportPanel';
import BurpSuitePanel from '@/components/panels/BurpSuitePanel';
import TemplatesPanel from '@/components/panels/TemplatesPanel';
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
      case 'code':
        return <CodeAutomationPanel />;
      case 'report':
        return <ReportPanel />;
      case 'burp':
        return <BurpSuitePanel />;
        
      // Templates - now all under one panel
      case 'templates':
        return <TemplatesPanel />;
        
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
              <HTTPTrafficAnalyzer />
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
              <div className="border-l border-[#323232] bg-[#252526]">
                <SidebarMenu
                  activeItem={activeSidebarItem}
                  onItemChange={setActiveSidebarItem}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  );
};

export default Index;
