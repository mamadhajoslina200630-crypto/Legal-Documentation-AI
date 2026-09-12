# Legal AI Platform (Compliance Checking)

> **Purpose:** Complete implementation blueprint for `Compliance Checking`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Compliance Checking`

## 1.2 Service ID

`sys-compliance-check-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Compliance Checking service must:

* Evaluate legal documents (like Privacy Policies or Data Processing Agreements) against known external regulatory frameworks (e.g., GDPR, CCPA, HIPAA).
* Identify whether the document fulfills the specific requirements of the selected regulation (e.g., "Does this document grant users the Right to be Forgotten?").
* Output a structured Compliance Report detailing Pass/Fail statuses for each regulatory requirement.

The service must **not** check internal company rules (that belongs to Legal Risk Detection) or provide certified legal opinions guaranteeing a company won't be sued.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Regulatory fines are astronomical. Ensuring that every contract and public policy complies with shifting global data privacy laws is a massive manual burden. This service automates the initial compliance sweep, acting as a specialized regulatory auditor that instantly flags missing mandatory clauses.

## 1.7 User Value

Explain what the user gains from this service.
Confidence. A user can upload their website's Privacy Policy, select "GDPR", and instantly see a checklist showing exactly which GDPR requirements they meet and which ones they are missing.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that maps document text against a predefined database of regulatory frameworks, prompting the AI Gateway to evaluate compliance, and storing the resulting Audit Report in PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining the taxonomy of Regulatory Frameworks (GDPR, CCPA, etc.).
* Mapping specific regulatory requirements to AI prompts.
* Orchestrating the AI evaluation (Pass/Fail/Partial).
* Highlighting the specific text in the document that fulfills the requirement.
* Generating a Compliance Audit Report.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Custom playbook rules (Handled by Legal Risk Detection).
* Automatic drafting of missing clauses (Handled by Clause Drafting).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch document text | Text Chunks |
| `AIGateway` | To evaluate compliance | JSON Evaluation |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the Compliance Checklist).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User selects a document and chooses a framework (e.g., "Run GDPR Audit").

## 3.2 User Input
Selection of the regulatory framework.

## 3.3 User Flow

```text
User clicks "Run GDPR Audit"
  ↓
UI shows "Auditing against 25 GDPR requirements..."
  ↓
Service passes chunks to AI to check for presence of required clauses.
  ↓
Service saves the Audit Report to the database.
  ↓
UI displays a checklist. (e.g., "✅ Data Portability", "❌ Right to be Forgotten").
User clicks the ✅ to jump to the exact sentence proving compliance.
```

## 3.4 User States
* `Auditing`
* `Completed`

## 3.5 User-Visible Result
A Pass/Fail checklist organized by regulatory articles, with interactive text highlights.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Compliance Audit Workflow

```text
CELERY WORKER receives `run_compliance_audit(doc_id, framework_id)`
  ↓
Fetch all text chunks for `doc_id`.
Fetch all requirements for `framework_id` (e.g., Framework=GDPR, Req1="Right of Access").
  ↓
For each requirement:
  Send Prompt to AI Gateway:
  "Does the provided text satisfy this regulatory requirement? Return Status (PASS/FAIL) and the exact text that proves compliance."
  ↓
Parse AI JSON response.
  ↓
Aggregate results into a single `ComplianceAuditReport`.
  ↓
Save to database.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Document must have status `READY` |
| `framework_id`| `String` | Yes | Must map to a known framework (e.g., `gdpr_v1`) |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must raise `UnknownFrameworkError` if the user requests an audit against a regulation the system does not support.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database rows representing the Audit Report and individual Check Items.

## 6.2 Output Structure
```json
{
  "id": "uuid",
  "document_id": "uuid",
  "framework_name": "GDPR",
  "overall_status": "FAIL",
  "checks": [
    {
      "requirement_name": "Right of Access (Article 15)",
      "status": "PASS",
      "chunk_id": "uuid",
      "evidence_text": "Users may request a copy of their data at any time...",
      "ai_explanation": "The clause explicitly grants the user the right to access their data."
    },
    {
      "requirement_name": "Right to Erasure (Article 17)",
      "status": "FAIL",
      "chunk_id": null,
      "evidence_text": null,
      "ai_explanation": "The document makes no mention of deleting user data upon request."
    }
  ]
}
```

## 6.3 Output Rules
* Status MUST be an Enum: `PASS`, `FAIL`, `PARTIAL`, `NOT_APPLICABLE`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Evidence-Based Compliance:** If the AI marks a requirement as `PASS`, it MUST provide the exact `evidence_text` and the `chunk_id`. The user must be able to verify the AI's conclusion.
* **Conservative Failing:** If the AI is unsure if a vague clause satisfies a strict regulation, it must default to `FAIL` or `PARTIAL`. It is better to have a human double-check a false negative than to falsely certify a non-compliant document.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a document is missing sections required by the framework, the missing sections must be explicitly listed in the output as `FAIL` with a `chunk_id` of `null`.

## 7.4 Failure Rules
* See standard Celery AI retry logic.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Requires full document text. For large documents, the service may use semantic search (RAG) first to find the most relevant chunks before asking the AI to evaluate compliance, rather than passing a 200-page book to the AI to find one sentence about "Erasure".

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Regulatory interpretation and text matching.

## 9.4 AI Rules
* Use a high-reasoning model (e.g., GPT-4o).
* Instruct the model to assume the persona of a strict Regulatory Compliance Officer.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a strict Regulatory Compliance Officer auditing a document against the {framework_name}.
Your task is to determine if the document satisfies the following specific requirement:
"{requirement_description}"

If the document satisfies the requirement, output status "PASS" and extract the exact sentence that provides the evidence.
If it does not, output "FAIL".
Output must be strictly JSON. Do not invent or assume compliance.
```

