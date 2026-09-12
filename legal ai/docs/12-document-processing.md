# Legal AI Platform (Document Processing)

> **Purpose:** Complete implementation blueprint for `Document Processing`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Document Processing`

## 1.2 Service ID

`sys-doc-processing-core-platform`

## 1.3 Service Category

`Platform Engineering & Data Ingestion`

## 1.4 Service Type

`Background Pipeline`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Document Processing pipeline must:

* Securely receive, validate, and store uploaded files (PDFs, Word Docs, Images).
* Extract raw, searchable text from these files using standard parsers (e.g., PyMuPDF).
* Automatically detect scanned, non-searchable PDFs or images and run Optical Character Recognition (OCR) to convert them into searchable text.
* Output clean, structured text ready for AI analysis and RAG embedding.

The service must **not** perform AI semantic analysis (like finding risks). It only prepares the raw text.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
The legal industry in India relies heavily on scanned physical documents, stamped papers, and poor-quality photocopies. AI models cannot read images directly without massive token costs. This service ensures that regardless of how terrible the uploaded PDF is, the rest of the platform receives clean, readable digital text.

## 1.7 User Value

Explain what the user gains from this service.
Users can upload any document they have—even a photo taken on their phone of a physical contract—and the platform will seamlessly digitize it and make it AI-searchable.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A robust, asynchronous Celery pipeline that takes an S3 Object URL, runs OCR if necessary, and saves the extracted text to PostgreSQL, before triggering the RAG Indexing pipeline.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* File format validation (MIME types, size limits).
* S3 / Object Storage uploading.
* Native text extraction (PyMuPDF for PDFs, `python-docx` for Word).
* OCR orchestration (PaddleOCR / Tesseract).
* Page-level text mapping (keeping track of which text came from which page).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector Database Embeddings (Handled by RAG Architecture).
* Legal Clause extraction (Handled by Legal Intelligence services).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Celery Workers` | Heavy OCR processing cannot block APIs | Compute |
| `Storage Architecture` | Where to save the raw files | S3 Buckets |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
The `RAG Architecture` and all `Core Legal Services` depend on this clean text to function.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

The user clicks "Upload Document" in the React Dashboard.

## 3.2 User Input

A file (`.pdf`, `.docx`, `.jpeg`, `.png`).

## 3.3 User Flow

```text
User selects File
    ↓
Frontend uploads directly to API (or via S3 Presigned URL)
    ↓
API saves metadata to Postgres, fires Celery Task
    ↓
Frontend polls for status updates
    ↓
Celery finishes OCR, updates Postgres status to "Ready"
    ↓
Frontend refreshes to show Document UI
```

## 3.4 User States

* **Uploading:** Progress bar (0-100%).
* **Processing:** "Analyzing document quality..."
* **Extracting:** "Running OCR on scanned pages..."
* **Ready:** Document UI appears.
* **Error:** "Could not read this file. Ensure it is not encrypted."

## 3.5 User-Visible Result

A split-screen UI where the left side renders the PDF (via PDF.js) and the right side is ready for AI Chat.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
API ENDPOINT
  ↓ (Saves File to S3, Creates DB Record)
CELERY WORKER QUEUE
  ↓
TASK: Validate & Detect Type
  ↓ (Is it Scanned?)
YES ──► TASK: OCRmyPDF / PaddleOCR
NO ───► TASK: PyMuPDF Extraction
  ↓
Save Extracted Text to Postgres (`document_pages` table)
  ↓
TRIGGER TASK: RAG Indexing
```

For each step define:

### Step 1 — Ingestion
**Purpose:** Secure the file.
**Input:** HTTP Upload.
**Output:** S3 URL.
**Rules:**
* Max file size: 50MB.

### Step 2 — Triage
**Purpose:** Decide if OCR is needed.
**Input:** PDF File.
**Output:** Routing decision.
**Rules:**
* Use PyMuPDF to check if pages contain actual text layers. If a page has < 50 characters of text but contains large images, flag it for OCR.

### Step 3 — Extraction / OCR
**Purpose:** Get the text.
**Input:** PDF File.
**Output:** Dictionary of `{page_number: text}`.
**Rules:**
* PaddleOCR must be used for complex Indian languages or stamped documents if Tesseract fails.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `file`    | `UploadFile` | Yes | HTTP multipart/form-data. |
| `workspace_id`| `UUID` | Yes | Path parameter. |

## 5.2 Optional Inputs

N/A

## 5.3 Input Validation Rules

* Reject encrypted/password-protected PDFs immediately.
* Reject executable files or scripts disguised as PDFs.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A populated database representation of the document, broken down by page.

## 6.2 Output Structure

```python
# PostgreSQL Table Structure
class DocumentPage(Base):
    document_id = Column(UUID)
    page_number = Column(Integer)
    raw_text = Column(Text)
    contains_tables = Column(Boolean)
