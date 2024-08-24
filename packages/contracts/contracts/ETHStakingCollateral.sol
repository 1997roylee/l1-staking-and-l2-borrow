// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ETHStakingCollateral is ReentrancyGuard {
    using SafeMath for uint256;

    mapping(address => uint256) public stakedBalance;
    // mapping(address => uint256) public debtBalance;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    // event Borrowed(address indexed user, uint256 amount);

    // event Repaid(address indexed user, uint256 amount);

    function stake() external payable nonReentrant {
        require(msg.value > 0, "Must stake some ETH");
        stakedBalance[msg.sender] = stakedBalance[msg.sender].add(msg.value);
        emit Staked(msg.sender, msg.value);
    }

    // function updateL2Balance(uint256 amount) internal {}

    function unstake(uint256 amount) external nonReentrant {
        require(
            stakedBalance[msg.sender] >= amount,
            "Insufficient staked balance"
        );
        // require(
        //     debtBalance[msg.sender] == 0,
        //     "Must repay debt before unstaking"
        // );

        stakedBalance[msg.sender] = stakedBalance[msg.sender].sub(amount);
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }

    // function borrow(uint256 amount) external nonReentrant {
    //     require(
    //         stakedBalance[msg.sender] >= amount.mul(2),
    //         "Insufficient collateral"
    //     );
    //     require(
    //         address(this).balance >= amount,
    //         "Insufficient contract balance"
    //     );

    //     debtBalance[msg.sender] = debtBalance[msg.sender].add(amount);
    //     payable(msg.sender).transfer(amount);
    //     emit Borrowed(msg.sender, amount);
    // }

    // function repay() external payable nonReentrant {
    //     require(msg.value > 0, "Must repay some amount");
    //     require(debtBalance[msg.sender] >= msg.value, "Repayment amount exceeds debt");

    //     debtBalance[msg.sender] = debtBalance[msg.sender].sub(msg.value);
    //     emit Repaid(msg.sender, msg.value);
    // }

    function getStakedBalance() external view returns (uint256) {
        return stakedBalance[msg.sender];
    }

    // function getDebtBalance() external view returns (uint256) {
    //     return debtBalance[msg.sender];
    // }
}
