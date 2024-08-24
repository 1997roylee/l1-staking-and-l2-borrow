// SPDX-License-Identifier: GPL-3.0
import "./interfaces/IL1Blocks.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

pragma solidity ^0.8.20;

/**
 * @title L2Borrow
 * @dev A contract for borrowing tokens on an L2 network, using L1 token balances as collateral
 */
contract L2Borrow is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Constants for L1 contract addresses
    address constant L1_BLOCKS_ADDRESS =
        0x5300000000000000000000000000000000000001;
    address constant L1_SLOAD_ADDRESS =
        0x0000000000000000000000000000000000000101;

    // State variables
    address public borrowToken; // Address of the token that can be borrowed
    address public l1TokenAddress; // Address of the L1 token used as collateral
    uint256 public ltv; // Loan-to-Value ratio in basis points
    uint256 private constant BASIS_POINTS = 10000;
    mapping(address => uint256) public borrowedBalance; // Borrowed amounts per user
    uint256 private nonce; // Nonce for generating unique signatures

    // Events
    event Borrowed(address indexed user, uint256 amount, uint256 blockNumber);
    event Repaid(
        address indexed user,
        uint256 amount,
        bytes32 signature,
        uint256 nonce
    );

    /**
     * @dev Constructor to initialize the contract
     * @param _borrowToken Address of the token that can be borrowed
     * @param _l1TokenAddress Address of the L1 token used as collateral
     * @param _ltv Loan-to-Value ratio in basis points
     */
    constructor(address _borrowToken, address _l1TokenAddress, uint256 _ltv) {
        require(_ltv <= BASIS_POINTS, "LTV cannot exceed 100%");
        borrowToken = _borrowToken;
        l1TokenAddress = _l1TokenAddress;
        ltv = _ltv;
    }

    /**
     * @dev Retrieves the latest L1 block number
     * @return The latest L1 block number
     */
    function latestL1BlockNumber() public view returns (uint256) {
        uint256 l1BlockNum = IL1Blocks(L1_BLOCKS_ADDRESS).latestBlockNumber();
        return l1BlockNum;
    }

    /**
     * @dev Retrieves data from L1 storage
     * @param l1StorageAddress The L1 contract address to query
     * @param slot The storage slot to read
     * @return The data retrieved from L1
     */
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

    /**
     * @dev Gets the user's balance from the L1 token contract
     * @param account The user's address
     * @return The user's balance on L1
     */
    function getUserBalance(address account) public view returns (uint) {
        uint slotNumber = 2;
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

    /**
     * @dev Allows a user to borrow tokens
     * @param amount The amount of tokens to borrow
     */
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

    /**
     * @dev Calculates the maximum amount a user can borrow
     * @param user The user's address
     * @return The maximum borrowable amount
     */
    function getMaxBorrowAmount(address user) public view returns (uint256) {
        uint256 balance = getUserBalance(user);
        return balance.mul(ltv).div(BASIS_POINTS) - borrowedBalance[user];
    }

    /**
     * @dev Allows a user to repay borrowed tokens
     * @param amount The amount of tokens to repay
     * @return A unique signature for the repayment transaction
     */
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

    /**
     * @dev Retrieves the borrowed balance of a user
     * @param user The user's address
     * @return The borrowed balance of the user
     */
    function getBorrowedBalance(address user) external view returns (uint256) {
        return borrowedBalance[user];
    }

    /**
     * @dev Updates the LTV ratio
     * @param _ltv The new LTV ratio
     */
    function updateLTVCollateral(uint256 _ltv) external onlyOwner {
        require(_ltv <= BASIS_POINTS, "LTV cannot exceed 100%");
        ltv = _ltv;
    }
}
