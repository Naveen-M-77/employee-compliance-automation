export interface EmployeeData {
  employeeId: string;
  name: string;
  workingDays: number;
  targetSales: number;
  actualSales: number;
  customerSatisfactionScore: number;
  month: string;
}

export interface PredictionResult {
  isCompliant: boolean;
  confidence: number;
  derivedFields: {
    lowWorkingDays: boolean;
    targetNotMet: boolean;
    lowCustomerSatisfaction: boolean;
  };
  nonComplianceReason?: string;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'failed';
}