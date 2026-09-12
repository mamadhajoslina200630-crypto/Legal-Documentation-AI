# Legal AI Platform (Document Upload & Ingestion)

> **Purpose:** Complete implementation blueprint for `Document Upload & Ingestion`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Document Upload & Ingestion`

## 1.2 Service ID

`sys-common-upload-ingestion`

## 1.3 Service Category

`Common Infrastructure`

## 1.4 Service Type

`Gateway / Ingress Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Document Upload & Ingestion service must:

* Securely accept user files (PDF, DOCX, TXT) via the frontend UI.
* Issue short-lived Pre-Signed URLs to allow direct client-to-cloud (S3/Blob) uploads, bypassing the main application servers to prevent memory bottlenecks.
* Trigger a virus scan on the uploaded binary payload.
* Create the initial `Document` record in the PostgreSQL database with status `UPLOADED`.
* Dispatch an event to the message broker (RabbitMQ/Redis) to trigger the downstream `Legal Document Analysis` pipeline.

The service must **not** perform OCR or text extraction itself (that is handled downstream). It is strictly the secure gateway for moving bits from the user's computer into the cloud.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers frequently upload massive files (e.g., 500MB scanned evidence PDFs). If these files passed directly through the Python/Node API servers, they would crash the servers with Out-Of-Memory (OOM) errors and block other users. This service implements a highly scalable direct-to-S3 architecture, ensuring the platform never crashes during bulk uploads.

## 1.7 User Value

Explain what the user gains from this service.
Speed and reliability. They can drag-and-drop a folder of 100 heavy PDFs, and the system instantly accepts them and begins processing without the browser freezing or timing out.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A securely stored binary file in an S3 bucket, a corresponding metadata row in the PostgreSQL database, and a Celery task queued up for processing.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Generating Pre-Signed AWS S3/GCP Blob URLs.
* Validating file extensions and MIME types.
* Enforcing file size limits.
* Antivirus scanning (via integration like ClamAV).
* Webhook interception (listening for the S3 "Upload Complete" event).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Text chunking or vectorization.
* Document conversion (e.g., converting DOCX to PDF).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Object Storage (S3)` | To store binary files | Binary Data |
| `Message Broker` | To trigger background jobs | Event Payload |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**OCR & Text Extraction Service**, **Legal Document Analysis Service**.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user drags and drops a file onto the Dashboard.

## 3.2 User Input
One or more binary files.

## 3.3 User Flow

```text
User drops "Contract.pdf" (50MB) into the UI.
  ↓
UI requests a Pre-Signed URL from the API.
  ↓
Service returns a secure, 5-minute URL.
  ↓
UI uploads the binary payload directly to S3 via PUT request.
  ↓
S3 triggers a Webhook back to the Service.
  ↓
Service runs virus scan.
  ↓
Service creates `Document` in DB.
  ↓
Service fires `DocumentUploadedEvent` to queue.
  ↓
UI updates state from "Uploading..." to "Processing..."
```

## 3.4 User States
* `Uploading`
* `Scanning`
* `Processing`

## 3.5 User-Visible Result
A progress bar that rapidly completes, followed by the file appearing in their Workspace directory.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Upload Coordination Workflow

```text
HTTP REQUEST `POST /api/v1/workspaces/{id}/upload-url`
  Body: { "filename": "Contract.pdf", "size_bytes": 50000000, "mime_type": "application/pdf" }
  ↓
Validate size against Workspace limits.
Generate S3 object key: `workspace_{id}/raw/{uuid}.pdf`
Generate Pre-Signed URL for PUT.
  ↓
HTTP RESPONSE 200 OK -> `{ "url": "https://s3...", "document_id": "uuid" }`

[Client performs direct upload to S3]

HTTP WEBHOOK `POST /api/v1/webhooks/s3-upload-complete`
  ↓
Trigger asynchronous Antivirus Scan (ClamAV).
  ↓
If Virus Found -> Delete from S3, mark `Document` status `FAILED_SECURITY`.
If Clean -> Mark `Document` status `UPLOADED`.
  ↓
Publish Event: `DocumentUploadedEvent(document_id)` to trigger Doc Analysis.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `filename`| `String` | Yes | Must have a valid extension |
| `size_bytes`| `Integer`| Yes | Must be > 0 |
| `mime_type`| `String`| Yes | Must be a supported MIME type |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must strictly reject unsupported MIME types (e.g., `.exe`, `.sh`, `.zip`) to prevent malicious execution or complex archive bomb attacks.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A secure URL for the client to upload to, and eventually a database row representing the file metadata.

## 6.2 Output Structure
```json
{
  "document_id": "uuid",
  "upload_url": "https://legal-ai-bucket.s3.amazonaws.com/workspace_123/raw/...",
  "expires_in_seconds": 300
}
```

## 6.3 Output Rules
* The Pre-Signed URL MUST expire shortly after generation (e.g., 5 minutes) to prevent URL sharing or replay attacks.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Direct-to-Cloud Uploads:** The application server (FastAPI/Node) MUST NEVER buffer the binary payload in its own memory. All uploads must go directly from the client's browser to the S3 bucket.
* **Workspace Isolation via Paths:** The S3 bucket structure MUST inherently isolate files by workspace. Example: `s3://bucket-name/workspaces/{workspace_id}/raw/{document_id}.pdf`. This ensures IAM policies can enforce strict access controls.

