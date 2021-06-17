// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract hei is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    mapping(string => uint8) hashes;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Heirloom", "HEI") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function safeMint(address to) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function mintItem(address recipient, string memory hash, string memory metadata)
      public
      returns (uint256)
      {
        require(hashes[hash] != 1);
        hashes[hash] = 1;
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, metadata);
        return newItemId;
      }
      
           // by a token by passing in the token's id
      function buyToken(uint256 _tokenId) public payable {
        // check if the function caller is not an zero account address
        require(msg.sender != address(0));
        // check if the token id of the token being bought exists or not
        require(_exists(_tokenId));
        // get the token's owner
        address tokenOwner = ownerOf(_tokenId);
        // token's owner should not be an zero address account
        require(tokenOwner != address(0));
        // the one who wants to buy the token should not be the token's owner
        require(tokenOwner != msg.sender);
        // transfer the token from owner to the caller of the function (buyer)
        _transfer(tokenOwner, msg.sender, _tokenId);

      }
}