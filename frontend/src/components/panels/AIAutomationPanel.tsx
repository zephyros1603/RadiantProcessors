//AIAutomationPanel.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Send, Bot, Trash, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateResponse } from '@/lib/api';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  commands?: string[];
}

const AIAutomationPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello! I\'m your cybersecurity AI assistant. How can I help you with security testing, automation, or vulnerability assessment today?',
      timestamp: new Date(),
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [deepthink, setDeepthink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsThinking(true);
    
    try {
      const response = await generateResponse(prompt, deepthink);
      const aiMessage: Message = {
        role: 'ai',
        content: response.response,
        timestamp: new Date(),
        commands: response.commands
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
      });
    } finally {
      setIsThinking(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const clearConversation = () => {
    setMessages([
      {
        role: 'ai',
        content: 'Hello! I\'m your cybersecurity AI assistant. How can I help you with security testing, automation, or vulnerability assessment today?',
        timestamp: new Date(),
      }
    ]);
  };

  const downloadConversation = () => {
    const text = messages.map(m => 
      `${m.role.toUpperCase()} (${m.timestamp.toLocaleString()}):\n${m.content}\n${
        m.commands ? '\nCommands:\n' + m.commands.join('\n') + '\n' : ''
      }\n`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-ai-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContentWithCopyButtons = (content: string) => {
    return content.split(/(```[\s\S]*?```|`(?!`)[^`]*`)/g).map((part, index) => {
      const isCodeBlock = part.startsWith('```');
      const isInlineCode = part.startsWith('`') && part.endsWith('`') && !isCodeBlock;

      if (isCodeBlock || isInlineCode) {
        const codeContent = part
          .replace(/^```[\s\S]*?\n?/, '')  // Remove starting ```
          .replace(/```$/, '')             // Remove ending ```
          .replace(/^`/, '')               // Remove starting `
          .replace(/`$/, '')               // Remove ending `
          .trim();

        return (
          <div key={index} className="relative group bg-[#1a1a1a] rounded-md p-2 my-2">
            <pre className={`overflow-x-auto whitespace-pre-wrap font-mono text-xs ${
              isCodeBlock ? 'block' : 'inline'
            }`}>
              {codeContent}
            </pre>
            <button
              onClick={() => copyToClipboard(codeContent)}
              className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy size={12} />
            </button>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full p-0 text-white bg-[#252526] relative">
      <div className="p-4 border-b border-[#323232] flex items-center justify-between">
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold">Security AI Assistant</h2>
        </div>
        <div className="flex text-black space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearConversation}
            className="border-[#444] text-bg hover:bg-[#3a3a3a]"
          >
            <Trash size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadConversation}
            className="border-[#444] text-bg hover:bg-[#3a3a3a]"
          >
            <Download size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-[#2d2d2d] text-white'
              }`}
            >
              {message.role === 'ai' && (
                <div className="flex items-center mb-1">
                  <Bot size={16} className="mr-2 text-blue-400" />
                  <span className="text-sm text-blue-400">AI Assistant</span>
                </div>
              )}
              
              <div className="text-sm whitespace-pre-wrap">
                {renderContentWithCopyButtons(message.content)}
              </div>
              
              {message.commands && (
                <div className="mt-3 space-y-2">
                  {message.commands.map((cmd, cmdIdx) => (
                    <div key={cmdIdx} className="bg-[#1a1a1a] rounded-md overflow-hidden">
                      <div className="p-2 font-mono text-xs overflow-x-auto whitespace-pre-wrap relative">
                        {cmd}
                        <button 
                          onClick={() => copyToClipboard(cmd)}
                          className="absolute right-1 top-1 p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-[#2d2d2d] rounded-lg p-3 flex items-center space-x-2">
              <Bot size={16} className="text-blue-400" />
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-[#323232]">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Textarea
            placeholder="Ask about security testing, vulnerability scanning, or automation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-[#1e1e1e] border-[#444] text-white resize-none min-h-[40px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isThinking || !prompt.trim()}
            className="ml-2 bg-blue-600 hover:bg-blue-700 p-2 h-[40px] w-[40px]"
          >
            <Send size={18} />
          </Button>
        </form>
        <Button 
          variant='ghost'
          onClick={() => setDeepthink((prev) => !prev)}
          className={`m-2 rounded-full border-2 opacity-85 ${deepthink ? 'bg-neutral-300/30 text-white' : ''}`}
        >
          Deepthink
        </Button>
      </div>
    </div>
  );
};

export default AIAutomationPanel;



// curl -X POST http://localhost:8000/analyze-tool \
//   -H "Content-Type: application/json" \
//   -d '{
//     "tool_output": "Starting Nmap 7.93 ( https://nmap.org ) at 2023-04-20 15:30 UTC\nNmap scan report for target.example.com (192.168.1.100)\nHost is up (0.015s latency).\nNot shown: 994 closed tcp ports (reset)\nPORT    STATE SERVICE  VERSION\n22/tcp  open  ssh      OpenSSH 8.2p1 (protocol 2.0)\n80/tcp  open  http     nginx 1.18.0\n443/tcp open  https    nginx 1.18.0\n",
//     "tool_name": "nmap",
//     "temperature": 0.7,
//     "max_tokens": 800
//   }'