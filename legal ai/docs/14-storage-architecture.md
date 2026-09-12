# Legal AI Platform (Storage Architecture)

> **Purpose:** Complete implementation blueprint for `Storage Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Storage Architecture`

## 1.2 Service ID

`sys-storage-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & Data Management`

## 1.4 Service Type

`Infrastructure Specification`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Storage Architecture must:

* Dictate exactly how raw physical files (PDFs, Word Docs, generated Audio files) are saved, structured, and retrieved from cloud object storage (e.g., AWS S3 or Cloudflare R2).
* Enforce strict security boundaries so that files cannot be accessed publicly without authentication.
* Define the lifecycle policies (retention, deletion, archiving) for legal documents.

The service must **not** dictate how structured relational data is saved (that belongs to Database Architecture).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Legal documents are highly confidential. Storing them on a standard web server's hard drive is insecure, unscalable, and prone to data loss if the server crashes. By using a defined Object Storage architecture, the platform guarantees that millions of documents can be stored securely, redundantly, and cost-effectively, while remaining instantly accessible to the AI processing pipelines.

## 1.7 User Value

Explain what the user gains from this service.
Users trust the platform because their highly sensitive M&A contracts and litigation documents are stored in military-grade encrypted cloud vaults, immune to arbitrary data loss.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully defined S3 bucket topology, strict IAM access policies for the backend servers, and a standardized Python interface (`StorageService`) for uploading and downloading files.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* AWS S3 / Cloudflare R2 Bucket configuration.
* Folder naming conventions (UUIDs vs plaintext names).
* Pre-signed URL generation logic.
* File encryption at rest (KMS).
* S3 Lifecycle rules (e.g., moving old docs to Glacier).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Extracting text from the stored files (Handled by Document Processing).
* Saving file metadata like "uploader_id" (Handled by PostgreSQL / Database Architecture).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `PostgreSQL Database` | Stores the reference paths to S3 | S3 Keys |
| `Cloud Provider` | Physical storage hardware | Object Storage APIs |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
`Document Processing` (uploads files), `Frontend` (downloads files via Presigned URLs), and `Voice Assistant` (saves generated audio).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A - Users interact with files via the Frontend UI, which connects to the backend API.

## 3.2 User Input
N/A

## 3.3 User Flow
N/A

## 3.4 User States
N/A

## 3.5 User-Visible Result
N/A

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
UPLOAD FLOW
  ↓
FastAPI receives HTTP Multipart File
  ↓
Generate secure S3 Object Key
  ↓
Stream bytes directly to S3 (Boto3 / Aiobotocore)
  ↓
Save resulting S3 Key to PostgreSQL

DOWNLOAD FLOW
  ↓
Frontend requests to view Document ID 123
  ↓
FastAPI validates User Workspace permissions against PostgreSQL
  ↓
FastAPI calls S3 to generate a 15-minute Pre-signed URL
  ↓
Frontend uses URL to fetch PDF directly from AWS S3
```

For each step define:

### Step 1 — Upload
**Purpose:** Securely store the file.
**Input:** File bytes.
**Output:** S3 Object Key.
**Rules:**
* Never load large files entirely into RAM. Use streaming uploads.

### Step 2 — Retrieval (Presigned URL)
**Purpose:** Allow frontend access without routing 50MB files through the backend API.
**Input:** S3 Object Key.
**Output:** Temporary HTTP URL.
**Rules:**
* URLs must expire quickly (e.g., 15 minutes) to prevent unauthorized sharing of links.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `file_bytes` | `Stream` | Yes | - |
| `workspace_id`| `UUID` | Yes | Used for structuring the S3 path |

## 5.2 Optional Inputs

N/A

## 5.3 Input Validation Rules

* Rely on the `Document Processing` service to validate MIME types before calling the storage layer.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

* **On Upload:** S3 Object Key (String).
* **On Download:** Pre-signed URL (String).

## 6.2 Output Structure

```python
# Example S3 Key Structure
"workspaces/f47ac10b-58cc-4372-a567-0e02b2c3d479/documents/a8c715b3.pdf"
```

## 6.3 Output Rules

* The returned S3 key must be relative to the bucket root, allowing the backend to change buckets easily across environments (dev vs prod).

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Privacy by Default:** S3 Buckets must strictly disable public access. The only way to access a file is via a backend-generated Presigned URL.
* **Obfuscation:** S3 Object Keys must use UUIDs, never the user's original filename (e.g., `Confidential_Merger_Apple_Tesla.pdf` must be saved as `8f4b...391a.pdf`). The original filename is stored only in Postgres.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* Audio files generated by the Voice Assistant should be stored in a temporary `/cache` folder in S3 with a lifecycle rule to auto-delete after 7 days, to save costs on ephemeral audio.

## 7.4 Failure Rules

* If the S3 upload fails, the API must return a 502 Bad Gateway error and ensure no orphaned records are created in Postgres.

## 7.5 Boundary Rules

* The frontend must NEVER upload files directly to S3 from the browser (e.g., no direct-to-S3 CORS uploads) because it bypasses malware scanning and strict validation.

---

# 8. DOCUMENT CONTEXT

N/A - Storage treats all documents as raw bytes.

---

# 9. AI RESPONSIBILITY

N/A

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* **Orphan Cleanup:** A Celery Beat task that runs nightly to delete S3 objects that do not have a corresponding record in Postgres (e.g., if a DB transaction rolled back but the S3 upload succeeded).

## 12.2 Processing Trigger

* Cron Schedule (Nightly).

## 12.3 Processing Status
N/A

## 12.4 Retry Rules
N/A

## 12.5 Idempotency
* Deletion is inherently idempotent.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

N/A - Storage owns the S3 buckets, not the relational DB.

## 13.5 Database Rules

* PostgreSQL `documents` table must have an `s3_key` column (e.g., `VARCHAR(255)`).

---

# 14. STORAGE REQUIREMENTS

*(This entire document defines this section)*

## 14.1 Stored Objects

* `PDF`
* `DOCX`
* `PNG/JPEG` (Scanned images)
* `MP3/WAV` (Generated legal voice readings)

## 14.2 Storage Rules

* **Bucket Structure:**
  * `legal-ai-prod-documents`
  * `legal-ai-dev-documents`
* **Encryption:** `AES-256` Server-Side Encryption (SSE-S3 or SSE-KMS) must be enabled on the bucket.
* **Versioning:** Bucket versioning should be enabled to recover from accidental overwrites.

---

# 15. API CONTRACT

N/A - Interacted with via internal Python AWS SDK (`boto3`).

---

# 16. ERROR HANDLING

## Error Rules

* Catch `botocore.exceptions.ClientError`.
* If S3 returns HTTP 403, raise a severe internal security alert, as the backend IAM role is misconfigured.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* The backend EC2/ECS instances must be assigned an IAM Role with `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions ONLY for the specific app buckets.

