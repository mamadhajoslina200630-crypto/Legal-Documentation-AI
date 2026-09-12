# Legal AI Platform (Document Comparison)

> **Purpose:** Complete implementation blueprint for `Document Comparison`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Document Comparison`

## 1.2 Service ID

`sys-doc-comparison-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Document Comparison service must:

* Take two distinct legal documents (e.g., Version A and Version B) and perform a semantic, clause-by-clause comparison.
* Identify not just literal text insertions/deletions (like a standard redline diff), but *semantic shifts* in meaning (e.g., "The counterparty changed the net-30 payment terms to net-60").
* Output a structured mapping connecting chunks from Document A to chunks in Document B, highlighting the material differences.

The service must **not** decide whether the changes are acceptable (that is Legal Risk Detection) or perform the raw text extraction itself.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
During contract negotiations, counterparties often send back PDFs or Word documents with tracked changes disabled, hoping to sneak in a hidden clause. Standard text-diff tools fail if the document formatting changes slightly. This service provides a semantic diff, catching sneaky, material changes to legal language instantly and protecting the firm from agreeing to hidden terms.

## 1.7 User Value

Explain what the user gains from this service.
Total transparency during negotiations. A user can upload the draft they sent yesterday and the PDF they received today, and instantly see a side-by-side view highlighting exactly what the counterparty altered, categorized by significance.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that maps the structure of two documents, leverages the AI Gateway to evaluate the differences between mapped clauses, and saves a `DocumentComparison` report to PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Structural alignment (mapping Section 1 of Doc A to Section 1 of Doc B).
* Semantic comparison of matched clauses via LLM.
* Identification of "Missing" clauses (deleted entirely) and "New" clauses (inserted).
* Summarizing the *impact* of the change (e.g., "Shifts liability to our company").
* Saving the mapping data to the database.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Standard character-by-character git-style diffs (The frontend can do this visually if needed; this service provides the AI semantic diff).
* Merging the two documents into a single new document.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `ClauseExtractionService` | To align documents by clause types | JSON Clauses |
| `AIGateway` | To evaluate the semantic difference | JSON Explanations|

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the side-by-side comparison view).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User selects two documents in the UI and clicks "Compare".

## 3.2 User Input
Two Document IDs.

## 3.3 User Flow

```text
User selects Doc A and Doc B, clicks "Compare".
  ↓
UI shows "Aligning documents..."
  ↓
Service maps the clauses of Doc A to Doc B.
  ↓
UI shows "Analyzing semantic differences..."
  ↓
Service passes mismatched clauses to AI Gateway to summarize the change.
  ↓
Service saves the comparison report.
  ↓
UI displays a side-by-side split screen. Material changes are highlighted in Orange. Unchanged text is greyed out.
```

## 3.4 User States
* `Comparing`
* `Completed`

## 3.5 User-Visible Result
A split-screen comparison dashboard detailing insertions, deletions, and semantic changes.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Semantic Comparison Workflow

```text
CELERY WORKER receives `compare_documents(doc_a_id, doc_b_id)`
  ↓
Fetch all `ExtractedClauses` for Doc A and Doc B.
  ↓
Alignment Phase:
  Match clauses based on `clause_type` and semantic similarity (vector distance).
  Identify:
    - Matched pairs (Clause A -> Clause B)
    - Unmatched A (Deleted clauses)
    - Unmatched B (Added clauses)
  ↓
Evaluation Phase (For Matched Pairs):
  If raw text is 100% identical -> Mark as "NO_CHANGE".
  If text differs -> Send Prompt to AI Gateway:
    "Compare Clause A and Clause B. Explain the material legal difference. Output severity (MINOR/MATERIAL)."
  ↓
Parse AI JSON response.
  ↓
Save to `DocumentComparison` and `ComparisonItem` database tables.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `source_document_id` | `UUID` | Yes | Must have status `READY` |
| `target_document_id` | `UUID` | Yes | Must have status `READY` |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must raise `DocumentsNotReadyError` if either document has not finished initial text extraction.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database rows representing the mapping and differences between the two documents.

## 6.2 Output Structure
```json
{
  "id": "uuid",
  "source_document_id": "uuid",
  "target_document_id": "uuid",
  "changes": [
    {
      "change_type": "MODIFIED",
      "severity": "MATERIAL",
      "source_chunk_id": "uuid",
      "target_chunk_id": "uuid",
      "ai_explanation": "The counterparty reduced the notice period from 60 days to 15 days."
    },
    {
      "change_type": "DELETED",
      "severity": "MATERIAL",
      "source_chunk_id": "uuid",
      "target_chunk_id": null,
      "ai_explanation": "The entire Arbitration clause was removed."
    }
  ]
}
```

## 6.3 Output Rules
* `change_type` must be an Enum: `IDENTICAL`, `MODIFIED`, `DELETED`, `ADDED`.
* `severity` must be an Enum: `NONE`, `MINOR` (e.g., fixing typos), `MATERIAL` (legal meaning changed).

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Ignore Formatting:** The AI comparison must ignore changes in whitespace, font styling, or bullet point numbering unless they materially change the meaning of the contract.
* **Explain the Impact:** It is not enough to say "Text was changed." The AI must explicitly state *how* the change impacts the user (e.g., "This removes your right to terminate early").

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If the vector similarity between two clauses is extremely low, do not force a match. Treat the old clause as `DELETED` and the new clause as `ADDED`. Forcing a match between completely unrelated paragraphs confuses the user.

## 7.4 Failure Rules
* See standard Celery AI retry logic.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* This service relies heavily on `chunk_id` mapping so the frontend can scroll the left and right PDF viewers in sync when the user clicks a specific change.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Semantic comparison and impact analysis.

## 9.4 AI Rules
* Use a high-tier reasoning model (GPT-4o or Claude 3.5 Sonnet) because determining the legal materiality of a small word change (e.g., changing "may" to "shall") requires deep reasoning.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert contract negotiator. Your task is to compare Original Clause A to Redlined Clause B.
Determine if the legal meaning has changed. 
If it has, classify the severity (MINOR/MATERIAL) and provide a 1-sentence explanation of the business impact. Ignore trivial formatting or spelling corrections.
Output strictly as JSON matching the requested schema.
```

