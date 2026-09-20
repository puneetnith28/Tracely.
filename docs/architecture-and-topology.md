# 🏗️ Architecture & Topology

## Executive Overview

**Tracely** is an institutional-grade, decentralized supply chain provenance and physical package integrity verification platform. It converges **Google Gemini Multimodal AI Vision**, **Ethereum Smart Contracts (Sepolia)**, **Decentralized Storage (IPFS / Pinata)**, **Auth0 Identity & RBAC**, and **MongoDB Atlas** into an immutable 3-layer security protocol.

```mermaid
flowchart TD
    subgraph ClientLayer["1. Client & Edge Layer"]
        UI["React 18 + Vite SPA<br/>(TailwindCSS / shadcn/ui / Framer Motion)"]
        Cam["Mobile / Web Multi-Angle Camera Capture"]
        MetaMask["MetaMask / Web3 Wallet"]
        Req["Requestly Traffic Interceptor / Gateway Router"]
    end

    subgraph AuthLayer["2. Identity & Access Layer"]
        Auth0["Auth0 Identity Provider (OAuth2 / OIDC)"]
        A0Action["Auth0 Post-Login Action<br/>(Role Assignment & Custom JWT Claims)"]
    end

    subgraph APILayer["3. Application & Intelligence Layer (Flask Backend)"]
        API["Flask REST API Gateway<br/>(Python 3.13 + CORS)"]
        AuthMiddleware["JWT Validation Middleware<br/>(RS256 PyJWKClient + Certifi)"]
        
        subgraph AIEnsemble["Forensic AI Vision Pipeline"]
            GeminiPro["Google Gemini Model 1<br/>(gemini-3-flash-preview)"]
            GeminiFlash["Google Gemini Model 2<br/>(gemini-3-flash-preview)"]
            CVAlign["OpenCV / NumPy Alignment<br/>(ORB/SIFT + RANSAC + CLAHE LAB)"]
            TISEngine["Trust Integrity Score (TIS) Engine<br/>(Delta Penalty & Worst-Case Gating)"]
        end
    end

    subgraph PersistenceLayer["4. Persistence & Ledger Layer"]
        Mongo[("MongoDB Atlas<br/>(User Profiles & Role Lock)")]
        Pinata["Pinata Cloud / IPFS<br/>(Immutable Evidence Vault)"]
        Sepolia["Ethereum Sepolia Testnet<br/>(SupplyChainTrust.sol Contract)"]
    end

    %% Interactions
    UI -->|1. Authenticate| Auth0
    Auth0 -->|2. Custom Claims JWT| UI
    UI -->|3. Signed REST Calls| API
    Req -.->|Network Interception / Failover| UI
    
    API -->|Validate Token| AuthMiddleware
    API -->|User Profile Ops| Mongo
    API -->|Proxy Upload| Pinata
    
    API -->|Multi-Angle Images| GeminiPro
    API -->|Multi-Angle Images| GeminiFlash
    GeminiPro & GeminiFlash -->|JSON Schema Validated Diffs| TISEngine
    CVAlign -.->|Homography / Normalization Fallback| TISEngine
    
    UI -->|4. Web3 Sign Transaction| MetaMask
    MetaMask -->|5. On-Chain State Handoff| Sepolia
    Pinata -.->|6. Pinned CIDs & Hashes| Sepolia
```

---

## Component Topology Deep Dive

### 1. Client & Presentation Layer
* **Framework**: React 18 with TypeScript and Vite for near-instant HMR.
* **Component Library**: Radix UI primitives styled with TailwindCSS and `shadcn/ui`.
* **State & Query**: TanStack React Query (`@tanstack/react-query`) for asynchronous data fetching and cache invalidation.
* **Web3 Integration**: Ethers.js v6 for contract interaction, wallet lifecycle management, and ABI encoding.
* **Camera / Dual-Perspective Capture**: HTML5 environment-facing video stream integration with multi-angle capture guidance (Angle 1: Top/Seam, Angle 2: Side/Label).

