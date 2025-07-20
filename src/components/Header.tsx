import React from 'react';
import { Shield, Database, Link2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Employee Compliance Automation</h1>
              <p className="text-sm text-gray-600">ML-powered compliance prediction with blockchain integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Database className="w-4 h-4 mr-1" />
              <span>ML Model</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Link2 className="w-4 h-4 mr-1" />
              <span>Blockchain</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}