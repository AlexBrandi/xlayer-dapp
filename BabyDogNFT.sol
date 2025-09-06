// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BabyDogNFT is ERC721, Ownable {
    uint256 public constant maxSupply = 10000;
    uint256 public mintPrice = 0.02 ether;

    uint256 private _nextTokenId = 1;
    uint256 private _totalMinted;
    uint256 public constant MAX_PER_TX = 100;

    string private _baseTokenURI = "https://your-domain.com/babydog/metadata/";

    constructor() ERC721("BabyDog", "BABYDOG") Ownable(msg.sender) {}

    function totalSupply() public view returns (uint256) {
        return _totalMinted;
    }

    function setMintPrice(uint256 weiPrice) external onlyOwner {
        mintPrice = weiPrice;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        _mintMany(to, amount);
    }

    function withdraw(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }

    function mint(uint256 amount) external payable {
        require(amount > 0 && amount <= MAX_PER_TX, "Bad amount");
        require(_totalMinted + amount <= maxSupply, "Sold out");
        require(msg.value == mintPrice * amount, "Wrong value");
        _mintMany(msg.sender, amount);
    }

    function _mintMany(address to, uint256 amount) internal {
        unchecked {
            for (uint256 i = 0; i < amount; i++) {
                _safeMint(to, _nextTokenId++);
            }
            _totalMinted += amount;
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId <= maxSupply, "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}