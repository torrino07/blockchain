import { ethers } from 'hardhat';

async function main() {
  const SimpleCounter = await ethers.getContractFactory('SimpleCounter');
  const simpleCounter = await SimpleCounter.deploy(0) as any;

  //await simpleCounter.deployed();

  console.log(`SimpleCounter deployed to: ${simpleCounter.target}`);
  console.log(simpleCounter)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

