const Web3 = require("web3");
const ApplicationBinaryInterface = require("./ApplicationBinaryInterface");
const db = require("./db.json");

const platform = "alchemy";
const contractName = "CarbonCredit";
const contracts = db["contracts"].find(item => item.name === contractName)["contracts"];
const contractAddress = db["contracts"].find(item => item.name === contractName)["address"];
const providerUrl = db["platforms"].find(item => item.name === platform)["wss"];
const walletPrivateKey = db["wallets"].find(item => item.isOwner === true)["private_key"];

async function main() {
  try {
    const abiInstance = new ApplicationBinaryInterface(providerUrl, walletPrivateKey);
    const abi = await abiInstance.loadAbi(contracts, contractName);
    const contract = await abiInstance.getContractInstance(contractAddress, abi);

    // Subscribe to events
    subscribeToEvents(contract);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}

function subscribeToEvents(contract) {
  contract.events.WalletAdded()
      .on("data", event => console.log("Wallet Added:", event.returnValues))
      .on("error", console.error);

  contract.events.WalletRemoved()
      .on("data", event => console.log("Wallet Removed:", event.returnValues))
      .on("error", console.error);

  contract.events.ProjectAdded()
      .on("data", event => console.log("Project Added:", event.returnValues))
      .on("error", console.error);
}

main().catch((error) => {
  console.error("Unhandled Error:", error);
  process.exitCode = 1;
});
