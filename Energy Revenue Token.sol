// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyRevenueToken is ERC20, Ownable {
    mapping(address => uint256) public stakedTokens;
    mapping(address => uint256) public lastClaimed;
    uint256 public totalStaked;
    uint256 public revenuePool;
    uint256 public lastRevenueDistribution;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RevenueAdded(uint256 amount);
    event RevenueClaimed(address indexed user, uint256 amount);

    constructor() ERC20("EnergyToken", "ETK") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply
    }

    function stakeTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        stakedTokens[msg.sender] += amount;
        totalStaked += amount;
        lastClaimed[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) external {
        require(stakedTokens[msg.sender] >= amount, "Insufficient staked balance");
        stakedTokens[msg.sender] -= amount;
        totalStaked -= amount;
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function addRevenue(uint256 amount) external onlyOwner {
        revenuePool += amount;
        lastRevenueDistribution = block.timestamp;
        emit RevenueAdded(amount);
    }

    function claimRevenue() external {
        require(stakedTokens[msg.sender] > 0, "No staked tokens");
        uint256 userShare = (stakedTokens[msg.sender] * revenuePool) / totalStaked;
        require(userShare > 0, "No claimable revenue");
        revenuePool -= userShare;
        payable(msg.sender).transfer(userShare);
        lastClaimed[msg.sender] = block.timestamp;
        emit RevenueClaimed(msg.sender, userShare);
    }
    
    receive() external payable {}
}
