# 📡 API Reference

## Base URL & Configuration

* **Local Development**: `http://localhost:5000`
* **Production**: Vercel / Cloud Run Serverless Gateway
* **Default Content-Type**: `application/json` (or `multipart/form-data` for direct binary uploads)
* **CORS Policy**: Enabled for `/api/*` with support for standard web headers (`Origin`, `Content-Type`, `Authorization`).

---

## Endpoint Summary

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/analyze` | Optional | Dual-angle or single-angle forensic comparison via Gemini AI & CV. |
| `POST` | `/api/analyze_multipart` | Optional | Multipart file upload version of forensic image analysis. |
| `POST` | `/api/upload` | No | Secure server-side proxy for Pinata IPFS file pinning. |
| `GET` | `/api/user/profile` | **Yes (RS256 JWT)** | Fetch MongoDB user profile by verified Auth0 `sub`. |
| `POST` | `/api/user/profile` | **Yes (RS256 JWT)** | Create/update user profile and permanently lock selected role. |
| `DELETE`| `/api/user/profile` | **Yes (RS256 JWT)** | Remove user profile from database. |
| `GET` | `/api/health` | No | System health check and backend dependency status. |

---

## Detailed Endpoint Specifications

### 1. Execute Forensic Analysis (`POST /api/analyze`)
Performs multi-perspective forensic anomaly detection by evaluating current photos against reference baselines.

#### Request Headers
```http
Content-Type: application/json
Authorization: Bearer <Optional_Auth0_JWT>
```

#### Request Body (Two-Angle Mode)
```json
{
  "baseline_angle1": "https://ipfs.io/ipfs/bafybeib7v6...",
  "baseline_angle2": "https://ipfs.io/ipfs/bafybeic8w7...",
  "current_angle1": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "current_angle2": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

#### Response (`200 OK`)
```json
{
  "aggregate_tis": 88,
  "overall_assessment": "SAFE",
  "confidence_overall": 0.86,
  "notes": "Package integrity verified. Minor superficial anomalies detected.",
  "differences": [
    {
      "id": "a1-d1",
      "region": "top edge",
      "bbox": [0.12, 0.03, 0.76, 0.08],
      "type": "scratch",
      "description": "Superficial surface scratch on upper cardboard flap.",
      "severity": "LOW",
      "confidence": 0.78,
      "explainability": ["linear mark", "surface abrasion"],
      "suggested_action": "Proceed",
      "tis_delta": -8
    }
  ],
  "angle_results": [
    {
      "view": "angle_1",
      "aggregate_tis": 92,
      "overall_assessment": "SAFE",
      "confidence_overall": 0.88,
      "differences": [...]
    },
    {
      "view": "angle_2",
      "aggregate_tis": 84,
      "overall_assessment": "SAFE",
      "confidence_overall": 0.84,
      "differences": [...]
    }
  ],
  "analysis_metadata": {
    "total_differences": 1,
    "high_severity_count": 0,
    "medium_severity_count": 0,
    "low_severity_count": 1,
    "angle_1_tis": 92,
    "angle_2_tis": 84,
    "angle_tis_min": 84,
    "angle_tis_max": 92,
    "scoring_version": "cv-v3",
    "gemini_ready": true,
    "cv_ready": true,
    "analysis_timestamp": "2026-09-20T14:30:00.000Z"
  }
}
```

---

### 2. Pin Image to IPFS (`POST /api/upload`)
Proxies binary file uploads to Pinata Cloud IPFS storage without leaking server JWT secrets.

#### Request Headers
```http
Content-Type: multipart/form-data
```

#### Form Data
* `file`: Binary image file (Max size: 16 MB; types: JPEG, PNG, WEBP).

#### Response (`200 OK`)
```json
{
  "url": "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
}
```

---

### 3. User Profile Management (`/api/user/profile`)

#### Fetch Profile (`GET /api/user/profile`)
* **Headers**: `Authorization: Bearer <Auth0_JWT>`
* **Response (`200 OK`)**:
  ```json
  {
    "sub": "google-oauth2|109283746501928374650",
    "email": "operator@apexlogistics.com",
    "name": "Jane Doe",
    "picture": "https://lh3.googleusercontent.com/a/...",
    "role": "WAREHOUSE",
    "created_at": "2026-09-20T10:00:00Z",
    "last_login": "2026-09-20T14:30:00Z"
  }
  ```

#### Create / Update Profile (`POST /api/user/profile`)
* **Headers**: `Authorization: Bearer <Auth0_JWT>`
* **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "operator@apexlogistics.com",
    "picture": "https://lh3.googleusercontent.com/a/...",
    "role": "WAREHOUSE"
  }
  ```
* **Response (`200 OK`)**: Returns updated profile document. Note: Once set to a non-null role, the `role` field cannot be modified by subsequent POST requests.

---

### 4. Health Check (`GET /api/health`)
Verifies active backend subsystem availability.

#### Response (`200 OK`)
```json
{
  "status": "ok",
  "timestamp": "2026-09-20T14:30:00.000Z",
  "auth_available": true,
  "db_available": true
}
```

---

## Error Status Codes

| HTTP Status | Error Reason | Resolution |
| :---: | :--- | :--- |
| `400 Bad Request` | Missing baseline or current image inputs; invalid JSON body. | Ensure both baseline and current image sources are included. |
| `401 Unauthorized` | Missing, expired, or invalid Auth0 Bearer token. | Refresh token via Auth0 SDK and re-authenticate. |
| `404 Not Found` | User sub not found in MongoDB database. | Submit `POST /api/user/profile` to initialize user document. |
| `413 Payload Too Large` | Uploaded file exceeds the 16 MB proxy threshold. | Compress or downscale image before uploading. |
| `500 Internal Error` | Gemini API exception or unhandled image decode failure. | Check backend logs and verify `GEMINI_API_KEY`. |
| `502 Bad Gateway` | Pinata Cloud upload rejected or upstream service timeout. | Check `PINATA_JWT` credentials and Pinata status. |
| `503 Service Unavailable`| MongoDB connection offline or PyJWT dependency missing. | Check `MONGODB_URI` and network TLS certificates. |
