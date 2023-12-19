require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_URL="https://eth-goerli.g.alchemy.com/v2/9kQk--dWFauG2QLeXqBrc9jwrIYt2r-j"
const PRIVATE_KEY="96384276a09231d3b185cb9c2ced0d4de4a3231f4f5c8486c9ef5177ecd16a57"

module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: ALCHEMY_API_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};