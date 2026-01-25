require('dotenv').config();
const blockchainService = require('./src/services/blockchainService');

async function test() {
  console.log('🧪 Testing BlockchainService...\n');
  
  const testBatchId = 'test-mongo-batch-' + Date.now();
  
  console.log('📝 Recording test activity...');
  const result = await blockchainService.recordActivity(testBatchId, {
    activityType: 'FERTILIZER',
    productName: 'Organic Compost',
    quantity: 15000,
    isOrganic: true,
    photo: 'https://example.com/photo.jpg'
  });
  
  console.log('\n📋 Result:', result);
  
  if (result.success) {
    console.log('\n✅ SUCCESS! View transaction:');
    console.log(result.explorerUrl);
    
    console.log('\n📖 Reading back from blockchain...');
    const activities = await blockchainService.getBatchActivities(testBatchId);
    console.log('Activities:', activities);
    
    console.log('\n🔍 Checking organic status...');
    const organic = await blockchainService.checkOrganicStatus(testBatchId);
    console.log('Organic:', organic);
  }
  
  const total = await blockchainService.getTotalActivities();
  console.log('\n📊 Total activities on contract:', total);
}

test().then(() => process.exit(0)).catch(console.error);
