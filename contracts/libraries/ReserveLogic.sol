// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {DataTypes} from "./DataTypes.sol";

error RESERVE_ALREADY_INITIALIZED();

library ReserveLogic {
	using ReserveLogic for DataTypes.Reserve;

	function init(
		DataTypes.Reserve storage reserve,
		address thTokenAddress
	) internal {
		if (reserve.thTokenAddress != address(0)) {
			revert RESERVE_ALREADY_INITIALIZED();
		}
		reserve.thTokenAddress = thTokenAddress;
	}
}