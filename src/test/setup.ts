import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.ethereum for blockchain tests
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
});

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3001',
    VITE_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
    VITE_BLOCKCHAIN_NETWORK: 'sepolia',
  },
  writable: true,
});

// Mock fetch globally
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};