# Project Description

**Deployed Frontend URL:** [https://coinflip.skartik.xyz]

**Solana Program ID:** 3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr

## Project Overview

### Description
SolFlip is a stunning, animated coin flip gambling dApp built on Solana blockchain with a playful UI and real-time transactions. Users can place bets on coin flips (heads or tails) against the house, with outcomes determined by on-chain randomness. The dApp features beautiful 3D coin animations, confetti celebrations for wins, and a modern glassmorphism design using a carefully curated color palette. Each flip is a unique transaction with its own seed, ensuring fair and verifiable randomness while providing an engaging gaming experience with instant feedback.

### Key Features
- **🎯 Fair Coin Flipping**: Place bets on heads or tails with blockchain-verified randomness
- **💰 Real SOL Betting**: Bet actual SOL tokens with configurable amounts (default 0.01 SOL)
- **🎨 Stunning 3D Animations**: Beautiful coin flip animations with realistic physics
- **🎉 Interactive Celebrations**: Confetti animations and visual feedback for wins
- **⚡ Lightning Fast**: Instant transactions powered by Solana's speed
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔒 Secure & Transparent**: All randomness generated on-chain, verifiable results

### How to Use the dApp
1. **Connect Wallet** - Connect your Phantom or Solflare wallet to the dApp
2. **Choose Your Side** - Select either "Heads" or "Tails" using the animated buttons
3. **Review Your Bet** - Default bet is 0.01 SOL (displayed below the controls)
4. **Start Flip** - Click "🚀 Start Flip" to initiate the on-chain transaction
5. **Watch the Magic** - Enjoy the 3D coin flip animation with realistic physics
6. **Celebrate or Try Again** - See confetti for wins, or place another bet for losses

## Program Architecture
The SolFlip program uses a sophisticated architecture with unique flip accounts for each game, a shared vault for house funds, and deterministic PDA generation for security. The program implements on-chain randomness generation and automatic payout distribution based on game outcomes.

### PDA Usage
The program uses Program Derived Addresses to create unique game instances and manage the house vault securely.

**PDAs Used:**
- **Flip Account PDA**: Derived from seeds `["flip", user_wallet_pubkey, unique_seed]` - creates a unique account for each coin flip game, preventing replay attacks and ensuring game isolation
- **Vault PDA**: Derived from seeds `["vault"]` - holds the house funds and manages payouts, ensuring only the program can access and distribute funds

### Program Instructions
**Instructions Implemented:**
- **flip**: Main game instruction that accepts user choice (heads/tails), bet amount, and unique seed. Creates a flip account, generates random outcome, and handles fund transfers based on win/loss

### Account Structure
```rust
#[account]
pub struct FlipAccount {
    pub user: Pubkey,         // The wallet that initiated this flip
    pub user_action: bool,    // User's choice: false = heads, true = tails
    pub ai_action: bool,      // Program's random choice: false = heads, true = tails
    pub bid: u64,            // Bet amount in lamports
}
```

## Testing

### Test Coverage
Comprehensive test suite covering multiple scenarios including edge cases with vault balance management, different bet amounts, and both winning and losing outcomes to ensure program security and fair gameplay.

**Happy Path Tests:**
- **Heads Bet with Sufficient Vault**: Successfully processes heads bet with adequate house funds
- **Tails Bet with Sufficient Vault**: Successfully processes tails bet with adequate house funds
- **Multiple Sequential Flips**: Ensures each flip uses unique seeds and proper account creation

**Unhappy Path Tests:**
- **Insufficient Vault Balance**: Tests behavior when house doesn't have enough funds to cover potential payouts
- **Duplicate Seed Usage**: Prevents replay attacks by rejecting duplicate flip accounts
- **Invalid Bet Amounts**: Handles edge cases with zero or excessive bet amounts
- **Unauthorized Access**: Ensures only the user can access their flip results

### Running Tests
```bash
cd anchor_project/solflip
anchor test                    # run full test suite
anchor test --skip-local-validator  # run with external validator
```

### Additional Notes for Evaluators

This project showcases advanced Solana development concepts including PDA usage, on-chain randomness, and complex state management. The biggest technical challenges were implementing fair randomness generation on-chain (avoiding client-side manipulation), managing vault economics to ensure the house can cover payouts, and creating smooth user experience with proper error handling for failed transactions.

The frontend demonstrates modern React patterns with TypeScript, beautiful CSS animations using 3D transforms, and comprehensive wallet integration. Special attention was paid to user experience with loading states, transaction feedback, and responsive design across devices.

Key learning outcomes: mastering PDA derivation patterns, understanding Solana's account model for game state, implementing robust error handling for blockchain transactions, and creating delightful user interactions that make blockchain complexity invisible to end users.