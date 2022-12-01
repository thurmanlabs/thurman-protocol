// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {DataTypes} from "./DataTypes.sol";
import {IGroup} from "../IGroup.sol";

library GroupLogic {
	using GroupLogic for DataTypes.Group;

	function addMember(
		address groupAddress,
		address newMember,
		DataTypes.GroupMember memory params
	) internal returns (bool) {
		IGroup(groupAddress).addMember(newMember, params);
		return true;
	}

	function removeMember(
		address groupAddress,
		address member
	) internal returns (bool) {
		IGroup(groupAddress).removeMember(member);
		return true;
	}
}