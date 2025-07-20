# Employee Compliance Automation

A full-stack application that predicts employee policy compliance using machine learning and records results on the blockchain for immutable audit trails.

## Features

- **React Frontend**: Modern, responsive interface with TypeScript
- **ML Model Integration**: Predicts compliance based on employee data
- **Blockchain Integration**: Records predictions on Ethereum blockchain
- **MetaMask Integration**: Seamless wallet connection
- **Real-time Updates**: Transaction status monitoring
- **Professional UI**: Production-ready design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: Ethers.js
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios

## Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** browser extension
3. **Sepolia testnet** ETH for gas fees

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy .env file and update values
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
VITE_BLOCKCHAIN_NETWORK=sepolia
```

### Smart Contract Setup (Required for Blockchain Functionality)

**IMPORTANT**: You must deploy your own smart contract to use the blockchain features.

#### Quick Deploy Steps:

1. **Copy the contract code below**
2. **Go to [Remix IDE](https://remix.ethereum.org/)**
3. **Create a new file** (e.g., `ComplianceRecorder.sol`)
4. **Paste the contract code**
5. **Compile the contract** (Solidity 0.8.0+)
6. **Connect to Sepolia testnet** in Remix
7. **Deploy the contract** with your MetaMask wallet
8. **Copy the deployed contract address**
9. **Update your `.env` file** with the contract address

#### Sample Smart Contract (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplianceRecorder {
    struct ComplianceRecord {
        bool isCompliant;
        uint256 confidence;
        string reason;
        uint256 timestamp;
    }
    
    mapping(string => ComplianceRecord) public records;
    
    event ComplianceRecorded(
        string indexed employeeId,
        string name,
        bool isCompliant,
        uint256 confidence
    );
    
    function recordCompliance(
        string memory employeeId,
        string memory name,
        bool isCompliant,
        uint256 confidence,
        string memory month,
        string memory reason
    ) public {
        records[employeeId] = ComplianceRecord({
            isCompliant: isCompliant,
            confidence: confidence,
            reason: reason,
            timestamp: block.timestamp
        });
        
        emit ComplianceRecorded(employeeId, name, isCompliant, confidence);
    }
    
    function getComplianceRecord(string memory employeeId) 
        public 
        view 
        returns (bool, uint256, string memory, uint256) 
    {
        ComplianceRecord memory record = records[employeeId];
        return (record.isCompliant, record.confidence, record.reason, record.timestamp);
    }
}
```

#### Deployment Instructions:

1. **Open [Remix IDE](https://remix.ethereum.org/)**
2. **Create new file**: `ComplianceRecorder.sol`
3. **Paste the contract code above**
4. **Go to Solidity Compiler tab**
5. **Select compiler version**: 0.8.0 or higher
6. **Compile the contract**
7. **Go to Deploy & Run tab**
8. **Select Environment**: "Injected Provider - MetaMask"
9. **Make sure MetaMask is on Sepolia testnet**
10. **Click Deploy**
11. **Confirm transaction in MetaMask**
12. **Copy the contract address from the deployed contracts section**
13. **Update your `.env` file**:
    ```env
    VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
    ```

### MetaMask Configuration

1. **Install MetaMask**: Download from [metamask.io](https://metamask.io/)
2. **Add Sepolia Network**: 
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io
3. **Get Test ETH**: Use [Sepolia faucet](https://sepoliafaucet.com/)

### ML Model Integration

#### Mock Implementation (Current)
The application currently uses a mock prediction service that simulates ML model behavior based on business rules.

#### Production Implementation
To integrate with a real ML model:

1. **Update Prediction Service**: Replace mock logic in `src/services/predictionService.ts`
2. **API Endpoint**: Set up backend API at `VITE_API_BASE_URL`
3. **Model Format**: Ensure API returns predictions in the expected format

#### Sample API Integration

```typescript
export async function predictCompliance(data: EmployeeData): Promise<PredictionResult> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/predict`, {
      working_days: data.workingDays,
      target_sales: data.targetSales,
      actual_sales: data.actualSales,
      customer_satisfaction_score: data.customerSatisfactionScore,
    });
    
    return {
      isCompliant: response.data.is_compliant,
      confidence: response.data.confidence,
      derivedFields: response.data.derived_fields,
      nonComplianceReason: response.data.non_compliance_reason,
    };
  } catch (error) {
    throw new Error('Prediction service unavailable');
  }
}
```

## Application Architecture

### Component Structure

```
src/
├── components/
│   ├── EmployeeForm.tsx          # Data input form
│   ├── PredictionDisplay.tsx     # Results display
│   ├── BlockchainIntegration.tsx # Blockchain operations
│   ├── Header.tsx                # Application header
│   └── StepIndicator.tsx         # Progress indicator
├── contexts/
│   └── AppContext.tsx            # Global state management
├── services/
│   ├── predictionService.ts      # ML model integration
│   └── blockchainService.ts      # Blockchain operations
├── types/
│   └── index.ts                  # TypeScript definitions
└── App.tsx                       # Main application
```

### State Management

The application uses React Context with useReducer for state management:

- **Employee Data**: Form input and validation
- **Prediction Results**: ML model outputs
- **Blockchain Transaction**: Transaction status and details
- **Loading States**: UI feedback during operations
- **Error Handling**: Centralized error management

### Key Features

1. **Progressive Form**: Step-by-step data collection
2. **Real-time Prediction**: Instant compliance assessment
3. **Blockchain Recording**: Immutable audit trail
4. **Transaction Monitoring**: Real-time status updates
5. **Error Handling**: Comprehensive error management
6. **Responsive Design**: Mobile-friendly interface

## Dataset Integration

The application is designed to work with the Employee Policy Compliance Dataset:

### Input Fields
- Employee ID
- Employee Name
- Working Days
- Target Sales
- Actual Sales
- Customer Satisfaction Score
- Month

### Derived Fields (Auto-calculated)
- Low Working Days
- Target Not Met
- Low Customer Satisfaction

### Output
- Compliance Status (Yes/No)
- Confidence Score
- Non-compliance Reasons

## Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Requirements

For production deployment, you'll need:

1. **ML Model API**: Backend service for predictions
2. **Blockchain Network**: Mainnet or testnet deployment
3. **Environment Configuration**: Production environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub