# Legal AI Platform (Obligation & Deadline Extraction)

> **Purpose:** Complete implementation blueprint for `Obligation & Deadline Extraction`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Obligation & Deadline Extraction`

## 1.2 Service ID

`sys-obligation-extraction-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Obligation & Deadline Extraction service must:

* Scan legal documents to identify actionable obligations (e.g., "Vendor must deliver the report") and associated deadlines (e.g., "within 30 days of quarter-end").
* Distinguish between absolute deadlines (e.g., "January 1, 2025") and relative/conditional deadlines (e.g., "60 days after written notice").
* Structure these extracted facts into a calendar-friendly data model (Assignee, Task, Due Date, Trigger Event).
* Store the data so it can be consumed by the frontend for alerting and calendar integration.

The service must **not** send the actual email alerts (that is handled by a Notification Service) or manage general clause extraction (handled by Clause Extraction).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Contracts are fundamentally lists of promises. Failing to keep a promise (missing a deadline) leads to breach of contract. Companies currently track these manually in massive Excel spreadsheets. This service automates the creation of that "docket" or obligation tracker, ensuring a company never accidentally auto-renews a bad contract because they missed the 90-day cancellation window.

## 1.7 User Value

Explain what the user gains from this service.
An automated legal calendar. Instead of reading a contract to figure out what they have to do, the user receives a neat dashboard of tasks ("Send Q3 report to Client X by Friday") automatically generated from the PDF.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that prompts the AI Gateway to identify promises and dates within text chunks, outputting structured `Obligation` records to the PostgreSQL database.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Identifying the "Party" responsible for an action.
* Extracting the specific action required.
* Extracting the deadline (Absolute or Relative).
* Calculating absolute dates for relative deadlines if the trigger date is known (e.g., calculating 30 days from the `Effective Date`).
* Linking the extracted obligation to the specific `chunk_id` for traceability.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Actually sending email reminders or Slack notifications.
* Identifying non-actionable clauses like "Governing Law" (Handled by Clause Extraction).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch text chunks | Text Chunks |
| `AIGateway` | To perform NER and reasoning | JSON Outputs |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Notification/Alerting Service**, **Frontend API** (Calendar views).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
Triggered automatically during document ingestion, or via a "Find Deadlines" button.

## 3.2 User Input
Button click.

## 3.3 User Flow

```text
Service scans the document in the background.
  ↓
Service saves extracted obligations to the database.
  ↓
User opens the "Obligations" tab on a contract.
  ↓
UI displays a Kanban board or Calendar view of tasks.
  ↓
User clicks a task (e.g., "Provide Audit Report - Due Nov 1").
  ↓
UI highlights the sentence in the PDF that mandates the audit report.
```

## 3.4 User States
* `Processing`
* `Completed`

## 3.5 User-Visible Result
A structured list/calendar of tasks with responsible parties and due dates.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Obligation Extraction Workflow

```text
CELERY WORKER receives `extract_obligations(doc_id)`
  ↓
Fetch all text chunks for `doc_id`.
Fetch known metadata for the document (e.g., `effective_date` = 2024-01-01).
  ↓
Group chunks logically.
  ↓
Send Prompt to AI Gateway:
  "Identify all actionable obligations in this text. Extract: Who must do it, What they must do, and When it must be done. Output strictly as JSON."
  ↓
Parse AI JSON response.
  ↓
Date Resolution Phase:
  For each obligation, if deadline is "30 days after Effective Date", calculate the actual absolute date using the known metadata.
  ↓
Save to `ExtractedObligation` database table.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Must have status `READY` |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must raise `DocumentNotReadyError` if chunks have not been created.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Structured database rows representing actionable tasks.

## 6.2 Output Structure
```json
{
  "id": "uuid",
  "document_id": "uuid",
  "chunk_id": "uuid",
  "responsible_party": "Acme Corp (Vendor)",
  "beneficiary_party": "Client XYZ",
  "action_description": "Deliver the annual security audit report",
  "deadline_type": "RELATIVE",
  "deadline_raw_text": "within 30 days of the anniversary date",
  "calculated_absolute_date": "2025-02-01T00:00:00Z"
}
```

## 6.3 Output Rules
* `deadline_type` must be an Enum: `ABSOLUTE` (e.g., Jan 1, 2024), `RELATIVE` (e.g., 30 days after X), `RECURRING` (e.g., first Monday of every month), `UPON_EVENT` (e.g., upon termination).
* `calculated_absolute_date` may be null if the trigger event has not happened yet (e.g., "30 days after breach").

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Actionability Requirement:** The AI must only extract clauses that require an *action*. "Vendor represents it owns the IP" is a statement of fact, not an obligation. "Vendor shall defend the Client against IP claims" is an obligation.
* **Traceability:** Every extracted obligation MUST link to a `chunk_id` so the human can verify the promise in the original text.

## 7.2 Validation Rules
* If the AI attempts to calculate an absolute date, the backend must verify the date parsing logic to ensure the AI didn't hallucinate a non-existent date (e.g., February 30).

## 7.3 Decision Rules
* If an obligation is conditional ("If A happens, B must do C within 10 days"), it must be flagged so the UI knows it is not an active task until condition A is met.

## 7.4 Failure Rules
* See standard Celery AI retry logic for malformed JSON.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* The service heavily relies on `chunk_id`. It also benefits greatly from knowing the overall document `effective_date` (which should be extracted by the Document Summarization service first) to resolve relative dates.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Information Extraction and Date Logic reasoning.

## 9.4 AI Rules
* Use a model highly proficient in logical reasoning and date math (e.g., GPT-4o) so that "30 days after January 15 in a leap year" is calculated correctly.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a highly precise contract manager. Your task is to read the legal text and extract any actionable obligations or deadlines.
For each obligation, identify the responsible party, the action required, and the deadline.
If a deadline is relative to an event, specify the event.
Output strictly as JSON matching the provided schema. Do not extract general statements of fact or definitions.
```

