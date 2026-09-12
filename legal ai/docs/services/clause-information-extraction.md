# Legal AI Platform (Clause Information Extraction)

> **Purpose:** Complete implementation blueprint for `Clause Information Extraction`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Clause Information Extraction`

## 1.2 Service ID

`sys-clause-extraction-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Clause Information Extraction service must:

* Scan the text chunks of a processed legal document and identify specific, standardized legal clauses (e.g., *Indemnification*, *Limitation of Liability*, *Termination for Convenience*).
* Extract precise data points from within those clauses (e.g., "Notice Period = 30 Days", "Liability Cap = $1,000,000").
* Store these identified clauses as structured data linked to their original text chunk so the frontend UI can highlight them in the PDF viewer.

The service must **not** determine if a clause is "good" or "bad" for the user (that belongs to Legal Risk Detection).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
A contract is essentially a database of obligations and rules, but it is written as unstructured paragraphs. This service converts the unstructured text into a highly structured database. Without this, a lawyer has to manually read 50 pages just to answer "What is the liability cap?". With this service, that data point is instantly available in a dashboard table.

## 1.7 User Value

Explain what the user gains from this service.
Granular control and visibility. They can instantly filter a massive contract to see only the "Confidentiality" terms, or view a dashboard summarizing the specific financial obligations embedded deep within the text.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that prompts the AI Gateway to classify and extract clauses from a document, saving the results as structured JSON linked to specific text chunks in PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Iterating over document text chunks.
* Calling the AI Gateway for Named Entity Recognition (NER) and Classification.
* Standardizing clause types into a known taxonomy (e.g., mapping "Hold Harmless" to `INDEMNIFICATION`).
* Extracting structured key-value pairs from the text.
* Saving the mapping between the structured data and the raw text chunk ID.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vectorizing the text (Handled by Legal Document Analysis).
* Generating summaries (Handled by Legal Document Summarization).
* Providing legal advice or risk scores based on the extracted data.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch document text chunks | Text Chunks |
| `AIGateway` | To execute classification prompts | JSON responses |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Document Comparison**, **Compliance Checking**, and **Legal Risk Detection** all heavily rely on this structured data.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User clicks "Extract Clauses" on a document, or it is run automatically via an upload workflow.

## 3.2 User Input
A button click.

## 3.3 User Flow

```text
User triggers Extraction
  ↓
UI shows "Scanning for Clauses..."
  ↓
Service passes chunks to AI to identify clause boundaries and types.
  ↓
Service saves structured data to the database.
  ↓
UI updates: The document viewer now has highlights. Clicking a highlight shows a sidebar with the exact data (e.g., "Liability Cap: $500k").
```

## 3.4 User States
* `Scanning`
* `Completed`

## 3.5 User-Visible Result
A structured table of clauses and interactive highlights layered over the original document text.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Extraction Workflow

```text
CELERY WORKER receives `extract_clauses(doc_id)`
  ↓
Fetch all text chunks for `doc_id`.
  ↓
Group chunks into logical pages/sections.
  ↓
For each group:
  Send Prompt to AI Gateway: "Identify any of the following clause types in this text: [List of Types]. Extract relevant parameters."
  ↓
Parse AI JSON response.
  ↓
For each identified clause:
  Map it to the exact `chunk_id` where it was found.
  Save to `ExtractedClause` database table.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Document must have status `READY` |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `clause_types`| `Array`  | `ALL`       | Specific clauses to look for (e.g., `["TERMINATION"]`) |

## 5.3 Input Validation Rules
* Must raise `DocumentNotReadyError` if the raw text has not been extracted yet.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database rows linking extracted data to document chunks.

## 6.2 Output Structure
```json
{
  "id": "uuid",
  "document_id": "uuid",
  "chunk_id": "uuid",
  "clause_type": "LIMITATION_OF_LIABILITY",
  "extracted_text": "In no event shall either party be liable for more than $1,000,000...",
  "parameters": {
    "cap_amount": 1000000,
    "currency": "USD",
    "exceptions": ["gross negligence", "fraud"]
  }
}
```

## 6.3 Output Rules
* The output MUST strictly adhere to the defined Clause Taxonomy. The AI cannot invent a new `clause_type` like `SPECIAL_LIABILITY_THING`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Strict Taxonomy:** The system must maintain a hardcoded, versioned taxonomy of recognized clause types (e.g., `Enum` in Python). The LLM prompt must force the AI to select only from this list.
* **Traceability:** Every single extracted fact MUST be linked to a `chunk_id`. The user must always be able to click an extracted fact and see the original text highlighting the exact sentence where the AI found it.

## 7.2 Validation Rules
* If the AI returns a `cap_amount` of "One million dollars", Pydantic must coerce this into a numeric `1000000` or throw a validation error to trigger an AI retry.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* If the AI hallucinates a clause type not in the Taxonomy, the service must drop that specific clause from the output and log a warning, rather than failing the entire document extraction.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Requires perfect synchronization with `DocumentChunks`. If chunks are deleted or re-processed, the associated `ExtractedClauses` must cascade delete.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Classification and Named Entity Recognition (NER).

## 9.4 AI Rules
* Use OpenAI's "Structured Outputs" (or equivalent JSON-schema enforcement) to guarantee the LLM returns the exact Pydantic schema required.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a precision legal data extraction tool.
Your job is to scan the provided text and identify any clauses matching the provided Taxonomy.
If you find a match, extract the exact text of the clause and populate the specific parameters required for that clause type.
Do not infer or guess parameters. If a parameter is not explicitly stated, return null.
You MUST output valid JSON matching the provided JSON Schema.
```

