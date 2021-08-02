<div align="center">

# @randomsounds/contracts

[![Version][v-badge-url]][npm-url] [![Downloads][dl-badge-url]][npm-url] [![GitHub Workflow Status][gh-actions-img]][github-actions]

</div>

Solidity contract for <a href="https://randomsounds.wtf"><code>RAND0M S0UNDS NFT</code></a>. Includes the contract itself, ABIs and TypeScript definitons.

## Addresses

- Contract address: [`0xF66770253dfC078d6a3844e0c4738d2ff5006E5D`](https://polygonscan.com/token/0xf66770253dfc078d6a3844e0c4738d2ff5006e5d?a=0x0A9f12d325b905907C43566b4740F2dFE10C3C4B)
- Deployer address: `0x0A9f12d325b905907C43566b4740F2dFE10C3C4B`

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
