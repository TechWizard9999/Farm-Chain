# FarmChain

**Blockchain-Powered Agricultural Supply Chain Transparency Platform**

## Overview

FarmChain is a platform designed to address transparency and trust issues in the agricultural supply chain by using blockchain technology to create an immutable record of produce from farm to consumer.

---

## The Problem

India's agricultural supply chain faces critical issues backed by real data:

### Farmer Income Crisis (NABARD Report, Dec 2024)
- Average farming household monthly income: **₹13,661**
- Income from agriculture alone: **₹4,476 (only 33%)**
- This is **lower than the government minimum wage** for unskilled workers

### Middlemen Exploitation (RBI Working Paper, Oct 2024)
Farmers receive a tiny fraction of what consumers pay:

| Product | Farmer's Share |
|---------|---------------|
| Bananas | 31% |
| Tomatoes | 33% |
| Grapes | 35% |
| Onions | 36% |
| Potatoes | 37% |
| Mangoes | 43% |

### Supply Chain Inefficiencies
- **5-8 intermediaries** between farm and consumer
- Average market (mandi) coverage: **434 sq. km** (recommended: 80 sq. km)
- Post-harvest losses: **5.5%** for cereals/pulses, **11%** for fruits/vegetables
- Farmers travel long distances, increasing dependence on middlemen

---

## Our Solution

FarmChain creates a direct, transparent connection between farmers, businesses, and consumers using blockchain technology.

### For Farmers
- Register farms with GPS verification
- Log all farming activities on blockchain
- List produce directly to businesses
- Receive instant payments via smart contracts
- Obtain blockchain-verified organic certification

### For Businesses
- Browse verified produce with complete history
- Post requirements and receive competitive bids
- Verify quality and origin before purchase
- Escrow-based secure payments
- Real-time delivery tracking

### For Consumers
- Scan QR codes to view complete product journey
- Verify organic claims via blockchain certificates
- See farmer info, harvest dates, storage conditions
- Make informed purchasing decisions

---

## Project Structure

```
Farm-Chain/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── graphql/
│   │   │   ├── resolvers/
│   │   │   │   ├── farmResolver.js
│   │   │   │   ├── index.js
│   │   │   │   └── userResolver.js
│   │   │   └── schemas/
│   │   │       ├── farmSchema.js
│   │   │       ├── index.js
│   │   │       └── userSchema.js
│   │   ├── models/
│   │   │   ├── farm.js
│   │   │   └── user.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── farmService.js
│   │   │   ├── otpService.js
│   │   │   └── userService.js
│   │   └── server.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
└── README.md
```

---

## Expected Impact

| Stakeholder | Current State | With FarmChain |
|-------------|---------------|----------------|
| **Farmers** | 31-43% of consumer price | 70-80% through direct sales |
| **Payment** | 2-4 weeks delay | Instant via smart contracts |
| **Verification** | Trust-based, fraud-prone | Blockchain-verified |
| **Traceability** | None | Complete farm-to-fork |

---

## Tech Stack

- **Backend**: Node.js, GraphQL, MongoDB
- **Authentication**: JWT, OTP-based verification
- **Blockchain**: Smart contracts for payments & certification

---

## Data Sources

- NABARD Report (December 2024) - Farmer Income Statistics
- RBI Working Papers (October 2024) - Price Share Analysis
- Ministry of Agriculture, Government of India

---

## Status

🚧 **In Development** - Backend API complete, Frontend coming soon