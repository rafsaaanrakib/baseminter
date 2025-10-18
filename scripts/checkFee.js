import hre from 'hardhat';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const address = process.env.FACTORY_ADDRESS || '0x2c080712805487413E181Ac5A23c5fBa8Bd67631';
  const newFeeEth = process.env.NEW_DEPLOY_FEE; // e.g. '0.0003'

  const factory = await hre.ethers.getContractAt('BaseMinterFactory', address);

  const currentFee = await factory.deployFee();
  console.log('Current deployFee (wei):', currentFee.toString());
  console.log('Current deployFee (ether):', hre.ethers.formatEther(currentFee));

  if (newFeeEth) {
    const tx = await factory.setDeployFee(hre.ethers.parseEther(newFeeEth));
    await tx.wait();
    console.log('Deploy fee updated to', newFeeEth, 'ETH');
    const newFee = await factory.deployFee();
    console.log('New deployFee (ether):', hre.ethers.formatEther(newFee));
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
