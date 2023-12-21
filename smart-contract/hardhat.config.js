require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_URL="https://eth-sepolia.g.alchemy.com/v2/Gk8XenOHkElitZ4N6E60lc3qKsZcXWB4"
const PRIVATE_KEY="96384276a09231d3b185cb9c2ced0d4de4a3231f4f5c8486c9ef5177ecd16a57"

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};