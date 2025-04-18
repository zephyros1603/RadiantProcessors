
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Zap, Database, Code, Mail, Scan, 
  Search, ShieldAlert
} from 'lucide-react';
import DOSAttacksPanel from './templates/DOSAttacksPanel';
import SQLInjectionPanel from './templates/SQLInjectionPanel';
import XSSPanel from './templates/XSSPanel';
import PhishingPanel from './templates/PhishingPanel';
import NetworkScanPanel from './templates/NetworkScanPanel';

const TemplatesPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('dos');
  
  const templates = [
    { id: 'dos', name: 'DOS Attacks', icon: Zap, component: DOSAttacksPanel },
    { id: 'sql', name: 'SQL Injections', icon: Database, component: SQLInjectionPanel },
    { id: 'xss', name: 'Cross-Site Scripting', icon: Code, component: XSSPanel },
    { id: 'phishing', name: 'Phishing Simulations', icon: Mail, component: PhishingPanel },
    { id: 'scan', name: 'Network Scanning', icon: Scan, component: NetworkScanPanel },
  ];

  const filteredTemplates = searchTerm 
    ? templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : templates;

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
  };

  const renderTemplateComponent = (ComponentFunc: React.FC) => {
    return <ComponentFunc />;
  };

  return (
    <div className="flex flex-col h-full p-2 sm:p-4 text-white bg-[#252526]">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Attack Templates</h2>
      
      <div className="mb-2 sm:mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-[#1e1e1e] border-[#333]"
        />
      </div>
      
      {filteredTemplates.length > 0 ? (
        <div className="flex flex-col h-full">
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="mb-4 bg-[#1e1e1e] border-[#333] text-white">
              <SelectValue>
                {templates.find(t => t.id === selectedTemplate)?.name || 'Select Template'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
              {filteredTemplates.map(template => (
                <SelectItem 
                  key={template.id} 
                  value={template.id}
                  className="focus:bg-[#2a2a2a] focus:text-white"
                >
                  <div className="flex items-center">
                    <template.icon size={16} className="mr-2" />
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 overflow-y-auto">
            {filteredTemplates.find(t => t.id === selectedTemplate)?.component && 
              renderTemplateComponent(filteredTemplates.find(t => t.id === selectedTemplate)!.component)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-400 p-4">
          <ShieldAlert size={36} className="mb-2 sm:mb-4" />
          <p className="text-sm sm:text-base">No templates match your search.</p>
          <Button 
            variant="link" 
            className="mt-2 text-blue-400 text-sm sm:text-base"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPanel;
