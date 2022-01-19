// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract BloomGameAirdropping is Ownable {
    using Address for address;

    struct Airdrop {
        address tokenAddress;
        address[] receivers;
        uint256[] tokenIds;
    }

    mapping(address => mapping(address => mapping (uint256 => bool))) public airdropDone;           // Storage for all airdrops to identify executed airdrops
    mapping(address => mapping (address => bool)) public airdropCanceled;                           // Storage for all airdrops that have been canceled

    bool public paused;

    string private constant airdropType = "Airdrop(address tokenAddress, address[] receivers, uint256[] tokenIds)";
    bytes32 public constant airdropTypeHash = keccak256(abi.encodePacked(airdropType));

    modifier onlyUnpaused {
        require(paused == false, "Error: Airdrops are paused!");
        _;
    }

    constructor() {}

    function claim(address tokenAddress, address[] memory receivers, uint256[] memory tokenIds, uint256 index, uint8 v, bytes32 r, bytes32 s) onlyUnpaused external {       
        address sender = ecrecover(hashAirdrop(tokenAddress, receivers, tokenIds), v, r, s);
        uint256 tokenId = tokenIds[index];
        address receiver = receivers[index];

        require(receiver == msg.sender, "Error: Defined airdrop receiver needs to be msg.sender!");
        require(airdropDone[receiver][tokenAddress][tokenId] == false, "Error: Receiver has already retrieved this airdrop!");

        airdropDone[receiver][tokenAddress][tokenId] = true;
        
        require(airdropCanceled[sender][tokenAddress] == false, "Error: Sender has canceled this airdrop!");

        IERC721 token = IERC721(tokenAddress);
        token.safeTransferFrom(sender, receiver, tokenId);
    }

    function hashAirdrop(address tokenAddress, address[] memory receivers, uint256[] memory tokenIds) private pure returns (bytes32){
      return keccak256(abi.encode(
            airdropTypeHash,
            keccak256(abi.encodePacked(tokenAddress)),
            keccak256(abi.encodePacked(receivers)),
            keccak256(abi.encodePacked(tokenIds))
        ));
    }

    function setPausedTo(bool value) external onlyOwner {
        paused = value;
    }

    function cancel(address tokenAddress) external {
        airdropCanceled[msg.sender][tokenAddress] = true;
    }

    function kill() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
