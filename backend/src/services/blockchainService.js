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
    this.initialized = false;
    this.initializationError = null;
    
    // Check if blockchain env vars are configured
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const contractAddress = process.env.ACTIVITY_LOG_ADDRESS;
    
    if (!privateKey || privateKey === 'your-private-key' || privateKey.length < 64) {
      console.log('⚠️ BlockchainService: PRIVATE_KEY not configured - running in offline mode');
      this.initializationError = 'Blockchain not configured';
      return;
    }
    
    if (!rpcUrl || !contractAddress) {
      console.log('⚠️ BlockchainService: RPC URL or Contract address not configured');
      this.initializationError = 'Blockchain not configured';
      return;
    }
    
    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, ACTIVITY_LOG_ABI, this.wallet);
      
      this.initialized = true;
      console.log('✅ BlockchainService initialized');
      console.log('📍 Contract:', contractAddress);
    } catch (error) {
      console.log('⚠️ BlockchainService initialization failed:', error.message);
      this.initializationError = error.message;
    }
  }
  
  getBatchIdHash(mongoId) {
    return ethers.keccak256(ethers.toUtf8Bytes(mongoId.toString()));
  }
  
  async recordActivity(batchId, activityData) {
    if (!this.initialized) {
      console.log('⚠️ Blockchain not initialized - skipping record activity');
      return {
        success: false,
        error: this.initializationError || 'Blockchain service not initialized'
      };
    }
    
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
    if (!this.initialized) {
      return [];
    }
    
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
    if (!this.initialized) {
      return {
        isOrganic: false,
        activityCount: '0',
        verified: false,
        error: 'Blockchain not configured'
      };
    }
    
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
    if (!this.initialized) {
      return '0';
    }
    
    try {
      const total = await this.contract.totalActivitiesRecorded();
      return total.toString();
    } catch (error) {
      return '0';
    }
  }
}

module.exports = new BlockchainService();
