
// SPDX-License-Identifier: MIT
// ─────────────────────────────────────────────────────────────────────────────
//   🧠 BASEMINTER.FUN — AUTOMATED TOKEN DEPLOYER ON BASE CHAIN
//   "Mint your ERC-20 dream in seconds."
//   Built for Base ecosystem with OpenZeppelin Standards.
//   Author: BASEMINTER.FUN
//   Website: https://baseminter.fun
//   X: https://x.com/baseminterfun
//   Telegram: https://t.me/baseminterdotfun
// ─────────────────────────────────────────────────────────────────────────────
//   ⚙️ FEATURES
//   • ERC-20 Standard (Fully Compatible)
//   • Burnable Tokens (Users can destroy their tokens)
//   • EIP-2612 Permit (Gasless Approvals)
//   • 1,000,000,000 Supply Minted to Creator/Recipient
//   • Auto-ready for Base Mainnet
// ─────────────────────────────────────────────────────────────────────────────
//
//   ⚠️ NOTE:
//   This template is for automated deployment systems.
//   Replace “MyToken” and “MTK” dynamically during deployment
//   via BASEMINTER.FUN to auto-generate unique token names & symbols.
// ─────────────────────────────────────────────────────────────────────────────

pragma solidity ^0.8.20;

import "./BaseToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title BASEMINTER Factory Template
/// @notice Factory for auto-generating ERC-20 tokens for BASEMINTER.FUN users.
/// @dev Uses OpenZeppelin implementations to ensure security and reliability.
contract BaseMinterFactory is Ownable {
    uint256 public deployFee = 0.0003 ether;
    address[] public deployedTokens;

    event TokenCreated(address indexed creator, address indexed tokenAddress);

    constructor() {}

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _supply
    ) external payable {
        require(msg.value >= deployFee, "Insufficient fee");

        BaseToken newToken = new BaseToken(
            _name,
            _symbol,
            _supply,
            msg.sender
        );

        deployedTokens.push(address(newToken));
        emit TokenCreated(msg.sender, address(newToken));

        // Transfer fee to owner
        (bool sent, ) = owner().call{value: msg.value}("");
        require(sent, "Failed to send fee");
    }

    function setDeployFee(uint256 _newFee) external onlyOwner {
        deployFee = _newFee;
    }

    function getDeployedTokens() external view returns (address[] memory) {
        return deployedTokens;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  💡 BASEMINTER.FUN — Deploy Tokens Instantly on Base
//  Visit 👉 https://baseminter.fun to mint your own ERC-20 in under 60 seconds!
//  X: https://x.com/baseminterfun
//  Telegram: https://t.me/baseminterdotfun
// ─────────────────────────────────────────────────────────────────────────────