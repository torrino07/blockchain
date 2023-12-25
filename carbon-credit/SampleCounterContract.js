const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

class SimpleCounterContract {
  constructor(providerUrl, contractAddress, walletPrivateKey) {
    this.web3 = new Web3(providerUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(walletPrivateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.contractAddress = contractAddress;
    this.abi = this.loadAbi();
    this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
  }

  loadAbi() {
    const buildInfoPath = "./artifacts/build-info";
    const files = fs.readdirSync(buildInfoPath);
    const abiFileName = files.find(file => file.endsWith(".json"));
    const abiFilePath = path.join(buildInfoPath, abiFileName);
    const fileContent = JSON.parse(fs.readFileSync(abiFilePath, "utf8"));
    return fileContent.output.contracts["contracts/SimpleCounter.sol"]["SimpleCounter"].abi;
  }

  async incrementCount() {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.increment().estimateGas({ from: this.account.address });

    const receipt = await this.contract.methods.increment().send({
      from: this.account.address,
      gasPrice,
      gas: gasEstimate
    });

    console.log("Transaction receipt:", receipt);
  }

  async decrementCount() {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.decrement().estimateGas({ from: this.account.address });

    const receipt = await this.contract.methods.decrement().send({
      from: this.account.address,
      gasPrice,
      gas: gasEstimate
    });

    console.log("Transaction receipt:", receipt);
  }

  async getCount() {
    const count = await this.contract.methods.getCount().call();
    console.log("Current count:", count);
  }
}

module.exports = SimpleCounterContract;
