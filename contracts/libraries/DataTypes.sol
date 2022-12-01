// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

library DataTypes {
	struct Reserve {
		uint16 id;
		address thTokenAddress;
	}

	struct GroupMember {
		uint256 borrowCap;
		bool borrowingEnabled;
		uint256 balanceRemaining;
		uint256 currentLTV;
		bool delinquent;
	}

	struct Group {
		string name;
		bool active;
		bool paused;
		bool borrowingEnabled;
		uint256 totalBorrowingCap;
		uint256 totalBalanceRemaining;
		uint256 delinquencyRate;
	}

}