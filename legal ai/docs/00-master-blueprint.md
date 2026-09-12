# Legal AI Platform (Master Blueprint)

> **Purpose:** Complete implementation blueprint for the `Legal AI Platform`.
>
> This document is the authoritative specification for building this overarching platform. Developers must be able to understand **what the system does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform (Master Blueprint)`

## 1.2 Service ID

`sys-legal-ai-core-platform`

## 1.3 Service Category

`Full Application System (Core Legal / Document / Language / Indian Legal / Workspace / AI)`

## 1.4 Service Type

`Hybrid (User-facing / Backend / Background / Shared capabilities)`

## 1.5 Primary Responsibility

The platform must:

* Provide a unified **AI Legal Workspace** and **Document Workspace** for users to upload, manage, and interrogate legal documents.
* Execute **Core Legal Document Intelligence** (extraction, risk analysis, summarization, comparison, tracking, and drafting).
* Ensure **Accessibility & Indian Legal support** (regional language translation, plain-language simplification, court order OCR, and voice output).

The service must **not** own responsibilities belonging to external foundational AI model training (it must use external APIs via an AI Gateway).

## 1.6 Business Purpose

To democratize legal information and automate tedious legal review. It removes the friction of reading dense 40+ page documents by merging deep document intelligence with conversational AI, specifically tailored to overcome language and complexity barriers in the Indian legal context.

## 1.7 User Value

Users (citizens and legal professionals) gain instant understanding, risk assessment, and translation of complex legal documents without requiring deep legal expertise or fluency in formal legal English.

## 1.8 Final Outcome

A scalable web application where uploading a legal document instantly yields an interactive workspace containing summaries, extracted risks, obligations, regional translations, and a conversational AI chat assistant.

---

# 2. SCOPE

## 2.1 In Scope

* User Authentication, Workspace, and Document Management.
* Document Ingestion pipeline (PDF, DOCX, Scanned Images/OCR).
* Shared RAG and AI Provider Gateway infrastructure.
* Core Legal Intelligence Services (Analysis, Summary, Clauses, Risk, Compliance, Comparison, Q&A, Search, Obligations, Drafting).
* Language & Accessibility Services (Translation, Simple Explanation, Regional Output, Voice).
* Indian Legal Services (Judgments, Court Documents, Indian Legal Context).
* Trust & Safety guardrails (Citations, Disclaimers).

## 2.2 Out of Scope

* Providing certified, legally binding professional advice (must include disclaimers).
* Direct filing of documents to Indian courts.
* Training proprietary foundational LLMs from scratch.

## 2.3 Dependencies on Other Services

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AI Provider` | LLM text generation and analysis (Gemini/GPT/Claude) | Prompts, Document Chunks |
| `Object Storage` | Securely storing uploaded files | File blobs (PDF/DOCX/Images) |
| `Vector DB` | Semantic search and RAG retrieval | Text embeddings |
| `Relational DB` | Storing metadata, users, extracted entities | Structured application data |

## 2.4 Services Depending on This Service

As this is the master blueprint, the **User Frontend (React/Vite)** and **Background Workers (Celery)** directly consume the core backend described here.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

* AI Workspace (Home Page)
* Document Workspace

## 3.2 User Input

* Document Upload (PDF, DOCX, Images)
* Text Queries (Chat)
* Feature Triggers (e.g., "Analyze", "Translate to Tamil", "Find Risks")
* Voice Input (optional)

## 3.3 User Flow

```text
User Login & AI Workspace Entry
    ↓
Upload Document or Ask Question
    ↓
File Validation & Ingestion
    ↓
Background Processing (OCR, RAG, Extraction)
    ↓
Document Workspace Generation (Summary, Risks, Clauses)
    ↓
User Action (Chat, Translate, Compare)
```

## 3.4 User States

* Initial state: Empty workspace / Welcome chat prompt.
* Input state: Drag-and-drop file upload.
* Processing state: Loading indicators for document analysis.
* Success state: Interactive Document Workspace with sidebars for extracted data.
* Error state: Unsupported file format or API failure.

## 3.5 User-Visible Result

A clean dashboard displaying the Document Overview, AI Chat window, and dedicated sections for Risks, Clauses, Obligations, and Quick Actions.

---

# 4. SERVICE WORKFLOW

```text
INPUT (Document Upload / Chat Query)
  ↓
VALIDATION (Auth & File type checks)
  ↓
CONTEXT PREPARATION (Chunking, OCR)
  ↓
PROCESSING (Embedding, Indexing)
  ↓
AI / LOGIC (RAG Retrieval, Prompt Execution via AI Gateway)
  ↓
VALIDATION (Citation Verification, Safety checks)
  ↓
RESULT (Parsed JSON / Translated Text)
  ↓
STORAGE (PostgreSQL, Qdrant)
  ↓
API RESPONSE (Frontend UI update)
```

