
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Shield, 
  Code2, 
  Bug, 
  Network, 
  Zap,
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e1e] to-[#252526] text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="py-1 px-6 bg-white/5 backdrop-blur-sm border-white/10">
              AI-Powered Security Testing
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Next-Gen Bug Bounty Automation
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Harness the power of AI to automate your security testing workflow. Find vulnerabilities faster and smarter than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/app">
                <Button size="lg" className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Launch Application
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Shield className="w-12 h-12 text-purple-400" />
              <h3 className="text-xl font-semibold">Intelligent Scanning</h3>
              <p className="text-gray-400">Advanced AI algorithms detect vulnerabilities with unprecedented accuracy.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Code2 className="w-12 h-12 text-blue-400" />
              <h3 className="text-xl font-semibold">Code Analysis</h3>
              <p className="text-gray-400">Deep code inspection to identify potential security flaws.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Bug className="w-12 h-12 text-green-400" />
              <h3 className="text-xl font-semibold">Attack Templates</h3>
              <p className="text-gray-400">Pre-built templates for common attack vectors and vulnerabilities.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Network className="w-12 h-12 text-yellow-400" />
              <h3 className="text-xl font-semibold">Network Analysis</h3>
              <p className="text-gray-400">Comprehensive network scanning and vulnerability assessment.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Zap className="w-12 h-12 text-red-400" />
              <h3 className="text-xl font-semibold">Real-time Testing</h3>
              <p className="text-gray-400">Instant feedback and results from your security tests.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Rocket className="w-12 h-12 text-pink-400" />
              <h3 className="text-xl font-semibold">Automated Reports</h3>
              <p className="text-gray-400">Detailed reports and actionable insights from your security tests.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;