## 7.2 Validation Rules
* Maximum file size limit: e.g., 200MB. If `size_bytes` exceeds this, reject immediately.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* If the S3 upload fails or the client disconnects, the system will have an "Orphaned" Document record in the DB (status `PENDING_UPLOAD`). A nightly cron job must sweep and delete these orphans.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* This service *creates* the initial context.

---

# 9. AI RESPONSIBILITY

N/A - This is a purely infrastructural service.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Antivirus scanning.
* Firing the `DocumentUploadedEvent` into the Celery task queue to start the downstream analysis pipeline.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `documents` table (Creation of the master record).

## 13.5 Database Rules
* The `documents` table must track the `s3_uri` explicitly so downstream services know exactly where to fetch the binary.

---

# 14. STORAGE REQUIREMENTS

## 14.1 S3 / Blob Storage
* **Bucket Configuration:** The bucket must be completely private (no public read/write).
* **CORS:** The bucket must have CORS configured to allow `PUT` requests directly from the trusted Frontend origins.
* **Encryption:** Enable KMS-based AES-256 server-side encryption at rest (SSE-KMS) by default. Legal documents are highly sensitive.

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/upload-url` (Generate presigned URL)
* `POST /api/v1/webhooks/storage-events` (Internal webhook from S3)

---

# 16. ERROR HANDLING

## Error Rules
* If a virus is detected, the `documents` table `status` must be set to `FAILED_SECURITY`, and a WebSocket event must be pushed to the UI to inform the user why the upload vanished.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before generating the upload URL.

## 17.4 Security Rules
* Do not trust the `mime_type` provided by the client in the initial request. When the backend receives the S3 webhook, it must verify the file's "magic bytes" (file signature) to ensure an `.exe` file wasn't renamed to `.pdf`.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* URL generation must be `< 100ms`.

## 20.2 Large Input Handling
* Handled via the direct-to-S3 architectural choice. S3 handles the heavy lifting of multi-part 500MB uploads.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Upload Logic   | `backend/app/services/document_upload.py` | URL generation & DB creation |
| Storage Client | `backend/app/core/storage.py` | Boto3 / AWS S3 interactions |

---

# 22. SERVICE CONNECTIONS

```text
[Frontend UI] ──(1. Get URL)──► [API Server] ──► [PostgreSQL]
      │
      └──(2. PUT File)──► [Amazon S3] ──(3. Webhook)──► [API Server] ──► [Message Broker (RabbitMQ/Redis)]
```

---

# 23. EVENTS

## 23.1 Emitted Events
* `DocumentUploadedEvent`: Contains `workspace_id`, `document_id`, and `s3_uri`. Consumed by the Legal Document Analysis service.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: User generated upload URL for Contract.pdf (5MB).`
* `INFO: S3 Webhook received for Doc 123. AV Scan passed. Emitted DocumentUploadedEvent.`

---

# 25. OBSERVABILITY

## Metrics
* Track `total_upload_bytes` to monitor storage costs.
* Track `upload_failures` (where a URL was generated but the webhook never arrived, indicating a client-side network failure).

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test MIME Validation:** Pass `mime_type="application/x-msdownload"` (an EXE file). Assert the service rejects it with a 400 Bad Request.
* **Test Webhook Parsing:** Feed a mock AWS S3 Event JSON payload to the webhook endpoint. Assert it correctly identifies the `object_key`, parses the `workspace_id` from the path, and updates the database.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Zero-Byte File` | The UI or an API script might accidentally upload an empty 0-byte file. The URL generation endpoint must reject `size_bytes == 0`. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `S3_BUCKET_NAME` | Target storage bucket | Yes | `legal-ai-dev-bucket` |
| `MAX_UPLOAD_SIZE_MB`| Hard limit on file size | Yes | `200` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Requires IAM Roles (AWS) or Service Accounts (GCP) attached to the application servers with permissions to execute `s3:PutObject`, `s3:GetObject`, and `s3:GeneratePresignedUrl`.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Application server memory does not spike during a 200MB file upload.
* [ ] Pre-signed URLs expire after 5 minutes.
* [ ] Files are strictly segregated by `workspace_id` in the cloud bucket.
* [ ] `DocumentUploadedEvent` is correctly published to trigger downstream workflows.

---

# 32. DEFINITION OF DONE

The Document Upload & Ingestion service is **DONE** when a user can drag 50 heavy PDFs onto the dashboard simultaneously, and the system absorbs them flawlessly without crashing, immediately queueing them up for AI analysis.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Reject bad MIME types).
3. **Database ownership must be explicit.** (This service creates the initial `Document`).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the secure, scalable front door for getting heavy binary files into the platform.

## What the user sees
A fast, reliable drag-and-drop upload experience that never crashes their browser or times out.

## What happens in the background
The service intercepts the upload request, issues a secure temporary passport (Pre-Signed URL) for the user to upload directly to Amazon S3, waits for S3 to confirm receipt, scans the file for viruses, and triggers the AI factory to start processing it.

## What it receives
File metadata and Webhooks.

## What it produces
Secure S3 URLs and Message Broker Events.

## Success means
The AI platform is highly resilient and cannot be crashed by a user attempting to upload a gigabyte of scanned evidence.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
