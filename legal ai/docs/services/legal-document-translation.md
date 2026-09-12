# Legal AI Platform (Legal Document Translation)

> **Purpose:** Complete implementation blueprint for `Legal Document Translation`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Document Translation`

## 1.2 Service ID

`sys-legal-translation-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Document Translation service must:

* Read the extracted text chunks of a processed legal document in its source language.
* Orchestrate LLM calls to translate the text into a target language while strictly preserving legal nuances, defined terms, and formatting.
* Handle massive documents by translating chunk-by-chunk and managing context overlap to ensure consistency across the document.
* Output a new translated Document entity that is permanently linked as a "child" or "translation" of the original source Document.

The service must **not** provide certified, legally binding translations (this requires a human notary) or translate raw audio/video files.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Global business requires contracts in multiple languages. Standard machine translation (like Google Translate) often translates legal idioms literally, changing the binding meaning of the contract. Hiring specialized legal translators takes weeks and costs thousands of dollars. This service provides near-human legal translation in minutes, allowing lawyers to instantly understand foreign contracts or prepare first-draft translations for international deals.

## 1.7 User Value

Explain what the user gains from this service.
Instant cross-border capabilities. A lawyer in London can upload a 100-page lease written in Japanese, click a button, and read a fluent English version of it 3 minutes later, complete with side-by-side comparisons.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that iterates through document chunks, uses a specialized translation prompt via the AI Gateway, and stores the translated text as a new, linked Document in PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Chunk-by-chunk translation logic.
* Overlapping context windows (passing the previous chunk to the AI so it knows how a sentence started).
* Terminology consistency (ensuring "La Empresa" is consistently translated as "The Company" and not "The Enterprise" in later pages).
* Creating a new Document object.
* Emitting progress events to the frontend via WebSockets.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Formatting a new PDF with images and tables perfectly aligned (The system outputs Markdown/Text; layout recreation is handled by a separate Document Export service).
* Certifying the translation for court use.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch original chunks | Source text |
| `AIGateway` | To perform the translation | Translated text |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend Document Viewer** (to display the dual-pane view).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user clicks a "Translate" button on an existing document and selects a target language.

## 3.2 User Input
Target language (e.g., "Spanish").

## 3.3 User Flow

```text
User selects "French" and clicks Translate.
  ↓
UI shows a progress bar: "Translating Page 1 of 50..."
  ↓
Service processes chunks in the background, updating progress.
  ↓
Service finishes and creates Document B.
  ↓
UI refreshes, showing a dual-pane viewer: Japanese on the left, English on the right, scrolling in sync.
```

## 3.4 User States
* `Translating (Progress: X%)`
* `Completed`

## 3.5 User-Visible Result
A newly generated document in the target language, viewable side-by-side with the original.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Chunk Translation Workflow

```text
CELERY WORKER receives `translate_document(source_doc_id, target_lang)`
  ↓
Create new Document record: `target_doc` (status=PROCESSING, linked to `source_doc_id`).
  ↓
Fetch all text chunks for `source_doc_id`.
  ↓
Initialize Terminology Glossary (Empty dict).
  ↓
For each chunk (Sequential processing required for glossary consistency):
  Construct Prompt:
    System: "Translate this legal text to {target_lang}. Preserve tone and formatting."
    Context (Previous Chunk): "..."
    Glossary (From previous chunks): "..."
    Target Text: [chunk.text]
  ↓
  Send Prompt to AI Gateway.
  ↓
  Parse AI response (Translated Text + Any new defined terms to add to Glossary).
  ↓
  Save to `target_doc` chunks.
  Update Progress Tracker (Redis).
  ↓
Mark `target_doc` as READY.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `source_document_id` | `UUID` | Yes | Must have status `READY` |
| `target_language` | `String` | Yes | Standard ISO code or name (e.g., "es", "Spanish") |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `glossary`| `JSON`   | `{}` | User-provided overrides (e.g., `{"Empresa": "Acme Corp"}`) |

## 5.3 Input Validation Rules
* Must raise `DocumentNotReadyError` if chunks have not been extracted from the source document.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A new Document record in the database.

## 6.2 Output Structure
```json
{
  "translation_job_id": "uuid",
  "source_document_id": "uuid",
  "target_document_id": "uuid",
  "target_language": "Spanish",
  "status": "COMPLETED",
  "total_chunks_processed": 145
}
```

## 6.3 Output Rules
* The newly created `target_document_id` must have a metadata flag indicating it is an AI Translation and a foreign key pointing to the `source_document_id`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Legal Nuance over Literal Translation:** The LLM must be explicitly instructed to prioritize legal meaning over literal word-for-word translation. If a French idiom means "Force Majeure", it must translate it to the legal term "Force Majeure", not "Superior Force".
* **Chunk Synchronization:** The generated translated chunks MUST map exactly 1:1 with the source chunks. If source Chunk A is paragraph 1, translated Chunk A must be the translation of paragraph 1. This is required for the UI's dual-pane synchronized scrolling.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If the user provides a custom `glossary`, those terms MUST override the AI's natural translation choices.

## 7.4 Failure Rules
* If translation of Chunk 54 fails after 3 retries, the entire job must be marked as `FAILED`, and the partial `target_document` should be cleaned up (deleted) to prevent users from relying on half-translated contracts.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* This service creates entirely new `document_chunks`. It requires the `chunk_sequence` and `page_number` from the source document to perfectly recreate the structure in the target document.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Cross-lingual translation and legal terminology mapping.

## 9.4 AI Rules
* Use a high-tier model (e.g., GPT-4o or Claude 3.5 Sonnet). Do NOT use legacy translation APIs (like standard Google Translate) because they lack the ability to accept system prompts enforcing legal tone and dynamic glossaries.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert, bilingual legal translator. Your task is to translate the provided legal text into {target_language}.
CRITICAL RULES:
1. Preserve the exact legal meaning and tone. Use standard legal terminology for the target language.
2. Ensure absolute consistency with the provided Glossary.
3. Preserve all Markdown formatting, bullet points, and numbering exactly as they appear in the source.
4. Output ONLY the translated text. Do not include commentary.
```

