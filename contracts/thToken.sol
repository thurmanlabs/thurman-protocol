// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThToken is ERC20 {
	constructor() ERC20("Thurman Token", "THT"){}

	function mint(address _account, uint256 _amount) external {
		_mint(_account, _amount);
	}

	function burn(address _account, uint256 _amount) external {
		_burn(_account, _amount);
	}
}