// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract WorkshopPayment {
    address private immutable implementation = address(this);
    address public owner;
    uint256 public paymentCount;
    event Paid(address indexed payer, address indexed recipient, uint256 amount);
    constructor() { owner = address(1); }
    function initialize(address who) external {
        require(owner == address(0), "initialized");
        require(who != address(0), "owner");
        owner = who;
    }
    function pay(address payable recipient) external payable {
        // TODO 1: reject direct implementation calls.
        // TODO 2: only owner, and msg.value > 0.
        // TODO 3: increment count, send msg.value, check success, emit Paid.
        revert("Complete the TODOs before deployment");
    }
}
