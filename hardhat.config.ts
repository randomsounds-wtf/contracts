// hardhat.config.ts
import { HardhatUserConfig } from 'hardhat/types'
import { config as dotEnvConfig } from 'dotenv'

dotEnvConfig()

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-gas-reporter'

// TODO: reenable solidity-coverage when it works
// import "solidity-coverage";
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    tests: './tests',

    cache: './cache',
    artifacts: './artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337, // TO WORK WITH METAMASK
      gas: 8000000,
      gasPrice: 1
    },
    polygon: {
      url: 'https://polygon-mainnet.infura.io/v3/08791951999a4e71b9ba5ae174126de5',
      accounts: [PRIVATE_KEY],
      chainId: 137
    },
    localhost: {}
  },
  gasReporter: { gasPrice: 25, currency: 'USD' }
}

export default config