### Step 1 — Document Ingestion
**Purpose:** Accept and validate files.
**Input:** Raw File.
**Output:** File saved to Object Storage, Metadata in DB.
**Rules:** Must restrict file types and sizes.

### Step 2 — Background Pipeline
**Purpose:** Prepare document for AI.
**Input:** File reference.
**Output:** Text extracted, embedded, and stored in Qdrant.
**Rules:** Must trigger OCR if document is scanned.

### Step 3 — AI Orchestration
**Purpose:** Generate insights.
**Input:** Extracted Text/Vectors.
**Output:** Summary, Risks, Clauses.
**Rules:** Must route through AI Gateway, not hardcode a specific LLM.

---

# 5. INPUT CONTRACT

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `Auth Token` | `JWT` | Yes      | Must be valid and non-expired |
| `Payload` | `File/JSON` | Yes      | Must match endpoint schema |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `Language` | `String` | `English` | Must be a supported language (e.g., Tamil, Hindi) |

## 5.3 Input Validation Rules

* Supported formats: PDF, DOCX, JPG, PNG.
* Size limits: 50MB per document.
* Missing information: Handled gracefully via HTTP 400.
* Permission requirements: User must own the workspace/document.

---

# 6. OUTPUT CONTRACT

## 6.1 Primary Output

Structured legal intelligence (JSON) or rendered UI components representing analysis, chat responses, or drafted documents.

## 6.2 Output Structure

```text
Result
├── Status (Success/Error)
├── Main Result (Extracted Clauses, Chat Response, Summary)
├── Sources (Page/Section references)
├── Warnings (Disclaimers, Low Confidence markers)
└── Metadata (Tokens used, Timestamps)
```

## 6.3 Output Rules

* Output must be verifiable (include sources).
* Output must not contain hallucinated legal facts.
* Missing information must be stated as "Not found in document".

---

# 7. BUSINESS RULES

## 7.1 Core Rules

* The AI should not be directly tied to Gemini or GPT. It must use an AI Gateway.
* Every service must send its result back to the same Legal AI Workspace (unified UX).
* Documents must never be mixed across workspaces.

## 7.2 Validation Rules

* Verify workspace access before retrieving any document context.

## 7.3 Decision Rules

* If document has no selectable text, automatically route to OCR pipeline.

## 7.4 Failure Rules

* If AI provider fails, retry with exponential backoff or fallback to secondary provider (if configured).

## 7.5 Boundary Rules

* Maximum concurrent document processing per user is capped to prevent abuse.

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* Document ID
* Extracted text (Chunks)
* Pages and Sections
* Metadata (Parties, Dates)

## 8.2 Context Rules

* Always use the selected document version.
* Do not mix unrelated workspace documents.
* Preserve document/page/section references for source linking.
* Respect document permissions.

## 8.3 Section-Level Context

The platform supports operating on:
* Entire document (Summarization)
* Selected clauses (Rewriting/Explanation)
* Multiple documents (Comparison/Search)

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

To extract, analyze, summarize, translate, and chat about legal documents using provided context.

## 9.2 AI Input

RAG-retrieved chunks of the uploaded document, user query, and strict system prompts.

## 9.3 AI Output

Structured JSON (for backend parsing) or conversational text (for chat).

## 9.4 AI Rules

The AI must:
* Stay within the service's responsibility (e.g., do not translate if asked to summarize).
* Use supplied context exclusively.
* Clearly indicate uncertainty.
* Preserve important source references.

## 9.5 AI Provider Independence

```text
Platform Services
   ↓
AI Gateway
   ↓
Provider Adapter
   ↓
Selected AI Provider (Gemini / GPT / Claude)
```
The service must continue working if the underlying provider changes.

## 9.6 Model Requirements

* Context requirements: Minimum 128k context window preferred for long contracts.
* Output requirements: Must support structured JSON output formatting reliably.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Instructions

Must enforce legal neutrality, plain-language principles, and strict adherence to context.

## 10.2 Task Instructions

Specific instructions per capability (e.g., "Extract only termination clauses").

## 10.3 Context Instructions

"Use the following document chunks to answer. If the answer is not present, say so."

## 10.4 Output Instructions

Enforce specific JSON schemas or markdown formatting.

## 10.5 Safety Instructions

"Do not provide binding legal advice. Append a disclaimer if interpreting laws."

## 10.6 Prompt Versioning

Prompts must be version-controlled in the codebase alongside the API routes.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Sources

Uploaded user documents, and potentially loaded Indian legal statutes (Acts, Rules).

## 11.2 Retrieval Requirements

* Must use semantic vector search (Qdrant) combined with exact metadata filtering (PostgreSQL).

