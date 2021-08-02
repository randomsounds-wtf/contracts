import assert from 'assert'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { nfts } from '../scripts/nfts'
import { RandomSoundsNFT } from '../typechain/RandomSoundsNFT'

describe('NFT', () => {
  let NFTContractFactory
  let NFTContract: RandomSoundsNFT
  let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addrs

  beforeEach(async () => {
    ;[owner, addr1, addr2, addrs] = await ethers.getSigners()
    NFTContractFactory = await ethers.getContractFactory('RandomSoundsNFT')
    NFTContract = await NFTContractFactory.deploy()
    await NFTContract.deployed()

    console.log('Contract deployed to:', NFTContract.address)

    const promises = nfts.map(async (nft) => {
      await NFTContract.mint(nft.cid)
    })

    await Promise.all(promises)
  })

  describe('Standard functions', () => {
    it('Initial contract balance should be 50', async () => {
      const bal = await NFTContract.balanceOf(owner.address)
      assert.strictEqual(bal.toNumber(), 50)
    })
    it(`tokenURI(...) should return token's minted URI`, async () => {
      assert.strictEqual(await NFTContract.tokenURI(1), 'QmWfzvHK9yPR7jpEiovDejMspkjkKzFQPUMC7h3fZKuCye')
    })
  })

  describe('Custom functions', () => {
    describe('tokenIdsByOwner(_owner) ', () => {
      it('should return an array with all owned token IDs', async () => {
        const mockIDs = []

        for (let i = 1; i <= 50; i++) mockIDs.push(i)

        assert.deepStrictEqual(
          (await NFTContract.tokenIdsByOwner(owner.address)).map((x) => x.toNumber()),
          mockIDs
        )
      })
      it('should return a correct array when some of the tokens are claimed', async () => {
        const mockIDs = []

        for (let i = 1; i <= 50; i++) {
          if (i !== 2 && i !== 8 && i !== 12) mockIDs.push(i)
        }

        // Transfer away some NFTs
        await NFTContract.transferFrom(owner.address, addr1.address, 2)
        await NFTContract.transferFrom(owner.address, addr1.address, 8)
        await NFTContract.transferFrom(owner.address, addr1.address, 12)

        assert.deepStrictEqual(
          (await NFTContract.tokenIdsByOwner(owner.address)).map((x) => x.toNumber()),
          mockIDs
        )

        assert.deepStrictEqual(
          (await NFTContract.tokenIdsByOwner(addr1.address)).map((x) => x.toNumber()),
          [2, 8, 12]
        )
      })
      it('should return an empty array if none of the tokens are owned', async () => {
        assert.deepStrictEqual(await NFTContract.tokenIdsByOwner(addr1.address), [])
      })
    })
    describe('tokenURIsAndIDsByOwner()', () => {
      it('should return an array of structs with IDs and URIs', async () => {
        const mockIDs = []

        for (let i = 1; i <= 50; i++) mockIDs.push({ id: i, uri: nfts[i - 1].cid })

        assert.deepStrictEqual(
          (await NFTContract.tokenURIsAndIDsByOwner(owner.address)).map((x) => ({
            uri: x.uri,
            id: x.id.toNumber()
          })),
          mockIDs
        )
      })
      it('should return a correct array when some of the tokens are claimed', async () => {
        const mockIDs = []

        for (let i = 1; i <= 50; i++) {
          if (i !== 2 && i !== 8 && i !== 12) mockIDs.push({ id: i, uri: nfts[i - 1].cid })
        }

        // Transfer away some NFTs
        await NFTContract.transferFrom(owner.address, addr1.address, 2)
        await NFTContract.transferFrom(owner.address, addr1.address, 8)
        await NFTContract.transferFrom(owner.address, addr1.address, 12)

        assert.deepStrictEqual(
          (await NFTContract.tokenURIsAndIDsByOwner(owner.address)).map((x) => ({
            uri: x.uri,
            id: x.id.toNumber()
          })),
          mockIDs
        )
      })
      it('should return an empty array if none of the tokens are owned', async () => {
        assert.deepStrictEqual(await NFTContract.tokenURIsAndIDsByOwner(addr1.address), [])
      })
    })
    describe('claim(tokenId)', () => {
      it('should throw an error on invalid sent value', async () => {
        await NFTContract.transferFrom(owner.address, addr1.address, 2)
        try {
          await NFTContract.claim(2, { value: ethers.utils.parseEther('0.2') })
        } catch (e) {
          assert.strictEqual(
            e.message,
            `VM Exception while processing transaction: reverted with reason string 'Invalid sent value'`
          )
        }
      })
      it('should throw if already an owner', async () => {
        try {
          await NFTContract.claim(2, { value: ethers.utils.parseEther('120') })
        } catch (e) {
          assert.strictEqual(
            e.message,
            `VM Exception while processing transaction: reverted with reason string 'Non-existent address or already an owner'`
          )
        }
      })
      it('should take 120 MATIC from an address and transfer the NFT', async () => {
        await NFTContract.transferFrom(owner.address, addr1.address, 2)
        const b1 = await owner.getBalance()

        const value = ethers.utils.parseEther('120')

        assert.deepStrictEqual((await NFTContract.balanceOf(owner.address)).toNumber(), 49)

        const tx = await NFTContract.claim(2, { value })

        const receipt = tx.wait()

        const gas = (await receipt).gasUsed.mul(tx.gasPrice!)

        const b2 = await owner.getBalance()

        assert.deepStrictEqual(b1.sub(gas).sub(BigNumber.from(value)), b2)
        assert.deepStrictEqual((await NFTContract.balanceOf(owner.address)).toNumber(), 50)
      })
    })
    describe('setPrice(price)', () => {
      it('changes default price', async () => {
        const value = ethers.utils.parseEther('0.05')
        await NFTContract.setPrice(BigNumber.from(value))
        await NFTContract.transferFrom(owner.address, addr1.address, 2)
        const b1 = await owner.getBalance()

        assert.deepStrictEqual((await NFTContract.balanceOf(owner.address)).toNumber(), 49)

        const tx = await NFTContract.claim(2, { value })

        const receipt = tx.wait()

        const gas = (await receipt).gasUsed.mul(tx.gasPrice!)

        const b2 = await owner.getBalance()

        assert.deepStrictEqual(b1.sub(gas).sub(BigNumber.from(value)), b2)
      })
    })
  })
})