## 10.2 User Prompt
```text
Original Clause A: {source_text}
Redlined Clause B: {target_text}

Analyze the difference.
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Direct text comparison.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes inside a Celery Worker. Comparing a 50-page document against a 50-page document requires aligning dozens of chunks and making multiple LLM calls for modified clauses.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `document_comparisons` table.
* `comparison_items` table.

## 13.5 Database Rules
* The `document_comparisons` table must have a unique constraint on `(source_document_id, target_document_id)` to prevent running duplicate comparisons on the same pair of documents.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/document-comparisons` (Start comparison job)
* `GET /api/v1/workspaces/{id}/document-comparisons/{comp_id}` (Get results)

---

# 16. ERROR HANDLING

## Error Rules
* If the two documents are completely fundamentally different (e.g., comparing an NDA to an Employment Agreement), the alignment phase should detect < 5% similarity and instantly abort the job, returning an error: "Documents are too dissimilar to compare."

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` for **BOTH** `source_document_id` and `target_document_id` before starting the comparison. A user cannot compare their document against a document belonging to another tenant.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The `comparison_items` MUST link to the specific `chunk_id` in both the source and target documents.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* "This automated comparison may not catch all material changes. Please review the documents manually before signing."

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Target execution time: < 45 seconds for a standard 30-page comparison.

## 20.2 Large Input Handling
* Use `asyncio.gather` to evaluate the material differences of modified clauses concurrently against the AI Gateway.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/document_comparison.py` | Orchestration |
| Alignment      | `backend/app/services/alignment_service.py` | Vector matching logic |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository] (Fetch chunks A & B)
       │
       ├──► [AlignmentService] (Match chunks)
       │
       ├──► [AIGateway] (Evaluate semantic shifts)
       │
       └──► [ComparisonRepository] (Save results)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Comparison 123 finished. Found 4 MATERIAL changes, 12 MINOR changes, 2 DELETED clauses.`

---

# 25. OBSERVABILITY

## Metrics
* Track average comparison processing time.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Alignment:** Pass two lists of strings that are slightly out of order. Ensure the alignment algorithm matches the highly similar strings correctly.
* **Test Evaluation:** Pass a pair where "shall" is changed to "may". Assert the mocked AI evaluates this as a `MATERIAL` change.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Reordered Clauses` | The counterparty moved Section 9 to Section 2. The semantic alignment phase must rely on vector similarity, not linear order, so it correctly identifies that the clause was moved (not deleted and recreated). |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `COMPARISON_MODEL` | Which LLM to use | Yes | `gpt-4o` |
| `ALIGNMENT_THRESHOLD`| Min vector similarity to match | No | `0.85` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Can align clauses even if the document was heavily reformatted or reordered.
* [ ] Accurately classifies trivial typo fixes as MINOR or NO_CHANGE.
* [ ] Explicitly explains the business impact of MATERIAL changes.
* [ ] Fails gracefully if documents are completely unrelated.

---

# 32. DEFINITION OF DONE

The Document Comparison service is **DONE** when a user can upload a draft they wrote and a redline sent back by a client, and instantly view a side-by-side dashboard highlighting the 3 sneaky changes the client tried to hide, along with plain-English explanations of what those changes mean.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Dissimilar documents abort early).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as a hyper-vigilant contract reviewer that compares two versions of a document to find hidden changes.

## What the user sees
A side-by-side split screen where changed clauses are linked and highlighted, accompanied by AI explanations of the differences.

## What happens in the background
The service aligns the two documents using vector similarity to handle reordering, isolates the changed text, and prompts a high-tier LLM to determine if the change is a harmless typo fix or a dangerous semantic shift in legal liability.

## What it receives
Two Document IDs.

## What it produces
A structured mapping of changes, severities, and AI explanations.

## Success means
Lawyers never agree to a hidden, detrimental clause slipped into a massive contract during the negotiation phase.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
