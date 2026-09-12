# Legal AI Platform (Legal Document Analysis)

> **Purpose:** Complete implementation blueprint for `Legal Document Analysis`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Document Analysis`

## 1.2 Service ID

`sys-legal-doc-analysis-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Document Analysis service must:

* Take a raw uploaded document (PDF, Word, Scanned Image) and extract structured, machine-readable text from it.
* Orchestrate the chunking of this text into semantically meaningful segments (e.g., separating by clauses or paragraphs).
* Trigger the Embedding service to vectorize these chunks for the RAG architecture.
* Extract basic metadata (Document Type, Page Count, Language).

The service must **not** perform subjective legal reasoning (like risk detection or compliance checking). It only parses, cleans, and structures the raw data so *other* services can reason about it.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers upload messy, unstructured, often scanned documents. AI models cannot read raw PDFs or images; they need clean text. This service is the foundational pipeline that converts human-readable legal files into AI-readable data. Without this, no other AI feature on the platform can function.

## 1.7 User Value

Explain what the user gains from this service.
The ability to drag-and-drop any contract into the system and instantly have it ready for chat, search, and summarization, regardless of whether it was a pristine digital PDF or a crooked scan of a 10-year-old lease.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that takes a Document ID, extracts the text via OCR/parsers, chunks it, stores the chunks in Postgres, and vectors them in Qdrant, ultimately marking the Document status as `READY`.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Text extraction (PyPDF2, pdfplumber, or cloud OCR).
* Semantic Chunking (LangChain text splitters).
* Metadata extraction (Detecting if it's an NDA, Lease, etc.).
* Coordinating with the Embedding/Vector DB layer.
* Managing the Document state machine (`UPLOADED` -> `PROCESSING` -> `READY` / `FAILED`).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Clause extraction or rewrites (Handled by Clause Information Extraction).
* Summarizing the document (Handled by Legal Document Summarization).
* The physical file upload to S3 (Handled by Document Upload Ingestion).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `StorageService` | Fetching the raw PDF | Binary file stream |
| `OCRService` | Extracting text from scans | Raw Text |
| `EmbeddingService` | Vectorizing text chunks | Vector Embeddings |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Almost every AI service** (Chat, Risk Detection, Comparison) depends on the clean, chunked text produced by this service.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user uploads a document on the frontend dashboard.

## 3.2 User Input
A file (PDF/Docx).

## 3.3 User Flow

```text
User uploads file.
  ↓
UI shows "Processing Document... (Step 1/3: Reading Text)"
  ↓
Analysis Service runs OCR and extracts text.
  ↓
UI shows "Processing Document... (Step 2/3: Analyzing Structure)"
  ↓
Analysis Service chunks the document and generates embeddings.
  ↓
UI shows "Document Ready!"
```

## 3.4 User States
* `Processing`
* `Failed (Unreadable)`
* `Ready`

## 3.5 User-Visible Result
The document appears in their workspace library and is clickable/chatable.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Background Processing Pipeline

```text
CELERY WORKER receives `analyze_document(doc_id)`
  ↓
Fetch Document record from DB, mark as `PROCESSING`.
  ↓
Fetch raw file from S3 via `StorageService`.
  ↓
Determine File Type (Digital PDF vs Scanned Image).
  ↓
Execute Text Extraction (pass to OCR if scanned).
  ↓
Apply Legal Semantic Chunking (split by headers/clauses, max 1000 tokens/chunk).
  ↓
For each chunk:
  Generate Vector Embedding via `EmbeddingService`.
  Save Chunk Text + Vector to Qdrant (via RAG Architecture).
  Save Chunk Text to PostgreSQL (for exact keyword search).
  ↓
Update Document DB record to `READY`.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Must exist in DB |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* The service must verify the document status is `UPLOADED`. If it is already `READY` or `PROCESSING`, it must abort to prevent duplicate processing.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database mutations (No direct HTTP return, as this runs in the background).

## 6.2 Output Structure
N/A

## 6.3 Output Rules
* If successful, the Document DB row `status` is set to `READY`.
* If it fails, `status` is set to `FAILED`, and the `error_message` column is populated.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Chunking Strategy:** Standard character-based chunking is insufficient for legal documents. The service MUST use semantic chunking (e.g., attempting to split on paragraph breaks, headers, or clause numbers) so that a single chunk contains a complete legal thought. Overlap chunks by 150 tokens to preserve context across boundaries.
* **Non-Destructive:** The original uploaded file in S3 must NEVER be altered or deleted by this service.

## 7.2 Validation Rules
* If the extracted text contains fewer than 50 characters, the document should be flagged as `FAILED` with a "No readable text found" error, prompting the user to upload a better quality scan.

## 7.3 Decision Rules
* If PyPDF2 detects that >90% of the pages are images (no embedded text), automatically route the file to the heavier OCR pipeline.

## 7.4 Failure Rules
* Exceptions during vector embedding must trigger a retry. Exceptions during text extraction on corrupted PDFs should fail permanently and notify the user.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

*(This service is the creator of the Document Context).*

## 8.1 Required Document Information
* Each chunk saved to the database MUST retain a reference to its original `page_number` to allow the frontend UI to jump to the correct page when citing sources.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Using Embeddings to prepare data for RAG.

## 9.4 AI Rules
* Embedding generation must be batched (e.g., sending 50 chunks at a time to the OpenAI API) to avoid rate limits and improve processing speed.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - This service primarily generates embeddings, not chat completions.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* The chunks produced here populate the Qdrant vector database.

## 11.2 Chunking Rules
* Max chunk size: 1000 tokens.
* Chunk overlap: 150 tokens.
* Metadata attached to each chunk in Qdrant: `workspace_id`, `document_id`, `page_number`.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* This entire service executes inside a Celery Worker. It is heavily CPU/IO bound.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `document_chunks` table (PostgreSQL).

## 13.5 Database Rules
* Ensure a one-to-many relationship: One `Document` has many `DocumentChunks`.

---

# 14. STORAGE REQUIREMENTS

## 14.2 File Formats
* Accepts `.pdf`, `.docx`, `.png`, `.jpg`.

---

# 15. API CONTRACT

*(API is limited to triggering the job and checking status)*

---

# 16. ERROR HANDLING

## Error Rules
* If the document is password protected, catch the specific exception and fail the job with a user-friendly message: "Document is password protected. Please remove the password and try again."

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* The Celery worker MUST query the `Document` using both `document_id` AND `workspace_id` to absolutely guarantee cross-tenant isolation during background processing.

## 17.3 Sensitive Data
* **Data Privacy:** Text extracted from the document exists temporarily in the worker's RAM. It must be written to PostgreSQL and Qdrant and then garbage collected. Do not log the raw text to standard output (Sentry/CloudWatch).

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The integrity of the `page_number` mapping is paramount. If chunking messes up the page numbers, citations in the UI will point the lawyer to the wrong page.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* 100-page digital PDFs should be text-extracted and vectorized in < 30 seconds.
* 100-page scanned PDFs requiring OCR may take up to 3 minutes.

## 20.2 Large Input Handling
* Documents over 500 pages must be processed in chunks, streaming the pages from S3 rather than loading a 2GB PDF entirely into RAM, which will crash the Celery worker.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/legal_document_analysis.py` | Core pipeline orchestration |
| Parsers        | `backend/app/services/parsers/` | PDF/Docx specific logic |
| Chunking       | `backend/app/services/chunking/` | Semantic splitters |

---

# 22. SERVICE CONNECTIONS

```text
[S3] ──(Stream PDF)──► [Analysis Service]
                              │
                              ├──► [OCR Service]
                              │
                              ├──► [Embedding Service (OpenAI)]
                              │
                              ├──► [Qdrant]
                              │
                              └──► [PostgreSQL]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log processing milestones clearly:
  * `INFO: [DocID] Started extraction`
  * `INFO: [DocID] Extracted 45 pages. Starting chunking.`
  * `INFO: [DocID] Generated 120 chunks. Starting vectorization.`
  * `INFO: [DocID] Completed processing.`

---

# 25. OBSERVABILITY

## Metrics
* Track `document_processing_time_seconds` as a histogram to monitor the performance of the pipeline.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Create dummy PDFs (one text-based, one image-based, one password-protected) and commit them to the `tests/fixtures/` folder. Test that the service correctly routes and handles each file type.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Scanned PDF with invisible text layer` | PyPDF2 might extract garbage text (e.g., `!@#$`). Implement a gibberish-detection heuristic (e.g., checking ratio of standard alphanumeric characters). If gibberish, force the OCR pipeline instead. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `CHUNK_SIZE` | Max tokens per chunk | No | `1000` |
| `CHUNK_OVERLAP`| Tokens to overlap | No | `150` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* The Celery workers handling this service require significant RAM (minimum 2GB per worker process) to parse large PDFs in memory.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Digital PDFs are correctly parsed into text.
* [ ] Text is chunked with semantic boundaries and 150-token overlaps.
* [ ] Embeddings are generated and saved to Qdrant with `workspace_id`.
* [ ] The Document DB status transitions from `PROCESSING` to `READY`.

---

# 32. DEFINITION OF DONE

The Legal Document Analysis service is **DONE** when a user can upload a standard 50-page legal contract, and within 30 seconds, the database and Qdrant are fully populated with perfectly vectorized chunks linked to correct page numbers.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Password protected, corrupted files).
3. **Repeated requests must not create unintended duplicate data.** (Check status before processing).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Transforms messy, raw uploaded files into clean, structured, AI-readable data.

## What the user sees
A progress bar transitioning their document from "Uploaded" to "Ready".

## What happens in the background
A heavy background worker streams the file from S3, parses the text, intelligently splits it into legal paragraphs, calls an LLM to generate mathematical vectors, and stores everything securely in the databases.

## What it receives
A Document ID.

## What it produces
Text chunks, Vector Embeddings, and Database status updates.

## Success means
The foundational data layer of the entire platform is solid, accurate, and retains critical metadata like page numbers so lawyers never lose context.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
