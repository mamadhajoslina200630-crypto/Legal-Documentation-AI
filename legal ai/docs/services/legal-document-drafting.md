# Legal AI Platform (Legal Document Drafting)

> **Purpose:** Complete implementation blueprint for `Legal Document Drafting`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Document Drafting`

## 1.2 Service ID

`sys-legal-doc-drafting-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Document Drafting service must:

* Generate net-new, complete legal documents (e.g., NDAs, Employment Agreements, Master Services Agreements) based on a set of user-provided parameters and variables.
* Utilize the AI Gateway to seamlessly weave specific business terms (names, dates, dollar amounts) into standard, legally sound boilerplate language.
* Optionally utilize RAG to fetch the company's past contracts to match the firm's preferred tone and style.
* Output a formatted document (Markdown or HTML) that can be edited in a rich-text editor by the user.

The service must **not** perform legal research or answer chat questions (handled by Legal Search and Chat). It is strictly a document generation engine.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Drafting a routine contract from a template usually involves a lawyer finding an old Word document, using "Find and Replace" for the client's name, and manually rewriting a few clauses to fit the new deal. This is slow and highly prone to copy-paste errors (leaving the old client's name in paragraph 12). This service automates the generation of first drafts, reducing a 2-hour task to 30 seconds.

## 1.7 User Value

Explain what the user gains from this service.
A massive head start. Instead of starting with a blank page or a messy old template, the user fills out a quick web form ("Who is the client? What is the fee?") and instantly receives a perfectly formatted, 90% complete first draft ready for final review.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
An API endpoint that takes a set of JSON parameters and a template ID, prompts an LLM to generate the contract text, and saves the resulting draft to the database for the user to edit in the UI.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining a repository of standard "Prompts/Templates" (e.g., "Standard Mutual NDA").
* Injecting user-provided variables (JSON) into the drafting prompt.
* Instructing the LLM to output clean Markdown.
* Executing RAG (optional) to pull stylistic examples from the user's workspace.
* Saving the generated draft to the `DraftDocuments` table.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Clause-by-clause rewriting of an *existing* uploaded document (Handled by Clause Drafting/Rewriting).
* E-Signature integration (Handled by a separate integration service).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `TemplateRepository` | To fetch drafting rules | Template Prompt |
| `AIGateway` | To generate the text | Markdown output |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend Editor** (to allow the user to modify the drafted text).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User clicks "Create New Document" -> "From AI Template".

## 3.2 User Input
A web form capturing key variables (e.g., `Party A Name`, `State of Jurisdiction`, `Payment Terms`).

## 3.3 User Flow

```text
User fills out the intake form and clicks "Generate Draft".
  ↓
UI shows "Drafting Document..."
  ↓
Service constructs a massive prompt containing the template instructions and the user variables.
  ↓
Service calls AI Gateway.
  ↓
Service saves the generated Markdown to the database.
  ↓
UI redirects the user to a Rich Text Editor loaded with the generated draft.
```

## 3.4 User States
* `Drafting`
* `Reviewing`

## 3.5 User-Visible Result
A fully populated, formatted legal document in an editable web interface.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Generative Drafting Workflow

```text
CELERY WORKER receives `generate_draft(template_id, parameters_json)`
  ↓
Fetch the Base Prompt for `template_id` (e.g., "Draft a California NDA...").
  ↓
(Optional RAG Phase):
  If the template requests style matching, query Qdrant for "NDA" in this workspace to fetch examples of how this company usually writes NDAs.
  ↓
Construct Final Prompt:
  System: "You are an expert contract drafter..."
  Context (Style Examples): [...]
  Instructions: [Base Prompt]
  Variables: [parameters_json]
  ↓
Send Prompt to AI Gateway.
  ↓
Receive generated Markdown text.
  ↓
Save to `DraftDocument` database table.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `template_id` | `UUID` | Yes | Maps to a known prompt instruction set |
| `parameters`  | `JSON` | Yes | Key-value pairs provided by the user |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `match_style` | `Boolean`| `false`     | If true, execute RAG to mimic past documents |

## 5.3 Input Validation Rules
* Must validate `parameters` against the schema defined by the `template_id`. If the template requires `governing_law`, and the user didn't provide it, the service must return a 400 Bad Request before calling the AI.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A new database row representing the drafted document.

## 6.2 Output Structure
```json
{
  "draft_id": "uuid",
  "template_name": "Standard Mutual NDA",
  "status": "DRAFTED",
  "content_markdown": "# NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement (this \"Agreement\") is entered into as of October 1, 2024, by and between Acme Corp..."
}
```

## 6.3 Output Rules
* The output MUST be clean, standard Markdown. The LLM must be instructed not to wrap the output in ```markdown blocks, just output the raw text.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **No Placeholders:** The AI must NEVER output placeholders like `[Insert Date Here]` if that data was provided in the `parameters`. It must weave the variables naturally into the text.
* **Jurisdictional Accuracy:** If the `parameters` specify "New York Law", the LLM must be instructed to utilize standard clauses that comply with New York state law.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a parameter is missing and is not strictly required by the template schema, the LLM should be instructed to output a highly visible bracketed placeholder (e.g., `[MISSING: PAYMENT TERMS]`) so the lawyer knows to fill it in manually.

