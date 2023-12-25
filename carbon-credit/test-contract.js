const SimpleCounterContract = require('./SampleCounterContract');

const providerUrl = "https://eth-sepolia.g.alchemy.com/v2/Gk8XenOHkElitZ4N6E60lc3qKsZcXWB4";
const contractAddress = "0x791466fA0832D713f239331f8E1E5a78Ea127B0e"
const walletPrivateKey = "96384276a09231d3b185cb9c2ced0d4de4a3231f4f5c8486c9ef5177ecd16a57";

// Create an instance of the contract class
const simpleCounter = new SimpleCounterContract(
    providerUrl,
    contractAddress,
    walletPrivateKey
);

// Main execution function
async function main() {
    const action = process.argv[2];

    if (action === "increment") {
        await simpleCounter.incrementCount();
    } else if (action === "decrement") {
        await simpleCounter.decrementCount();
    } else if (action === "getCount") {
        await simpleCounter.getCount();
    } else {
        console.log("Invalid action. Please use 'increment', 'decrement', or 'getCount'.");
    }
}

// Run the main function and handle errors
main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});