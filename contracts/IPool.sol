// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {DataTypes} from "./libraries/DataTypes.sol";

interface IPool {

	function initReserve(
		address underlyingAsset,
		address thTokenAddress
	) external returns (bool);

	function deposit(
		address underlyingAsset,
		uint256 amount
	) external;

	function withdraw(
		address underlyingAsset,
		uint256 amount
	) external;

	function getReserve(address asset) external view returns(DataTypes.Reserve memory);
}