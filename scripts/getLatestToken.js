const hre = require('hardhat');

async function main() {
  const factory = await hre.ethers.getContractAt('BaseMinterFactory', '0x2c080712805487413E181Ac5A23c5fBa8Bd67631');
  
  // Get the latest TokenCreated event
  const filter = factory.filters.TokenCreated();
  const events = await factory.queryFilter(filter);
  
  if (events.length === 0) {
    console.log('No tokens deployed yet');
    return;
  }

  const latestEvent = events[events.length - 1];
  console.log('Latest deployed token:', {
    tokenAddress: latestEvent.args.tokenAddress,
    creator: latestEvent.args.creator
  });
}

main().catch(console.error);