## 17.2 Data Isolation

* Enforced by the `workspace_id` in the S3 prefix, combined with PostgreSQL authorization checks before generating URLs.

## 17.3 Sensitive Data

* Files are highly sensitive.

## 17.4 Security Rules

* Block Public Access must be turned ON at the AWS Account level.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Presigned URL generation must take < 5ms (it does not require a network call to AWS, it is just local cryptographic signing).

## 20.2 Large Input Handling

* Use `boto3` Multipart Upload for any file > 10MB to ensure network reliability.

## 20.3 Concurrent Usage

* S3 inherently handles massive concurrency.

## 20.4 Resource Limits

N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Storage Client | `backend/app/core/storage.py` | Boto3 wrapper & URL generator |
| API Dependency | `backend/app/api/deps.py` | Injects storage client |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI / Celery] ──► (Boto3 via HTTPS) ──► [AWS S3 Bucket]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log S3 upload successes and failures.

## 24.2 Audit Logging

* Deletion of an S3 object must be audited in Postgres.

## 24.3 Sensitive Data Rules

* DO NOT log the generated Presigned URLs. If leaked into a logging system (like Datadog), anyone could download the document.

---

# 25. OBSERVABILITY

## Metrics

* Monitor S3 Bucket Size (GB).
* Monitor 4xx and 5xx error rates on the bucket via AWS CloudWatch.

## Health

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Use `moto` (Mock Boto3) to test the storage service locally without hitting AWS.

## 26.2 Integration Testing
N/A
## 26.3 End-to-End Testing
N/A
## 26.4 AI Testing
N/A
## 26.5 Security Testing
* Attempt to access an S3 URL directly without the presigned signature. It MUST return `AccessDenied`.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `S3 Outage` | Fast fail upload attempts and return a graceful 503 error to the UI. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `AWS_ACCESS_KEY_ID` | IAM Auth (if not using EC2 roles) | No | - |
| `AWS_SECRET_ACCESS_KEY` | IAM Auth | No | - |
| `S3_BUCKET_NAME` | Target bucket | Yes | - |
| `AWS_REGION` | Bucket region | Yes | `ap-south-1` (India) |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* S3 bucket must be provisioned via Terraform before the backend can start.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Backend can successfully upload a file to S3.
* [ ] Backend can successfully generate a Presigned URL.
* [ ] Presigned URL successfully allows download of the exact file uploaded.
* [ ] Direct access to the S3 URL without signature returns 403 Forbidden.

---

# 32. DEFINITION OF DONE

The Storage Architecture is **DONE** when the storage client securely streams files to the cloud, preventing OOM (Out of Memory) crashes on the web servers, and serving files securely to authorized users.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Database ownership must be explicit.**
3. **Documents must remain associated with the correct workspace and permissions.** (Use UUID prefixes).
4. **Secrets must never be committed to source control.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the secure, scalable physical storage location for all binary files in the platform.

## What the user sees
N/A (Internal).

## What happens in the background
Files are streamed to AWS S3 using encrypted connections. The backend generates cryptographic signatures allowing users to temporarily view their files securely in the browser.

## What it receives
Raw file bytes.

## What it produces
S3 keys and Presigned HTTP URLs.

## Success means
The application can store petabytes of legal documents securely with 99.999999999% durability.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
