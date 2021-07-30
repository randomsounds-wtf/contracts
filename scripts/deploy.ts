import hre from 'hardhat'
import { RandomSoundsNFT__factory } from '../typechain/index'
import { RandomSoundsNFT } from '../typechain/RandomSoundsNFT'
import { nfts } from './nfts'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  const NFTContractFactory = (await hre.ethers.getContractFactory('RandomSoundsNFT')) as RandomSoundsNFT__factory
  const NFTContract = (await NFTContractFactory.deploy()) as RandomSoundsNFT

  await NFTContract.deployed()

  console.log('Minting NFTs to the contract with the deployer address : ', deployer.address)

  const isLocalTestnet = (await deployer.getChainId()) === 1337

  for (const nft of nfts) {
    if (!isLocalTestnet) await sleep(1000)
    console.log(`Minting ${nft.cid}`)

    const tx = await NFTContract.mint(nft.cid)

    if (!isLocalTestnet) {
      console.log(`Pending (tx hash: ${tx.hash})`)
      const receipt = await tx.wait()
      console.log(`Status: ${receipt.status === 1 ? 'Success' : 'Failure'}`)
    }
  }

  console.log('Contract deployed to:', NFTContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