## 11.3 Source Rules

Retrieved information must remain traceable to its original document and page number.

## 11.4 Context Rules

Irrelevant retrieved chunks must be ignored by the LLM.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* OCR Extraction
* Document Chunking & Embedding
* Proactive Risk/Clause Analysis
* Heavy Translation Jobs

## 12.2 Processing Trigger

File upload or asynchronous user request via API.

## 12.3 Processing Status

```text
Pending → Processing → Completed / Failed
```

## 12.4 Retry Rules

* Max 3 retries for transient API failures.
* Fail permanently on unreadable/corrupted files.

## 12.5 Idempotency

Uploading the exact same file hash should ideally link to the existing processed asset if within the same workspace, or re-run cleanly without duplicating metadata.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

Users, Workspaces, Documents, Extracted Clauses, Risks, Chat History, Audit Logs.

## 13.2 Read Data

N/A (Top level owns everything).

## 13.3 Written Data

All platform metadata.

## 13.4 Database Entities

| Entity     | Ownership   | Purpose     |
| ---------- | ----------- | ----------- |
| `Workspace`| `Core` | Logical grouping of documents |
| `Document` | `Core` | File metadata and status |
| `Clause` | `Intelligence` | Extracted contract clauses |

## 13.5 Database Rules

* Maintain workspace/user isolation at all times.
* Do not duplicate authoritative data unnecessarily.

---

# 14. STORAGE REQUIREMENTS

## 14.1 Stored Objects

* Original Documents (PDF/DOCX/IMG)
* Generated Documents (Drafts)
* Page Images (for UI rendering)

## 14.2 Storage Rules

* Ownership: Tied to Workspace ID.
* Access permissions: Pre-signed URLs for frontend access.

---

# 15. API CONTRACT

## 15.1 API List (High Level)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/documents` | Upload and trigger ingestion |
| `GET` | `/api/v1/documents/{id}/analysis` | Retrieve extracted risks/clauses |
| `POST` | `/api/v1/chat` | Send message to AI assistant |
| `POST` | `/api/v1/documents/{id}/translation` | Request translation |

## 15.2 API Request

* Authentication: Bearer JWT.
* Authorization: Workspace RBAC checks.

## 15.3 API Response

* Success: HTTP 200 with JSON payload.
* Error: HTTP 400 (Bad Request), HTTP 401/403 (Auth), HTTP 500 (Server Error).

## 15.4 API Rules

* APIs must be versioned (`/api/v1/`).
* Never expose internal AI prompts or API keys to the frontend.

---

# 16. ERROR HANDLING

| Error | Cause | User Result | Recovery |
| --- | --- | --- | --- |
| `FILE_UNSUPPORTED` | Invalid format | "File format not supported" | Upload different file |
| `AI_TIMEOUT` | Provider slow | "Analysis taking longer than expected" | Retry later |

## Error Rules

Must distinguish between User Errors (invalid input) and System Errors (AI failure, DB failure).

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Roles: Admin, Manager, Lawyer, Reviewer, Viewer.

## 17.2 Data Isolation

User and workspace data must never cross unauthorized boundaries (Tenant Isolation).

## 17.3 Sensitive Data

Legal contracts contain highly confidential information.

## 17.4 Security Rules

* Validate all external input.
* Enforce authorization on backend via dependencies.
* Never expose AI credentials.

---

# 18. SOURCE & TRACEABILITY

## 18.1 Source Types

* Document Pages
* Specific Clauses

## 18.2 Source Requirements

Every important generated finding (Risk, Obligation, Summary point) must have a source citation linking to the document.

## 18.3 Missing Source Behavior

Indicate "Generated via general legal knowledge" or "No direct source found in text".

---

# 19. LEGAL SAFETY

## 19.1 Accuracy

Must accurately reflect the text of the uploaded document without altering facts.

## 19.2 Uncertainty

If the AI is unsure, it must state "The document is ambiguous regarding..."

## 19.3 Unsupported Claims

The service must not present unsupported AI-generated information as verified fact.

## 19.4 Disclaimer Requirements

A persistent UI disclaimer: *"AI output is informational and not a substitute for professional legal advice."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Chat API: Streamed responses (< 2s time to first token).
* Document Analysis: Async (Background job, UI polling/websockets).

## 20.2 Large Input Handling

Files > 50 pages must be heavily chunked and handled entirely via background Celery workers.

## 20.3 Concurrent Usage

Scalable via Docker, load balancers, and Redis queues.

---

# 21. FOLDER STRUCTURE

```text
project/
├── frontend/
│   └── src/ (React, Zustand, Tailwind)
├── backend/
│   ├── api/ (FastAPI routers)
│   ├── services/ (Core logic, Teams 1 & 2 logic)
│   ├── ai/ (AI Gateway, Prompt management)
│   └── workers/ (Celery tasks)
└── docs/
    └── 00-master-blueprint.md
```

