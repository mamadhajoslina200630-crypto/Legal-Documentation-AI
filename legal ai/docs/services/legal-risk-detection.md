# Legal AI Platform (Legal Risk Detection)

> **Purpose:** Complete implementation blueprint for `Legal Risk Detection`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Risk Detection`

## 1.2 Service ID

`sys-legal-risk-detection-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Risk Detection service must:

* Analyze extracted clauses and document text against a predefined "Legal Playbook" (a set of rules defining what is acceptable vs. dangerous for a specific workspace).
* Identify deviations from the Playbook (e.g., "Unlimited Liability", "Auto-renewal without notice").
* Assign a severity score (High, Medium, Low) to each identified risk.
* Generate a human-readable explanation of the risk and propose mitigation language.

The service must **not** extract the clauses itself (that is handled by Clause Information Extraction). It only analyzes data that has already been extracted.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Missing a one-line "auto-renewal" clause buried on page 40 of a contract can cost a company millions of dollars. Junior lawyers spend hundreds of hours manually checking contracts against company policies to prevent this. This service automates that review, acting as an instant, tireless senior partner that flags dangerous terms immediately.

## 1.7 User Value

Explain what the user gains from this service.
Peace of mind and massive time savings. The user sees a traffic-light dashboard (Red/Yellow/Green) highlighting the specific dangers in a contract before they even start reading it.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A background pipeline that takes a set of extracted clauses, prompts the LLM to evaluate them against a Playbook, and saves a structured list of `IdentifiedRisks` (including severity and mitigation advice) to the database.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Managing and applying the "Legal Playbook" rules.
* Prompting the AI Gateway for legal reasoning and risk assessment.
* Categorizing risk severity (High, Medium, Low).
* Generating mitigation recommendations (e.g., suggested redlines).
* Storing the risk assessment linked to the specific document chunk.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Actually rewriting the document (Handled by Clause Drafting/Rewriting).
* Checking regulatory compliance like GDPR (Handled by Compliance Checking).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `ClauseExtractionService`| To get the structured clauses | JSON Clauses |
| `AIGateway` | To perform legal reasoning | JSON Risk Assessments |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the Risk Dashboard).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user opens a document and clicks the "Risk Analysis" tab.

## 3.2 User Input
Selection of a specific "Playbook" (e.g., "Standard Vendor Playbook" or "Aggressive Sales Playbook").

## 3.3 User Flow

```text
User selects "Vendor Playbook" and clicks "Analyze Risks".
  ↓
UI shows "Evaluating against Playbook rules..."
  ↓
Service passes extracted clauses and Playbook rules to the AI Gateway.
  ↓
Service saves the identified risks to the database.
  ↓
UI updates to show 3 High Risks (Red) and 2 Medium Risks (Yellow).
User clicks a Red risk and the PDF viewer highlights the dangerous text.
```

## 3.4 User States
* `Evaluating`
* `Completed`

## 3.5 User-Visible Result
An interactive risk dashboard and PDF highlights.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Risk Detection Workflow

```text
CELERY WORKER receives `detect_risks(doc_id, playbook_id)`
  ↓
Fetch all `ExtractedClauses` for `doc_id`.
Fetch `PlaybookRules` for `playbook_id`.
  ↓
For each rule in the Playbook (e.g., "Liability must be capped at 1x"):
  Find the relevant extracted clause.
  If clause missing -> Flag as "Missing Required Clause" Risk.
  If clause present -> Send to AI Gateway:
    "Does this clause violate this rule? Return severity and explanation."
  ↓
Parse AI JSON response.
  ↓
If Risk == True:
  Save to `IdentifiedRisk` database table (linked to `chunk_id`).
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `document_id` | `UUID` | Yes | Clauses must already be extracted |
| `playbook_id` | `UUID` | Yes | Defines the rules to check against |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must raise `ClausesNotExtractedError` if the prerequisite Clause Extraction service has not finished running on this document.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Database rows representing identified risks.

## 6.2 Output Structure
```json
{
  "id": "uuid",
  "document_id": "uuid",
  "chunk_id": "uuid",
  "playbook_rule_id": "uuid",
  "severity": "HIGH",
  "risk_title": "Uncapped Liability",
  "explanation": "The vendor has explicitly stated liability is unlimited, violating rule 4.",
  "mitigation_suggestion": "Insert: 'Total liability shall not exceed the fees paid in the prior 12 months.'"
}
```

## 6.3 Output Rules
* Severity must be strictly constrained to an Enum (`HIGH`, `MEDIUM`, `LOW`, `INFO`).

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Rule-Based Grounding:** The AI must NEVER invent its own idea of what a "risk" is. It must ONLY flag a clause if it violates a specific rule defined in the user's selected `Playbook`. A clause that is dangerous for a Vendor might be highly desirable for a Seller.
* **Explainability:** Every flagged risk MUST include a plain-English explanation of *why* it violates the playbook, quoting the specific offending text.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a Playbook rule requires a clause (e.g., "Must have Governing Law = NY"), and the clause is completely missing from the document, the `chunk_id` in the output should be `null`, and the risk should be flagged at the document level.

## 7.4 Failure Rules
* If the AI Gateway returns an ambiguous response (e.g., "Maybe it's a risk"), Pydantic validation must fail it, and the service must retry with a stricter prompt.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Requires the `chunk_id` from the Clause Extraction service to allow the UI to jump to the text.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Legal reasoning and comparative analysis.

## 9.4 AI Rules
* This requires the highest tier of reasoning available (e.g., GPT-4-Turbo or Claude 3.5 Sonnet). Do not use fast/cheap models for risk detection, as nuance is critical (e.g., distinguishing between "gross negligence" and "negligence").

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert legal auditor. Your task is to compare a specific contract clause against a strict Playbook Rule.
Determine if the clause violates the rule. 
If it does, classify the severity (HIGH/MEDIUM/LOW based on the playbook guidelines), explain exactly why, and propose a redline mitigation.
Output strictly as JSON matching the requested schema.
```

