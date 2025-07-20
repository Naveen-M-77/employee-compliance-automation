import React from 'react';
import { CheckCircle, XCircle, TrendingUp, Calendar, Target, Star, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { predictCompliance } from '../services/predictionService';

export default function PredictionDisplay() {
  const { state, dispatch } = useApp();
  const { employeeData, predictionResult, isLoading, error } = state;

  const handlePredict = async () => {
    if (!employeeData) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await predictCompliance(employeeData);
      dispatch({ type: 'SET_PREDICTION_RESULT', payload: result });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  if (!employeeData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Summary</h2>
        <p className="text-gray-600">Review data and get compliance prediction</p>
      </div>

      {/* Employee Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employee</p>
              <p className="text-lg font-semibold text-gray-900">{employeeData.name}</p>
              <p className="text-sm text-gray-500">ID: {employeeData.employeeId}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales Performance</p>
              <p className="text-lg font-semibold text-gray-900">
                ${employeeData.actualSales.toLocaleString()} / ${employeeData.targetSales.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {((employeeData.actualSales / employeeData.targetSales) * 100).toFixed(1)}% of target
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Working Days</p>
              <p className="text-lg font-semibold text-gray-900">{employeeData.workingDays} days</p>
              <p className="text-sm text-gray-500">
                Rating: {employeeData.customerSatisfactionScore}/5
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Prediction Button */}
      {!predictionResult && (
        <div className="text-center mb-8">
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              'Predict Compliance'
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {predictionResult && (
        <div className="mb-8">
          <div className={`p-6 rounded-lg border-2 ${
            predictionResult.isCompliant 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {predictionResult.isCompliant ? (
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 mr-3" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {predictionResult.isCompliant ? 'Compliant' : 'Non-Compliant'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {(predictionResult.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Confidence</div>
              </div>
            </div>

            {/* Derived Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-3 rounded ${predictionResult.derivedFields.lowWorkingDays ? 'bg-red-100' : 'bg-green-100'}`}>
                <p className="text-sm font-medium">Working Days</p>
                <p className={`text-sm ${predictionResult.derivedFields.lowWorkingDays ? 'text-red-600' : 'text-green-600'}`}>
                  {predictionResult.derivedFields.lowWorkingDays ? 'Below Required' : 'Adequate'}
                </p>
              </div>
              <div className={`p-3 rounded ${predictionResult.derivedFields.targetNotMet ? 'bg-red-100' : 'bg-green-100'}`}>
                <p className="text-sm font-medium">Sales Target</p>
                <p className={`text-sm ${predictionResult.derivedFields.targetNotMet ? 'text-red-600' : 'text-green-600'}`}>
                  {predictionResult.derivedFields.targetNotMet ? 'Not Met' : 'Met'}
                </p>
              </div>
              <div className={`p-3 rounded ${predictionResult.derivedFields.lowCustomerSatisfaction ? 'bg-red-100' : 'bg-green-100'}`}>
                <p className="text-sm font-medium">Customer Satisfaction</p>
                <p className={`text-sm ${predictionResult.derivedFields.lowCustomerSatisfaction ? 'text-red-600' : 'text-green-600'}`}>
                  {predictionResult.derivedFields.lowCustomerSatisfaction ? 'Below Threshold' : 'Satisfactory'}
                </p>
              </div>
            </div>

            {/* Non-compliance Reason */}
            {predictionResult.nonComplianceReason && (
              <div className="mt-4 p-3 bg-red-100 rounded">
                <p className="text-sm font-medium text-red-800">Non-Compliance Reasons:</p>
                <p className="text-sm text-red-700">{predictionResult.nonComplianceReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {(predictionResult || error) && (
        <div className="text-center">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}