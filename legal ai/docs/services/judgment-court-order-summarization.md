# Legal AI Platform (Judgment & Court Order Summarization)

> **Purpose:** Complete implementation blueprint for `Judgment & Court Order Summarization`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Judgment & Court Order Summarization`

## 1.2 Service ID

`sys-judgment-summary-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Judgment & Court Order Summarization service must:

* Read the extracted text of a court judgment, judicial order, or appellate decision.
* Use a specialized litigation prompt via the AI Gateway to extract the highly specific structural elements of a court case: Case Title, Court Name, Presiding Judge(s), Parties (Appellant/Respondent), Facts of the Case, *Ratio Decidendi* (the rule of law established), and the Final Verdict.
* Apply a Map-Reduce strategy for massive judgments (e.g., a 1000-page Supreme Court ruling).
* Output a structured litigation brief (Markdown and JSON).

The service must **not** perform transactional contract summarization (Handled by Legal Document Summarization) or attempt to predict the outcome of future cases.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Litigation lawyers spend most of their time reading past case law to find precedents. Court judgments are notoriously long, rambling, and dense, often spending 50 pages recounting history before delivering a 2-page ruling. This service acts as an automated "headnote" generator, instantly briefing the lawyer on the facts, the legal issue, and the court's decision, saving hours of reading time.

## 1.7 User Value

Explain what the user gains from this service.
Instant case briefs. A litigator can upload 10 past judgments relevant to their current case and immediately receive 1-page summaries of each, allowing them to rapidly discard irrelevant cases and focus only on the strong precedents.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that takes a `document_id`, processes the text, prompts an LLM with strict litigation taxonomy, and writes a structured Markdown brief and JSON metadata to the PostgreSQL database.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Managing Map-Reduce context for extremely long judicial opinions.
* Crafting the specialized Litigation Brief Prompts.
* Parsing structured JSON outputs for specific legal concepts (e.g., distinguishing *Ratio* from *Obiter*).
* Saving the generated brief to the database.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Contract summarization (Handled by a separate service).
* Vectorizing the text (Handled by Legal Document Analysis).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch document text chunks | Text Data |
| `AIGateway` | To execute the prompt | JSON/Markdown |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to display the Case Brief on the dashboard).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user uploads a court judgment and clicks "Generate Case Brief".

## 3.2 User Input
A button click.

## 3.3 User Flow

```text
User clicks "Generate Brief" on a court document.
  ↓
UI shows "Analyzing Judgment..."
  ↓
Service fetches text, sends prompt to AI Gateway via Celery Worker.
  ↓
Service saves Markdown brief to database.
  ↓
UI updates to display the formatted Brief (Facts, Issue, Rule, Analysis, Conclusion).
```

## 3.4 User States
* `Generating`
* `Completed`

## 3.5 User-Visible Result
A clean, structured case brief appearing next to the document viewer, similar to standard law school FIRAC (Facts, Issue, Rule, Analysis, Conclusion) briefs.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Judgment Summarization Workflow

```text
CELERY WORKER receives `summarize_judgment(doc_id)`
  ↓
Fetch all text chunks for `doc_id`.
  ↓
Is total token count > LLM Context Window?
  ├── NO: Stuff all text into a single Prompt -> Call AI Gateway.
  └── YES: (Map-Reduce)
       1. Map Phase: For each chunk, extract "Key Facts", "Legal Arguments", and "Rulings".
       2. Concatenate the mapped data.
       3. Reduce Phase: Call AI Gateway to synthesize the concatenated data into a final Case Brief.
  ↓
Parse response into structured format (Markdown + JSON Metadata).
  ↓
Save to `JudgmentSummary` table.
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
N/A

## 5.3 Input Validation Rules
* Must raise `DocumentNotReadyError` if text extraction hasn't finished.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A structured judgment summary object saved to the database.

## 6.2 Output Structure
```json
{
  "document_id": "uuid",
  "brief_markdown": "# Case Brief\n## Facts\n...",
  "metadata": {
    "case_name": "Smith v. Jones",
    "court": "Supreme Court of California",
    "date_decided": "2024-05-12",
    "judge_name": "Hon. Jane Doe",
    "ratio_decidendi": "A contract is void if...",
    "verdict": "Appeal Dismissed"
  }
}
```

## 6.3 Output Rules
* The service must strictly separate the human-readable Markdown brief from the structured JSON metadata so the UI can populate search filters (e.g., filtering all cases where `verdict` == "Appeal Dismissed").

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Litigation Taxonomy:** The AI must be instructed to use standard litigation terminology. It must explicitly identify the `Ratio Decidendi` (the binding legal principle) separately from the `Obiter Dicta` (passing remarks by the judge).
* **Objective Reporting:** The summary must remain entirely objective. It must report *what* the judge decided, not whether the AI agrees with the decision.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If the document is not actually a court judgment (e.g., a user accidentally runs this on a lease agreement), the AI should detect this and return a specific failure status: `NOT_A_JUDGMENT`.

## 7.4 Failure Rules
* See standard Celery AI retry logic.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Consumes raw text chunks.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Abstractive reasoning, legal synthesis, and information extraction.

## 9.4 AI Rules
* Use a high-tier reasoning model (GPT-4o or Claude 3.5 Sonnet). Identifying the exact legal reasoning behind a judge's ruling requires deep comprehension of legal text.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert appellate lawyer. Your task is to write a comprehensive Case Brief for the provided court judgment.
You must extract the Case Name, Court, Judge, Date, and Final Verdict.
You must summarize the Material Facts, the Legal Issues, the Ratio Decidendi (Rule of Law), and the Court's Analysis.
Output the result strictly as a JSON object matching the requested schema.
```

