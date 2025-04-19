import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

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
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputBufferRef = useRef<string>("");
  // Track whether we should ignore the next server response (command echo)
  const shouldIgnoreNextEchoRef = useRef<boolean>(false);

  // Initialize xterm and WebSocket connection
  useEffect(() => {
    // Make sure xterm.js is available
    if (!terminalRef.current) return;

    // Create xterm instance
    xtermRef.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        cursor: "#ffffff"
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      convertEol: true,
      cols: 80,
      rows: 24,
      scrollback: 5000,
      disableStdin: false,
      allowTransparency: true
    });

    // Add fit addon
    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);
    
    // Open terminal
    xtermRef.current.open(terminalRef.current);
    
    // Connect to WebSocket server
    wsRef.current = new WebSocket('ws://localhost:3002');

    wsRef.current.onopen = () => {
      if (xtermRef.current) {
        xtermRef.current.write('\r\n$ ');
      }
    };

    wsRef.current.onmessage = (event) => {
      if (xtermRef.current) {
        // Process and write server output
        xtermRef.current.write(event.data);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (xtermRef.current) {
        xtermRef.current.write('\r\nConnection error\r\n');
      }
    };

    wsRef.current.onclose = () => {
      if (xtermRef.current) {
        xtermRef.current.write('\r\nConnection closed\r\n');
      }
    };

    // Handle terminal input
    if (xtermRef.current) {
      xtermRef.current.onData((data) => {
        if (data === '\r') { // Enter key
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // Store command for history
            const commandToSend = inputBufferRef.current;
            
            // Send command to server
            wsRef.current.send(commandToSend + '\n');
            
            // Write locally for immediate feedback, but only once
            xtermRef.current?.write('\r\n');
            
            // Add to command history
            if (commandToSend.trim()) {
              setHistory(prev => [...prev, commandToSend]);
              if (onExecuteCommand) {
                onExecuteCommand(commandToSend);
              }
            }
            
            // Clear input buffer
            inputBufferRef.current = "";
          }
        } else if (data === '\u007F') { // Backspace
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            if (xtermRef.current) {
              xtermRef.current.write('\b \b');
            }
          }
        } else if (data === '\u0003') { // Ctrl+C
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send('\u0003');
          }
          inputBufferRef.current = "";
          if (xtermRef.current) {
            xtermRef.current.write('^C\r\n$ ');
          }
        } else if (data === '\u0018') { // Ctrl+X
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send('\u0018');
          }
          inputBufferRef.current = "";
          if (xtermRef.current) {
            xtermRef.current.write('^X\r\n$ ');
          }
        } else {
          // Regular text input
          inputBufferRef.current += data;
          if (xtermRef.current) {
            xtermRef.current.write(data);
          }
        }
      });
    }

    // Resize handler
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        
        if (xtermRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'resize',
            cols: xtermRef.current.cols,
            rows: xtermRef.current.rows
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      wsRef.current?.close();
      xtermRef.current?.dispose();
    };
  }, [onExecuteCommand]);

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.write('\r\n$ ');
    }
  };

  // Expose method to execute commands programmatically
  useImperativeHandle(ref, () => ({
    executeCommand: (cmd: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && xtermRef.current) {
        // Just write the command, don't echo it
        xtermRef.current.write(`${cmd}`);
        wsRef.current.send(cmd + '\n');
        
        if (onExecuteCommand) {
          onExecuteCommand(cmd);
        }
      }
    },
  }));

  return (
    <div className={cn("flex flex-col h-full bg-[#1e1e1e] border border-[#323232]", className)}>
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
        ref={terminalRef} 
        className="flex-grow overflow-auto" 
        style={{ position: 'relative' }}
      />
    </div>
  );
});

Terminal.displayName = "Terminal";

export default Terminal;