## 10.4 Prompt Rules
* The prompt must clearly define the *intent* of the regulatory requirement, as legal documents may use different vocabulary (e.g., "Right to be Forgotten" vs "Deletion Request").

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* For massive documents, the service should query the Qdrant vector database for chunks semantically similar to the regulatory requirement (e.g., searching for "data deletion") to narrow down the text before prompting the LLM for the final Pass/Fail evaluation.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes entirely within Celery workers due to the high volume of LLM calls required to check dozens of regulatory requirements.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `compliance_audits` table.
* `compliance_checks` table (The individual line items).
* `regulatory_frameworks` table (Hardcoded definitions maintained by platform engineers).

## 13.5 Database Rules
* `regulatory_frameworks` must be system-global (no `workspace_id`), as GDPR is the same for everyone. The resulting `compliance_audits` MUST belong to a specific `workspace_id`.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `GET /api/v1/frameworks` (List available regulations to check against)
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/compliance-audits` (Start audit)
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/compliance-audits/{audit_id}` (Get results)

---

# 16. ERROR HANDLING

## Error Rules
N/A

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` before fetching document text and saving audit reports.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The `evidence_text` is the most critical output. A compliance audit is useless if it simply says "Pass" without showing the lawyer *where* the document passes.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* **CRITICAL DISCLAIMER:** The UI MUST display: *"This automated compliance check does not constitute a certified legal audit or legal advice. Passing this check does not guarantee immunity from regulatory fines. Always consult with qualified legal counsel."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution target: < 45 seconds for a standard framework (e.g., 20 checks) on a 30-page document.

## 20.2 Large Input Handling
* Use asyncio to run the independent framework checks concurrently against the AI Gateway.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/compliance_checking.py` | Orchestration |
| Frameworks     | `backend/app/schemas/frameworks/` | Hardcoded JSON files defining GDPR, CCPA, etc. |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [DocumentRepository]
       │
       ├──► [Qdrant] (Optional: Semantic search to narrow text)
       │
       ├──► [AIGateway] (Evaluate PASS/FAIL)
       │
       └──► [ComplianceRepository] (Save report)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log the final status of the audit.
  * `INFO: Compliance Audit [GDPR] on Doc 123 finished. Status: FAIL (15 Pass, 5 Fail).`

---

# 25. OBSERVABILITY

## Metrics
* Track usage of specific frameworks (e.g., `compliance_checks_gdpr_total`) to inform product management which regulations are most valuable to users.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Create a dummy document containing a clear "Right to Erasure" clause. Run the service with a mocked AI and assert that the check passes and the `chunk_id` is correctly recorded.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Not Applicable` | A document might be an Employment Contract, and the user accidentally runs a HIPAA (Healthcare) audit. The AI should flag most clauses as `NOT_APPLICABLE` rather than `FAIL`, as the document simply doesn't contain PHI. |

---

# 28. VERSIONING

## Compatibility Rules
* Laws change. Frameworks must be versioned (e.g., `gdpr_2018`, `cpra_2023`). If a law changes, do not overwrite the old framework; create a new version so users can audit against historical standards if necessary.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `COMPLIANCE_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Can evaluate documents against system-defined frameworks.
* [ ] "PASS" results always include the exact quoting text as evidence.
* [ ] Concurrent AI calls are used to speed up processing.
* [ ] Disclaimers regarding legal liability are strictly enforced in output data.

---

# 32. DEFINITION OF DONE

The Compliance Checking service is **DONE** when a user can upload a Privacy Policy, select GDPR, and receive a complete, itemized PASS/FAIL checklist proving exactly where the document meets the law and where it falls short.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an automated regulatory auditor, checking documents against external laws like GDPR or CCPA.

## What the user sees
An interactive checklist showing exactly which legal requirements they meet and which they are failing.

## What happens in the background
The service takes hardcoded regulatory requirements, scans the document text, and uses a high-tier LLM to judge whether the semantic meaning of the document satisfies the strict letter of the law, outputting a structured report with evidentiary citations.

## What it receives
Document IDs and a Framework ID.

## What it produces
A Compliance Audit Report.

## Success means
Companies can rapidly assess their exposure to regulatory fines without waiting weeks for expensive outside counsel to perform a manual review.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
