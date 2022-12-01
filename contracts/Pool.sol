// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {DepositLogic} from "./libraries/DepositLogic.sol";
import {GroupLogic} from "./libraries/GroupLogic.sol";
import {PoolLogic} from "./libraries/PoolLogic.sol";
import {ReserveLogic} from "./libraries/ReserveLogic.sol";
import {ThToken} from "./thToken.sol";
import {IThToken} from "./IThToken.sol";
import {IPool} from "./IPool.sol";
import {PoolStorage} from "./PoolStorage.sol";

contract Pool is Initializable, OwnableUpgradeable, PoolStorage, IPool {
	using ReserveLogic for DataTypes.Reserve;

	function initialize() external initializer {
		_repayPeriod = 30 days;
		__Ownable_init();
	}

	function initReserve(
		address underlyingAsset,
		address thTokenAddress
	) external onlyOwner returns (bool) {
		bool initialized = PoolLogic.initReserve(_reserves, _reservesList, underlyingAsset, thTokenAddress);
		return initialized;
	}

	function initGroup(
		address groupAddress,
		DataTypes.Group memory params
	) external onlyOwner returns (bool) {
		bool initialized = PoolLogic.initGroup(_groups, groupAddress, params);
		return initialized;
	}

	function removeGroup(address groupAddress) external onlyOwner returns (bool) {
		delete(_groups[groupAddress]);
		return true;
	}

	function addGroupMember(
		address groupAddress,
		address newMember,
		DataTypes.GroupMember memory params
	) external onlyOwner returns (bool) {
		bool added = GroupLogic.addMember(groupAddress, newMember, params);
		return added;
	}

	function removeGroupMember(
		address groupAddress,
		address member
	) external onlyOwner returns (bool) {
		bool removed = GroupLogic.removeMember(groupAddress, member);
		return removed;
	} 

	function deposit(
		address underlyingAsset,
		uint256 amount
	) public virtual override {
		DepositLogic.deposit(_reserves, underlyingAsset, amount);
	}
	
	function withdraw(
		address underlyingAsset,
		uint256 amount
	) public virtual override {
		DepositLogic.withdraw(_reserves, underlyingAsset, amount);
	}

	function getReserve(address asset) external view returns (DataTypes.Reserve memory) {
		return _reserves[asset];
	}

	function getGroup(address groupAddress) external view returns (DataTypes.Group memory) {
		return _groups[groupAddress];
	}
}