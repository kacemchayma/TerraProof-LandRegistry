// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LandNFT.sol";

/// @title Registre foncier basé sur NFT + DID
contract LandRegistry is AccessControl {
    
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    LandNFT public nft;
    uint256 public nextId;

    struct Parcel {
        uint256 id;
        string cadastreId;
        string location;
        uint256 area;
        address owner;
        string metadataURI;
        bytes32 didHash;
        bool exists;
    }

    mapping(uint256 => Parcel) public parcels;
    mapping(uint256 => address[]) public history;

    event ParcelCreated(uint256 id, address owner);
    event ParcelTransferred(uint256 id, address from, address to);

    constructor(address admin, address nftAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
        nft = LandNFT(nftAddress);
    }

    /// @notice Crée une nouvelle parcelle + NFT
    function createParcel(
        string memory cadastreId,
        string memory location,
        uint256 area,
        address owner,
        string memory metadataURI,
        bytes32 didHash
    ) external onlyRole(REGISTRAR_ROLE) {

        uint256 id = nextId;

        parcels[id] = Parcel(
            id,
            cadastreId,
            location,
            area,
            owner,
            metadataURI,
            didHash,
            true
        );

        nextId++;

        nft.mint(owner, id);

        emit ParcelCreated(id, owner);
    }

    /// @notice Transfère la propriété + NFT
    function transferParcel(
        uint256 id,
        address newOwner,
        bytes32 didHash
    ) external {

        Parcel storage p = parcels[id];
        require(p.exists, "Parcel does not exist");
        require(msg.sender == p.owner, "Not owner");

        history[id].push(p.owner);

        address previousOwner = p.owner;

        p.owner = newOwner;
        p.didHash = didHash;

        // IMPORTANT : ici le registre suppose qu'il est approvedForAll
        nft.safeTransferFrom(previousOwner, newOwner, id);

        emit ParcelTransferred(id, previousOwner, newOwner);
    }
}
