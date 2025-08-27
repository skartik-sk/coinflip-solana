# 🎯 SolFlip - Solana Coin Flip dApp

A stunning, animated coin flip game built on Solana blockchain with a playful UI and real-time transactions.

![SolFlip Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![Solana](https://img.shields.io/badge/Blockchain-Solana-blueviolet) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

## 🌟 Features

- **⚡ Lightning Fast**: Instant coin flips powered by Solana's speed
- **🔒 Secure & Fair**: Blockchain-verified randomness
- **🎨 Stunning UI**: Beautiful animations and modern design
- **💸 Low Fees**: Minimal transaction costs on Solana
- **📱 Responsive**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Phantom Wallet](https://phantom.app/) or [Solflare](https://solflare.com/) browser extension
- Some SOL in your wallet for transactions (devnet SOL for testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd program-skartik-sk/frontend

# Install dependencies with Bun
bun install

# Start development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 How to Play

1. **Connect Wallet**: Click the wallet button to connect your Solana wallet
2. **Choose Side**: Select either "Heads" or "Tails"
3. **Place Bet**: Default bet is 0.01 SOL
4. **Flip Coin**: Click "Start Flip" and watch the magic happen!
5. **Win or Lose**: See the result and your updated balance

## 🏗️ Technical Details

### Program Information
- **Program ID**: `3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr`
- **Network**: Devnet (configurable)
- **Framework**: Anchor Framework

### Key Technologies
- **React 19** with TypeScript
- **Vite** for fast development
- **Bun** as package manager
- **@solana/wallet-adapter** for wallet integration
- **@coral-xyz/anchor** for program interaction

## 🎨 Design System

### Color Palette
- **Background**: `#262322` - Rich dark base
- **Surface**: `#E5F4E3` - Clean light text
- **Primary**: `#2A9D8F` - Teal for main actions
- **Secondary**: `#F4A261` - Warm orange for accents
- **Accent**: `#FB8B24` - Bright orange for highlights

### Animations
- **Coin Flip**: 3D CSS transforms with easing
- **Button Interactions**: Hover effects and micro-animations
- **Confetti**: Particle animation on wins
- **Background**: Floating animated blobs

## 🔧 Development

### Available Scripts

```bash
# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint
```

## 🔗 Program Integration

### Program ID: `3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr`

The flip function expects:
- `seed`: Unique string for this flip
- `user_action`: boolean (false = heads, true = tails)  
- `bid`: Amount in lamports (1 SOL = 1,000,000,000 lamports)

---

**Made with 🎯 for the Solana ecosystem**
