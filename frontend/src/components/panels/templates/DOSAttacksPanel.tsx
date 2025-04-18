
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const DOSAttacksPanel: React.FC = () => {
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [method, setMethod] = useState('HTTP Flood');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const methods = [
    'HTTP Flood',
    'TCP SYN Flood',
    'UDP Flood',
    'ICMP Flood',
    'Slowloris',
    'DNS Amplification'
  ];

  const handleStartAttack = () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target URL or IP",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    toast({
      title: "Simulation Started",
      description: `Simulating ${method} attack on ${target}:${port}`,
    });

    // Simulate stopping after 5 seconds
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Simulation Complete",
        description: `The ${method} attack simulation has finished.`,
      });
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full p-4 text-white bg-[#252526] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">DOS Attack Simulation</h2>
      <p className="mb-4 text-sm text-gray-400">
        This module simulates various Denial of Service (DoS) attacks for educational and testing purposes only.
        Do not use against unauthorized targets.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Target (URL or IP)</label>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com or 192.168.1.1"
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Port</label>
          <Input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="80"
            type="number"
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Attack Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      
      <Button
        onClick={handleStartAttack}
        disabled={isRunning}
        className={`w-full mb-4 ${isRunning ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700`}
      >
        {isRunning ? 'Simulating Attack...' : 'Start Simulation'}
      </Button>
      
      <div className="flex-1">
        <label className="block text-sm mb-1">Output</label>
        <Textarea
          readOnly
          value={isRunning ? `Running ${method} attack simulation against ${target}:${port}...\nSending packets...\nMonitoring response times...` : ''}
          className="h-48 bg-[#1a1a1a] border-[#333] font-mono text-sm p-2 w-full"
        />
      </div>
    </div>
  );
};

export default DOSAttacksPanel;
