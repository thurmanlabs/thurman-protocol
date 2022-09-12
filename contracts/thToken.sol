// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThToken is ERC20 {
	constructor() ERC20("Thurman Token", "THT"){}
}