## 10.4 Prompt Rules
* The prompt must include strict definitions of what constitutes an "Actionable Obligation" vs a "Representation/Warranty" to prevent the LLM from returning 500 rows of useless data.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Direct text processing of chunks.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task. Reading every chunk of a contract for hidden obligations is an intensive process that must run asynchronously.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `extracted_obligations` table.

## 13.5 Database Rules
* The database schema must separate the `deadline_raw_text` (what the contract actually says) from the `calculated_absolute_date` (what the system thinks it means), so if the system calculates it wrong, the user can still read the raw text and override it.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/extract-obligations`
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/obligations`
* `PUT /api/v1/workspaces/{id}/obligations/{id}` (Allow user to manually correct a date)

---

# 16. ERROR HANDLING

## Error Rules
N/A

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before saving or fetching obligations.

---

# 18. SOURCE & TRACEABILITY

*(See 7.1 Traceability)*.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must clarify: *"This list of automated obligations may not be exhaustive. The AI may miss complex or vaguely worded deadlines. It is not a substitute for manual docketing of critical dates."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution time: Target < 60 seconds for a 50-page document.

## 20.2 Large Input Handling
* Use batching (sending 5-10 chunks per LLM call) to reduce the number of API requests while staying within context limits.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/obligation_extraction.py` | Orchestration & Date Math |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository]
       │
       ├──► [AIGateway] (Extract JSON)
       │
       └──► [ObligationRepository] (Save results)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Obligation extraction for Doc 123 complete. Found 12 obligations.`

---

# 25. OBSERVABILITY

## Metrics
* Track `obligations_extracted_per_document`. If this drops to 0 globally, the LLM prompt has likely broken and is failing to classify actions correctly.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Relative Dates:** Feed the AI a chunk: "The Contractor shall submit the design 45 days after the Effective Date." Provide the backend with an Effective Date of `2024-01-01`. Assert the final database row calculates the absolute date as `2024-02-15`.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Business Days vs Calendar Days` | Legal text specifies "10 Business Days". The AI must be prompted to recognize this distinction, and the backend date-math logic must account for weekends when calculating the absolute date. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `OBLIGATION_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Ignores non-actionable statements (representations/warranties).
* [ ] Extracts the responsible party accurately.
* [ ] Calculates absolute dates for relative deadlines when the trigger date is provided.
* [ ] Links all findings to the exact source chunk.

---

# 32. DEFINITION OF DONE

The Obligation Extraction service is **DONE** when a user can upload a massive Master Services Agreement and instantly have their dashboard calendar populated with the 14 specific tasks they are required to do over the next year to avoid breaching the contract.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Date calculation belongs here, not in the UI).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an automated legal docketing clerk, reading documents to find promises and deadlines.

## What the user sees
A clean, actionable task list or calendar view generated directly from a dense legal PDF.

## What happens in the background
The service chunks the text, prompts an LLM to perform Named Entity Recognition (NER) looking specifically for actions and dates, performs Python-based date math to convert relative text ("30 days later") into absolute timestamps, and saves the tasks to the database linked to the original text.

## What it receives
Document IDs.

## What it produces
Structured Obligation records containing Assignees, Actions, and Due Dates.

## Success means
Companies never miss a hidden contract deadline, avoiding late fees, accidental auto-renewals, or breach of contract lawsuits.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