## 7.4 Failure Rules
* See standard Celery AI retry logic.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* If `match_style=true`, the service relies on Qdrant to fetch previous documents.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Generative writing and legal templating.

## 9.4 AI Rules
* Set `temperature=0.2`. Drafting requires a slight amount of creativity to weave sentences together naturally, but must remain highly deterministic to avoid hallucinating wild legal concepts.
* Use a high-tier model (GPT-4o or Claude 3.5 Sonnet) capable of generating long-form content (often 2,000+ tokens of output).

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert corporate attorney. Your task is to draft a complete, legally binding document based on the provided instructions and variables.
Do not include any conversational filler (e.g., "Here is your document:").
Output only the pure text of the contract, formatted in clean Markdown.
Ensure all provided variables are seamlessly integrated into the legal text.
```

## 10.2 User Prompt
```text
DOCUMENT TYPE: {template_name}
INSTRUCTIONS: {template_instructions}

DEAL VARIABLES:
{parameters_json}

Draft the document now.
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* (Optional) Queries Qdrant to find 2-3 examples of the requested document type from the user's workspace to use as stylistic guides.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task. Generating a 10-page contract can take the AI Gateway 30-60 seconds.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `draft_documents` table.
* `drafting_templates` table.

## 13.5 Database Rules
* `DraftDocument` is distinct from the main `Document` table. A Draft is a living text object edited in the UI, whereas a main `Document` is an immutable, uploaded PDF/Word file used as a source of truth.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `GET /api/v1/templates`
* `POST /api/v1/workspaces/{id}/drafts/generate` (Triggers job, returns 202)
* `GET /api/v1/workspaces/{id}/drafts/{draft_id}` (Fetch completed draft)
* `PUT /api/v1/workspaces/{id}/drafts/{draft_id}` (For the frontend editor to save user edits)

---

# 16. ERROR HANDLING

## Error Rules
* See 5.3 (Parameter schema validation).

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` when accessing templates and saving drafts.

---

# 18. SOURCE & TRACEABILITY

N/A - This is a generative service creating net-new text, not extracting from a source.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI editor must display: *"This draft was generated by AI. It must be reviewed by qualified legal counsel before use. The platform assumes no liability for the enforceability of this document."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution time: Target < 45 seconds for a standard 5-page draft.

## 20.2 Large Input Handling
* Output limits: Ensure the LLM `max_tokens` is set high enough (e.g., 4000) so the contract does not cut off mid-sentence.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/document_drafting.py` | Orchestration |
| Templates      | `backend/app/schemas/templates/` | Hardcoded JSON schema definitions for templates |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [TemplateRepository]
       │
       ├──► (Optional) [Qdrant]
       │
       ├──► [AIGateway] (Generate text)
       │
       └──► [DraftRepository] (Save Markdown)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Generated draft 123 (Template: Mutual NDA) in 28 seconds. Tokens: 350 In / 1200 Out.`

---

# 25. OBSERVABILITY

## Metrics
* Track `template_usage_count` to determine which drafting templates are most valuable to users.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Pass a mock parameter JSON `{"party_a": "Google", "state": "CA"}` to the service. Mock the AI response. Assert that the resulting database row correctly stores the AI's markdown string.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Contradictory Inputs` | The user selects a "Non-Compete Agreement" template but inputs a parameter `jurisdiction = California`. Non-competes are largely illegal in CA. The LLM should be prompted to flag this in the generated text (e.g., `[WARNING: Non-compete clauses are generally unenforceable in California. Seek local counsel.]`). |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `DRAFTING_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Service validates user input against the template schema before drafting.
* [ ] Generates clean, well-formatted Markdown without conversational AI filler.
* [ ] Seamlessly weaves provided variables into the legal text.
* [ ] Exposes endpoints for the UI to retrieve and edit the generated draft.

---

# 32. DEFINITION OF DONE

The Legal Document Drafting service is **DONE** when a user can fill out 5 text fields in a web form and instantly receive a highly professional, 10-page Master Services Agreement that looks like it took a senior associate 3 hours to write.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Drafts are separate from uploaded Source Documents).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an AI Junior Associate capable of drafting net-new contracts from scratch based on a few key parameters.

## What the user sees
A simple intake form that magically outputs a fully formatted, editable contract draft in seconds.

## What happens in the background
The service merges user inputs with strict templating rules, optionally pulls stylistic examples from the firm's past documents via vector search, and instructs a high-tier LLM to generate the lengthy legal text, saving it as editable Markdown.

## What it receives
Template ID and User Parameters (JSON).

## What it produces
A Markdown document.

## Success means
Law firms stop wasting hours copying, pasting, and rewriting old templates to start new deals.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