```

## 6.3 Output Rules

* The text must preserve basic paragraph formatting (newlines) to help the RAG chunking algorithm.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Asynchronous Execution:** OCR must NEVER run inside the FastAPI request cycle. It must be dispatched to Celery.
* **Original File Integrity:** The uploaded file in S3 must never be modified. OCR operations should generate a *new* searchable PDF in a `/processed/` bucket, leaving the original intact for legal evidence.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* If a PDF is a hybrid (Page 1 is native text, Page 2 is a scanned image), the system must apply OCR *only* to the scanned pages to save compute resources.

## 7.4 Failure Rules

* If OCR fails completely (e.g., the image is completely illegible), update the document status to `Failed_OCR` and notify the user. Do not crash the worker queue.

## 7.5 Boundary Rules

N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* This service *creates* the document context for the rest of the application.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

* OCR is a form of specialized, deterministic ML.

## 9.2 AI Input

* Pixel data (images of pages).

## 9.3 AI Output

* Recognized strings and bounding boxes.

## 9.4 AI Rules

* Avoid using highly expensive generative LLMs (like GPT-4V) for basic OCR. Use dedicated OCR engines (PaddleOCR) first to save costs.

## 9.5 AI Provider Independence

N/A

## 9.6 Model Requirements

* OCR models must support English and key Indian scripts (Hindi/Devanagari, Tamil, etc.) depending on platform requirements.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - This service feeds the RAG pipeline.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* `process_uploaded_document_task(document_id: UUID)`

## 12.2 Processing Trigger

* Triggered via API upon successful S3 upload.

## 12.3 Processing Status

* Tracked in Postgres via `document.status` ENUM (`PENDING`, `EXTRACTING`, `OCR_PROCESSING`, `COMPLETED`, `FAILED`).

## 12.4 Retry Rules

* Do not infinitely retry OCR on a corrupted file. Max retries: 1.

## 12.5 Idempotency

* If `process_uploaded_document_task` is triggered twice on the same `document_id`, the second run should abort if the status is already `COMPLETED`.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

* `documents` table metadata.
* `document_pages` extracted text.

## 13.4 Database Entities

* See 13.1.

## 13.5 Database Rules

* Avoid storing massive 500-page strings in a single Postgres cell. Break them down by page into a `document_pages` table to allow targeted queries.

---

# 14. STORAGE REQUIREMENTS

## 14.1 Stored Objects

* Original User Upload (S3).
* Processed Searchable PDF (S3).

## 14.2 Storage Rules

* Files must be keyed by `workspace_id` in the S3 bucket path (e.g., `s3://legal-docs/workspaces/{id}/docs/{uuid}.pdf`).

---

# 15. API CONTRACT

## 15.1 API List

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `POST` | `/api/v1/workspaces/{id}/documents` | Upload a file |
| `GET`  | `/api/v1/documents/{id}/status` | Poll for processing status |

## 15.2 API Request

* Multipart form data for uploads.

## 15.3 API Response

* JSON indicating the Celery `task_id` and DB `document_id`.

## 15.4 API Rules

* API route must validate the MIME type using python `python-magic` or similar, do not trust the user-provided file extension.

---

# 16. ERROR HANDLING

## Error Rules

* Catch `PyMuPDF` decryption errors and return a clean "Document is password protected" status to the UI.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* A user cannot upload a document to a workspace they do not belong to.

## 17.2 Data Isolation

* Documents are strictly siloed by `workspace_id`.

## 17.3 Sensitive Data

* Malware scanning should ideally be integrated at the S3 bucket level (e.g., AWS GuardDuty) to prevent users from uploading malicious files.

## 17.4 Security Rules

* Celery workers processing the files must run in isolated Docker containers with minimal privileges, in case a malicious PDF exploits the OCR engine.

---

# 18. SOURCE & TRACEABILITY

## 18.1 Source Types

