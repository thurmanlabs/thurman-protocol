// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IThToken} from "./IThToken.sol";

contract ThToken is ERC20Upgradeable, IThToken {
	address internal _underlyingAsset;

	event Initialized(address indexed underlyingAsset);

	function initialize(
		string memory name,
		string memory symbol,
		address underlyingAsset
		) external initializer {
		__ERC20_init(name, symbol);
		_underlyingAsset = underlyingAsset;
		emit Initialized(underlyingAsset);
	}

	function mint(address _account, uint256 _amount) external {
		_mint(_account, _amount);
	}

	function burn(address _account, uint256 _amount) external {
		_burn(_account, _amount);
		if (_account != address(this)) {
			IERC20Upgradeable(_underlyingAsset).transfer(_account, _amount);
		}
	}

	function getUnderlyingAsset() public view returns(address) { return _underlyingAsset; }
}