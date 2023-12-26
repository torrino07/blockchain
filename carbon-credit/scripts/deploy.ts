import { ethers } from "hardhat";

async function main() {
  const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
  const carbonCreditToken = await CarbonCreditToken.deploy();

  //await carbonCreditToken.deployed();

  console.log(`CarbonCreditToken deployed to: ${carbonCreditToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
