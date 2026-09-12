# Legal AI Platform (OCR & Text Extraction)

> **Purpose:** Complete implementation blueprint for `OCR & Text Extraction`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - OCR & Text Extraction`

## 1.2 Service ID

`sys-common-ocr-extraction`

## 1.3 Service Category

`Common Infrastructure`

## 1.4 Service Type

`Background Worker Pipeline`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The OCR & Text Extraction service must:

* Download the raw binary document (PDF, Image, DOCX) from secure cloud storage (S3) when triggered by an upload event.
* Determine if the document is a "native text" file (like a DOCX) or a "scanned image" file (like a scanned PDF).
* Apply Optical Character Recognition (OCR) to extract text from images, maintaining spatial relationships, reading order, and identifying structural elements (tables, headers, signatures).
* Output structured raw text blocks and save them to the `document_chunks` table for downstream AI processing.

The service must **not** perform vector embedding (Handled by RAG engine) or summarize the document (Handled by Legal Document Analysis). It purely converts pixels/bytes into readable text.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
AI models cannot read pixels; they require text strings. Legal documents are notoriously messy—often crooked, low-resolution scans of 20-year-old paper contracts with coffee stains. This service acts as the platform's "eyes," performing the heavy lifting of digitizing analog documents so the AI can actually read them. Without this, the entire AI platform is useless.

## 1.7 User Value

Explain what the user gains from this service.
The magical ability to upload a terrible, unsearchable photo of a contract and instantly be able to run deep AI analysis on it.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background task that consumes an S3 file, routes it through an OCR engine (e.g., AWS Textract or Azure Document Intelligence), and populates the `document_chunks` database table with the extracted text.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Multi-format support (PDF, JPEG, PNG, TIFF, DOCX, TXT).
* OCR orchestration (Calling 3rd-party OCR APIs).
* Layout analysis (Preserving the reading order of two-column documents).
* Table extraction (Converting visual grids into Markdown tables or CSV structures).
* Handwriting recognition (if supported by the chosen OCR provider).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Semantic chunking for vector search (This service just provides raw structural blocks; the RAG engine decides how to chunk them semantically).
* Virus scanning (Handled by Upload & Ingestion).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Object Storage (S3)` | To fetch the file | Binary File |
| `OCR Provider (e.g., AWS Textract)` | To perform computer vision | Raw Images |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Legal Document Analysis**, **RAG Engine**, **Document Comparison** (Every AI service relies on the text extracted here).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User uploads a file. The OCR process happens invisibly in the background.

## 3.2 User Input
N/A (Automated).

## 3.3 User Flow

```text
User uploads file.
  ↓
Upload Service fires `DocumentUploadedEvent`.
  ↓
UI shows: "Extracting Text..."
  ↓
Celery Worker picks up event, downloads file, runs OCR.
  ↓
Worker saves text to DB and fires `TextExtractionCompleteEvent`.
  ↓
UI shows: "Analyzing Document..."
```

## 3.4 User States
* `Extracting Text`

## 3.5 User-Visible Result
The document becomes fully searchable and the AI features unlock.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### OCR Pipeline Workflow