## 10.2 User Prompt
```text
Here is the text of the judgment:
<document_text>
{text}
</document_text>

Generate the case brief JSON.
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Summarization relies on the document text itself.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes inside a Celery Worker. Summarizing large judgments takes 30-90 seconds.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `judgment_summaries` table. (Distinct from the contract `document_summaries` table to accommodate different metadata schemas).

## 13.5 Database Rules
* Use a `JSONB` column to store the `metadata` object.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/summarize-judgment` (Triggers job)
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/judgment-summary` (Returns finished brief)

---

# 16. ERROR HANDLING

## Error Rules
* See 7.3. Handle non-judgments gracefully.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id`. While many court judgments are public record, the user's specific library and the summaries generated for their strategy must remain private to their workspace.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The AI should be instructed to output page/paragraph numbers where the judge states the Final Verdict, allowing the lawyer to quickly jump to the conclusion.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI MUST display: *"This case brief is AI-generated and may misinterpret the court's ruling. Always read the full judgment before citing this case in court."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task should complete in `< 60 seconds` for standard judgments (< 50 pages).

## 20.2 Large Input Handling
* **Map-Reduce:** For massive cases (e.g., complex antitrust rulings), the Map-Reduce flow is critical to avoid context window limits.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/judgment_summarization.py` | Orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository]
       │
       └──► [AIGateway]
       │
       └──► [JudgmentSummaryRepository]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Summarized Judgment Doc 123. Tokens: 65,000 In / 800 Out. Strategy: Map-Reduce.`

---

# 25. OBSERVABILITY

## Metrics
* Track `judgment_summarization_time`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Feed the service a mock JSON text representing a small court order. Assert that the service correctly parses the JSON response and separates the `brief_markdown` from the `verdict`.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Dissenting Opinions` | Appellate court judgments often contain a majority opinion and a dissenting opinion. The LLM must be explicitly prompted to summarize BOTH, clearly distinguishing the binding majority rule from the non-binding dissent. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `JUDGMENT_SUMMARY_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Large judgments are summarized using Map-Reduce.
* [ ] Extracts highly specific litigation metadata (Ratio, Verdict, Judge).
* [ ] Clearly distinguishes between majority and dissenting opinions.
* [ ] Detects and rejects non-judgment documents (e.g., contracts).

---

# 32. DEFINITION OF DONE

The Judgment & Court Order Summarization service is **DONE** when a litigator can upload a 300-page Supreme Court ruling and receive a 1-page FIRAC (Facts, Issue, Rule, Analysis, Conclusion) brief that perfectly captures the legal precedent established by the case.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Reject contracts).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an AI judicial clerk, reading massive court judgments and boiling them down into concise, structured Case Briefs.

## What the user sees
A standard law-school style Case Brief (Facts, Issue, Rule, Conclusion) accompanying their uploaded court documents.

## What happens in the background
The service evaluates the length of the document, applies a Map-Reduce strategy if necessary, and uses a high-tier LLM instructed specifically in litigation taxonomy to extract the exact legal precedent and verdict established by the judge.

## What it receives
Document IDs.

## What it produces
Markdown Case Briefs and JSON litigation metadata.

## Success means
Litigators can process case law research 10x faster, rapidly finding the exact precedents they need to win their case.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
