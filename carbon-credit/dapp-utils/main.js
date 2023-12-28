const db = require("./db.json");
const ApplicationBinaryInterface = require('./ApplicationBinaryInterface');

const id = 0;
const platform = "alchemy";
const contractName = "CarbonCredit";

const contracts = db["contracts"].find(item => item.name === contractName)["contracts"];
const contractAddress = db["contracts"].find(item => item.name === contractName)["address"];
const providerUrl = db["platforms"].find(item => item.name === platform)["url"];
const walletPrivateKey = db["wallets"].find(item => item.id === id)["private_key"];


async function main() {
  try {
    const abiInstance = new ApplicationBinaryInterface(providerUrl, walletPrivateKey);
    const abi = await abiInstance.loadAbi(contracts, contractName);
    const contract = await abiInstance.getContractInstance(contractAddress, abi);

    // Define the wallet details to be added
    const walletToAdd = "0x6ce99eC2c5455Ae932ce6B1B8001e01b019415Af"; // Replace with the actual wallet address
    const walletId = 1; // Example ID
    const walletRole = "issuer"; // Example role

    // Call addWallet function
    await executeContractFunction(abiInstance, contract, "addWallet", [walletToAdd, walletId, walletRole], true);

  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}

async function executeContractFunction(abiInstance, contract, functionName, args = [], isTransactional = false) {
  try {
    let result;
    if (isTransactional) {
      // Estimate the gas required for the transaction
      const estimatedGas = await contract.methods[functionName](...args).estimateGas({ from: abiInstance.account.address });

      // Send the transaction with the estimated gas limit
      const tx = await contract.methods[functionName](...args).send({
        from: abiInstance.account.address,
        gas: estimatedGas
      });
      console.log(`Transaction Hash for ${functionName}:`, tx.transactionHash);
      result = tx;
    } else {
      result = await contract.methods[functionName](...args).call();
    }
    console.log(`${functionName} result:`, result);
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error.message);
    throw error;
  }
}


main().catch((error) => {
  console.error("Unhandled Error:", error);
  process.exitCode = 1;
});
