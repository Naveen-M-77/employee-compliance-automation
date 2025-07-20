import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from '../../src/contexts/AppContext';
import { EmployeeData, PredictionResult, BlockchainTransaction } from '../../src/types';

// Test component to access context
function TestComponent() {
  const { state, dispatch } = useApp();
  
  return (
    <div>
      <div data-testid="loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || 'null'}</div>
      <div data-testid="employee-data">{state.employeeData ? 'exists' : 'null'}</div>
      <div data-testid="prediction-result">{state.predictionResult ? 'exists' : 'null'}</div>
      <div data-testid="transaction">{state.transaction ? 'exists' : 'null'}</div>
      
      <button 
        onClick={() => dispatch({ type: 'SET_LOADING', payload: true })}
        data-testid="set-loading"
      >
        Set Loading
      </button>
      
      <button 
        onClick={() => dispatch({ type: 'SET_ERROR', payload: 'Test error' })}
        data-testid="set-error"
      >
        Set Error
      </button>
      
      <button 
        onClick={() => dispatch({ type: 'RESET' })}
        data-testid="reset"
      >
        Reset
      </button>
    </div>
  );
}

describe('AppContext', () => {
  const renderWithProvider = () => {
    return render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
  };

  it('provides initial state correctly', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(screen.getByTestId('employee-data')).toHaveTextContent('null');
    expect(screen.getByTestId('prediction-result')).toHaveTextContent('null');
    expect(screen.getByTestId('transaction')).toHaveTextContent('null');
  });

  it('updates loading state', () => {
    renderWithProvider();
    
    act(() => {
      screen.getByTestId('set-loading').click();
    });
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('updates error state', () => {
    renderWithProvider();
    
    act(() => {
      screen.getByTestId('set-error').click();
    });
    
    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
  });

  it('resets state correctly', () => {
    renderWithProvider();
    
    // Set some state first
    act(() => {
      screen.getByTestId('set-loading').click();
      screen.getByTestId('set-error').click();
    });
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    
    // Reset
    act(() => {
      screen.getByTestId('reset').click();
    });
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('throws error when used outside provider', () => {
    // Create a component that uses the hook outside provider
    function ComponentWithoutProvider() {
      try {
        useApp();
        return <div>Should not render</div>;
      } catch (error) {
        return <div data-testid="error-caught">Error caught</div>;
      }
    }

    // This should not throw because we're catching the error
    render(<ComponentWithoutProvider />);
    expect(screen.getByTestId('error-caught')).toBeInTheDocument();
  });

  it('handles SET_EMPLOYEE_DATA action', () => {
    const TestEmployeeDataComponent = () => {
      const { state, dispatch } = useApp();
      
      const mockEmployeeData: EmployeeData = {
        employeeId: 'EMP001',
        name: 'John Doe',
        workingDays: 22,
        targetSales: 50000,
        actualSales: 45000,
        customerSatisfactionScore: 4,
        month: '2024-01',
      };
      
      return (
        <div>
          <div data-testid="employee-name">
            {state.employeeData?.name || 'null'}
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_EMPLOYEE_DATA', payload: mockEmployeeData })}
            data-testid="set-employee-data"
          >
            Set Employee Data
          </button>
        </div>
      );
    };
    
    render(
      <AppProvider>
        <TestEmployeeDataComponent />
      </AppProvider>
    );
    
    act(() => {
      screen.getByTestId('set-employee-data').click();
    });
    
    expect(screen.getByTestId('employee-name')).toHaveTextContent('John Doe');
  });

  it('handles SET_PREDICTION_RESULT action', () => {
    const TestPredictionComponent = () => {
      const { state, dispatch } = useApp();
      
      const mockPredictionResult: PredictionResult = {
        isCompliant: true,
        confidence: 0.85,
        derivedFields: {
          lowWorkingDays: false,
          targetNotMet: false,
          lowCustomerSatisfaction: false,
        },
      };
      
      return (
        <div>
          <div data-testid="compliance-status">
            {state.predictionResult?.isCompliant?.toString() || 'null'}
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_PREDICTION_RESULT', payload: mockPredictionResult })}
            data-testid="set-prediction"
          >
            Set Prediction
          </button>
        </div>
      );
    };
    
    render(
      <AppProvider>
        <TestPredictionComponent />
      </AppProvider>
    );
    
    act(() => {
      screen.getByTestId('set-prediction').click();
    });
    
    expect(screen.getByTestId('compliance-status')).toHaveTextContent('true');
  });

  it('handles SET_TRANSACTION action', () => {
    const TestTransactionComponent = () => {
      const { state, dispatch } = useApp();
      
      const mockTransaction: BlockchainTransaction = {
        hash: '0xabcdef1234567890',
        status: 'pending',
      };
      
      return (
        <div>
          <div data-testid="transaction-status">
            {state.transaction?.status || 'null'}
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_TRANSACTION', payload: mockTransaction })}
            data-testid="set-transaction"
          >
            Set Transaction
          </button>
        </div>
      );
    };
    
    render(
      <AppProvider>
        <TestTransactionComponent />
      </AppProvider>
    );
    
    act(() => {
      screen.getByTestId('set-transaction').click();
    });
    
    expect(screen.getByTestId('transaction-status')).toHaveTextContent('pending');
  });
});