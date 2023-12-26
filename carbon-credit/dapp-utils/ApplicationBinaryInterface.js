const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

class ApplicationBinaryInterface {
  constructor(providerUrl, walletPrivateKey) {
    this.web3 = new Web3(providerUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(walletPrivateKey);
    this.web3.eth.accounts.wallet.add(this.account);
  }

  async loadAbi(contracts, contractName) {
    try {
      const buildInfoPath = "../artifacts/build-info";
      const files = fs.readdirSync(buildInfoPath);
      const abiFileName = files.find(file => file.endsWith(".json"));
      const abiFilePath = path.join(buildInfoPath, abiFileName);
      const fileContent = JSON.parse(fs.readFileSync(abiFilePath, "utf8"));
      return fileContent.output.contracts[contracts][contractName].abi;
    } catch (error) {
      console.error("Error loading ABI:", error.message);
      throw error;
    }
  }

  async getContractInstance(contractAddress, abi) {
    return new this.web3.eth.Contract(abi, contractAddress);
  }
}

module.exports = ApplicationBinaryInterface;