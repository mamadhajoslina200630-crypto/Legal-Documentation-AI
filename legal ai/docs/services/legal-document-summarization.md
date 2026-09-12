# Legal AI Platform (Legal Document Summarization)

> **Purpose:** Complete implementation blueprint for `Legal Document Summarization`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Document Summarization`

## 1.2 Service ID

`sys-legal-doc-summary-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Document Summarization service must:

* Read the extracted text of a fully processed legal document.
* Orchestrate LLM calls via the AI Gateway to generate concise, accurate summaries of the document.
* Apply Map-Reduce or Refine strategies for large documents that exceed the LLM's context window.
* Extract key overarching metadata (Parties involved, Effective Date, Governing Law) as part of the summary process.

The service must **not** perform specific risk analysis (that belongs to Legal Risk Detection) or raw text extraction (that belongs to Legal Document Analysis).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers do not have time to read every 150-page lease agreement just to find out who the parties are and when it expires. This service provides a "TL;DR" executive summary instantly, saving hours of manual review and allowing legal teams to triage their workload effectively.

## 1.7 User Value

Explain what the user gains from this service.
Instant comprehension. Within seconds of uploading a massive contract, they receive a neat 1-page overview highlighting the core agreement, parties, dates, and fundamental purpose of the document.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that takes a `document_id`, reads its text chunks, prompts an LLM, and writes a structured Markdown and JSON summary to the PostgreSQL database.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Managing LLM context windows (Map-Reduce logic).
* Crafting the specialized Legal Summary Prompts.
* Parsing structured JSON outputs from the LLM (Parties, Dates).
* Saving the generated summary to the database.
* Exposing an endpoint for the frontend to retrieve the summary.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Clause-by-clause rewriting.
* Document Translation.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch document text chunks | Text Data |
| `AIGateway` | To execute the prompt | JSON/Markdown |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to display the summary on the dashboard).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user clicks "Generate Summary" on a document, or it is triggered automatically upon upload.

## 3.2 User Input
A button click.

## 3.3 User Flow

```text
User clicks "Summarize"
  ↓
UI shows "Generating Executive Summary..."
  ↓
Service fetches text, sends prompt to AI Gateway via Celery Worker.
  ↓
Service saves Markdown summary to database.
  ↓
UI updates to display the formatted Markdown summary.
```

## 3.4 User States
* `Generating`
* `Completed`

## 3.5 User-Visible Result
A clean, bulleted executive summary appearing next to the document viewer.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Summarization Workflow (Map-Reduce for Large Docs)

```text
CELERY WORKER receives `summarize_document(doc_id)`
  ↓
Fetch all text chunks for `doc_id`.
  ↓
Is total token count > LLM Context Window (e.g., > 100k tokens)?
  ├── NO: Stuff all text into a single Prompt -> Call AI Gateway.
  └── YES: (Map-Reduce)
       1. For each chunk: Call AI Gateway to summarize the chunk.
       2. Concatenate all chunk summaries.
       3. Call AI Gateway to summarize the concatenated summaries.
  ↓
Parse response into structured format (Markdown + JSON Metadata).
  ↓
Save to `DocumentSummary` table.
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
| `focus`   | `String` | `null` | e.g., "Summarize focusing on payment terms" |

## 5.3 Input Validation Rules
* If the Document status is not `READY` (meaning text extraction hasn't finished), the service must raise a `DocumentNotReadyError`.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A structured summary object saved to the database.

## 6.2 Output Structure
```json
{
  "document_id": "uuid",
  "executive_summary_markdown": "# Summary\nThis is a lease...",
  "metadata": {
    "parties_involved": ["Acme Corp", "John Doe"],
    "effective_date": "2024-01-01",
    "governing_law": "California"
  }
}
```

## 6.3 Output Rules
* The output must cleanly separate the human-readable Markdown from the structured metadata so the UI can render them differently.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Hallucination Prevention:** The prompt MUST strictly instruct the LLM: "Do not invent dates or parties. If a piece of information is not explicitly stated in the provided text, output 'Not Specified'."
* **Model Selection:** Summarization is a reasoning-heavy task. This service must request a high-tier model (e.g., GPT-4 or Claude 3.5 Sonnet) from the AI Gateway, rather than a fast/cheap model.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* **Automatic vs Manual:** If a document is under 20 pages, automatically trigger summarization upon upload completion. If over 20 pages, require the user to explicitly click "Summarize" to save API costs.

## 7.4 Failure Rules
* If the LLM returns a malformed JSON response that Pydantic cannot parse, the service must retry the AI Gateway request up to 2 times before failing the job.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* This service consumes the raw text chunks created by the `Legal Document Analysis` service.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Abstractive reasoning and text generation.

## 9.4 AI Rules
* Set `temperature=0.1` for the LLM call. Legal summaries must be highly deterministic and factual, not creative.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert corporate lawyer. Your task is to provide an executive summary of the provided legal document. 
You must extract the exact parties, the effective date, and the governing law. 
If a detail is missing, state 'Not Specified'. Do not hallucinate.
Output the result strictly as a JSON object matching the requested schema.
```

