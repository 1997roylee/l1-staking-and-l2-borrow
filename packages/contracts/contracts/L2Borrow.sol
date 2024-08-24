// SPDX-License-Identifier: GPL-3.0
import "./interfaces/IL1Blocks.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

pragma solidity ^0.8.20;

contract L2Borrow is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    address constant L1_BLOCKS_ADDRESS =
        0x5300000000000000000000000000000000000001;
    address constant L1_SLOAD_ADDRESS =
        0x0000000000000000000000000000000000000101;

    address public borrowToken;
    address public l1TokenAddress;
    uint256 public ltv;
    uint256 private constant BASIS_POINTS = 10000;
    mapping(address => uint256) public borrowedBalance;

    event Borrowed(address indexed user, uint256 amount, uint256 blockNumber);
    event Repaid(
        address indexed user,
        uint256 amount,
        bytes32 signature,
        uint256 nonce
    );
    uint256 private nonce;

    constructor(address _borrowToken, address _l1TokenAddress, uint256 _ltv) {
        require(_ltv <= BASIS_POINTS, "LTV cannot exceed 100%");
        borrowToken = _borrowToken;
        l1TokenAddress = _l1TokenAddress;
        ltv = _ltv;
    }

    function latestL1BlockNumber() public view returns (uint256) {
        uint256 l1BlockNum = IL1Blocks(L1_BLOCKS_ADDRESS).latestBlockNumber();
        return l1BlockNum;
    }

    function retrieveFromL1(
        address l1StorageAddress,
        uint slot
    ) internal view returns (bytes memory) {
        bytes memory input = abi.encodePacked(l1StorageAddress, slot);
        bool success;
        bytes memory returnValue;
        (success, returnValue) = L1_SLOAD_ADDRESS.staticcall(input);

        require(success, "L1SLOAD failed");

        return returnValue;
    }

    function getUserBalance(address account) public view returns (uint) {
        uint slotNumber = 1;
        return
            abi.decode(
                retrieveFromL1(
                    l1TokenAddress,
                    uint(
                        keccak256(
                            abi.encodePacked(uint(uint160(account)), slotNumber)
                        )
                    )
                ),
                (uint)
            );
    }

    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Must borrow some amount");

        uint256 maxBorrow = getMaxBorrowAmount(msg.sender);
        require(
            borrowedBalance[msg.sender].add(amount) <= maxBorrow,
            "Borrow would exceed allowed LTV"
        );

        uint256 contractBalance = IERC20(borrowToken).balanceOf(address(this));
        require(amount <= contractBalance, "Insufficient contract balance");

        borrowedBalance[msg.sender] = borrowedBalance[msg.sender].add(amount);
        IERC20(borrowToken).safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount, block.number);
    }

    function getMaxBorrowAmount(address user) public view returns (uint256) {
        uint256 balance = getUserBalance(user);
        return balance.mul(ltv).div(BASIS_POINTS) - borrowedBalance[user];
    }

    function repay(uint256 amount) external nonReentrant returns (bytes32) {
        require(amount > 0, "Must repay some amount");
        require(
            borrowedBalance[msg.sender] >= amount,
            "Repayment amount exceeds debt"
        );
        IERC20(borrowToken).safeTransferFrom(msg.sender, address(this), amount);
        borrowedBalance[msg.sender] = borrowedBalance[msg.sender].sub(amount);
        bytes32 signature = keccak256(
            abi.encodePacked(address(this), msg.sender, amount)
        );
        emit Repaid(msg.sender, amount, signature, nonce);
        return signature;
    }

    function getBorrowedBalance(address user) external view returns (uint256) {
        return borrowedBalance[user];
    }
}
