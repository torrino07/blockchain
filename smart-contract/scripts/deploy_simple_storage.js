const hre = require("hardhat");

async function main() {
  // This line gets the contract to deploy
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");

  // This line deploys the contract
  const simpleStorage = await SimpleStorage.deploy();

  // Wait for the deployment to be confirmed
  await simpleStorage.deployed();

  // Output the address of the deployed contract
  console.log("SimpleStorage deployed to:", simpleStorage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