```text
CELERY WORKER receives `extract_text(document_id)`
  ↓
Fetch `s3_uri` from `documents` table.
Download file from S3 to temporary local disk.
  ↓
Determine File Type:
  - If Native Text (TXT, DOCX): Use Python libraries (`python-docx`, `PyMuPDF`) to extract text directly (Fast, cheap).
  - If Scanned Image/PDF: Send to OCR Provider (AWS Textract / Azure Form Recognizer).
  ↓
Receive OCR Payload (Bounding boxes, Text blocks, Tables).
  ↓
Flatten/Normalize the payload into linear structural blocks (Paragraphs, Headers, Tables).
  ↓
Save blocks to `document_chunks` table in PostgreSQL.
Mark `Document` status as `TEXT_EXTRACTED`.
  ↓
Publish `TextExtractionCompleteEvent`.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Must have status `UPLOADED` |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must fail gracefully if the file in S3 is corrupted or missing.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database rows representing the structural blocks of the document.

## 6.2 Output Structure
```json
// Example of a single row inserted into document_chunks
{
  "chunk_id": "uuid",
  "document_id": "uuid",
  "page_number": 1,
  "chunk_sequence": 14,
  "chunk_type": "PARAGRAPH", // e.g., HEADER, PARAGRAPH, TABLE
  "text_content": "The tenant agrees to pay..."
}
```

## 6.3 Output Rules
* Tables must be extracted and serialized into a readable text format (like Markdown tables) so that downstream LLMs can understand the relationships between columns and rows.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Layout Preservation:** Legal documents often use two-column layouts. The OCR engine MUST be configured to read left-to-right, top-to-bottom *within* columns, not straight across the page (which produces unreadable gibberish).
* **Native Text Priority:** OCR is expensive and slow. If a PDF contains native text layers (e.g., a PDF exported directly from MS Word), the service MUST extract the native text rather than rendering it to an image and paying for OCR, unless the native text is detected as corrupted/garbage.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a document is > 100 pages, the OCR process should be batched or executed asynchronously with the OCR provider to avoid Celery worker timeouts.

## 7.4 Failure Rules
* If OCR fails (e.g., the scan is entirely black), mark `Document` status as `FAILED_EXTRACTION` so the UI can prompt the user to upload a better scan.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* This service creates the foundational document context.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Computer Vision (CV) and Optical Character Recognition (OCR).

## 9.4 AI Rules
* Do not attempt to build a custom OCR engine. Use enterprise-grade Managed Services (AWS Textract, Azure Document Intelligence, or Google Cloud Document AI). They are vastly superior at handling messy, rotated, noisy legal scans than open-source tools like Tesseract.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - Uses standard OCR API parameters, not generative LLM prompts.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* This entire service is a background task. OCR on a 50-page PDF can take 15-30 seconds.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `document_chunks` table (Writing the raw structural blocks).

## 13.5 Database Rules
* `chunk_sequence` must be strictly monotonically increasing. If the sequencing is wrong, the AI will read the contract out of order.

---

# 14. STORAGE REQUIREMENTS

## 14.1 S3 / Blob Storage
* Requires temporary local disk storage on the Celery worker to hold the file while parsing, which must be aggressively cleaned up after processing to prevent disk-full errors.

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* None directly. It consumes events from the queue.

---

# 16. ERROR HANDLING

## Error Rules
* See 7.4. Catch `PdfReadError` (corrupted files) and update the database status so the user isn't stuck watching an endless "Extracting..." spinner.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* The Celery worker must use IAM credentials strictly scoped to the `legal-ai-bucket` to download the file.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The OCR provider usually returns bounding box coordinates (X, Y) for every word. While storing this for every word is too database-heavy, the service MUST store the bounding box of the overall `chunk` in the database. This allows the Frontend UI to highlight the exact paragraph on the PDF image when a user clicks a citation link.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Target `< 1 second per page` for OCR processing.

## 20.2 Large Input Handling
* Utilize the Async/Batch APIs of the chosen OCR provider for documents > 50 pages, pausing the Celery task and waiting for a webhook from the OCR provider to resume.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Worker Logic   | `backend/app/workers/text_extraction.py` | Celery Task |
| OCR Client     | `backend/app/core/ocr_client.py` | AWS/Azure Integration |

---

# 22. SERVICE CONNECTIONS

```text
[Message Broker] ──► [Celery Worker] ──► [S3] (Download file)
                             │
                             ├──► [OCR Provider API] (e.g., Azure Document Intelligence)
                             │
                             └──► [PostgreSQL] (Save chunks, update status)
                                      │
                                      └──► Publish `TextExtractionCompleteEvent`
```

---

# 23. EVENTS

## 23.1 Emitted Events
* `TextExtractionCompleteEvent`: Consumed by the RAG chunking service and the Legal Document Analysis service.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Extracted Doc 123. Type: SCANNED_PDF. Pages: 45. Time: 28s. Structural Blocks: 450.`

---

# 25. OBSERVABILITY

## Metrics
* Track `ocr_pages_processed` (crucial for monitoring billing costs from the OCR provider).
* Track `ocr_native_vs_scanned_ratio`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Layout Parsing:** Mock the JSON response from an OCR provider containing a two-column layout. Assert the flattening algorithm reads the left column completely before reading the right column.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Watermarks / Stamps` | "DRAFT" watermarks diagonally across a page often confuse OCR engines. The service should rely on OCR provider features to filter out background watermarks so they don't break up legitimate sentences. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `OCR_PROVIDER` | Which API to use | Yes | `azure_document_intelligence` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Celery workers performing text extraction need sufficient RAM (e.g., 2GB+) as loading a 100-page PDF into memory with `PyMuPDF` can consume significant resources.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Extracts native text from DOCX/PDF instantly.
* [ ] Routes scanned images to OCR provider successfully.
* [ ] Converts tables into Markdown format.
* [ ] Maintains correct reading order for multi-column documents.

---

# 32. DEFINITION OF DONE

The OCR & Text Extraction service is **DONE** when a user can upload a crooked smartphone photo of an NDA, and 5 seconds later, the AI platform can perfectly read and analyze the text within it.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Do not generate embeddings here).
2. **Unsupported input must fail safely.** (Detect corrupt files early).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the "eyes" for the AI, converting raw files and messy images into structured, readable text.

## What the user sees
Nothing directly, other than a seamless transition from "Uploaded" to "Ready for Analysis".

## What happens in the background
A background worker downloads the file, determines if it's native text or a scan, routes it to an enterprise OCR API if necessary, normalizes the reading order, extracts tables, and saves the foundational text blocks to the database.

## What it receives
Event triggers containing Document IDs.

## What it produces
Structured text blocks (`document_chunks`) and downstream events.

## Success means
The platform can ingest any analog or digital legal document flawlessly, bridging the gap between paper contracts and advanced AI.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
