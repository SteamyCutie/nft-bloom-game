//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract BloomGameStaking is Ownable {
    using Address for address;

    struct UserInfo {
        mapping(address => uint256[]) stakedTokens;
        mapping(address => uint256) timeStaked;
        uint256 amountStaked;
    }

    struct NftInfo {
        bool isStakable;
        address nftAddress;
        uint256 stakingFee;
        uint256 amountOfStakers;
        uint256 stakingLimit;
    }

    mapping(address => UserInfo) public userInfo;
    mapping(address => mapping(uint256 => address)) public tokenOwners;

    NftInfo[] public nftCollection;

    constructor() {}

    function stake(uint256 _cid, uint256 _id) external payable {
        require(msg.value >= nftCollection[_cid].stakingFee, "Error: Not enough Staking fee!");
        _stake(msg.sender, _cid, _id);
    }

    function unstake(uint256 _cid, uint256 _id) external {
        _unstake(msg.sender, _cid, _id);
    }

    function _stake(address _user, uint256 _cid, uint256 _id) internal {
        UserInfo storage user = userInfo[_user];
        NftInfo storage nftInfo = nftCollection[_cid];

        require(user.stakedTokens[nftInfo.nftAddress].length < nftInfo.stakingLimit, "Error: Stake Count Limited!");

        IERC721(nftInfo.nftAddress).transferFrom(_user, address(this),_id);

        if (user.stakedTokens[nftInfo.nftAddress].length == 0) {
            nftInfo.amountOfStakers += 1;
        }

        user.amountStaked += 1;
        user.timeStaked[nftInfo.nftAddress] = block.timestamp;
        user.stakedTokens[nftInfo.nftAddress].push(_id);
        tokenOwners[nftInfo.nftAddress][_id] = _user;
    }

    function _unstake(address _user, uint256 _cid, uint256 _id) internal {
        UserInfo storage user = userInfo[_user];
        NftInfo storage nftInfo = nftCollection[_cid];

        require(tokenOwners[nftInfo.nftAddress][_id] == _user, "Error: You don't own this NFT.");

        for (uint256 i; i < user.stakedTokens[nftInfo.nftAddress].length; i++) {
            if (user.stakedTokens[nftInfo.nftAddress][i] == _id) {
                user.stakedTokens[nftInfo.nftAddress][i] = user.stakedTokens[nftInfo.nftAddress][user.stakedTokens[nftInfo.nftAddress].length - 1];
                user.stakedTokens[nftInfo.nftAddress].pop();
                break;
            }
        }

        if (user.stakedTokens[nftInfo.nftAddress].length == 0) {
            nftInfo.amountOfStakers -= 1;
        }

        delete tokenOwners[nftInfo.nftAddress][_id];

        user.timeStaked[nftInfo.nftAddress] = block.timestamp;
        user.amountStaked -= 1;

        if (user.amountStaked == 0) {
            delete userInfo[_user];
        }

        IERC721(nftInfo.nftAddress).transferFrom(address(this), _user, _id);
    }

    function setNftInfo(bool _isStakable, address _nftAddress, uint256 _stakingFee, uint256 _stakingLimit) public onlyOwner {
        nftCollection.push(
            NftInfo({
                isStakable: _isStakable,
                nftAddress: _nftAddress,
                stakingFee: _stakingFee,
                amountOfStakers: 0,
                stakingLimit: _stakingLimit
            })
        );
    }

    function updateNftInfo(uint256 _cid, bool _isStakable, address _nftAddress, uint256 _stakingFee, uint256 _stakingLimit) public onlyOwner {
        NftInfo storage collection = nftCollection[_cid];
        collection.isStakable = _isStakable;
        collection.nftAddress = _nftAddress;
        collection.stakingFee = _stakingFee;
        collection.stakingLimit = _stakingLimit;
    }

    function setStakeStatues(uint256 _cid, bool _isStakable) public onlyOwner {
        nftCollection[_cid].isStakable = _isStakable;
    }


    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getUserInfo(address _user, address _collection) public view returns (uint256[] memory, uint256, uint256) {
        UserInfo storage user = userInfo[_user];
        return (
            user.stakedTokens[_collection],
            user.timeStaked[_collection],
            user.amountStaked
        );
    }

    function getNftInfo(uint256 _cid) public view returns (bool, address, uint256, uint256, uint256) {
        NftInfo memory nftInfo = nftCollection[_cid];
        return (
            nftInfo.isStakable,
            nftInfo.nftAddress,
            nftInfo.stakingFee,
            nftInfo.amountOfStakers,
            nftInfo.stakingLimit
        );
    }

    receive() external payable {}
}