### 2. Identity & Access Management (IAM)
* **Provider**: Auth0 by Okta.
* **Tokens**: RS256-signed JSON Web Tokens containing custom namespace claims (`https://tracely.app/role`).
* **Roles**: `MANUFACTURER`, `DISTRIBUTOR`, `WAREHOUSE`, `RETAILER`, `CONSUMER`.
* **Serverless Action**: Post-login Auth0 Action automatically assigns roles for passwordless email authentication and maps OAuth2 claims.

### 3. Application & Forensic Vision Backend
* **Runtime**: Python 3.13 / Flask.
* **Security Middleware**: RS256 JWKS token validation with automatic key rotation lookup and macOS SSL certifi patch.
* **AI Vision Engine**: Google Gemini Multimodal API (`google-generativeai`) querying dual models in an ensemble configuration.
* **Computer Vision Normalization**: OpenCV headless (`cv2`) and NumPy for feature-based Homography (ORB/SIFT + RANSAC) and LAB color-space CLAHE illumination normalization.
* **IPFS Proxy**: Secure backend multipart proxy uploading package evidence to Pinata Cloud without exposing API secrets to the client.

### 4. Decentralized Ledger & Storage
* **Smart Contract**: `SupplyChainTrust.sol` deployed on Ethereum Sepolia testnet.
* **Cryptographic Event Hash**: Keccak256 / SHA256 hashes generated over `(batchId, timestamp, actor, role, firstViewImage, secondViewImage, note)`.
* **Decentralized Storage**: Pinata IPFS nodes anchoring dual-angle photographic evidence under immutable CIDs (`ipfs://<CID>`).

---

## End-to-End Sequence Flow

The following sequence diagram details the full lifecycle of a physical package custody transfer under Tracely verification:

```mermaid
sequenceDiagram
    autonumber
    actor Handler as Supply Chain Actor (e.g. Warehouse)
    participant Client as Tracely Web App
    participant Auth as Auth0
    participant Backend as Flask API Gateway
    participant Gemini as Google Gemini Ensemble
    participant IPFS as Pinata / IPFS Vault
    participant Chain as Sepolia (SupplyChainTrust)

    Handler->>Client: Scan QR Code & Launch Custody Transfer
    Client->>Auth: Verify JWT & Extract Role Claim
    Auth-->>Client: Valid Session Token
    
    Handler->>Client: Capture Orthogonal Angles (Angle 1 & Angle 2)
    Client->>Backend: POST /api/upload (Proxy Raw Photos)
    Backend->>IPFS: Pin Images to IPFS
    IPFS-->>Backend: Return Immutable CIDs
    Backend-->>Client: Image IPFS URLs & CIDs

    Client->>Backend: POST /api/analyze (Baseline vs Current Images)
    Backend->>Gemini: Multimodal Analysis (gemini-3-flash-preview)
    Gemini-->>Backend: Structured Anomalies & Differences JSON
    Backend->>Backend: Compute Trust Integrity Score (TIS)
    Backend-->>Client: TIS Score + Assessment (SAFE / MODERATE_RISK / HIGH_RISK)

    alt TIS >= 40% (Integrity Verified)
        Client->>Chain: logEvent(batchId, actor, role, note, img1, img2, eventHash)
        Chain-->>Client: Transaction Receipt (Block Number & Event Logged)
        Client-->>Handler: ✅ Custody Handover Approved & Logged On-Chain
    else TIS < 40% (Tamper Detected)
        Client-->>Handler: 🚨 ALARM: Package Quarantined (Transfer Blocked)
    end
```

---

## Network Resiliency & Requestly Layer

To guarantee institutional uptime and simulate failure edge cases during quality assurance, Tracely leverages **Requestly**:
1. **IPFS Gateway Failover**: Intercepts `ipfs.io` public gateway timeouts and dynamically reroutes to high-speed dedicated Pinata endpoints (`https://gateway.pinata.cloud/ipfs/`).
2. **Tamper Stress Testing**: Injects modified response payloads into the `/api/analyze` route to verify that frontend quarantine gates and UI alert banners activate with zero false negatives.
3. **Latency Simulation**: Simulates edge-network degraded connectivity at remote shipping ports and loading docks.