---

# 22. SERVICE CONNECTIONS

```text
[Frontend UI]
     ↓ (HTTP / WebSockets)
[FastAPI Backend]
     ↓ (Celery/Redis)
[Background Workers]
     ↓ (AI Gateway)
[Gemini / GPT / Claude]
```

---

# 23. EVENTS

## Events Produced

| Event | Consumers | Purpose |
| --- | --- | --- |
| `document.uploaded` | Celery Worker | Trigger OCR/RAG pipeline |
| `analysis.completed` | Websocket Manager | Notify UI of completion |

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

Log API requests, AI gateway latency, and errors.

## 24.2 Audit Logging

Track document uploads, deletions, and major workspace modifications for legal compliance.

## 24.3 Sensitive Data Rules

Logs must **never** contain the raw text of legal documents, passwords, or PII.

---

# 25. OBSERVABILITY

## Metrics

* Request count & AI Token usage.
* Success/Failure rate of OCR and RAG extraction.

## Health

`/health` endpoint verifying DB, Redis, and Qdrant connectivity.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

Test all parsing, chunking, and validation logic via `pytest`.

## 26.2 Integration Testing

Test AI Gateway fallbacks, DB transactions, and API endpoints.

## 26.3 End-to-End Testing

Test the full flow: Upload → Analysis → Chat via `Playwright`.

## 26.4 AI Testing

Test for hallucination resistance and source citation correctness.

---

# 27. EDGE CASES

| Case | Expected Behavior |
| --- | --- |
| Hand-written document | Pass to advanced OCR, flag low confidence |
| Encrypted PDF | Fail early with "Please remove password protection" |
| Contradictory clauses | AI highlights both and flags the conflict |

---

# 28. VERSIONING

## Service Version: `1.0.0`
## API Version: `v1`
## Compatibility Rules

Database migrations (Alembic) must be backwards compatible where possible.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `AI_PROVIDER` | Selected LLM backend | Yes | `gemini` |
| `MAX_FILE_SIZE` | Upload limit | No | `50MB` |
| `JWT_SECRET` | Auth encryption | Yes | - |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* Python 3.12+, Node.js 20+

## Environment Requirements

* Docker + Docker Compose (Local/Dev)
* AWS/GCP Kubernetes or ECS (Prod)

## External Dependencies

* PostgreSQL, Redis, Qdrant, S3

---

# 31. ACCEPTANCE CRITERIA

* [ ] Document upload and parsing works reliably.
* [ ] RAG pipeline correctly embeds and retrieves chunks.
* [ ] AI Gateway successfully routes to providers without hardcoding.
* [ ] Frontend AI Chat successfully answers questions with source citations.
* [ ] Background jobs successfully process large PDFs asynchronously.
* [ ] Indian Legal features (Translations, Judgments) are integrated into the main workspace.

---

# 32. DEFINITION OF DONE

This platform blueprint is **DONE** when all underlying 23 services are implemented according to these exact guidelines, tested, and communicating successfully through the centralized AI Workspace without duplicating common platform capabilities.

---

# 33. IMPLEMENTATION RULES

1. **Do not duplicate common platform capabilities.** (e.g., OCR is built once).
2. **Keep business logic inside the service responsible for it.**
3. **Frontend must not contain authoritative business logic.**
4. **Frontend must not directly depend on AI-provider credentials.**
5. **AI providers must remain replaceable via the AI Gateway.**
6. **Important AI results must remain traceable where possible.**
7. **Secrets must never be committed to source control.**

---

# 34. SERVICE DEPENDENCY MAP

```text
                    [FRONTEND WORKSPACE]
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
    [Team 1 Services] [Team 2 Services] [Common Services]
              │            │            │
              └────────────┼────────────┘
                           ↓
                   [SHARED AI GATEWAY]
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
            [Postgres] [Qdrant]    [Storage]
```

---

# 35. FINAL SERVICE SUMMARY

## What it does
The Legal AI Platform is a comprehensive system that allows users to upload complex legal documents and interact with them via AI to extract insights, detect risks, translate content, and manage obligations.

## What the user sees
A unified AI and Document Workspace where they can chat, view document summaries, and trigger actions like translation or simplification.

## What happens in the background
Documents are ingested, OCR'd, chunked, and embedded into a vector database. Background tasks orchestrate AI calls to generate insights proactively.

## What it receives
Legal documents (PDFs, Images, DOCX) and user text/voice queries.

## What it produces
Structured legal intelligence (JSON), translated texts, and conversational answers with citations.

## Success means
Users can reliably upload a document and instantly interact with its contents accurately, safely, and in their preferred language.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
