
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Send, Bot, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CommandSuggestion {
  command: string;
  description: string;
}

interface AiHelperProps {
  className?: string;
  onSelectCommand?: (command: string) => void;
}

const AiHelper: React.FC<AiHelperProps> = ({ className, onSelectCommand }) => {
  const [target, setTarget] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, commands?: CommandSuggestion[]}[]>([
    {
      role: 'ai',
      content: 'vulnerabilities',
      commands: [
        {
          command: 'sslscan --no-failed example.com',
          description: 'Scan for SSL/TLS vulnerabilities excluding failed ciphers'
        }
      ]
    },
    {
      role: 'ai',
      content: 'here is detailed command to execute for such low vulnerabilities',
      commands: [
        {
          command: 'nmap -sV -p- --script=vuln target.com',
          description: 'Here is a detailed command to execute for the requested task:'
        }
      ]
    }
  ]);
  
  const suggestions: CommandSuggestion[] = [
    {
      command: 'sslscan --no-failed example.com',
      description: 'Scan for SSL/TLS vulnerabilities excluding failed ciphers'
    },
    {
      command: 'nmap -sV -p- --script=vuln target.com',
      description: 'Run Nmap with vulnerability scripts on all ports'
    },
    {
      command: 'dirb http://target.com /usr/share/dirb/wordlists/common.txt',
      description: 'Directory brute-forcing with common wordlist'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {role: 'user', content: prompt}]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai', 
          content: `Based on your target ${target || 'domain'}, here are some recommended commands to execute:`,
          commands: suggestions
        }
      ]);
    }, 1000);
    
    setPrompt('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (onSelectCommand) {
      onSelectCommand(text);
    }
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'I have generated a vulnerability report for your target.',
          commands: [
            {
              command: 'cat report.txt',
              description: 'View the generated vulnerability report'
            }
          ]
        }
      ]);
    }, 2000);
  };

  return (
    <div className={cn("flex flex-col h-full bg-[#252526] border border-[#323232]", className)}>
      <div className="p-4 border-b border-[#323232]">
        <h2 className="text-xl font-semibold text-white text-center mb-4">AI Code Helper</h2>
        <div className="flex space-x-2 mb-2">
          <Input
            type="text"
            placeholder="Enter target domain/IP"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="flex-grow bg-[#1e1e1e] text-white border-[#323232] focus:border-blue-500"
          />
          <Button 
            onClick={generateReport} 
            disabled={isGeneratingReport || !target}
            className="bg-[#1e1e1e] hover:bg-blue-600 text-white"
          >
            <FileText size={16} className="mr-2" />
            {isGeneratingReport ? 'Generating...' : 'Report'}
          </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, idx) => (
          <div key={idx} className={`mb-6 ${message.role === 'user' ? 'pl-6' : ''}`}>
            {message.role === 'ai' && (
              <div className="flex items-center mb-1">
                <span className="text-gray-300 font-medium">{message.content}</span>
                <div className="ml-auto flex">
                  <ChevronUp className="text-gray-400 mr-1 cursor-pointer hover:text-white" size={16} />
                  <ChevronDown className="text-gray-400 cursor-pointer hover:text-white" size={16} />
                </div>
              </div>
            )}
            
            {message.commands && (
              <div className="space-y-3">
                {message.commands.map((cmd, cmdIdx) => (
                  <div key={cmdIdx} className="bg-black rounded-md overflow-hidden">
                    <div className="p-3 font-mono text-white relative">
                      {cmd.command}
                      <button 
                        onClick={() => copyToClipboard(cmd.command)}
                        className="absolute right-2 top-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                      >
                        copy
                      </button>
                    </div>
                    {cmd.description && cmd.description !== 'Here is a detailed command to execute for the requested task:' && (
                      <div className="p-3 text-sm text-gray-300 border-t border-gray-800">
                        <p>{cmd.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-[#323232] relative">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="PUT UR PROMPT HERE"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow p-2 bg-white text-black border border-gray-300 rounded-l focus:outline-none"
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r">
            <Send size={20} />
          </button>
          <div className="text-blue-500 ml-2">
            <Bot size={24} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiHelper;
