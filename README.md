# 🔗 Tracely: The Immutable Supply Chain Guardian

**"Bringing Institutional-Grade Trust to Global Logistics using AI and Blockchain."**

---

## 🚀 Overview

**Tracely** is a production-ready provenance platform designed to solve the $461 billion counterfeit goods crisis. By combining **Multimodal AI Vision (Gemini Ensemble)** with **Ethereum-backed immutability**, Tracely provides a transparent, untamperable audit trail for high-value assets—from pharmaceuticals to luxury electronics—without requiring expensive IoT hardware.

---

## 🔴 The Problem

The global supply chain is fractured. 
- **The Transparency Gap**: Most "tracking" only knows where a box is, not what’s *inside* or if it's been tampered with.
- **The Counterfeit Crisis**: Counterfeit goods cost the global economy billions annually and put lives at risk (fake medicines).
- **Centralized Vulnerability**: Traditional databases can be edited. A corrupt actor can alter records to hide theft or substitution.

---

## 🟢 Our Solution: The Tracely Protocol

Tracely introduces a three-layer trust architecture:

1.  **Digital Identity (QR Provenance)**: Every batch is assigned a unique, cryptographic QR identity that serves as its digital twin.
2.  **AI Guardian (TIS Score)**: Our proprietary **Trust Integrity Score (TIS)** uses an ensemble of Gemini 3 Flash models and classical CV (OpenCV) to detect micro-variations in packaging, seal lift, or digital tampering.
3.  **Blockchain Anchor (Ethereum)**: Every custody transfer is anchored on the Sepolia testnet, creating an immutable history that can be verified by anyone, anywhere.

---

## Requestly Integration

### Requestly as a Middleware Traffic Controller
Requestly was utilized as a middleware traffic controller to bridge the gap between decentralized latency and production-grade reliability.


### Network Resiliency & Failover
IPFS gateways can be volatile. We used **Requestly Redirect Rules** to ensure that even if the public IPFS gateway (`ipfs.io`) is slow, the Tracely UI remains responsive by instantly failing over to high-speed cached assets.


### Advanced Stress Testing (The "Broken Seal" Scenario)
To verify our AI's ability to detect tampering without damaging physical goods, we used **Modify Response Rules**. This allowed us to inject compromised data and "damaged" baseline images into the app in real-time, validating that our **Trust Integrity Score (TIS)** correctly flags and blocks suspicious handoffs.


### Accelerated Developer Velocity (Zero-Redeploy)
Requestly eliminated the **Code → Build → Deploy bottleneck**. By intercepting API calls and redirecting them to local mocks, we could test new UI states and complex backend logic instantly, ensuring a highly polished final product.

---

## AI Innovation: The Gemini Consensus Ensemble

Tracely moves beyond standard image recognition by implementing a **Forensic Ensemble Architecture** powered by **Google Gemini Flash and Pro models**.


### Beyond "Hotdog/Not-Hotdog": Forensic Vision

While standard AI identifies objects, Tracely's Gemini implementation detects **micro-variations in physical state**. It analyzes **texture consistency, seal reflection anomalies, and structural integrity** between **"Baseline"** and **"Current"** states to identify tampering that is invisible to the human eye.


### The Consensus Strategy (Zero-Hallucination)

To meet **institutional-grade security standards**, we do not rely on a single AI inference. Tracely utilizes an **ensemble approach** where **two independent Gemini models** analyze the package from different logical perspectives.

A custody event only proceeds **if there is a statistical consensus**, virtually eliminating AI hallucinations and ensuring higher reliability.


### Quantitative Trust (The TIS Score)

Gemini transforms qualitative visual data into a **quantitative Trust Integrity Score (TIS)**.

This score is **directly coupled with the Ethereum smart contract**—if the **TIS falls below the threshold**, the blockchain transaction is automatically **aborted**, creating a hard link between **AI intelligence and decentralized enforcement**.

---

## ✨ Key Features

- **🛡️ Multi-Angle Integrity Check**: Capture images from two distinct angles. Our AI analyzes both against a "Baseline" to detect physical or digital tampering.
- **📊 Real-time TIS Dashboard**: Get an instant percentage score on product integrity. Scores below 40% trigger an automatic quarantine.
- **⛓️ On-Chain Verification**: Transparent timeline of custody with actor identities, roles, and cryptographic hashes.
- **☁️ IPFS Evidence Vault**: All photographic evidence is stored on decentralized IPFS (via Pinata), ensuring records are as permanent as the ledger itself.
- **👤 Role-Based Access**: Secured via **Auth0**, with roles (Manufacturer, Wholesaler, Retailer) locked to prevent identity spoofing.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, Framer Motion |
| **Web3** | Ethers.js, Solidity Smart Contracts (Sepolia Testnet) |
| **AI / ML** | Google Gemini 3 Flash (Forensic Ensemble), OpenCV |
| **Backend** | Python (Flask), MongoDB Atlas |
| **Authentication** | Auth0 (JWT & Role-based access) |
| **Storage** | Pinata / IPFS (Decentralized Asset Management) |

---

## 🧠 Challenges & Learnings

### 1. The "Gemini Ensemble" Strategy
We discovered that a single AI model can produce hallucinations in specialized forensic tasks. We implemented a **consensus-based ensemble architecture** where two Gemini models independently analyze the images. If their confidence or detection types mismatch, a classical Computer Vision (OpenCV) filter is triggered to normalize result, ensuring high precision.

### 2. The macOS SSL & Auth0 Hurdle
During development on macOS, we encountered significant SSL certificate verification issues connecting to MongoDB and Auth0. We resolved this by implementing a robust certificate injection layer in the Python backend (`certifi`) to ensure secure, compliant connections in production environments.

### 3. State Syncing across 3 Layers
Managing state between **MongoDB (User Metadata)**, **Ethereum (Logs)**, and **IPFS (Images)** required a custom middleware to ensure transactions are atomic. We learned to prioritize blockchain confirmation before committing metadata to the local cache.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- MongoDB URI
- Google Gemini API Key
- Auth0 Domain/Client ID

### Frontend Setup
```bash
cd tracely_frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd tracely_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m flask --app api/index:app run --port 5000
```


---
*Built in Electrothon 8.0 by Team Obsidian.*
