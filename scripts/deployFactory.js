const { ethers } = require("hardhat");

async function main() {
  const BaseMinterFactory = await ethers.getContractFactory("BaseMinterFactory");
  const factory = await BaseMinterFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("BaseMinterFactory deployed to:", factoryAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
