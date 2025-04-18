
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Copy } from 'lucide-react';

const ReportPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Vulnerability Report</h2>
      
      <div className="mb-4 p-4 bg-[#252526] rounded border border-[#444]">
        <h3 className="text-lg font-medium mb-2">Report Actions</h3>
        <div className="flex space-x-2">
          <Button className="bg-[#0e639c] hover:bg-[#1177bb] text-white">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-[#444] text-white hover:bg-[#3a3a3a]">
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-[#252526] rounded border border-[#444]">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Vulnerability Summary</h3>
            <Button variant="ghost" size="sm">
              <Copy size={16} className="mr-1" /> Copy
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#2d2d2d] p-3 rounded">
                <div className="text-sm text-gray-400">Target</div>
                <div className="font-medium">example.com</div>
              </div>
              <div className="bg-[#2d2d2d] p-3 rounded">
                <div className="text-sm text-gray-400">Scan Date</div>
                <div className="font-medium">2023-04-17</div>
              </div>
              <div className="bg-[#2d2d2d] p-3 rounded">
                <div className="text-sm text-gray-400">High Severity</div>
                <div className="font-medium text-red-500">2</div>
              </div>
              <div className="bg-[#2d2d2d] p-3 rounded">
                <div className="text-sm text-gray-400">Medium Severity</div>
                <div className="font-medium text-yellow-500">5</div>
              </div>
            </div>
          </div>
          
          <h4 className="text-base font-medium mb-2">Findings</h4>
          
          <div className="space-y-4">
            <div className="bg-[#2d2d2d] p-3 rounded border-l-4 border-red-500">
              <div className="flex justify-between">
                <h5 className="font-medium">SQL Injection Vulnerability</h5>
                <span className="text-sm text-red-500">High</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Found in: /search.php?query=
              </p>
              <p className="text-sm mt-2">
                The search functionality is vulnerable to SQL injection attacks, allowing 
                potential extraction of sensitive data from the database.
              </p>
            </div>
            
            <div className="bg-[#2d2d2d] p-3 rounded border-l-4 border-yellow-500">
              <div className="flex justify-between">
                <h5 className="font-medium">Cross-Site Scripting (XSS)</h5>
                <span className="text-sm text-yellow-500">Medium</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Found in: /profile.php?user=
              </p>
              <p className="text-sm mt-2">
                The user profile page does not properly sanitize user input, allowing 
                potential execution of malicious scripts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;
