const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Load contract ABI
const buildInfoPath = './artifacts/build-info';
const files = fs.readdirSync(buildInfoPath);
const abiFileName = files.find(file => file.endsWith('.json'));
const abiFilePath = path.join(buildInfoPath, abiFileName);
const fileContent = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'));
const abi = fileContent.output.contracts['contracts/SimpleCounter.sol']['SimpleCounter'].abi;

// Load environment variables
const providerUrl = "https://eth-sepolia.g.alchemy.com/v2/Gk8XenOHkElitZ4N6E60lc3qKsZcXWB4";
const walletPrivateKey = "96384276a09231d3b185cb9c2ced0d4de4a3231f4f5c8486c9ef5177ecd16a57";
const contractAddress = "0x791466fA0832D713f239331f8E1E5a78Ea127B0e";

const web3 = new Web3(providerUrl);
const contract = new web3.eth.Contract(abi, contractAddress);

async function incrementCount() {
    const account = web3.eth.accounts.privateKeyToAccount(walletPrivateKey);
    web3.eth.accounts.wallet.add(account);

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.methods.increment().estimateGas({ from: account.address });

    const receipt = await contract.methods.increment().send({
        from: account.address,
        gasPrice,
        gas: gasEstimate
    });

    console.log('Transaction receipt:', receipt);
}

async function decrementCount() {
    const account = web3.eth.accounts.privateKeyToAccount(walletPrivateKey);
    web3.eth.accounts.wallet.add(account);

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.methods.decrement().estimateGas({ from: account.address });

    const receipt = await contract.methods.decrement().send({
        from: account.address,
        gasPrice,
        gas: gasEstimate
    });

    console.log('Transaction receipt:', receipt);
}

async function getCount() {
    const count = await contract.methods.getCount().call();
    console.log('Current count:', count);
}

async function main() {
    const action = process.argv[2];

    switch (action) {
        case 'increment':
            await incrementCount();
            break;
        case 'decrement':
            await decrementCount();
            break;
        case 'getCount':
            await getCount();
            break;
        default:
            console.log("Invalid action. Please use 'increment', 'decrement', or 'getCount'.");
    }
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});
