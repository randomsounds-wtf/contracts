// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract RandomSoundsNFT is ERC721, Ownable, ERC721URIStorage {
    struct URIwithID {
        uint256 id;
        string uri;
    }

    event Mint(uint256 id);
    event Claim(uint256 id);

    uint256 public constant MAX_TOKENS = 50;

    uint256 private constant PRICE = 50000000000000000;

    uint256 private constant MAX_GAS = 150000000000; // 150 gwei

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
    function claim(uint256 _tokenId) external payable {
        require(msg.value == PRICE, "Claiming an NFT costs 0.05 ETH");
        require(_tokenId <= MAX_TOKENS, "Only 50 NFTs were minted");
        require(
            msg.sender != address(0) && msg.sender != ownerOf(_tokenId),
            "Non-existent address or already an owner"
        );

        address _owner = ownerOf(_tokenId);

        payable(_owner).transfer(msg.value); // pay 0.05ETH to owner

        setApprovalForAll(_owner, true); // approve buying NFTs
        _transfer(_owner, msg.sender, _tokenId); // transfer NFT

        emit Claim(_tokenId);
    }

    // Get all token IDs of a token owner
    function tokenIdsByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256 i = 0;

            uint256[] memory result = new uint256[](tokenCount);

            for (uint256 _tokenId = 1; _tokenId <= 50; _tokenId++) {
                if (ownerOf(_tokenId) == _owner) {
                    result[i++] = _tokenId;
                }
            }

            return result;
        }
    }

    // Get token URIs and IDs in a single call
    function tokenURIsAndIDsByOwner(address _owner)
        public
        view
        returns (URIwithID[] memory)
    {
        uint256[] memory ids = tokenIdsByOwner(_owner);

        if (ids.length == 0) {
            return new URIwithID[](0);
        }

        URIwithID[] memory uris = new URIwithID[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            uris[i].uri = tokenURI(ids[i]);
            uris[i].id = ids[i];
        }

        return uris;
    }

    // withdraw bobux from contract
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
