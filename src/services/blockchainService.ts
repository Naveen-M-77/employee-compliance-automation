import { ethers } from 'ethers';
import { EmployeeData, PredictionResult, BlockchainTransaction } from '../types';

// Utility function to get proper checksum address
function getChecksumAddress(address: string): string {
  try {
    // Basic validation - Ethereum addresses should be 42 characters (0x + 40 hex chars)
    if (!address || address.length !== 42 || !address.startsWith('0x')) {
      throw new Error('Invalid address format');
    }
    return ethers.getAddress(address);
  } catch (error) {
    console.error('Invalid contract address:', address);
    throw new Error(`Invalid contract address: ${address}. Please deploy a contract or use a valid test contract address.`);
  }
}

// Smart contract ABI - Replace with actual contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "employeeId", "type": "string" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "bool", "name": "isCompliant", "type": "bool" },
      { "internalType": "uint256", "name": "confidence", "type": "uint256" },
      { "internalType": "string", "name": "month", "type": "string" },
      { "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "recordCompliance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "employeeId", "type": "string" }],
    "name": "getComplianceRecord",
    "outputs": [
      { "internalType": "bool", "name": "isCompliant", "type": "bool" },
      { "internalType": "uint256", "name": "confidence", "type": "uint256" },
      { "internalType": "string", "name": "reason", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Use a placeholder address that follows proper format but indicates it needs to be replaced
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const NETWORK = import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'sepolia';

export async function connectWallet(): Promise<ethers.Signer> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw new Error('Failed to connect wallet. Please try again.');
  }
}

export async function pushToBlockchain(
  employeeData: EmployeeData,
  predictionResult: PredictionResult
): Promise<BlockchainTransaction> {
  try {
    // Validate contract address
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured. Please set VITE_CONTRACT_ADDRESS in environment variables.');
    }

    const checksumAddress = getChecksumAddress(CONTRACT_ADDRESS);
    const signer = await connectWallet();
    const contract = new ethers.Contract(checksumAddress, CONTRACT_ABI, signer);
    
    // Convert confidence to basis points (0-10000)
    const confidenceBasisPoints = Math.round(predictionResult.confidence * 10000);
    
    const transaction = await contract.recordCompliance(
      employeeData.employeeId,
      employeeData.name,
      predictionResult.isCompliant,
      confidenceBasisPoints,
      employeeData.month,
      predictionResult.nonComplianceReason || ''
    );
    
    return {
      hash: transaction.hash,
      status: 'pending',
    };
  } catch (error) {
    console.error('Blockchain transaction error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to push to blockchain. Please check your wallet connection and contract configuration.');
  }
}

export async function getTransactionStatus(hash: string): Promise<BlockchainTransaction> {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(hash);
    
    if (receipt) {
      return {
        hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
      };
    }
    
    return {
      hash,
      status: 'pending',
    };
  } catch (error) {
    console.error('Transaction status error:', error);
    return {
      hash,
      status: 'failed',
    };
  }
}

// Check if wallet is connected
export async function checkWalletConnection(): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') {
    return false;
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    return false;
  }
}