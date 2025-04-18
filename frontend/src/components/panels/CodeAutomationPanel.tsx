
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CodeAutomationPanel: React.FC = () => {
  const [scriptType, setScriptType] = useState('python');
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState(`# Example generated Python script
import requests
from bs4 import BeautifulSoup

def scan_website(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        forms = soup.find_all('form')
        return [form.get('action') for form in forms]
    except Exception as e:
        return f"Error: {e}"

# Usage example
if __name__ == "__main__":
    target_url = "https://example.com"
    print(f"Scanning {target_url} for forms...")
    all_results = scan_website(target_url)
    print(f"Found {len(all_results)} forms:")
    for index, form_action in enumerate(all_results, 1):
        print(f"{index}. {form_action}")
`);
  const { toast } = useToast();

  const generateCode = () => {
    // In a real app, this would call an API to generate code based on description
    toast({
      title: "Code Generated",
      description: "Your custom script has been generated.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };

  return (
    <div className="flex flex-col h-full p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Code Automation</h2>
      
      <div className="bg-[#252526] rounded border border-[#444] p-4 mb-4">
        <h3 className="text-lg font-medium mb-2">Custom Script Generator</h3>
        <p className="text-sm text-gray-400 mb-4">
          Generate custom scripts for automating security tasks.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Script Type</label>
          <select 
            className="w-full bg-[#2d2d2d] border border-[#444] rounded p-2 text-white"
            value={scriptType}
            onChange={(e) => setScriptType(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="bash">Bash</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            placeholder="Describe what you want the script to do..." 
            className="bg-[#2d2d2d] text-white border-[#444]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <Button 
          className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
          onClick={generateCode}
        >
          Generate Code
        </Button>
      </div>
      
      <div className="flex-1 bg-[#252526] rounded border border-[#444] p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Generated Code</h3>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy size={16} className="mr-1" /> Copy
          </Button>
        </div>
        <div className="bg-[#1e1e1e] p-3 rounded font-mono text-sm h-[calc(100%-40px)] overflow-auto">
          <pre>
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeAutomationPanel;
