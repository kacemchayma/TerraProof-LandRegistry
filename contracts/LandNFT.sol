// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title LandNFT - Représentation NFT des parcelles
contract LandNFT is ERC721, Ownable {

    constructor(address initialOwner)
        ERC721("LandToken", "LAND")
        Ownable(initialOwner)
    {}

    /// @notice Mint un NFT représentant une parcelle
    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }
}
