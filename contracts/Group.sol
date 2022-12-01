// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {IPool} from "./IPool.sol";
import {IGroup} from "./IGroup.sol";

error CALLER_IS_NOT_POOL_ADMIN();

contract Group is Initializable, Context, IGroup {
	modifier onlyPool() {
		if (_msgSender() != address(POOL)) {
			revert CALLER_IS_NOT_POOL_ADMIN();
		}
		_;
	}

	mapping(address => DataTypes.GroupMember) internal _members;
	IPool public POOL;

	function initialize(IPool pool) external initializer{
		POOL = pool;
	}

	function addMember(
		address newMember,
		DataTypes.GroupMember memory params
	) external onlyPool returns (bool) {
		require(newMember != address(0), "Attempt to add member with zero address");
		_members[newMember].borrowCap = params.borrowCap;
		_members[newMember].borrowingEnabled = params.borrowingEnabled;
		_members[newMember].balanceRemaining = params.balanceRemaining;
		_members[newMember].currentLTV = params.currentLTV;
		_members[newMember].delinquent = params.delinquent;
		return true;
	}

	function removeMember(
		address member
	) external onlyPool returns(bool) {
		delete(_members[member]);
		return true;
	}

	function getMember(address member) external view returns (DataTypes.GroupMember memory) {
		return _members[member];
	}
}