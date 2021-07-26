import hre from 'hardhat'
import { RandomSoundsNFT__factory } from '../typechain/index'
import { RandomSoundsNFT } from '../typechain/RandomSoundsNFT'
import { nfts } from './nfts'

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  const NFTContractFactory = (await hre.ethers.getContractFactory('RandomSoundsNFT')) as RandomSoundsNFT__factory
  const NFTContract = (await NFTContractFactory.deploy()) as RandomSoundsNFT

  await NFTContract.deployed()

  console.log('Contract deployed to:', NFTContract.address)
  console.log('Minting NFTs to the contract with the deployer address : ', deployer.address)

  const promises = nfts.map(async (nft) => {
    console.log(`Deploying ${nft.name}: ${nft.cid}`)

    await NFTContract.mint(nft.cid)
  })

  await Promise.all(promises)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
