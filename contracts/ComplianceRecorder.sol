// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ComplianceRecorder
 * @dev Smart contract for recording employee policy compliance predictions
 * @author Employee Compliance Automation System
 */
contract ComplianceRecorder {
    
    struct ComplianceRecord {
        string employeeId;
        string name;
        bool isCompliant;
        uint256 confidence;        // Stored as basis points (0-10000 = 0-100%)
        string month;
        string reason;
        uint256 timestamp;
        address recordedBy;
    }
    
    // Mapping from employee ID to their compliance record
    mapping(string => ComplianceRecord) public records;
    
    // Mapping to check if a record exists
    mapping(string => bool) public recordExists;
    
    // Array to keep track of all employee IDs (for enumeration)
    string[] public employeeIds;
    
    // Events
    event ComplianceRecorded(
        string indexed employeeId,
        string name,
        bool isCompliant,
        uint256 confidence,
        address recordedBy,
        uint256 timestamp
    );
    
    event RecordUpdated(
        string indexed employeeId,
        bool previousCompliance,
        bool newCompliance,
        uint256 timestamp
    );
    
    /**
     * @dev Record or update compliance data for an employee
     * @param employeeId Unique identifier for the employee
     * @param name Employee's name
     * @param isCompliant Whether the employee is compliant
     * @param confidence Confidence score in basis points (0-10000)
     * @param month Month of the record (YYYY-MM format)
     * @param reason Reason for non-compliance (empty if compliant)
     */
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
        require(bytes(month).length > 0, "Month cannot be empty");
        
        bool isUpdate = recordExists[employeeId];
        bool previousCompliance = false;
        
        if (isUpdate) {
            previousCompliance = records[employeeId].isCompliant;
        } else {
            employeeIds.push(employeeId);
        }
        
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
        
        if (isUpdate) {
            emit RecordUpdated(employeeId, previousCompliance, isCompliant, block.timestamp);
        }
        
        emit ComplianceRecorded(
            employeeId, 
            name, 
            isCompliant, 
            confidence, 
            msg.sender, 
            block.timestamp
        );
    }
    
    /**
     * @dev Get compliance record for an employee
     * @param employeeId The employee ID to query
     * @return isCompliant Whether the employee is compliant
     * @return confidence Confidence score in basis points
     * @return reason Reason for non-compliance
     * @return timestamp When the record was created
     * @return recordedBy Address that recorded the data
     */
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
    
    /**
     * @dev Get full compliance record for an employee
     * @param employeeId The employee ID to query
     * @return record The complete compliance record
     */
    function getFullRecord(string memory employeeId) 
        public 
        view 
        returns (ComplianceRecord memory record) 
    {
        require(recordExists[employeeId], "Record does not exist");
        return records[employeeId];
    }
    
    /**
     * @dev Check if a record exists for an employee
     * @param employeeId The employee ID to check
     * @return exists Whether the record exists
     */
    function hasRecord(string memory employeeId) public view returns (bool exists) {
        return recordExists[employeeId];
    }
    
    /**
     * @dev Get the total number of records
     * @return count Total number of employee records
     */
    function getRecordCount() public view returns (uint256 count) {
        return employeeIds.length;
    }
    
    /**
     * @dev Get employee ID by index (for enumeration)
     * @param index The index to query
     * @return employeeId The employee ID at the given index
     */
    function getEmployeeIdByIndex(uint256 index) public view returns (string memory employeeId) {
        require(index < employeeIds.length, "Index out of bounds");
        return employeeIds[index];
    }
    
    /**
     * @dev Get compliance statistics
     * @return totalRecords Total number of records
     * @return compliantCount Number of compliant employees
     * @return nonCompliantCount Number of non-compliant employees
     */
    function getComplianceStats() 
        public 
        view 
        returns (
            uint256 totalRecords,
            uint256 compliantCount,
            uint256 nonCompliantCount
        ) 
    {
        totalRecords = employeeIds.length;
        compliantCount = 0;
        nonCompliantCount = 0;
        
        for (uint256 i = 0; i < employeeIds.length; i++) {
            if (records[employeeIds[i]].isCompliant) {
                compliantCount++;
            } else {
                nonCompliantCount++;
            }
        }
        
        return (totalRecords, compliantCount, nonCompliantCount);
    }
    
    /**
     * @dev Emergency function to pause contract (if needed in future versions)
     * Note: This is a basic version. In production, consider using OpenZeppelin's Pausable
     */
    bool public paused = false;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    function pause() public onlyOwner {
        paused = true;
    }
    
    function unpause() public onlyOwner {
        paused = false;
    }
    
    /**
     * @dev Transfer ownership (if needed)
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}