## 10.2 User Prompt
```text
Here is the text of the document:
<document_text>
{text}
</document_text>

Generate the summary JSON.
```

## 10.4 Prompt Rules
* The prompt must utilize XML tags (`<document_text>`) to clearly separate the instructions from the legal content, preventing prompt injection attacks hidden inside the contract.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Summarization typically puts the whole document in context (or uses map-reduce), rather than performing vector search.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* This service executes inside a Celery Worker because an LLM call for a large document can take 30-90 seconds to return.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `document_summaries` table.

## 13.5 Database Rules
* Use a `JSONB` column in PostgreSQL to store the `metadata` object, allowing the schema of extracted fields (parties, dates) to evolve over time without requiring heavy database migrations.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/summarize` (Triggers job, returns 202)
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/summary` (Returns the finished summary)

---

# 16. ERROR HANDLING

## Error Rules
* If the AI Provider API is down, the Celery task must catch the exception, delay, and retry (exponential backoff).

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before fetching the document text and before saving the summary.

## 17.3 Sensitive Data
* The summary itself contains highly confidential business information (deal values, parties). It must be protected by the same strict database rules as the raw document.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* For advanced summaries, instruct the LLM to output page citations for its claims (e.g., `Governing Law: California [Page 12]`).

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The frontend UI displaying this summary MUST include a permanent disclaimer: *"This summary is AI-generated and does not constitute legal advice. Always review the original document."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* The Celery task should complete in `< 60 seconds` for documents under 50 pages.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/legal_document_summarization.py` | Orchestration |
| Prompts        | `backend/app/services/prompts/summarization.py` | Prompt templates |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository] (Fetch Text)
       │
       └──► [AIGateway] (Send Prompt)
       │
       └──► [SummaryRepository] (Save Result)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log token usage provided by the AI Gateway to monitor the cost of the summarization feature.
  * `INFO: Summarized Doc 123. Tokens: 45,000 In / 500 Out. Strategy: Map-Reduce.`

---

# 25. OBSERVABILITY

## Metrics
* Track `summarization_token_count` to ensure massive documents aren't bankrupting the platform API limits.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Mock the AI Gateway to return a pre-defined JSON string. Assert that the Service correctly parses the JSON, separates the markdown, and calls the Repository to save it.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Empty Document` | If the `Legal Document Analysis` service yielded 0 chunks of text, the summarizer must abort early and save an error stating "Document contains no readable text." |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `SUMMARY_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Small documents are summarized in a single pass.
* [ ] Large documents are summarized using Map-Reduce.
* [ ] The LLM returns structured JSON matching the Pydantic schema.
* [ ] Dates and Parties are cleanly extracted into the database.

---

# 32. DEFINITION OF DONE

The Legal Document Summarization service is **DONE** when a user can click a button on a 50-page contract and reliably receive a structured executive summary highlighting the parties and key terms within 60 seconds.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.** (If a summary already exists, return it or overwrite it, do not create a second row).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an AI paralegal that reads an entire document and writes an executive summary.

## What the user sees
A beautiful, structured "TL;DR" of their massive legal contract.

## What happens in the background
The service gathers all text from the database, determines if the document is too large for the AI to read at once (applying map-reduce if so), prompts the LLM with strict formatting instructions, and saves the result as structured data.

## What it receives
A Document ID.

## What it produces
Markdown text and JSON metadata.

## Success means
Lawyers can triage their inbox 10x faster because they instantly know what a document is about without reading it.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
