// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {DataTypes} from "./libraries/DataTypes.sol";

interface IPool {
	event Deposit(address indexed reserve, address user, uint256 amount);
	event Withdraw(address indexed reserve, address user, uint256 amount);

	function initReserve(
		address underlyingAsset,
		address thTokenAddress
	) external returns (bool);

	function initGroup(address group, DataTypes.Group memory params) external returns(bool);

	function removeGroup(address groupAddress) external returns(bool);

	function deposit(
		address underlyingAsset,
		uint256 amount
	) external;

	function withdraw(
		address underlyingAsset,
		uint256 amount
	) external;

	function getReserve(address asset) external view returns(DataTypes.Reserve memory);

	function getGroup(address groupAddress) external view returns(DataTypes.Group memory);
}