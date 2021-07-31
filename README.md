<div align="center">

# @randomsounds/contracts

[![Version][v-badge-url]][npm-url] [![Downloads][dl-badge-url]][npm-url] [![GitHub Workflow Status][gh-actions-img]][github-actions]
 
</div>

Solidity contract for <a href="https://randomsounds.wtf"><code>RAND0M S0UNDS NFT</code></a>. Includes the contract itself, ABIs and TypeScript definitons.

## Addresses

- Ropsten testnet: `0x706Ceab8aD7696C75554446Cad371aa337405B09`
- Ethereum mainnet: coming soon

## Install

```sh
pnpm i @randomsounds/contracts
```

## Usage

### Solidity

```solidity
import "@randomsounds/contracts/RandomSoundsNFT.sol";

contract MyContract is RandomSoundsNFT {
 // blah blah
}
```

### TypeScript

```ts
import type { RandomSoundsNFT } from '@randomsounds/contracts'

// blah blah
```

[v-badge-url]: https://img.shields.io/npm/v/@randomsounds/contracts.svg?style=for-the-badge&color=black&label=&logo=npm
[npm-url]: https://www.npmjs.com/package/@randomsounds/contracts
[dl-badge-url]: https://img.shields.io/npm/dt/@randomsounds/contracts?style=for-the-badge&color=black
[github-actions]: https://github.com/randomsounds-wtf/contracts/actions
[gh-actions-img]: https://img.shields.io/github/workflow/status/randomsounds-wtf/contracts/CI?style=for-the-badge&color=black&label=&logo=github
