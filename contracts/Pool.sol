// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ThToken} from "./thToken.sol";
import {IThToken} from "./IThToken.sol";

struct Reserve {
		uint16 id;
		address thTokenAddress;
}

library PoolLogic {
	function initReserve(
		mapping(address => Reserve) storage reserves,
		address[] storage reservesList,
		address underlyingAsset,
		address thTokenAddress
	) internal returns (bool) {
		reserves[underlyingAsset].thTokenAddress = thTokenAddress;
		reservesList.push(underlyingAsset);
		reserves[underlyingAsset].id = uint16(reservesList.length - 1);
		bool alreadyAdded = reserves[underlyingAsset].id != 0 || reservesList[0] == underlyingAsset;
		require(!alreadyAdded, "Reserve Alrady Added");
		return true;
	}
}

contract Pool {

	// maps underlying asset address to reserve struct
	mapping(address => Reserve) internal _reserves;
	// addresses of underlying assets
	address[] _reservesList;

	function initReserve(
		address underlyingAsset,
		address thTokenAddress
	) external returns (bool) {
		bool initialized = PoolLogic.initReserve(_reserves, _reservesList, underlyingAsset, thTokenAddress);
		return initialized;
	}

	function deposit(
		address underlyingAsset
	) external payable {
		Reserve storage reserve = _reserves[underlyingAsset];
		IERC20(underlyingAsset).transferFrom(msg.sender, reserve.thTokenAddress, msg.value);
		IThToken(reserve.thTokenAddress).mint(msg.sender, msg.value);
	}
	
	function withdraw(
		address underlyingAsset,
		uint256 amount
	) external {
		Reserve storage reserve = _reserves[underlyingAsset];
		IThToken(reserve.thTokenAddress).burn(msg.sender, amount);
	}

}