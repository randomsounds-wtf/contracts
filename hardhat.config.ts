// hardhat.config.ts
import { HardhatUserConfig } from 'hardhat/types'
import { task } from 'hardhat/config'
import { config as dotEnvConfig } from 'dotenv'

dotEnvConfig()

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.6',
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
      gasPrice: 1,
      blockGasLimit: 15000000
    },
    localhost: {}
  }
}

export default config

task('blockNumber', 'Prints the current block number', async (_, { ethers }) => {
  await ethers.provider.getBlockNumber().then((blockNumber) => {
    console.log('Current block number: ' + blockNumber)
  })
})
