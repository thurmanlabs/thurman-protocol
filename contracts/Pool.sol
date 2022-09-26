// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ThToken} from "./thToken.sol";
import {IThToken} from "./IThToken.sol";
import {DataTypes} from "./DataTypes.sol";
import {PoolStorage} from "./PoolStorage.sol";

error INVALID_AMOUNT();
error NOT_ENOUGH_IN_USER_BALANCE();
error RESERVE_ALREADY_INITIALIZED();
error RESERVE_ALREADY_ADDED();

library PoolLogic {
	function initReserve(
		mapping(address => DataTypes.Reserve) storage reserves,
		address[] storage reservesList,
		address underlyingAsset,
		address thTokenAddress
	) internal returns (bool) {
		if (reserves[underlyingAsset].thTokenAddress != address(0)) {
			revert RESERVE_ALREADY_INITIALIZED();
		}
		reserves[underlyingAsset].thTokenAddress = thTokenAddress;
		bool alreadyAdded = reserves[underlyingAsset].id != 0; // || reservesList[0] == underlyingAsset;
		if (alreadyAdded) {
			revert RESERVE_ALREADY_ADDED();
		}
		reservesList.push(underlyingAsset);
		reserves[underlyingAsset].id = uint16(reservesList.length - 1); // temporarily hardcoded, but should be based on length variable		
		return true;
	}
}

contract Pool is PoolStorage {

	event Deposit(address indexed reserve, address user, uint256 amount);
	event Withdraw(address indexed reserve, address user, uint256 amount);

	function initReserve(
		address underlyingAsset,
		address thTokenAddress
	) external returns (bool) {
		bool initialized = PoolLogic.initReserve(_reserves, _reservesList, underlyingAsset, thTokenAddress);
		return initialized;
	}

	function deposit(
		address underlyingAsset,
		uint256 amount
	) external payable {
		DataTypes.Reserve memory reserve = _reserves[underlyingAsset];
		if (amount == 0) {
			revert INVALID_AMOUNT();
		}
		IERC20(underlyingAsset).transferFrom(msg.sender, reserve.thTokenAddress, amount);
		IThToken(reserve.thTokenAddress).mint(msg.sender, amount);
		emit Deposit(underlyingAsset, msg.sender, amount);
	}
	
	function withdraw(
		address underlyingAsset,
		uint256 amount
	) external {
		DataTypes.Reserve memory reserve = _reserves[underlyingAsset];
		if (amount == 0) {
			revert INVALID_AMOUNT();
		}
		uint256 userBalance = IThToken(reserve.thTokenAddress).balanceOf(msg.sender);
		if (amount >= userBalance) {
			revert NOT_ENOUGH_IN_USER_BALANCE();
		}
		IThToken(reserve.thTokenAddress).burn(msg.sender, amount);
		emit Withdraw(underlyingAsset, msg.sender, amount);
	}

	function getReserve(address asset) external view returns(DataTypes.Reserve memory) {
		return _reserves[asset];
	}
}