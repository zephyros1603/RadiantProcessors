
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download } from 'lucide-react';

const PhishingPanel: React.FC = () => {
  const [targetOrg, setTargetOrg] = useState('');
  const [simulationType, setSimulationType] = useState('Email');
  const [template, setTemplate] = useState('Password Reset');
  const [customTemplate, setCustomTemplate] = useState('');
  const { toast } = useToast();

  const simulationTypes = ['Email', 'SMS', 'Voice', 'Social Media', 'QR Code'];
  
  const templates = {
    'Email': ['Password Reset', 'Account Verification', 'Invoice', 'Security Alert', 'Shared Document'],
    'SMS': ['Bank Alert', 'Package Delivery', 'Verification Code', 'Account Access'],
    'Voice': ['Tech Support', 'Bank Fraud Department', 'Tax Authority'],
    'Social Media': ['Prize Giveaway', 'Job Offer', 'Friend Request'],
    'QR Code': ['Free WiFi', 'Restaurant Menu', 'Event Registration']
  };
  
  const emailTemplates = {
    'Password Reset': `Subject: Urgent: Your ${targetOrg || '[Company]'} Password Needs Reset
    
From: ${targetOrg || '[Company]'} Security Team <security@${targetOrg ? targetOrg.toLowerCase().replace(/\s+/g, '') : 'company'}.com>

Dear Valued User,

Our system has detected an unauthorized access attempt on your account. To protect your information, please reset your password immediately by clicking the link below:

[Reset Password Now]

If you don't reset your password within 24 hours, your account may be temporarily suspended.

Thank you,
${targetOrg || '[Company]'} Security Team`,

    'Account Verification': `Subject: Verify Your ${targetOrg || '[Company]'} Account Now
    
From: ${targetOrg || '[Company]'} Account Team <accounts@${targetOrg ? targetOrg.toLowerCase().replace(/\s+/g, '') : 'company'}.com>

Dear Valued Customer,

We need to verify your account information to ensure continued access to our services. Please click the link below to verify your account details:

[Verify Account]

Failure to verify may result in limited account access.

Regards,
${targetOrg || '[Company]'} Account Management`,

    'Invoice': `Subject: ${targetOrg || '[Company]'} Invoice #INV-2023-4872 - Payment Required
    
From: ${targetOrg || '[Company]'} Billing <invoices@${targetOrg ? targetOrg.toLowerCase().replace(/\s+/g, '') : 'company'}.com>

Dear Customer,

Please find attached your latest invoice (#INV-2023-4872) for services rendered. Payment is due within 7 days.

To view and pay your invoice, please click here:
[View Invoice]

Thank you for your business,
${targetOrg || '[Company]'} Billing Department`,

    'Security Alert': `Subject: ALERT: Suspicious Activity Detected on Your ${targetOrg || '[Company]'} Account
    
From: ${targetOrg || '[Company]'} Security <alerts@${targetOrg ? targetOrg.toLowerCase().replace(/\s+/g, '') : 'company'}.com>

IMPORTANT SECURITY NOTICE

We have detected unusual login activity on your account from a new device in [Location]. If this wasn't you, your account may be compromised.

Secure your account immediately:
[Secure Account Now]

${targetOrg || '[Company]'} Security Team`,

    'Shared Document': `Subject: Shared Document: Q4 Financial Report
    
From: ${targetOrg || '[Company]'} Documents <documents@${targetOrg ? targetOrg.toLowerCase().replace(/\s+/g, '') : 'company'}.com>

A document has been shared with you by the ${targetOrg || '[Company]'} Team.

Document: Q4 Financial Report.xlsx
Shared by: Finance Department

[View Document]

This link will expire in 7 days.`
  };

  const handleGenerateTemplate = () => {
    if (!targetOrg) {
      toast({
        title: "Warning",
        description: "Enter a target organization for better customization",
        variant: "default"
      });
    }
    
    if (simulationType === 'Email') {
      setCustomTemplate(emailTemplates[template as keyof typeof emailTemplates]);
    } else {
      // For non-email templates, generate a simple example
      setCustomTemplate(`${simulationType} Phishing Simulation: ${template}
      
Target: ${targetOrg || '[Organization]'}
Type: ${simulationType}
Template: ${template}

[This is a sample ${simulationType.toLowerCase()} phishing template that would be customized with relevant details for ${template} scenario]`);
    }
    
    toast({
      title: "Template Generated",
      description: `${simulationType} phishing template for "${template}" created`,
    });
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(customTemplate);
    toast({
      title: "Copied!",
      description: "Template copied to clipboard",
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob([customTemplate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${simulationType}_${template.replace(/\s+/g, '_')}_Template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full p-4 text-white bg-[#252526] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Phishing Simulation</h2>
      <p className="mb-4 text-sm text-gray-400">
        This module helps create phishing simulation templates for security awareness training. 
        For educational purposes and authorized testing only.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Target Organization</label>
          <Input
            value={targetOrg}
            onChange={(e) => setTargetOrg(e.target.value)}
            placeholder="ACME Corporation"
            className="bg-[#1e1e1e] border-[#333] w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Simulation Type</label>
          <select
            value={simulationType}
            onChange={(e) => {
              setSimulationType(e.target.value);
              setTemplate(templates[e.target.value as keyof typeof templates][0]);
            }}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {simulationTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] border border-[#333] p-2"
          >
            {templates[simulationType as keyof typeof templates].map((tmpl) => (
              <option key={tmpl} value={tmpl}>{tmpl}</option>
            ))}
          </select>
        </div>
      </div>
      
      <Button
        onClick={handleGenerateTemplate}
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
      >
        Generate Template
      </Button>
      
      <div className="flex-1 mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm">Generated Template</label>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={copyTemplate}>
              <Copy size={14} />
            </Button>
            <Button size="sm" variant="ghost" onClick={downloadTemplate}>
              <Download size={14} />
            </Button>
          </div>
        </div>
        <Textarea
          value={customTemplate}
          onChange={(e) => setCustomTemplate(e.target.value)}
          className="h-64 bg-[#1a1a1a] border-[#333] font-mono text-sm p-2 w-full"
        />
      </div>
      
      <div className="bg-yellow-900/30 border border-yellow-800 p-3 rounded">
        <h3 className="text-sm font-medium mb-1 text-yellow-300">Important Notice</h3>
        <p className="text-xs text-yellow-200">
          Phishing simulations should only be conducted with proper authorization and as part of a security awareness program.
          Always follow ethical guidelines and relevant regulations when conducting security testing.
        </p>
      </div>
    </div>
  );
};

export default PhishingPanel;
