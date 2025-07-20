import React from 'react';
import { Check, User, Brain, Link2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function StepIndicator() {
  const { state } = useApp();
  const { employeeData, predictionResult, transaction } = state;

  const steps = [
    {
      id: 1,
      name: 'Employee Data',
      icon: User,
      completed: !!employeeData,
      current: !employeeData,
    },
    {
      id: 2,
      name: 'Prediction',
      icon: Brain,
      completed: !!predictionResult,
      current: !!employeeData && !predictionResult,
    },
    {
      id: 3,
      name: 'Blockchain',
      icon: Link2,
      completed: !!transaction,
      current: !!predictionResult && !transaction,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-8">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="flex items-center">
              <div className="relative flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    step.completed
                      ? 'bg-blue-600 border-blue-600'
                      : step.current
                      ? 'border-blue-600 bg-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <step.icon
                      className={`w-5 h-5 ${
                        step.current ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {stepIdx < steps.length - 1 && (
                <div className="ml-8 w-16 h-0.5 bg-gray-300" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}