* Page numbers are established here.

## 18.2 Source Requirements

* The extraction dictionary must strictly map `text -> page_number`.

## 18.3 Missing Source Behavior
N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* The initial HTTP POST must return in < 1 second.
* Background OCR of a 10-page document should complete in < 15 seconds.

## 20.2 Large Input Handling

* The API must stream the upload to S3 in chunks (using FastAPI's `UploadFile.file.read(chunk_size)`). It must never load a 50MB PDF entirely into server RAM.

## 20.3 Concurrent Usage

* Celery workers must be scaled horizontally depending on the OCR load.

## 20.4 Resource Limits

* OCR requires significant CPU/RAM. Worker containers must be provisioned appropriately (e.g., 2vCPU, 4GB RAM minimum per worker).

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| API Route      | `backend/app/api/v1/documents.py` | Upload endpoint |
| Worker Tasks   | `backend/app/worker/tasks/document.py` | Celery orchestration |
| Parsers        | `backend/app/services/document/parsers.py`| PyMuPDF wrappers |
| OCR Engines    | `backend/app/services/document/ocr.py` | PaddleOCR wrappers |

---

# 22. SERVICE CONNECTIONS

```text
[Frontend]
    │ (Multipart Upload)
[FastAPI Route] ──► [S3 / R2]
    │
[Celery Queue (Redis)]
    │
[Celery Worker]
    │
    ├─► (PyMuPDF Extraction)
    ├─► (PaddleOCR Extraction)
    │
[PostgreSQL] (Save Text)
    │
[RAG Celery Queue] (Trigger Indexing)
```

---

# 23. EVENTS

## Events Produced

| Event | Consumers | Purpose |
| --- | --- | --- |
| `DOCUMENT_READY` | RAG Indexer | Trigger embeddings generation |

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log file size, page count, and OCR execution time.

## 24.2 Audit Logging

* Log WHO uploaded the document and WHEN.

## 24.3 Sensitive Data Rules

* DO NOT log the extracted text.

---

# 25. OBSERVABILITY

## Metrics

* Number of documents uploaded per day.
* Percentage of documents requiring heavy OCR.
* Average processing time per page.

## Health
N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test the triage logic: Provide a native PDF and assert OCR is skipped. Provide an image PDF and assert OCR is triggered.

## 26.2 Integration Testing

* Test the full upload flow using a small mock PDF.

## 26.3 End-to-End Testing
N/A
## 26.4 AI Testing
N/A
## 26.5 Security Testing
* Attempt to upload an `.exe` file disguised as a `.pdf` and assert the API rejects it.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Password Protected PDF` | Fail extraction gracefully, update DB status to `REQUIRES_PASSWORD`. |
| `Corrupted PDF` | Catch PDF parsing errors, update status to `FAILED`. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `AWS_S3_BUCKET` | File storage | Yes | - |
| `MAX_FILE_SIZE_MB` | Security | Yes | `50` |
| `ENABLE_OCR` | Toggle heavy processing | Yes | `true` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* The Celery worker Docker image MUST have system-level dependencies installed for OCR (e.g., `tesseract-ocr`, `ghostscript`, `libgl1` for OpenCV/PaddleOCR).

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] API successfully receives and saves a PDF to S3.
* [ ] Celery worker successfully reads a native PDF and extracts text to DB.
* [ ] Celery worker successfully reads a scanned PDF, runs OCR, and extracts text to DB.
* [ ] DB maps text accurately to page numbers.

---

# 32. DEFINITION OF DONE

The Document Processing pipeline is **DONE** when any user can upload a messy, scanned legal contract and the system automatically converts it into clean, database-backed text strings without crashing the API servers.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (No AI risk analysis here).
2. **Errors must be handled explicitly.** (Catch PDF parsing errors safely).
3. **Background processing must be safe to retry.**
4. **Unsupported input must fail safely.** (Reject bad files).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the front door for all user data, ingesting files and converting them into a format the AI can read.

## What the user sees
A loading bar followed by their document appearing in the dashboard.

## What happens in the background
Files are streamed to cloud storage, queued in Redis, and processed by heavy OCR computer vision models running inside isolated Celery workers, before finally being saved to Postgres.

## What it receives
Raw binary files.

## What it produces
Clean, structured text mapped to specific pages.

## Success means
The AI has perfectly legible text to read, ensuring high-quality legal analysis later in the pipeline.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
