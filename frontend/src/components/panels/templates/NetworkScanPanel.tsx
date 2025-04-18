
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const NetworkScanPanel: React.FC = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('Quick');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState('');
  const [options, setOptions] = useState({
    portScan: true,
    serviceScan: true,
    osDetection: false,
    scriptScan: false,
    timing: '3'
  });
  const { toast } = useToast();

  const scanTypes = ['Quick', 'Full', 'Vulnerability', 'Stealth'];
  const timingOptions = [
    { value: '0', label: 'Paranoid (0) - Very slow, evades IDS' },
    { value: '3', label: 'Normal (3) - Default' },
    { value: '5', label: 'Aggressive (5) - Fast but noisy' }
  ];

  const handleStartScan = () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP or hostname",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setResults('Starting scan...\n');
    
    toast({
      title: "Scan Started",
      description: `${scanType} scan initiated on ${target}`,
    });

    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setResults(prev => `${prev}\n[${progress}%] Scanning ${target}...`);
      
      if (progress >= 100) {
        clearInterval(interval);
        completeScanning();
      }
    }, 500);
  };

  const completeScanning = () => {
    // Generate sample results based on scan type
    setTimeout(() => {
      const scanResults = generateSampleResults();
      setResults(prev => `${prev}\n\nScan completed!\n\n${scanResults}`);
      setIsRunning(false);
      
      toast({
        title: "Scan Complete",
        description: `Finished ${scanType} scan on ${target}`,
      });
    }, 1000);
  };

  const generateSampleResults = () => {
    const openPorts = [];
    
    // Generate some random open ports
    if (options.portScan) {
      if (Math.random() > 0.3) openPorts.push(22);
      if (Math.random() > 0.4) openPorts.push(80);
      if (Math.random() > 0.5) openPorts.push(443);
      if (Math.random() > 0.7) openPorts.push(21);
      if (Math.random() > 0.8) openPorts.push(3306);
      if (Math.random() > 0.9) openPorts.push(5432);
    }
    
    let result = `Nmap scan report for ${target}\n`;
    result += `Host is up (0.045s latency).\n\n`;
    
    if (options.portScan) {
      result += `PORT     STATE SERVICE    VERSION\n`;
      if (openPorts.includes(21)) {
        result += `21/tcp   open  ftp        vsftpd 3.0.3\n`;
      }
      if (openPorts.includes(22)) {
        result += `22/tcp   open  ssh        OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n`;
      }
      if (openPorts.includes(80)) {
        result += `80/tcp   open  http       Apache httpd 2.4.41\n`;
      }
      if (openPorts.includes(443)) {
        result += `443/tcp  open  https      Apache httpd 2.4.41\n`;
      }
      if (openPorts.includes(3306)) {
        result += `3306/tcp open  mysql      MySQL 5.7.38\n`;
      }
      if (openPorts.includes(5432)) {
        result += `5432/tcp open  postgresql PostgreSQL 12.8\n`;
      }
      result += `\n`;
    }
    
    if (options.osDetection) {
      result += `OS details: Ubuntu 20.04.4 LTS (Linux 5.4.0-109-generic)\n`;
    }
    
    if (scanType === 'Vulnerability' && options.scriptScan) {
      result += `\nVulnerability scan results:\n`;
      if (openPorts.includes(80)) {
        result += `- 80/tcp: Potential CVE-2021-41773 (Apache Path Traversal)\n`;
      }
      if (openPorts.includes(22)) {
        result += `- 22/tcp: Using older cipher suites that may be vulnerable\n`;
      }
    }
    
    result += `\nHost script results:\n`;
    result += `- System uptime: ~14.2 days\n`;
    
    return result;
  };

  const generateCommand = () => {
    let command = 'nmap';
    
    // Add scan type flags
    if (scanType === 'Quick') command += ' -T' + options.timing;
    if (scanType === 'Full') command += ' -p- -T' + options.timing;
    if (scanType === 'Vulnerability') command += ' --script vuln -T' + options.timing;
    if (scanType === 'Stealth') command += ' -sS -T' + options.timing;
    
    // Add options
    if (options.serviceScan) command += ' -sV';
    if (options.osDetection) command += ' -O';
    if (options.scriptScan && scanType !== 'Vulnerability') command += ' -sC';
    
    // Add target
    command += ' ' + target;
    
    return command;
  };

  return (
    <div className="flex flex-col h-full p-4 text-white bg-[#252526] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Network Scanning</h2>
      <p className="mb-4 text-sm text-gray-400">
        This module simulates network reconnaissance and scanning. For educational and authorized testing only.
      </p>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Target (IP/Domain/Range)</label>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1 or example.com or 10.0.0.1-254"
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Scan Type</label>
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {scanTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Timing</label>
          <select
            value={options.timing}
            onChange={(e) => setOptions({...options, timing: e.target.value})}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {timingOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm">Options</label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="portScan" 
              checked={options.portScan}
              onCheckedChange={(checked) => 
                setOptions({...options, portScan: checked === true})
              }
            />
            <label htmlFor="portScan" className="text-sm">Port Scan</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="serviceScan" 
              checked={options.serviceScan}
              onCheckedChange={(checked) => 
                setOptions({...options, serviceScan: checked === true})
              }
            />
            <label htmlFor="serviceScan" className="text-sm">Service Detection</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="osDetection" 
              checked={options.osDetection}
              onCheckedChange={(checked) => 
                setOptions({...options, osDetection: checked === true})
              }
            />
            <label htmlFor="osDetection" className="text-sm">OS Detection</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="scriptScan" 
              checked={options.scriptScan}
              onCheckedChange={(checked) => 
                setOptions({...options, scriptScan: checked === true})
              }
            />
            <label htmlFor="scriptScan" className="text-sm">Script Scan</label>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Command Preview</label>
        <div className="bg-black rounded p-2 font-mono text-sm overflow-x-auto">
          {generateCommand()}
        </div>
      </div>
      
      <Button
        onClick={handleStartScan}
        disabled={isRunning}
        className={`w-full mb-4 ${isRunning ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700`}
      >
        {isRunning ? 'Scanning...' : 'Start Scan'}
      </Button>
      
      <div className="flex-1">
        <label className="block text-sm mb-1">Results</label>
        <Textarea
          readOnly
          value={results}
          className="h-48 bg-[#1a1a1a] border-[#333] font-mono text-sm p-2 w-full"
        />
      </div>
    </div>
  );
};

export default NetworkScanPanel;
