// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        _mint(_msgSender(), initialSupply);
    }

    // function mint(address to, uint256 amount) public {
    //     _mint(to, amount);
    // }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // Function to set decimals (for testing different decimal scenarios)
    function setDecimals(uint8 newDecimals) public {
        _decimals = newDecimals;
    }
}