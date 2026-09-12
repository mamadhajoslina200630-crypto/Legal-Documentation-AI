# Legal AI Platform (Court Document Understanding)

> **Purpose:** Complete implementation blueprint for `Court Document Understanding`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Court Document Understanding`

## 1.2 Service ID

`sys-court-doc-understanding-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Court Document Understanding service must:

* Analyze incoming litigation documents (e.g., Pleadings, Motions, Affidavits, Subpoenas, Notices).
* Automatically classify the document type (e.g., categorizing a file as a "Motion for Summary Judgment").
* Extract structured litigation metadata: Court Jurisdiction, Case Number, Plaintiff/Defendant names, Filing Date, Hearing Date (if present), and the specific Relief Sought.
* Prepare this structured data for ingestion into a firm's Docket Management or Calendaring system.

The service must **not** summarize the legal arguments of the case (Handled by Judgment Summarization) or draft responses to the motions.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Litigation teams receive hundreds of PDF filings from courts and opposing counsel every week. Paralegals spend countless hours opening each PDF, figuring out what it is, typing the case number and hearing dates into a central docketing system, and renaming the file. This service automates the triage process, turning unstructured PDF dumps into an organized, searchable litigation docket instantly.

## 1.7 User Value

Explain what the user gains from this service.
Automated docketing. A user can drag and drop 50 court filings into a folder, and the system will automatically rename them, tag them by case number, categorize the motion type, and extract upcoming hearing dates without a single keystroke.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that processes newly ingested litigation documents, uses a classification/NER LLM prompt to extract docket metadata, and saves a `CourtFilingMetadata` record linked to the document in PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Multi-class categorization of court document types (e.g., Pleading, Motion, Order, Discovery).
* Extraction of Case Numbers (often in highly variable formats).
* Extraction of Party Names (Plaintiff vs. Defendant).
* Extraction of critical dates (Filing dates, Response deadlines, Hearing dates).
* Identification of the specific Court/Jurisdiction.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Extracting contractual obligations (Handled by Obligation Extraction).
* Creating calendar events in Microsoft Outlook (This service provides the data; an Integration Service handles the Outlook API).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch text chunks | Text Data |
| `AIGateway` | To perform classification and NER | JSON Outputs |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Docket Management System**, **Frontend File Explorer** (to auto-rename files based on metadata).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User uploads files into a "Litigation Matter" workspace folder.

## 3.2 User Input
File upload.

## 3.3 User Flow

```text
User uploads "scanned_doc_01.pdf" into the "Smith v. Jones" folder.
  ↓
Service processes the text in the background.
  ↓
Service identifies it as a "Defendant's Motion to Dismiss" with a hearing date of Nov 12.
  ↓
UI auto-renames the file to "2024-10-01 - Motion to Dismiss - Defendant.pdf".
UI adds a "Hearing: Nov 12" tag next to the file.
```

## 3.4 User States
* `Processing`
* `Categorized`

## 3.5 User-Visible Result
A highly organized, tagged file repository and an automatically updated litigation timeline.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Court Document Parsing Workflow

```text
CELERY WORKER receives `parse_court_document(doc_id)`
  ↓
Fetch the first 3 text chunks of the document (Litigation metadata is almost exclusively on the caption/title page).
  ↓
Send Prompt to AI Gateway:
  "Analyze this court document caption. Categorize the document type. Extract the Case Number, Court, Parties, Filing Date, and any explicitly stated Hearing Dates. Output strictly as JSON."
  ↓
Parse AI JSON response.
  ↓
If document is recognized as a "Notice of Hearing" or "Scheduling Order", trigger an event to the Calendaring service.
  ↓
Save to `CourtFilingMetadata` database table.
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
* Must raise `DocumentNotReadyError` if chunks have not been extracted.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Structured database rows containing litigation metadata.

## 6.2 Output Structure
```json
{
  "document_id": "uuid",
  "document_category": "MOTION",
  "document_subtype": "Motion for Summary Judgment",
  "case_number": "CV-2024-00123",
  "court_name": "US District Court, SDNY",
  "filing_party": "Defendant",
  "filing_date": "2024-10-01",
  "hearing_date": "2024-11-15T09:00:00Z",
  "relief_sought": "Dismissal of all claims with prejudice"
}
```

## 6.3 Output Rules
* `document_category` must be constrained to an Enum (e.g., `PLEADING`, `MOTION`, `ORDER`, `DISCOVERY`, `NOTICE`, `AFFIDAVIT`, `OTHER`).

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **First-Page Focus:** Unlike contracts where obligations are hidden on page 40, court documents state their identity on the Caption page (Page 1). To save AI costs and reduce hallucination, the service should generally only pass the first 2-3 pages of text to the AI for this specific extraction.
* **Date Normalization:** Court documents often stamp dates in various formats (e.g., "1st day of October, 2024" or a messy OCR stamp). The LLM must be instructed to parse these into strict ISO-8601 formats (`YYYY-MM-DD`).

## 7.2 Validation Rules
* If the AI cannot find a Case Number, it must return `null`, not guess or hallucinate based on other numbers in the document.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* See standard Celery AI retry logic.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Requires the first few chunks of the `Document`. OCR quality is critical here, as court stamps (e.g., "FILED OCT 1 2024") are often messy and handwritten.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Classification and Named Entity Recognition (NER) specific to litigation captions.

## 9.4 AI Rules
* Use a fast, highly capable model (e.g., GPT-4o-mini or Claude 3 Haiku). Since we are only analyzing the first few pages and asking for structured extraction, we do not need the most expensive reasoning models, optimizing for speed and cost across thousands of files.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert litigation paralegal. Your task is to analyze the caption/title page of a court filing and extract its metadata.
Categorize the document into one of the allowed types. Extract the exact Case Number, Court Name, and Parties.
Convert all dates to YYYY-MM-DD format. If a piece of information is missing, return null.
Output strictly as JSON matching the requested schema.
```

