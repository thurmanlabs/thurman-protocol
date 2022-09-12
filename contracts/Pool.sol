// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {ThToken} from "./thToken.sol";

contract Pool {
	
	ThToken thToken;

	function setThToken(ThToken _thToken) external {
        thToken = _thToken;
	}

	function deposit() external payable {
		thToken.mint(msg.sender, msg.value);
	}

	function withdraw(address _account) external {
		uint256 amount = thToken.balanceOf(_account);
		require(amount != 0, "NO_AVAILABLE_TOKENS");
		thToken.burn(_account, amount);
		(bool transferSuccess, ) = _account.call{value: amount}("");
		require(transferSuccess, "FAILED_TRANSFER");
	}

}