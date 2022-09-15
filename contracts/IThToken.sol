// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IThToken is IERC20 {
	function mint(address _account, uint256 _amount) external;

	function burn(address _account, uint256 _amount) external;
}