const axios = require('axios');

const FACTORY_ADDRESS = '0x2c080712805487413E181Ac5A23c5fBa8Bd67631';
const EVENT_SIGNATURE = '0x99a99833dc6f49a9893e317f6a592606f0213497bfc8e1c3a5f9c21aef778f7e'; // TokenCreated event signature

async function main() {
  try {
    // Get the latest events from Basescan
    const response = await axios.get('https://api.basescan.org/api', {
      params: {
        module: 'logs',
        action: 'getLogs',
        fromBlock: '0',
        toBlock: 'latest',
        address: FACTORY_ADDRESS,
        topic0: EVENT_SIGNATURE,
        apikey: process.env.BASESCAN_API_KEY
      }
    });

    if (response.data.status === '1' && response.data.result.length > 0) {
      const latestEvent = response.data.result[response.data.result.length - 1];
      
      // The token address is in topic2
      const tokenAddress = '0x' + latestEvent.topics[2].slice(26);
      // The creator address is in topic1
      const creator = '0x' + latestEvent.topics[1].slice(26);
      
      console.log('Latest deployed token:', {
        tokenAddress,
        creator,
        blockNumber: latestEvent.blockNumber,
        transactionHash: latestEvent.transactionHash
      });
    } else {
      console.log('No tokens deployed yet');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();