require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const { ROPSTEN_API_URL, RINKEBY_API_URL, MAINNET_API_URL, POLYGON_API_URL, MUMBAI_API_URL, ETHERSCAN_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {},
    ropsten: {
      url: ROPSTEN_API_URL,
      accounts: [ PRIVATE_KEY ],
    },
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [ PRIVATE_KEY ],
    },
    mainnet: {
      chainId: 1,
      url: MAINNET_API_URL,
      accounts: [ PRIVATE_KEY ],
    },
    polygon: {
      url: POLYGON_API_URL,
      accounts: [ PRIVATE_KEY ],
    },
    mumbai: {
      url: MUMBAI_API_URL,
      accounts: [ PRIVATE_KEY ],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  }
};