// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {DataTypes} from "./libraries/DataTypes.sol";

interface IGroup {

	function addMember(
		address newMember,
		DataTypes.GroupMember memory params
	) external returns(bool);

	function removeMember(
		address member
	) external returns(bool);

	function getMember(address member) external view returns (DataTypes.GroupMember memory);
}