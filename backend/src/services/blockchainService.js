const { ethers } = require('ethers');
require('dotenv').config();

const ACTIVITY_LOG_ABI = [
  "function recordActivity(bytes32 _batchId, string memory _activityType, string memory _productName, uint256 _quantity, bool _isOrganic, string memory _evidenceHash) public returns (bool)",
  "function getBatchActivities(bytes32 _batchId) public view returns (tuple(bytes32 batchId, string activityType, string productName, uint256 quantity, bool isOrganic, uint256 timestamp, string evidenceHash, address recordedBy)[])",
  "function getBatchActivityCount(bytes32 _batchId) public view returns (uint256)",
  "function checkOrganicStatus(bytes32 _batchId) public view returns (bool)",
  "function totalActivitiesRecorded() public view returns (uint256)",
  "event ActivityRecorded(bytes32 indexed batchId, string activityType, string productName, bool isOrganic, uint256 timestamp, address recordedBy)"
];

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      process.env.ACTIVITY_LOG_ADDRESS,
      ACTIVITY_LOG_ABI,
      this.wallet
    );
    
    console.log('✅ BlockchainService initialized');
    console.log('📍 Contract:', process.env.ACTIVITY_LOG_ADDRESS);
  }
  
  getBatchIdHash(mongoId) {
    return ethers.keccak256(ethers.toUtf8Bytes(mongoId.toString()));
  }
  
  async recordActivity(batchId, activityData) {
    try {
      const batchIdHash = this.getBatchIdHash(batchId);
      
      const tx = await this.contract.recordActivity(
        batchIdHash,
        activityData.activityType,
        activityData.productName || '',
        activityData.quantity || 0,
        activityData.isOrganic || false,
        activityData.photo || ''
      );
      
      console.log(`⏳ Tx sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      
      console.log(`✅ Confirmed in block: ${receipt.blockNumber}`);
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        explorerUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`
      };
    } catch (error) {
      console.error('❌ Blockchain error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getBatchActivities(batchId) {
    try {
      const batchIdHash = this.getBatchIdHash(batchId);
      const activities = await this.contract.getBatchActivities(batchIdHash);
      
      return activities.map(activity => ({
        activityType: activity.activityType,
        productName: activity.productName,
        quantity: activity.quantity.toString(),
        isOrganic: activity.isOrganic,
        timestamp: new Date(Number(activity.timestamp) * 1000).toISOString(),
        evidenceHash: activity.evidenceHash
      }));
    } catch (error) {
      console.error('❌ Error fetching activities:', error.message);
      return [];
    }
  }
  
  async checkOrganicStatus(batchId) {
    try {
      const batchIdHash = this.getBatchIdHash(batchId);
      const isOrganic = await this.contract.checkOrganicStatus(batchIdHash);
      const count = await this.contract.getBatchActivityCount(batchIdHash);
      
      return {
        isOrganic,
        activityCount: count.toString(),
        verified: true
      };
    } catch (error) {
      console.error('❌ Error checking organic status:', error.message);
      return {
        isOrganic: false,
        verified: false,
        error: error.message
      };
    }
  }
  
  async getTotalActivities() {
    try {
      const total = await this.contract.totalActivitiesRecorded();
      return total.toString();
    } catch (error) {
      return '0';
    }
  }
}

module.exports = new BlockchainService();
