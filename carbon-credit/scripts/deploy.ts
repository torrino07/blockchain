import { ethers } from "hardhat";

async function main() {
  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  const carbonCredit = await CarbonCredit.deploy();

  //await carbonCreditToken.deployed();

  console.log(`CarbonCredit deployed to: ${carbonCredit.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
