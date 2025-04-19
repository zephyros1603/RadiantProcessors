import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { FileDown, FileText, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  content: string;
  timestamp: string;
}

const ReportPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Generate the report
      const genResponse = await fetch('http://localhost:8000/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!genResponse.ok) {
        throw new Error('Failed to generate report');
      }

      // Wait for file to be written
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Download the report
      const downloadResponse = await fetch('http://localhost:8000/download-report');
      
      if (!downloadResponse.ok) {
        throw new Error('Failed to download report');
      }
      
      const reportText = await downloadResponse.text();
      if (!reportText) {
        throw new Error('Empty report received');
      }

      setReport(reportText);
      toast.success('Report generated successfully');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const copyReport = async () => {
    if (report) {
      try {
        await navigator.clipboard.writeText(report);
        toast.success('Report copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy report');
      }
    }
  };

  const downloadReport = () => {
    if (report) {
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${new Date().toISOString()}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Security Report Generator</h2>
      
      <div className="mb-4 p-4 bg-[#252526] rounded border border-[#444]">
        <h3 className="text-lg font-medium mb-2">Report Actions</h3>
        <div className="flex space-x-2">
          <Button 
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button 
            variant="outline" 
            className="border-[#444] text-white hover:bg-[#3a3a3a]"
            onClick={downloadReport}
            disabled={!report}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download MD
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-[#252526] rounded border border-[#444]">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Report Preview</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyReport}
              disabled={!report}
            >
              <Copy size={16} className="mr-1" /> Copy
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <RefreshCw className="animate-spin mr-2" />
              Generating report...
            </div>
          ) : report ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              Click 'Generate Report' to create a new security report
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;