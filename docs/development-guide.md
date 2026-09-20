# 🛠️ Development Guide

## Local Environment Prerequisites

Ensure the following runtimes and tools are installed on your workstation:
* **Node.js**: `v18.0.0` or higher
* **Python**: `v3.9` or higher (Python 3.11–3.13 recommended)
* **Package Managers**: `npm` (v9+) and `pip`
* **Web3 Wallet**: MetaMask browser extension connected to **Ethereum Sepolia Testnet**
* **External Accounts**:
  * [Google AI Studio](https://aistudio.google.com/) (Gemini API Key)
  * [MongoDB Atlas](https://www.mongodb.com/atlas) (Free tier cluster)
  * [Pinata Cloud](https://www.pinata.cloud/) (IPFS gateway & JWT)
  * [Auth0](https://auth0.com/) (Single Page Application + Custom API)

---

## 1. Clone & Workspace Setup

```bash
git clone https://github.com/puneetnith28/Tracely..git
cd Tracely.
```

The repository is structured into modular application tiers:
```
Tracely/
├── docs/                    # 📚 Comprehensive Documentation Suite
├── tracely_backend/         # 🐍 Flask REST API & Forensic AI Vision Engine
├── tracely_frontend/        # ⚛️ React 18 + Vite SPA Frontend
├── eth_deploy/              # ⛓️ Hardhat Ethereum Sepolia Contracts & Deployment
├── auth0-action-assign-role.js # 🔒 Auth0 Post-Login Action Script
└── README.md                # 📖 Master Project Readme
```

---

## 2. Backend Setup (`tracely_backend`)

1. **Navigate and create a Python virtual environment**:
   ```bash
   cd tracely_backend
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Create a `.env` file inside `tracely_backend/`:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/tracely?retryWrites=true&w=majority
   PINATA_JWT=your_pinata_jwt_token
   AUTH0_DOMAIN=dev-tij06cqg4bb0xmn5.us.auth0.com
   AUTH0_AUDIENCE=https://tracely.app/api
   AUTH0_NAMESPACE=https://tracely.app
   ```

4. **Launch the Flask API server**:
   ```bash
   python -m flask --app api/index:app run --port 5000 --debug
   ```
   * The backend will start on `http://localhost:5000`.
   * Verify health at `http://localhost:5000/api/health`.

---

## 3. Frontend Setup (`tracely_frontend`)

1. **Navigate and install Node dependencies**:
   ```bash
   cd ../tracely_frontend
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file inside `tracely_frontend/`:
   ```env
   VITE_AUTH0_DOMAIN=dev-tij06cqg4bb0xmn5.us.auth0.com
   VITE_AUTH0_CLIENT_ID=r8p2MkfpgFPJxVXBWzTW90jbUDpgcbzL
   VITE_AUTH0_AUDIENCE=https://tracely.app/api
   VITE_AUTH0_NAMESPACE=https://tracely.app
   VITE_BACKEND_URL=http://localhost:5000
   VITE_CONTRACT_ADDRESS=0x4664CF917157735081c3ba095733a85ade5beb0f
   ```

3. **Start Vite development server**:
   ```bash
   npm run dev
   ```
   * Open `http://localhost:5173` in your browser.

---

## 4. Smart Contract Development (`eth_deploy`)

1. **Install Hardhat toolchain**:
   ```bash
   cd ../eth_deploy
   npm install
   ```

2. **Compile Solidity Contracts**:
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Ethereum Sepolia**:
   Ensure `eth_deploy/.env` contains your private key and Sepolia RPC:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

4. **Verify Contract State**:
   Run the ownership check utility script:
   ```bash
   node checkOwner.js
   ```

---

## 5. Requestly QA & Network Interception Setup

To test edge-case behavior and simulated network faults:

1. Install the **Requestly Browser Extension** or Desktop Client.
2. **Rule 1: IPFS Gateway Failover**:
   * **Type**: Redirect Request
   * **Match**: `*://ipfs.io/ipfs/*`
   * **Redirect To**: `https://gateway.pinata.cloud/ipfs/$1`
3. **Rule 2: Broken Seal Tamper Simulation**:
   * **Type**: Modify Response
   * **URL Pattern**: `*/api/analyze`
   * **Modified Body**: Inject synthetic `{"differences": [{"type": "seal_tamper", "severity": "HIGH", "tis_delta": -40}], "aggregate_tis": 35, "overall_assessment": "HIGH_RISK"}` to verify automated UI quarantine triggers.
