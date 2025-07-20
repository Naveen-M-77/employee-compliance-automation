import React, { useState, useEffect } from 'react';
import { Link2, Check, X, Clock, Wallet, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { pushToBlockchain, getTransactionStatus, checkWalletConnection } from '../services/blockchainService';

export default function BlockchainIntegration() {
  const { state, dispatch } = useApp();
  const { employeeData, predictionResult, transaction, isLoading } = state;
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection().then(setIsWalletConnected);
  }, []);

  useEffect(() => {
    if (transaction?.status === 'pending') {
      const interval = setInterval(async () => {
        try {
          const updatedTransaction = await getTransactionStatus(transaction.hash);
          if (updatedTransaction.status !== 'pending') {
            dispatch({ type: 'SET_TRANSACTION', payload: updatedTransaction });
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking transaction status:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [transaction, dispatch]);

  const handlePushToBlockchain = async () => {
    if (!employeeData || !predictionResult) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const txn = await pushToBlockchain(employeeData, predictionResult);
      dispatch({ type: 'SET_TRANSACTION', payload: txn });
      setIsWalletConnected(true);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Blockchain operation failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!employeeData || !predictionResult) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Blockchain Integration</h2>
        <p className="text-gray-600">Record the compliance prediction on the blockchain for immutable audit trail</p>
      </div>

      {/* Wallet Connection Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Wallet className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-medium">Wallet Status</span>
          </div>
          <div className="flex items-center">
            {isWalletConnected ? (
              <>
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600">Connected</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-red-600">Not Connected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data to be Recorded */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data to be Recorded</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Employee ID:</span>
              <span className="ml-2">{employeeData.employeeId}</span>
            </div>
            <div>
              <span className="font-medium">Employee Name:</span>
              <span className="ml-2">{employeeData.name}</span>
            </div>
            <div>
              <span className="font-medium">Compliance Status:</span>
              <span className={`ml-2 ${predictionResult.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                {predictionResult.isCompliant ? 'Compliant' : 'Non-Compliant'}
              </span>
            </div>
            <div>
              <span className="font-medium">Confidence:</span>
              <span className="ml-2">{(predictionResult.confidence * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">Month:</span>
              <span className="ml-2">{employeeData.month}</span>
            </div>
            {predictionResult.nonComplianceReason && (
              <div className="md:col-span-2">
                <span className="font-medium">Non-Compliance Reason:</span>
                <span className="ml-2">{predictionResult.nonComplianceReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {transaction && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status</h3>
          <div className={`p-4 rounded-lg border ${
            transaction.status === 'confirmed' 
              ? 'bg-green-50 border-green-200' 
              : transaction.status === 'failed'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {transaction.status === 'confirmed' ? (
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                ) : transaction.status === 'failed' ? (
                  <X className="w-5 h-5 text-red-500 mr-2" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                )}
                <span className="font-medium">
                  {transaction.status === 'confirmed' 
                    ? 'Transaction Confirmed' 
                    : transaction.status === 'failed'
                    ? 'Transaction Failed'
                    : 'Transaction Pending'
                  }
                </span>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                View on Etherscan
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Transaction Hash: <span className="font-mono">{transaction.hash}</span>
              </p>
              {transaction.blockNumber && (
                <p className="text-sm text-gray-600">
                  Block Number: {transaction.blockNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Push to Blockchain Button */}
      {!transaction && (
        <div className="text-center">
          <button
            onClick={handlePushToBlockchain}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Link2 className="inline w-4 h-4 mr-2" />
                Push to Blockchain
              </>
            )}
          </button>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Important: Contract Setup Required</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• Install MetaMask browser extension</li>
            <li>• Connect to Sepolia testnet</li>
            <li>• Get test ETH from <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">Sepolia faucet</a></li>
            <li>• <strong>Deploy your own smart contract</strong> using the code from README.md</li>
            <li>• Update VITE_CONTRACT_ADDRESS environment variable with your contract address</li>
          </ul>
          <p className="mt-2 p-2 bg-yellow-100 rounded border-l-4 border-yellow-500">
            <strong>⚠️ Demo Mode:</strong> The current contract address is a placeholder. You need to deploy the smart contract from the README to test blockchain functionality.
          </p>
          <div className="mt-3">
            <p><strong>Quick Deploy Steps:</strong></p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Copy the smart contract code from README.md</li>
              <li>Deploy it on <a href="https://remix.ethereum.org/" target="_blank" rel="noopener noreferrer" className="underline">Remix IDE</a></li>
              <li>Connect Remix to Sepolia testnet</li>
              <li>Deploy the contract and copy the address</li>
              <li>Update the environment variable with your contract address</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}