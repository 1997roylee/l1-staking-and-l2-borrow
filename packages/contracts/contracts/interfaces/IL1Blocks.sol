// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IL1Blocks {
    function latestBlockNumber() external view returns (uint256);
}