// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ETHStakingCollateral
 * @dev A contract for staking ETH as collateral
 */
contract ETHStakingCollateral is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    // Mapping to track staked balances for each user
    mapping(address => uint256) public stakedBalance;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    /**
     * @dev Allows a user to stake ETH
     * @notice This function is payable and uses nonReentrant modifier for security
     */
    function stake() external payable nonReentrant {
        require(msg.value > 0, "Must stake some ETH");
        stakedBalance[msg.sender] = stakedBalance[msg.sender].add(msg.value);
        emit Staked(msg.sender, msg.value);
    }

    // /**
    //  * @dev Allows a user to unstake their ETH
    //  * @param amount The amount of ETH to unstake
    //  * @notice Uses nonReentrant modifier for security
    //  */
    // function unstake(uint256 amount) external nonReentrant {
    //     require(
    //         stakedBalance[msg.sender] >= amount,
    //         "Insufficient staked balance"
    //     );
    //     // require(
    //     //     debtBalance[msg.sender] == 0,
    //     //     "Must repay debt before unstaking"
    //     // );

    //     stakedBalance[msg.sender] = stakedBalance[msg.sender].sub(amount);
    //     payable(msg.sender).transfer(amount);
    //     emit Unstaked(msg.sender, amount);
    // }

    function getStakedBalance() external view returns (uint256) {
        return stakedBalance[msg.sender];
    }
}
