# Smart Contract Deployment Guide

## Complete Step-by-Step Instructions for Deploying Your Employee Compliance Contract

### Prerequisites

1. **MetaMask Wallet** installed and configured
2. **Sepolia Test ETH** (get from faucets)
3. **Basic understanding** of blockchain transactions

---

## Method 1: Using Remix IDE (Recommended - Easiest)

### Step 1: Open Remix IDE
1. Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Wait for the IDE to load completely

### Step 2: Create the Smart Contract File
1. In the **File Explorer** (left panel), click the **"+"** button next to "contracts"
2. Name the file: `ComplianceRecorder.sol`
3. Copy and paste the following contract code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ComplianceRecorder {
    struct ComplianceRecord {
        string employeeId;
        string name;
        bool isCompliant;
        uint256 confidence;
        string month;
        string reason;
        uint256 timestamp;
        address recordedBy;
    }
    
    mapping(string => ComplianceRecord) public records;
    mapping(string => bool) public recordExists;
    
    event ComplianceRecorded(
        string indexed employeeId,
        string name,
        bool isCompliant,
        uint256 confidence,
        address recordedBy
    );
    
    function recordCompliance(
        string memory employeeId,
        string memory name,
        bool isCompliant,
        uint256 confidence,
        string memory month,
        string memory reason
    ) public {
        require(bytes(employeeId).length > 0, "Employee ID cannot be empty");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(confidence <= 10000, "Confidence must be <= 10000 (100%)");
        
        records[employeeId] = ComplianceRecord({
            employeeId: employeeId,
            name: name,
            isCompliant: isCompliant,
            confidence: confidence,
            month: month,
            reason: reason,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });
        
        recordExists[employeeId] = true;
        
        emit ComplianceRecorded(employeeId, name, isCompliant, confidence, msg.sender);
    }
    
    function getComplianceRecord(string memory employeeId) 
        public 
        view 
        returns (
            bool isCompliant,
            uint256 confidence,
            string memory reason,
            uint256 timestamp,
            address recordedBy
        ) 
    {
        require(recordExists[employeeId], "Record does not exist");
        ComplianceRecord memory record = records[employeeId];
        return (
            record.isCompliant,
            record.confidence,
            record.reason,
            record.timestamp,
            record.recordedBy
        );
    }
    
    function hasRecord(string memory employeeId) public view returns (bool) {
        return recordExists[employeeId];
    }
    
    function getRecordCount() public view returns (uint256) {
        // This is a simple implementation - in production you might want to track this more efficiently
        return 0; // Placeholder - you can enhance this
    }
}
```

### Step 3: Compile the Contract
1. Click on the **"Solidity Compiler"** tab (second icon in left panel)
2. Select compiler version: **0.8.19** or higher
3. Click **"Compile ComplianceRecorder.sol"**
4. Wait for green checkmark ✅ (no errors)

### Step 4: Connect MetaMask to Sepolia
1. Open MetaMask
2. Switch to **Sepolia Test Network**
3. Ensure you have some Sepolia ETH (get from faucets if needed)

### Step 5: Deploy the Contract
1. Click on **"Deploy & Run Transactions"** tab (third icon)
2. In **Environment**, select **"Injected Provider - MetaMask"**
3. MetaMask will prompt to connect - click **"Connect"**
4. Verify the account and network in Remix
5. Under **"Contract"**, select **"ComplianceRecorder"**
6. Click **"Deploy"** (orange button)
7. MetaMask will pop up - review gas fees and click **"Confirm"**

### Step 6: Get Your Contract Address
1. After deployment, scroll down to **"Deployed Contracts"**
2. You'll see your contract with an address like: `0x1234...abcd`
3. **Copy this address** - you'll need it for the application

### Step 7: Verify Deployment (Optional but Recommended)
1. Go to [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
2. Paste your contract address in the search
3. You should see your contract with the deployment transaction

---

## Method 2: Using Hardhat (Advanced)

### Step 1: Set Up Project
```bash
mkdir compliance-contract
cd compliance-contract
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
```

### Step 2: Create Contract
Create `contracts/ComplianceRecorder.sol` with the same code as above.

### Step 3: Configure Hardhat
Update `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

### Step 4: Deploy Script
Create `scripts/deploy.js`:

```javascript
async function main() {
  const ComplianceRecorder = await ethers.getContractFactory("ComplianceRecorder");
  const contract = await ComplianceRecorder.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Step 5: Deploy
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Method 3: Using Truffle (Alternative)

### Step 1: Install Truffle
```bash
npm install -g truffle
mkdir compliance-truffle
cd compliance-truffle
truffle init
```

### Step 2: Configure
Update `truffle-config.js` with Sepolia network configuration.

### Step 3: Deploy
```bash
truffle migrate --network sepolia
```

---

## After Deployment: Configure Your Application

### Step 1: Update Environment Variables
1. Copy your deployed contract address
2. Update your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0xYourActualContractAddress
VITE_BLOCKCHAIN_NETWORK=sepolia
```

### Step 2: Test the Integration
1. Restart your React application
2. Fill out the employee form
3. Get a prediction
4. Click "Push to Blockchain"
5. Confirm the transaction in MetaMask

### Step 3: Verify on Blockchain
1. After transaction confirms, click the Etherscan link
2. You should see your transaction and contract interaction

---

## Troubleshooting

### Common Issues:

**"Insufficient funds for gas"**
- Get more Sepolia ETH from faucets
- Wait 24 hours between faucet requests

**"Contract creation failed"**
- Check your Solidity code for errors
- Ensure you're on the correct network
- Try increasing gas limit

**"MetaMask not connecting"**
- Refresh Remix page
- Disconnect and reconnect MetaMask
- Clear browser cache

**"Transaction failed"**
- Check gas price and limit
- Ensure contract code is valid
- Verify network connection

### Gas Optimization Tips:
- Deploy during low network usage
- Use appropriate gas limit (not too high/low)
- Consider using CREATE2 for deterministic addresses

---

## Security Considerations

1. **Never share private keys**
2. **Use testnet for development**
3. **Audit contract code before mainnet**
4. **Test thoroughly before production**
5. **Keep dependencies updated**

---

## Next Steps

Once deployed:
1. **Test all functions** in Remix
2. **Verify contract** on Etherscan (optional)
3. **Document contract address** for team
4. **Set up monitoring** for contract events
5. **Plan for upgrades** if needed

---

## Support Resources

- **Remix Documentation**: [https://remix-ide.readthedocs.io/](https://remix-ide.readthedocs.io/)
- **Solidity Documentation**: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)
- **Ethers.js Documentation**: [https://docs.ethers.org/](https://docs.ethers.org/)
- **Sepolia Faucets**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

Remember: This is for testing purposes only. For production deployment, conduct thorough security audits and testing.