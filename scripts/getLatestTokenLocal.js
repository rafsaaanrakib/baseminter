const { ethers } = require('ethers');
const factoryABI = require('../artifacts/contracts/BaseMinterFactory.sol/BaseMinterFactory.json').abi;

async function main() {
  const RPC_URL = process.env.BASE_RPC || 'https://mainnet.base.org';
  const FACTORY_ADDRESS = '0x2c080712805487413E181Ac5A23c5fBa8Bd67631';

  try {
    // Create provider and contract instance
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryABI, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log('Latest block:', latestBlock);
    
    // Get events from the last 10000 blocks (approximately 2 days)
    const fromBlock = Math.max(0, latestBlock - 10000);
    console.log('Searching from block:', fromBlock);
    
    const filter = factory.filters.TokenCreated();
    const events = await factory.queryFilter(filter, fromBlock, latestBlock);
    
    if (events.length === 0) {
      console.log('No tokens deployed in the specified block range');
      
      // Try getting events from contract deployment
      console.log('\nTrying from earlier blocks...');
      const earlierEvents = await factory.queryFilter(filter, 0, fromBlock - 1);
      
      if (earlierEvents.length > 0) {
        const latestEvent = earlierEvents[earlierEvents.length - 1];
        console.log('Found earlier deployment:', {
          tokenAddress: latestEvent.args.tokenAddress,
          creator: latestEvent.args.creator,
          blockNumber: latestEvent.blockNumber,
          transactionHash: latestEvent.transactionHash
        });
      } else {
        console.log('No tokens found in the entire history');
      }
      return;
    }

    // Get the latest event
    const latestEvent = events[events.length - 1];
    console.log('Latest deployed token:', {
      tokenAddress: latestEvent.args.tokenAddress,
      creator: latestEvent.args.creator,
      blockNumber: latestEvent.blockNumber,
      transactionHash: latestEvent.transactionHash
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();