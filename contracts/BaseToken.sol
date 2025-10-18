
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

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title BASEMINTER Token Template
/// @notice Auto-generated ERC-20 token for BASEMINTER.FUN users.
/// @dev Uses OpenZeppelin implementations to ensure security and reliability.
contract BaseToken is ERC20, ERC20Burnable, ERC20Permit {
    /// @notice Deploys a new token with custom name, symbol, supply, and owner.
    /// @param name Token name (dynamic per deploy)
    /// @param symbol Token symbol (dynamic per deploy)
    /// @param initialSupply Initial supply (minted to owner)
    /// @param tokenOwner The address that receives the initial minted tokens.
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address tokenOwner
    ) ERC20(name, symbol) ERC20Permit(name) {
        _mint(tokenOwner, initialSupply);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  💡 BASEMINTER.FUN — Deploy Tokens Instantly on Base
//  Visit 👉 https://baseminter.fun to mint your own ERC-20 in under 60 seconds!
// ─────────────────────────────────────────────────────────────────────────────