## 10.2 User Prompt
```text
Playbook Rule: {rule_text}
Contract Clause: {clause_text}

Does the clause violate the rule? Generate the JSON assessment.
```

## 10.4 Prompt Rules
* The prompt must instruct the AI to be objective. It should act as a judge comparing Text A against Rule B.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - This uses exact clause text, not semantic search.

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Executes as a Celery Worker task. Evaluating 50 rules against 50 clauses requires dozens of LLM calls and must be done asynchronously.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `identified_risks` table.
* `playbooks` table (User-defined collections of rules).
* `playbook_rules` table.

## 13.5 Database Rules
* `IdentifiedRisk` must have a foreign key to `Document`, `Chunk` (nullable), and `PlaybookRule`.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/documents/{doc_id}/analyze-risks`
* `GET /api/v1/workspaces/{id}/documents/{doc_id}/risks`
* `POST /api/v1/workspaces/{id}/playbooks` (CRUD operations for managing the rules)

---

# 16. ERROR HANDLING

## Error Rules
* See 7.4.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Playbooks are highly proprietary to a law firm or company. The service MUST enforce `workspace_id` checks when fetching a playbook to ensure one company cannot see another company's risk thresholds.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The explanation generated by the AI MUST quote the specific phrase from the contract that triggered the risk flag.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must display: *"Risk detection is AI-assisted and based strictly on the selected Playbook. It does not replace human legal review. False negatives may occur."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Celery task execution target: < 30 seconds for a standard 50-rule playbook check.

## 20.2 Large Input Handling
* **Asynchronous LLM Calls:** The service should use `asyncio.gather` (within the async Celery worker or FastAPI background task) to evaluate multiple rules concurrently against the AI Gateway, rather than evaluating rule 1, waiting, then evaluating rule 2.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/legal_risk_detection.py` | Orchestration |
| Playbook Mgt   | `backend/app/services/playbook_service.py` | Managing the rules |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [ClauseRepository] (Fetch clauses)
       │
       ├──► [PlaybookRepository] (Fetch rules)
       │
       ├──► [AIGateway] (Evaluate matches)
       │
       └──► [RiskRepository] (Save results)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log the summary of the run:
  * `INFO: Risk Detection on Doc 123 complete. Found 3 HIGH, 1 MEDIUM, 0 LOW.`

---

# 25. OBSERVABILITY

## Metrics
* Track the average severity distribution. If 99% of documents have "HIGH" risks, the default Playbooks might be tuned too aggressively.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Create a test with a "Rule: No Auto-Renewal" and a "Clause: This contract shall automatically renew." Assert that the service correctly flags it as a HIGH risk.
* Create a test with the same rule, but a "Clause: This contract expires on Jan 1." Assert that the service correctly flags NO risk.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Contradictory Clauses` | A document might have a general limitation of liability, but a later clause creates an exception. The AI must be prompted to consider the holistic context of the extracted clauses if resolving a rule. |

---

# 28. VERSIONING

## Compatibility Rules
* If a Playbook is modified (a rule is changed), existing `IdentifiedRisks` on old documents should NOT be deleted or updated automatically. They represent the state of the document at the time it was analyzed against the *old* rule.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `RISK_EVAL_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Evaluates text strictly against user-defined Playbooks, not general knowledge.
* [ ] Outputs strict JSON conforming to the Risk schema.
* [ ] Identifies missing clauses (e.g., missing governing law).
* [ ] Generates actionable mitigation text.

---

# 32. DEFINITION OF DONE

The Legal Risk Detection service is **DONE** when a user can define a simple playbook ("I want net-30 payment terms"), upload a contract that says "net-90", and have the system instantly flag it in red with a suggestion to change it to net-30.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.** (Clear old risks before re-running the analysis).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as an automated contract auditor, scanning for dangerous terms and deviations from company policy.

## What the user sees
A traffic-light dashboard (Red/Yellow/Green) that instantly highlights the most dangerous parts of a 100-page contract.

## What happens in the background
The service fetches previously extracted clauses, compares them concurrently against a database of user-defined rules using a high-tier LLM, and records any violations along with AI-generated mitigation strategies.

## What it receives
Extracted clauses and Playbook rules.

## What it produces
Severity scores, explanations, and redline suggestions.

## Success means
Legal teams never miss a hidden liability clause, significantly reducing corporate risk and speeding up contract negotiation.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
