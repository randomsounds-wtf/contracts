// hardhat.config.ts
import { HardhatUserConfig } from 'hardhat/types'
import { task } from 'hardhat/config'
import { config as dotEnvConfig } from 'dotenv'

dotEnvConfig()

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

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
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [PRIVATE_KEY],
      chainId: 80001
    },
    localhost: {}
  }
}

export default config
