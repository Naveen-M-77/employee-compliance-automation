import React, { useState } from 'react';
import { User, Calendar, TrendingUp, Target, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { EmployeeData } from '../types';

export default function EmployeeForm() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<EmployeeData>({
    employeeId: '',
    name: '',
    workingDays: 22,
    targetSales: 50000,
    actualSales: 0,
    customerSatisfactionScore: 5,
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_EMPLOYEE_DATA', payload: formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workingDays' || name === 'targetSales' || name === 'actualSales' || name === 'customerSatisfactionScore'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Data Input</h2>
        <p className="text-gray-600">Enter employee information to predict policy compliance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="EMP001"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Employee Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="workingDays" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Working Days
            </label>
            <input
              type="number"
              name="workingDays"
              id="workingDays"
              value={formData.workingDays}
              onChange={handleChange}
              min="1"
              max="31"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Month
            </label>
            <input
              type="month"
              name="month"
              id="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="targetSales" className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline w-4 h-4 mr-2" />
              Target Sales ($)
            </label>
            <input
              type="number"
              name="targetSales"
              id="targetSales"
              value={formData.targetSales}
              onChange={handleChange}
              min="0"
              step="1000"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="actualSales" className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="inline w-4 h-4 mr-2" />
              Actual Sales ($)
            </label>
            <input
              type="number"
              name="actualSales"
              id="actualSales"
              value={formData.actualSales}
              onChange={handleChange}
              min="0"
              step="1000"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="customerSatisfactionScore" className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="inline w-4 h-4 mr-2" />
              Customer Satisfaction Score
            </label>
            <select
              name="customerSatisfactionScore"
              id="customerSatisfactionScore"
              value={formData.customerSatisfactionScore}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Continue to Prediction
          </button>
        </div>
      </form>
    </div>
  );
}