// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RandomSoundsNFT is ERC721, Ownable, ERC721URIStorage {
    event Mint(uint256 id);
    event Claim(uint256 id);

    uint256 public constant MAX_TOKENS = 50;

    uint256 private constant PRICE = 50000000000000000;

    using SafeMath for uint256;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor() ERC721("RandomSoundsNFT", "RSNFT") {}

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Mint an NFT and add URI to it
    function mint(string memory tokenURI_) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);

        require(tokenId <= MAX_TOKENS, "Sold out!");

        _setTokenURI(tokenId, tokenURI_);

        return tokenId;
    }

    // Claim and mint NFT
    function claim(uint256 id) external payable {
        require(msg.value == PRICE, "Claiming an NFT costs 0.05 ETH");
        require(id <= MAX_TOKENS, "Cannot claim non-existent token");

        // Transfer to seller
        safeTransferFrom(address(this), msg.sender, id);

        emit Claim(id);
    }

    // withdraw bobux
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function transferTo(address acc, uint256 id) public onlyOwner {
        safeTransferFrom(msg.sender, acc, id);
    }
}