## 10.4 Prompt Rules
* The prompt must dynamically inject the JSON Schema of the specific clauses the user is looking for to guide the LLM's output.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - This uses direct prompting on the chunks, not vector search.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task. Since scanning every chunk of a 200-page document is expensive, this should run asynchronously.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `extracted_clauses` table.

## 13.5 Database Rules
* The `parameters` column must be `JSONB` to accommodate the fact that a `TERMINATION` clause has different parameters (e.g., `notice_period`) than a `LIABILITY` clause (e.g., `cap_amount`).

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/extract-clauses`
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/clauses`

---

# 16. ERROR HANDLING

## Error Rules
* See 7.4. Handle LLM hallucinations gracefully by dropping invalid items rather than crashing.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before querying chunks or saving extracted data.

---

# 18. SOURCE & TRACEABILITY

*(See 7.1 Traceability)*. This is the most critical feature of this service.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must clarify that the AI may miss clauses. "This automated extraction is for convenience and does not guarantee the identification of all obligations."

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution time varies wildly based on document size. Target is < 2 seconds per page processed.

## 20.2 Large Input Handling
* **Batching:** Send chunks to the AI Gateway in batches (e.g., 5 chunks at a time) to minimize API latency while staying within the LLM context limits.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/clause_extraction.py` | Orchestration |
| Taxonomy       | `backend/app/schemas/taxonomy.py` | Clause Definitions & Schemas |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository]
       │
       ├──► [AIGateway (Structured JSON Mode)]
       │
       └──► [ClauseRepository]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log extraction yields:
  * `INFO: Doc 123. Extracted 14 clauses (3x Termination, 1x Indemnity, ...)`

---

# 25. OBSERVABILITY

## Metrics
* Track the `clause_extraction_failure_rate` (how often Pydantic rejects the AI's JSON output) to determine if the prompt engineering needs tuning.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Create a test with a hardcoded string containing a clear Termination clause. Pass it to the service (with a mocked AI response) and ensure the resulting DB row contains the correct `chunk_id` and parameters.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Split Clauses` | A single clause might cross a chunk boundary. The semantic chunker (in Doc Analysis) should minimize this, but the extraction prompt should be given overlapping chunks so the AI can read the full context. |

---

# 28. VERSIONING

## Compatibility Rules
* The Clause Taxonomy will evolve. If `TERMINATION` is renamed to `TERMINATION_FOR_CAUSE`, a database migration script must update all existing `extracted_clauses` rows to match the new taxonomy.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `EXTRACTION_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] AI strictly adheres to the provided JSON schema and Taxonomy.
* [ ] Extracted clauses are accurately mapped to their source `chunk_id`.
* [ ] Parameters (like dollar amounts or dates) are parsed into proper data types, not just strings.

---

# 32. DEFINITION OF DONE

The Clause Information Extraction service is **DONE** when a document can be scanned, and the frontend can render an interactive sidebar listing "Liability Caps" that, when clicked, jump the PDF viewer to the exact sentence proving that cap.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Drop hallucinatory outputs).
3. **Repeated requests must not create unintended duplicate data.** (Wipe old extracted clauses for a document before re-running extraction).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as a magnifying glass that scans unstructured legal text and extracts highly structured, standardized data points.

## What the user sees
A magical interface where standard legal concepts (like Termination or Indemnity) are automatically highlighted and categorized in a neat table next to their document.

## What happens in the background
The service chunks the text, leverages an LLM specifically instructed to output strict JSON schemas, maps the extracted concepts to a hardcoded taxonomy, and ties the extracted data back to the original text coordinates.

## What it receives
Document IDs and Taxonomy filters.

## What it produces
Structured JSON objects linked to specific text chunks.

## Success means
Lawyers stop manually reading contracts to find basic data points, relying on the platform to instantly surface the clauses they care about.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
