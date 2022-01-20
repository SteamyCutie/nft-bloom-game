//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CharacterNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    string public baseURI;

    uint256 public maxWhiteMint = 1000;
    uint256 public whitelistMintId = 1;
    uint256 public WHITELIST_SALE_PRICE = 0.01 ether;

    uint256 public maxPublicMint = 6000;
    uint256 public publicMintId = 1001;
    uint256 public PUBLIC_SALE_PRICE = 0.02 ether;

    bytes32 public whitelistMerkleRoot;

    bool public isPaused = true;

    mapping(address => bool) public isClaimed;

    constructor() ERC721("CharacterNFT", "NFT") {
        setBaseURI("");
        setPaused(true);
    }

    modifier isMintAllowed() {
        require(
            !isPaused, 
            "Error: You are not allowed to mint until the owner starts Minting!"
        );
        _;
    }

    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Error: Address is NOT whitelisted yet!"
        );
        _;
    }

    modifier isCorrectPayment(uint256 price, uint256 numberOfTokens) {
        require(
            price * numberOfTokens == msg.value,
            "Error: Sent ETH value is INCORRECT!"
        );
        _;
    }

    modifier canMint(uint256 numberOfTokens) {
        require(
            publicMintId + numberOfTokens <= maxPublicMint,
            "Error: Not enough tokens remaining to mint!"
        );
        _;
    }

    function whitelistMint(
      bytes32[] calldata merkleProof
    )
        public
        payable
        isMintAllowed
        isValidMerkleProof(merkleProof, whitelistMerkleRoot)
        isCorrectPayment(WHITELIST_SALE_PRICE, 1)
        nonReentrant
    {
        require(whitelistMintId <= maxWhiteMint, "Error: Already minted maximum number of tokens!");
        require(!isClaimed[msg.sender], "Error: NFT is already claimed by this wallet");
        _mint(msg.sender, whitelistMintId);
        _setTokenURI(whitelistMintId, Strings.toString(whitelistMintId));
        whitelistMintId ++;
        isClaimed[msg.sender] = true;
    }

    function publicMint(
      uint256 numberOfTokens
    )
        public
        payable
        isMintAllowed
        isCorrectPayment(PUBLIC_SALE_PRICE, numberOfTokens)
        canMint(numberOfTokens)
        nonReentrant
    {
        require(numberOfTokens <= 5, "Error: You can mint only 5 tokens maximum per purchase!");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _mint(msg.sender, publicMintId);
            _setTokenURI(publicMintId, Strings.toString(publicMintId));
            publicMintId ++;
        }
    }

    function tokenURI(uint256 tokenId)
      public
      view
      virtual
      override
      returns (string memory)
    {
      require(_exists(tokenId), "Error: Token does not exist!");
      return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
      baseURI = _baseURI;
    }

    function setWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        whitelistMerkleRoot = merkleRoot;
    }

    function resetClaim(address _address) public onlyOwner {
        isClaimed[_address] = false;
    }

    function setWhitelistSalePrice(uint256 _price) public onlyOwner {
        WHITELIST_SALE_PRICE = _price;
    }

    function setPublicSalePrice(uint256 _price) public onlyOwner {
        PUBLIC_SALE_PRICE = _price;
    }

    function setPaused(bool _paused) public onlyOwner {
        isPaused = _paused;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}