## 10.4 Prompt Rules
* The prompt must include the specific list of allowed `document_category` values to prevent the AI from inventing new categories.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Direct extraction from the text.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task triggered automatically upon document upload into a "Litigation" workspace.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `court_filing_metadata` table.

## 13.5 Database Rules
* `case_number` should be indexed, as users will frequently search for all documents related to a specific case number.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/parse-court-document`
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/court-metadata`

---

# 16. ERROR HANDLING

## Error Rules
N/A

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id`.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The UI should ideally allow the user to click the extracted "Hearing Date" and jump to the spot on Page 1 where the date is stamped to verify the OCR/AI didn't make a mistake.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must display: *"Automated docketing may miss critical dates due to scan quality. Always verify hearing and response dates manually."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution time: Target `< 10 seconds` per document (since it only processes the first few pages).

## 20.2 Large Input Handling
* See 7.1. Truncate the input to the first 3 chunks (approx. 1500 words) to save tokens, unless the document is classified as something that hides dates at the end.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/court_document_parsing.py` | Orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository] (Fetch Pages 1-3)
       │
       ├──► [AIGateway] (Extract JSON)
       │
       └──► [CourtMetadataRepository] (Save results)
```

---

# 23. EVENTS

## 23.1 Emitted Events
* If `hearing_date` is found, emit `HearingDateExtracted` to the platform's Event Bus so the Notification/Calendar service can pick it up.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Parsed Court Doc 123. Category: MOTION. Case: CV-2024-00123.`

---

# 25. OBSERVABILITY

## Metrics
* Track `court_doc_categorization_rate`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Feed the AI a mock string of a messy court caption: "IN THE DIST. COURT OF NY... MOTION TO DISMISS... FILED 10/1/24". Assert it successfully outputs the standardized JSON.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Missing Captions` | An exhibit or appendix usually lacks a court caption. The AI must correctly classify this as `EXHIBIT` or `OTHER` and return nulls for Case Number/Court without hallucinating them from the surrounding text. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `COURT_DOC_MODEL` | Which LLM to use | Yes | `gpt-4o-mini` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Extracts Case Number, Court, Parties, and Dates accurately.
* [ ] Categorizes documents according to a strict predefined taxonomy.
* [ ] Optimizes cost/speed by only sending caption pages to the LLM.
* [ ] Emits events for extracted hearing dates.

---

# 32. DEFINITION OF DONE

The Court Document Understanding service is **DONE** when a paralegal can bulk upload 100 messy, un-named PDFs from opposing counsel and watch the system automatically rename them all by date and motion type, populating the firm's central docket in 30 seconds.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Return `OTHER` category for unknown docs).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an automated docketing clerk for litigation teams, organizing messy court filings.

## What the user sees
A chaotic folder of "Scan_001.pdf" files automatically transforms into a neatly organized, tagged, and named litigation repository with extracted hearing dates.

## What happens in the background
The service intercepts newly uploaded files, grabs the first few pages (the court caption), and uses a fast LLM to perform Named Entity Recognition and classification, structuring the data into a strict schema and emitting calendar events if necessary.

## What it receives
Document IDs.

## What it produces
Structured Court Filing Metadata (Categories, Dates, Case Numbers).

## Success means
Law firms eliminate hundreds of hours of manual data entry and drastically reduce the risk of missing a court deadline due to an overlooked PDF.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
