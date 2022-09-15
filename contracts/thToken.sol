// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThToken is ERC20 {
	address internal _underlyingAsset;

	constructor(string memory name, string memory symbol) ERC20(name, symbol){}

	function initialize(
		address underlyingAsset
		) external {
		_underlyingAsset = underlyingAsset;
	}

	function mint(address _account, uint256 _amount) external {
		_mint(_account, _amount);
	}

	function burn(address _account, uint256 _amount) external {
		_burn(_account, _amount);
		if (_account != address(this)) {
			IERC20(_underlyingAsset).transfer(_account, _amount);
		}
	}

	function getUnderlyingAsset() public view returns(address) { return _underlyingAsset; }
}