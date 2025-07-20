import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EmployeeData, PredictionResult, BlockchainTransaction } from '../types';

interface AppState {
  employeeData: EmployeeData | null;
  predictionResult: PredictionResult | null;
  transaction: BlockchainTransaction | null;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_EMPLOYEE_DATA'; payload: EmployeeData }
  | { type: 'SET_PREDICTION_RESULT'; payload: PredictionResult }
  | { type: 'SET_TRANSACTION'; payload: BlockchainTransaction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: AppState = {
  employeeData: null,
  predictionResult: null,
  transaction: null,
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_EMPLOYEE_DATA':
      return { ...state, employeeData: action.payload };
    case 'SET_PREDICTION_RESULT':
      return { ...state, predictionResult: action.payload };
    case 'SET_TRANSACTION':
      return { ...state, transaction: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}