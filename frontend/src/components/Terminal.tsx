
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface TerminalProps {
  className?: string;
  onExecuteCommand?: (command: string) => void;
}

export interface TerminalRef {
  executeCommand: (command: string) => void;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(({ className, onExecuteCommand }, ref) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [output]);

  const simulateOutput = (cmd: string) => {
    if (!cmd.trim()) return;
    
    setHistory(prev => [...prev, cmd]);
    setCommand('');
    
    if (onExecuteCommand) {
      onExecuteCommand(cmd);
    }
    
    // Simulate terminal output based on command
    let simulatedOutput: string[] = [];
    
    if (cmd.includes('nmap')) {
      simulatedOutput = [
        `Starting Nmap scan... Scanning target [1000 ports]`,
        `Discovered open port 22/tcp`,
        `Discovered open port 80/tcp`,
        `Discovered open port 443/tcp`,
        `Scan completed in 3.2s`
      ];
    } else if (cmd.includes('sslscan')) {
      simulatedOutput = [
        `Testing SSL/TLS on target...`,
        `TLS 1.0: Enabled (Insecure)`,
        `TLS 1.1: Enabled (Insecure)`,
        `TLS 1.2: Enabled`,
        `TLS 1.3: Enabled`,
        `Certificate expires in 90 days`,
        `Weak ciphers detected: RC4, 3DES`
      ];
    } else if (cmd.includes('dirb')) {
      simulatedOutput = [
        `DIRB v2.22`,
        `START_TIME: Wed Apr 17 14:21:44 2025`,
        `WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt`,
        `FOUND: /admin/ (Status: 301)`,
        `FOUND: /css/ (Status: 301)`,
        `FOUND: /js/ (Status: 301)`,
        `FOUND: /robots.txt (Status: 200)`
      ];
    } else if (cmd.includes('cat report.txt')) {
      simulatedOutput = [
        `===================== VULNERABILITY REPORT =====================`,
        `Target: ${cmd.replace('cat report.txt', '').trim() || 'target.com'}`,
        `Scan Date: ${new Date().toLocaleString()}`,
        ``,
        `CRITICAL ISSUES:`,
        `- Outdated SSL/TLS configuration (TLS 1.0/1.1 enabled)`,
        `- Weak ciphers detected (RC4, 3DES)`,
        `- Open SSH port (22/tcp) with outdated version`,
        ``,
        `MEDIUM ISSUES:`,
        `- Directory indexing enabled`,
        `- robots.txt reveals sensitive directories`,
        ``,
        `RECOMMENDATIONS:`,
        `- Disable TLS 1.0/1.1 and weak ciphers`,
        `- Update SSH to latest version`,
        `- Disable directory indexing`,
        `- Review robot.txt content`
      ];
    } else {
      simulatedOutput = [`Command executed: ${cmd}`];
    }
    
    setOutput(prev => [...prev, `$ ${cmd}`, ...simulatedOutput]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateOutput(command);
  };

  const clearTerminal = () => {
    setOutput([]);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useImperativeHandle(ref, () => ({
    executeCommand: (cmd: string) => {
      simulateOutput(cmd);
    }
  }));

  return (
    <div 
      className={cn("flex flex-col h-full bg-[#1e1e1e] border border-[#323232]", className)}
      onClick={focusInput}
    >
      <div className="flex items-center px-3 py-1 bg-[#1e1e1e] border-b border-[#323232]">
        <h2 className="text-white font-medium">Terminal</h2>
        <div className="ml-auto flex">
          <button 
            onClick={clearTerminal}
            className="p-1 mr-2 bg-[#252526] rounded text-gray-400 hover:text-white"
            title="Clear terminal"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1 bg-[#252526] rounded text-gray-400 hover:text-white" title="New terminal">
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={terminalOutputRef}
        className="flex-grow p-2 font-mono text-sm text-[#cccccc] overflow-y-auto"
      >
        {output.map((line, index) => (
          <div key={index} className={line.startsWith('$') ? 'text-green-400 mt-1' : 'text-[#cccccc]'}>
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-2 border-t border-[#323232]">
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type command here..."
            className="flex-grow bg-transparent border-none outline-none text-[#cccccc] font-mono text-sm"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
});

Terminal.displayName = "Terminal";

export default Terminal;
