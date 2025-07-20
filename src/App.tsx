import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import EmployeeForm from './components/EmployeeForm';
import PredictionDisplay from './components/PredictionDisplay';
import BlockchainIntegration from './components/BlockchainIntegration';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator />
        
        <div className="space-y-8">
          <EmployeeForm />
          <PredictionDisplay />
          <BlockchainIntegration />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-4">Employee Compliance Automation System</p>
            <div className="text-sm space-y-2">
              <p><strong>Configuration:</strong></p>
              <p>• ML Model API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}</p>
              <p>• Blockchain Network: {import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'sepolia'}</p>
              <p>• Contract Address: {import.meta.env.VITE_CONTRACT_ADDRESS || 'Not configured'}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;