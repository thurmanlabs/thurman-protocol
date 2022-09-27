// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IThToken is IERC20Upgradeable {
	function mint(address _account, uint256 _amount) external;

	function burn(address _account, uint256 _amount) external;
}