## 10.2 User Prompt
```text
GLOSSARY:
{glossary_json}

PREVIOUS CONTEXT (For reference only, do not translate):
{previous_chunk_text}

TEXT TO TRANSLATE:
{source_text}
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - This is a direct sequential translation task.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task. Translating a 100-page document chunk-by-chunk will require dozens of LLM calls and will take 1-3 minutes.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* No entirely new tables. Re-uses the core `documents` and `document_chunks` tables, creating new records.

## 13.5 Database Rules
* The core `documents` table must have a `parent_document_id` column to support this service. If `parent_document_id` is not null, the UI knows this is a translation or derivative of another file.

---

# 14. STORAGE REQUIREMENTS

N/A - The service operates on text in the database.

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/translate` (Starts job, returns Job ID)
* `GET /api/v1/workspaces/{id}/translation-jobs/{job_id}` (Check progress status)

---

# 16. ERROR HANDLING

## Error Rules
* See 7.4. Atomic failure is required. Do not leave partially translated documents in the database.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before reading the source document and before creating the new translated document.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The 1:1 chunk mapping (See 7.1) is the source traceability. Every translated chunk implicitly points back to the source chunk with the exact same sequence number.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI MUST watermark or display a banner on translated documents: *"This is an AI-generated translation provided for convenience. It is not a certified legal translation and should not be used as the binding version of the contract."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution time: Target < 3 minutes for a 50-page document.

## 20.2 Large Input Handling
* **Batching vs Consistency:** While translating chunks concurrently via `asyncio` is faster, it breaks the ability to maintain a dynamic Glossary (where the AI decides how to translate a new term on Page 1 and passes that decision to Page 2).
* **Compromise:** Run concurrently in batches of 5 pages, passing the static User Glossary, but accepting that the AI might use slightly different synonyms across batches. For ultimate consistency, sequential processing is required, though slower.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/document_translation.py` | Orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository] (Fetch source)
       │
       ├──► [AIGateway] (Translate)
       │
       └──► [DocumentRepository] (Create new document & chunks)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Translation Job 123 (Doc A -> Spanish) completed. 145 chunks processed in 125 seconds.`

---

# 25. OBSERVABILITY

## Metrics
* Track `translation_target_languages` to see which languages are most popular, informing future prompt optimizations.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Feed a mock chunk to the service with a Glossary override (`{"Apple": "Manzana"}`). Mock the AI response. Assert that the resulting target chunk replaces the text according to the glossary.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Mixed Language Source` | A document might already contain both English and Spanish paragraphs. The AI must be prompted to recognize text already in the `target_language` and simply pass it through unaltered, rather than attempting to translate Spanish into Spanish. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `TRANSLATION_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Translates documents chunk-by-chunk while preserving formatting.
* [ ] Adheres strictly to user-provided glossaries.
* [ ] Maintains a 1:1 structural mapping between source and translated chunks.
* [ ] Cleans up gracefully if the job fails midway.

---

# 32. DEFINITION OF DONE

The Legal Document Translation service is **DONE** when a user can upload a Chinese supplier contract, hit translate, and 2 minutes later read a fluent English version of it with paragraphs aligned side-by-side with the original text.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Clean up partial documents).
3. **Database ownership must be explicit.** (Translations are children of the source document).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as a highly specialized, bilingual legal translator that can process massive documents.

## What the user sees
A progress bar followed by a beautiful dual-pane viewer showing their original document alongside the new translation.

## What happens in the background
The service iterates through the source document's chunks, using an LLM configured for legal translation to preserve nuanced terminology, and builds a brand new "child" Document in the database perfectly synchronized with the original's structure.

## What it receives
A Source Document ID and a Target Language.

## What it produces
A new Document ID representing the translation.

## Success means
International legal teams can collaborate instantly on documents without waiting days for expensive translation agencies to return first drafts.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
