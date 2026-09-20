# ⚙️ Environment Configuration

## Master Configuration Reference

Tracely utilizes separated environment configurations across the Backend API, Frontend Client, and Hardhat Deployment environments.

---

## 1. Backend Environment (`tracely_backend/.env`)

```env
# ==========================================
# Google Gemini Multimodal AI
# ==========================================
GOOGLE_API_KEY=AIzaSyD...your_gemini_api_key...
GEMINI_API_KEY=AIzaSyD...your_gemini_api_key...

# ==========================================
# MongoDB Atlas Database
# ==========================================
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.abcde.mongodb.net/tracely?retryWrites=true&w=majority

# ==========================================
# Pinata IPFS Decentralized Storage
# ==========================================
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_pinata_jwt...
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# ==========================================
# Auth0 Identity & JWT Validation
# ==========================================
AUTH0_DOMAIN=dev-tij06cqg4bb0xmn5.us.auth0.com
AUTH0_AUDIENCE=https://tracely.app/api
AUTH0_NAMESPACE=https://tracely.app

# ==========================================
# Ethereum Web3 (Optional Server-side RPC)
# ==========================================
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
CONTRACT_ADDRESS=0x4664CF917157735081c3ba095733a85ade5beb0f
```

---

## 2. Frontend Environment (`tracely_frontend/.env`)

```env
# ==========================================
# Auth0 Single Page Application (SPA)
# ==========================================
VITE_AUTH0_DOMAIN=dev-tij06cqg4bb0xmn5.us.auth0.com
VITE_AUTH0_CLIENT_ID=r8p2MkfpgFPJxVXBWzTW90jbUDpgcbzL
VITE_AUTH0_AUDIENCE=https://tracely.app/api
VITE_AUTH0_NAMESPACE=https://tracely.app

# ==========================================
# Backend API Gateway
# ==========================================
VITE_BACKEND_URL=http://localhost:5000

# ==========================================
# Ethereum Sepolia Smart Contract Address
# ==========================================
VITE_CONTRACT_ADDRESS=0x4664CF917157735081c3ba095733a85ade5beb0f
```

---

## 3. Smart Contract Hardhat Environment (`eth_deploy/.env`)

```env
# ==========================================
# Ethereum Sepolia Node & Deployer Wallet
# ==========================================
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
ETHERSCAN_API_KEY=your_etherscan_api_key_for_verification
```

---

## Variable Breakdown & Procurement Guide

### Google Gemini AI (`GOOGLE_API_KEY` / `GEMINI_API_KEY`)
* **Purpose**: Grants access to Google's generative multimodal models (`gemini-3-flash-preview`).
* **Acquisition**: Generate a free API key at [Google AI Studio](https://aistudio.google.com/).
* **Backend Role**: Attached via `google.generativeai.configure(api_key=...)`.

### MongoDB Atlas (`MONGODB_URI`)
* **Purpose**: Persists operator profiles, roles, and login activity.
* **Acquisition**: Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Ensure network access IP whitelist allows your deployment server (`0.0.0.0/0` for serverless).
* **TLS Certificate Notice**: On macOS and containerized Linux distributions, Python `pymongo` requires `certifi.where()` to establish secure TLS connections without certificate authority errors.

### Pinata IPFS (`PINATA_JWT` / `PINATA_API_KEY`)
* **Purpose**: Immutably pins dual-angle evidence photographs to IPFS.
* **Acquisition**: Register at [Pinata Cloud](https://www.pinata.cloud/), navigate to **API Keys**, and generate a key with `pinFileToIPFS` permissions.
* **Security Notice**: Never put `PINATA_JWT` in frontend `.env` files. All uploads must route through `/api/upload`.

### Auth0 Credentials (`AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE`)
* **Purpose**: Manages enterprise OIDC login, social auth (Google/Apple), and passwordless magic links.
* **Acquisition**: Create an **SPA Application** and an **API (Resource Server)** with Identifier `https://tracely.app/api` in the [Auth0 Dashboard](https://manage.auth0.com/).
* **Allowed Callback URLs**: `http://localhost:5173/callback` and production domain URLs.
* **Allowed Logout URLs**: `http://localhost:5173` and production domain URLs.
* **Allowed Web Origins**: `http://localhost:5173` and production domain URLs.

### Ethereum Sepolia (`SEPOLIA_RPC_URL`, `CONTRACT_ADDRESS`)
* **Purpose**: Connects client wallets and backend scripts to the Sepolia testnet.
* **Contract Address**: Deployed `SupplyChainTrust` contract address (`0x4664CF917157735081c3ba095733a85ade5beb0f`).
