import axios from 'axios';
import { EmployeeData, PredictionResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Mock prediction service - replace with actual ML model API
export async function predictCompliance(data: EmployeeData): Promise<PredictionResult> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock prediction logic based on business rules
    const salesPerformance = data.actualSales / data.targetSales;
    const workingDaysRatio = data.workingDays / 22; // Assuming 22 working days per month
    
    const derivedFields = {
      lowWorkingDays: data.workingDays < 18,
      targetNotMet: salesPerformance < 0.8,
      lowCustomerSatisfaction: data.customerSatisfactionScore < 3.5,
    };
    
    // Determine compliance based on multiple factors
    const complianceScore = 
      (salesPerformance >= 0.8 ? 0.4 : 0) +
      (workingDaysRatio >= 0.8 ? 0.3 : 0) +
      (data.customerSatisfactionScore >= 3.5 ? 0.3 : 0);
    
    const isCompliant = complianceScore >= 0.6;
    const confidence = Math.min(0.95, Math.max(0.55, complianceScore + Math.random() * 0.2));
    
    let nonComplianceReason = '';
    if (!isCompliant) {
      const reasons = [];
      if (derivedFields.lowWorkingDays) reasons.push('Insufficient working days');
      if (derivedFields.targetNotMet) reasons.push('Sales target not met');
      if (derivedFields.lowCustomerSatisfaction) reasons.push('Low customer satisfaction');
      nonComplianceReason = reasons.join(', ');
    }
    
    return {
      isCompliant,
      confidence,
      derivedFields,
      nonComplianceReason: nonComplianceReason || undefined,
    };
  } catch (error) {
    console.error('Prediction service error:', error);
    throw new Error('Failed to get prediction. Please try again.');
  }
}

// Actual API integration example (uncomment when backend is ready)
/*
export async function predictCompliance(data: EmployeeData): Promise<PredictionResult> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Prediction API error:', error);
    throw new Error('Failed to get prediction. Please try again.');
  }
}
*/