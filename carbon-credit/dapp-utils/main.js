const wallets = require("./wallets.json")
const ApplicationBinaryInterface = require('./ApplicationBinaryInterface');

const id = 0;
const addresses = wallets["addresses"];
const filteredIssuers = addresses.filter(issuer => issuer.id === id)[0];
const providerUrl = wallets["provider_url"];
const walletPrivateKey = filteredIssuers["private_key"]
const contractAddress = wallets["contract"]["address"];
const contracts =  wallets["contract"]["contracts"];
const contractName =  wallets["contract"]["name"];

async function main() {
  try {
    const abiInstance = new ApplicationBinaryInterface(providerUrl, walletPrivateKey);
    const abi = await abiInstance.loadAbi(contracts, contractName);
    const contract = await abiInstance.getContractInstance(contractAddress, abi);

    // Call getAllAddresses (or any other function)
    await executeContractFunction(abiInstance, contract, "getAllAddresses", [], false); // Assuming getAllAddresses is not transactional
    // For read-only functions, set the last parameter to false
    // await executeContractFunction(abiInstance, contract, "readOnlyFunction", [], false);

  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}

async function executeContractFunction(abiInstance, contract, functionName, args = [], isTransactional = false) {
  try {
    let result;
    if (isTransactional) {
      const tx = await contract.methods[functionName](...args).send({ from: abiInstance.account.address });
      console.log(`Transaction Hash for ${functionName}:`, tx.transactionHash);
      result = await abiInstance.getTransactionReceipt(tx.transactionHash);
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
