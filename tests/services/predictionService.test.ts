import { describe, it, expect, vi, beforeEach } from 'vitest';
import { predictCompliance } from '../../src/services/predictionService';
import { EmployeeData } from '../../src/types';

describe('PredictionService', () => {
  const mockEmployeeData: EmployeeData = {
    employeeId: 'EMP001',
    name: 'John Doe',
    workingDays: 22,
    targetSales: 50000,
    actualSales: 45000,
    customerSatisfactionScore: 4,
    month: '2024-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a prediction result with correct structure', async () => {
    const result = await predictCompliance(mockEmployeeData);
    
    expect(result).toHaveProperty('isCompliant');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('derivedFields');
    expect(result.derivedFields).toHaveProperty('lowWorkingDays');
    expect(result.derivedFields).toHaveProperty('targetNotMet');
    expect(result.derivedFields).toHaveProperty('lowCustomerSatisfaction');
    
    expect(typeof result.isCompliant).toBe('boolean');
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('predicts compliant for good performance', async () => {
    const goodPerformanceData: EmployeeData = {
      ...mockEmployeeData,
      workingDays: 22,
      actualSales: 55000, // Above target
      customerSatisfactionScore: 5,
    };
    
    const result = await predictCompliance(goodPerformanceData);
    
    expect(result.isCompliant).toBe(true);
    expect(result.derivedFields.lowWorkingDays).toBe(false);
    expect(result.derivedFields.targetNotMet).toBe(false);
    expect(result.derivedFields.lowCustomerSatisfaction).toBe(false);
    expect(result.nonComplianceReason).toBeUndefined();
  });

  it('predicts non-compliant for poor performance', async () => {
    const poorPerformanceData: EmployeeData = {
      ...mockEmployeeData,
      workingDays: 15, // Low working days
      actualSales: 30000, // Below target
      customerSatisfactionScore: 2, // Low satisfaction
    };
    
    const result = await predictCompliance(poorPerformanceData);
    
    expect(result.isCompliant).toBe(false);
    expect(result.derivedFields.lowWorkingDays).toBe(true);
    expect(result.derivedFields.targetNotMet).toBe(true);
    expect(result.derivedFields.lowCustomerSatisfaction).toBe(true);
    expect(result.nonComplianceReason).toBeDefined();
    expect(result.nonComplianceReason).toContain('Insufficient working days');
  });

  it('calculates derived fields correctly', async () => {
    const testData: EmployeeData = {
      ...mockEmployeeData,
      workingDays: 16, // Should trigger lowWorkingDays (< 18)
      actualSales: 35000, // Should trigger targetNotMet (< 80% of 50000)
      customerSatisfactionScore: 3, // Should trigger lowCustomerSatisfaction (< 3.5)
    };
    
    const result = await predictCompliance(testData);
    
    expect(result.derivedFields.lowWorkingDays).toBe(true);
    expect(result.derivedFields.targetNotMet).toBe(true);
    expect(result.derivedFields.lowCustomerSatisfaction).toBe(true);
  });

  it('handles edge cases for sales performance', async () => {
    const edgeCaseData: EmployeeData = {
      ...mockEmployeeData,
      actualSales: 40000, // Exactly 80% of target
    };
    
    const result = await predictCompliance(edgeCaseData);
    
    expect(result.derivedFields.targetNotMet).toBe(false); // Should be false at exactly 80%
  });

  it('simulates API delay', async () => {
    const startTime = Date.now();
    await predictCompliance(mockEmployeeData);
    const endTime = Date.now();
    
    // Should take at least 1000ms due to simulated delay (with some tolerance)
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
  }, 10000);

  it('generates non-compliance reasons correctly', async () => {
    const multipleIssuesData: EmployeeData = {
      ...mockEmployeeData,
      workingDays: 10,
      actualSales: 20000,
      customerSatisfactionScore: 1,
    };
    
    const result = await predictCompliance(multipleIssuesData);
    
    if (!result.isCompliant && result.nonComplianceReason) {
      expect(result.nonComplianceReason).toContain('Insufficient working days');
      expect(result.nonComplianceReason).toContain('Sales target not met');
      expect(result.nonComplianceReason).toContain('Low customer satisfaction');
    }
  });
});