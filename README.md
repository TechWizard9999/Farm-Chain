# FarmChain  
Blockchain-Powered Agricultural Supply Chain Transparency Platform

FarmChain is a blockchain-based traceability and marketplace system that enables farmers, businesses, and consumers to transparently track agricultural produce from seed to sale. It removes unnecessary intermediaries, prevents organic fraud, and guarantees instant payments using smart contract escrow.

The platform combines a Next.js frontend, GraphQL backend, MongoDB storage, IPFS for immutable files, and Ethereum/Polygon smart contracts to build a verifiable supply chain.

---

## Problem Statement

India’s agricultural supply chain faces major systemic challenges:

Farmers receive only 16–20% of the final consumer price.  
Over 25% of organic food is fraudulently labeled.  
15–20% of produce is lost post-harvest due to weak accountability.  
Payments to farmers are delayed by 2–4 weeks.  
Consumers have zero visibility into origin, chemical usage, or freshness.

Trust today is based on claims instead of proof.

---

## Solution

FarmChain creates a transparent, blockchain-backed journey for every crop batch.

Each product is linked to:

- Farm GPS location
- Farmer profile
- Chemical activity logs
- Harvest records
- Transport checkpoints
- Organic certification

All critical events are recorded on-chain. Supporting evidence (images, certificates) is stored on IPFS.

Payments are handled through smart contract escrow and released instantly once delivery is confirmed.

---

## Architecture Overview

Frontend  
Next.js + React

Backend  
Node.js + Express + GraphQL

Blockchain  
Polygon / Ethereum Sepolia

Storage  
MongoDB (application data)  
IPFS (images and certificates)

Wallet  
MetaMask / WalletConnect

---

## System Flow

Farmer registers farm → creates crop batch → logs activities → harvests → lists product  
Business verifies journey → places escrow order → tracks shipment → confirms delivery  
Smart contract releases funds to farmer  
Consumer scans QR → verifies full history

---

## Screenshots

### Architecture Diagram

![Architecture](https://github.com/user-attachments/assets/8f4ad2b9-d9dc-4324-b73c-514a36a0164f)

---

### Application Overview

![App Overview](https://github.com/user-attachments/assets/2b0e7f29-4d12-4ede-9a01-b3d9d51740f3)

---

You can add more screenshots by uploading images to GitHub Issues or Pull Requests and pasting their links here.

---

## Core Features

### Farmer

- OTP login and wallet connection  
- GPS verified farm registration  
- Crop batch creation  
- Activity logging (fertilizer, pesticide, watering)  
- Harvest recording  
- Product listing  
- Order management  
- Automatic payment via escrow  
- Earnings dashboard  

---

### Business

- Verified onboarding  
- Marketplace browsing  
- Complete product traceability  
- Escrow based purchasing  
- Shipment tracking  
- Delivery confirmation  

---

### Consumer

- QR scan on product  
- Farmer profile view  
- Farm location verification  
- Chemical usage inspection  
- Harvest date confirmation  
- Organic certification proof  

---

## Backend Services

The backend is modular and service-oriented.

### Auth Service
Handles OTP login, JWT sessions, and role-based access control.

### Farm Service
Manages farm registration, GPS coordinates, photos, and IPFS hashes.

### Batch Service
Creates crop batches and stores blockchain references.

### Activity Service
Logs fertilizer, pesticide, watering, and inspection events.
Each activity is written to the ChemicalLog smart contract.

### Marketplace Service
Handles product listings, orders, bidding, and delivery status.

### Order & Payment Service
Creates escrow orders, tracks shipment, confirms delivery, and triggers smart contract payout.

### Blockchain Service
Single interface for all on-chain operations:
- Farm registration
- Activity logging
- Escrow creation
- Delivery confirmation
- NFT minting

---

## Smart Contracts

### FarmRegistry
Registers farms on-chain and stores IPFS metadata hash.

### ChemicalLog
Stores immutable per-batch activity logs.

### Marketplace (Escrow)
Locks buyer funds and releases payment to farmer on delivery confirmation.

### OrganicNFT (ERC721)
Issues non-forgeable organic certificates with metadata on IPFS.

---

## Data Storage Strategy

Users, farms, products, orders stored in MongoDB.  
Images and certificates stored on IPFS.  
Payments and verification stored on blockchain.

This hybrid approach balances performance with trust.

---

## Expected Impact

Farmers earn up to 2–3x more.  
Payments become instant.  
Organic fraud becomes verifiable.  
Food waste is reduced.  
Consumers regain trust.

---

## Tech Stack

Frontend: Next.js, React  
Backend: Node.js, Express, GraphQL  
Database: MongoDB  
Blockchain: Polygon / Ethereum Sepolia  
Storage: IPFS  
Wallet: MetaMask / WalletConnect  
Auth: JWT + OTP  

---

## Project Setup

### Clone Repository

```bash
git clone https://github.com/TechWizard9999/Farm-Chain
cd Farm-Chain
