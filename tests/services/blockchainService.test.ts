import { describe, it, expect, vi, beforeEach } from 'vitest';
import { connectWallet, pushToBlockchain, getTransactionStatus, checkWalletConnection } from '../../src/services/blockchainService';
import { EmployeeData, PredictionResult } from '../../src/types';

// Mock ethers module
const mockSigner = {
  getAddress: vi.fn(() => Promise.resolve('0x1234567890123456789012345678901234567890')),
};

const mockProvider = {
  getSigner: vi.fn(() => Promise.resolve(mockSigner)),
  getTransactionReceipt: vi.fn(),
};

const mockContract = {
  recordCompliance: vi.fn(() => Promise.resolve({
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  })),
};

vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn(() => mockProvider),
    Contract: vi.fn(() => mockContract),
    getAddress: vi.fn((address: string) => address),
  },
}));

describe('BlockchainService', () => {
  const mockEmployeeData: EmployeeData = {
    employeeId: 'EMP001',
    name: 'John Doe',
    workingDays: 22,
    targetSales: 50000,
    actualSales: 45000,
    customerSatisfactionScore: 4,
    month: '2024-01',
  };

  const mockPredictionResult: PredictionResult = {
    isCompliant: true,
    confidence: 0.85,
    derivedFields: {
      lowWorkingDays: false,
      targetNotMet: false,
      lowCustomerSatisfaction: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.ethereum
    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: {
        request: vi.fn(),
        on: vi.fn(),
        removeListener: vi.fn(),
      },
    });
  });

  describe('checkWalletConnection', () => {
    it('returns true when wallet is connected', async () => {
      window.ethereum!.request = vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']);
      
      const result = await checkWalletConnection();
      
      expect(result).toBe(true);
      expect(window.ethereum!.request).toHaveBeenCalledWith({ method: 'eth_accounts' });
    });

    it('returns false when no accounts are connected', async () => {
      window.ethereum!.request = vi.fn().mockResolvedValue([]);
      
      const result = await checkWalletConnection();
      
      expect(result).toBe(false);
    });

    it('returns false when ethereum is not available', async () => {
      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: undefined,
      });
      
      const result = await checkWalletConnection();
      
      expect(result).toBe(false);
    });
  });

  describe('connectWallet', () => {
    it('successfully connects wallet', async () => {
      window.ethereum!.request = vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']);
      
      const signer = await connectWallet();
      
      expect(signer).toBeDefined();
      expect(window.ethereum!.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    });

    it('throws error when MetaMask is not installed', async () => {
      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: undefined,
      });
      
      await expect(connectWallet()).rejects.toThrow('MetaMask is not installed');
    });

    it('throws error when wallet connection fails', async () => {
      window.ethereum!.request = vi.fn().mockRejectedValue(new Error('User rejected'));
      
      await expect(connectWallet()).rejects.toThrow('Failed to connect wallet');
    });
  });

  describe('pushToBlockchain', () => {
    beforeEach(() => {
      window.ethereum!.request = vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']);
      
      // Mock environment variable
      vi.stubEnv('VITE_CONTRACT_ADDRESS', '0x1234567890123456789012345678901234567890');
    });

    it('successfully pushes data to blockchain', async () => {
      const result = await pushToBlockchain(mockEmployeeData, mockPredictionResult);
      
      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('status', 'pending');
      expect(result.hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('converts confidence to basis points correctly', async () => {
      await pushToBlockchain(mockEmployeeData, mockPredictionResult);
      
      expect(mockContract.recordCompliance).toHaveBeenCalledWith(
        'EMP001',
        'John Doe',
        true,
        8500, // 0.85 * 10000
        '2024-01',
        ''
      );
    });
  });

  describe('getTransactionStatus', () => {
    const mockHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

    it('returns confirmed status for successful transaction', async () => {
      mockProvider.getTransactionReceipt.mockResolvedValue({
        blockNumber: 12345,
        status: 1,
      });
      
      const result = await getTransactionStatus(mockHash);
      
      expect(result).toEqual({
        hash: mockHash,
        blockNumber: 12345,
        status: 'confirmed',
      });
    });

    it('returns failed status for failed transaction', async () => {
      mockProvider.getTransactionReceipt.mockResolvedValue({
        blockNumber: 12345,
        status: 0,
      });
      
      const result = await getTransactionStatus(mockHash);
      
      expect(result).toEqual({
        hash: mockHash,
        blockNumber: 12345,
        status: 'failed',
      });
    });

    it('returns pending status when receipt is not available', async () => {
      mockProvider.getTransactionReceipt.mockResolvedValue(null);
      
      const result = await getTransactionStatus(mockHash);
      
      expect(result).toEqual({
        hash: mockHash,
        status: 'pending',
      });
    });
  });
});