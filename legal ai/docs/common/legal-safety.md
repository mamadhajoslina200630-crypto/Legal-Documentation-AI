# Legal AI Platform (Legal Safety & Ethics)

> **Purpose:** Complete implementation blueprint for `Legal Safety & Ethics`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Safety & Guardrails`

## 1.2 Service ID

`sys-common-legal-safety`

## 1.3 Service Category

`Common Infrastructure / Compliance`

## 1.4 Service Type

`Middleware / Interceptor`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Safety service must:

* Act as a strict guardrail against the Unauthorized Practice of Law (UPL) by ensuring the AI never provides definitive legal advice or tells a user what action they *must* take.
* Enforce the automatic attachment of legally mandated disclaimers to all AI-generated outputs, reports, and exported documents.
* Perform PII (Personally Identifiable Information) and PHI (Protected Health Information) detection and redaction on prompts *before* they leave the secure boundary to hit external LLM providers (if applicable).
* Detect and block malicious or extremely high-risk prompts (e.g., "Help me draft a contract to hide assets from the IRS").

The service must **not** generate the actual legal analysis. It acts solely as a filter, censor, and disclaimer engine.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
The legal industry is heavily regulated. If a software platform gives incorrect "advice" that a user relies on to their detriment, the software provider can be sued for malpractice or UPL. Furthermore, uploading unredacted client financial data to public AI models violates Attorney-Client Privilege. This service exists to protect the AI vendor and the Law Firm from catastrophic liability.

## 1.7 User Value

Explain what the user gains from this service.
Safety and compliance. The user can confidently deploy this AI to their junior staff or clients, knowing that the AI is hardcoded to stay within ethical bounds and will not leak sensitive data.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A set of prompt interceptors and output formatters that scrub incoming data for PII, scan queries for ethical violations, and wrap all outbound AI responses in standard disclaimers.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Prompt injection filtering (preventing users from bypassing safety rules).
* UPL detection (flagging questions that demand definitive legal counsel).
* PII/PHI Redaction (replacing names, SSNs, bank accounts with placeholders like `[REDACTED_SSN]`).
* Mandatory UI and Document Disclaimers.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Standard RBAC authorization (Handled by Workspace Service).
* General cyber-security (e.g., SQL injection prevention is handled by the ORM, not this service).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AI Gateway` | To intercept requests | Prompt Payloads |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**AI Gateway** (uses this as middleware).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User asks a highly sensitive or borderline unethical question in the Chat.

## 3.2 User Input
"My business partner doesn't know about this bank account. Write a clause that keeps it out of the dissolution agreement without mentioning it."

## 3.3 User Flow

```text
User submits prompt.
  ↓
Legal Safety Middleware scans the prompt for intent.
  ↓
Middleware detects intent to commit fraud/concealment.
  ↓
Middleware rejects the prompt entirely.
  ↓
UI displays: "I cannot assist with drafting clauses intended to conceal assets or deceive counterparties. I can only assist with standard dissolution agreements."
```

## 3.4 User States
* `Request Blocked`
* `Redacted Processing`

## 3.5 User-Visible Result
A polite but firm refusal to violate legal ethics, and prominent disclaimers on all exported reports.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Safety Interception Workflow

```text
HTTP REQUEST from internal service to `AI Gateway`
  ↓
Gateway passes prompt through `LegalSafety.scan(prompt)`
  ↓
[Step 1: PII Redaction]
Run fast Regex / local NLP model (e.g., Presidio) to find SSNs, Bank Accounts.
Replace with `[REDACTED]`.
  ↓
[Step 2: Intent Scanning]
Run a fast, lightweight classification model on the prompt.
If intent == `UPL` or `MALICIOUS`:
  Abort request. Return canned safety response.
  ↓
[Step 3: Execution]
Pass redacted, safe prompt to LLM.
  ↓
[Step 4: Output Formatting]
Receive LLM response.
De-redact (replace `[REDACTED]` with the original local variable if necessary for the user to read).
Append standard Legal Disclaimer string to the bottom of the text.
  ↓
RETURN to calling service.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `prompt_text` | `String` | Yes | The text to be scanned |
| `workspace_id`| `UUID` | Yes | For logging safety violations |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
N/A

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A sanitized prompt (going forward) or a sanitized response (going backward).

## 6.2 Output Structure
```json
{
  "is_safe": true,
  "sanitized_prompt": "Review the contract for [REDACTED_ENTITY].",
  "disclaimer_appended": "Disclaimer: This is AI-generated analysis..."
}
```

## 6.3 Output Rules
N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **UPL Strictness:** The system prompt injected into EVERY AI model must contain: *"You are an AI assistant, not an attorney. You must never give definitive legal advice or guarantee legal outcomes. Always advise the user to consult qualified counsel for final decisions."*
* **Disclaimer Permanence:** If the user exports an AI summary to PDF or DOCX, the system MUST embed the legal disclaimer in the footer of every page of the exported document. It cannot just be in the UI.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* If the PII redaction engine fails or crashes, the AI Gateway MUST fail closed (reject the prompt) rather than passing potentially sensitive data unredacted to an external provider.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Classification of harmful intents.

## 9.4 AI Rules
* Intent scanning should use a fast, fine-tuned classification model (or OpenAI's Moderation API), not a slow reasoning LLM, to prevent adding latency to every single chat request.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `safety_violations_log` table.

## 13.5 Database Rules
* Log all rejected prompts (UPL, Fraud, Malicious) so Workspace Admins can review if a specific user is attempting to misuse the system.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* Internal library/middleware.

---

# 16. ERROR HANDLING

## Error Rules
N/A

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
N/A

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* *This service is the source of all disclaimers.*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* PII scanning and Intent classification must complete in `< 50ms`. Microsoft Presidio or fast Regex engines should be used for PII to avoid heavy NLP bottlenecks.

## 20.2 Large Input Handling
N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Middleware     | `backend/app/core/safety.py` | Prompt scanning and redaction |

---

# 22. SERVICE CONNECTIONS

```text
[Internal Service] ──► [AI Gateway] ──► [Legal Safety Middleware] ──► [External LLM]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `WARN: Blocked prompt from User 123 in Workspace 456 due to UPL violation.`

---

# 25. OBSERVABILITY

## Metrics
* Track `prompt_rejection_rate`.
* Track `pii_redaction_count`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test PII Redaction:** Pass a string with a Social Security Number. Assert the output replaces it with `[REDACTED_SSN]`.
* **Test Disclaimer:** Assert that the final output payload always ends with the exact approved legal disclaimer string.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `False Positives` | If the AI is too aggressive at blocking UPL, it becomes useless for legal research. The classification must distinguish between "What is the penalty for murder in Texas?" (Safe research) and "I murdered someone, what should I tell the cops?" (Unsafe advice). |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `ENABLE_PII_REDACTION` | Toggle redaction engine | Yes | `true` |
| `LEGAL_DISCLAIMER_TEXT` | The exact string to append | Yes | `"This is an AI generated..."` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Appends disclaimers to all AI outputs.
* [ ] Redacts standard PII patterns (SSN, Credit Cards) before external API calls.
* [ ] Blocks explicit requests for unethical legal drafting.
* [ ] Adds `< 50ms` latency to the AI Gateway.

---

# 32. DEFINITION OF DONE

The Legal Safety service is **DONE** when the platform's Terms of Service and Malpractice Insurance requirements are mathematically enforced in code, ensuring no user can ever trick the AI into acting as a licensed attorney.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Fail closed on PII).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the Ethics and Compliance filter for all AI interactions.

## What the user sees
Polite refusals if they ask inappropriate questions, and standard legal disclaimers reminding them not to blindly trust the AI.

## What happens in the background
A fast middleware scans every prompt for PII to protect client confidentiality, evaluates the intent to ensure it doesn't violate bar association ethics rules, and forcibly appends liability disclaimers to all outgoing data.

## What it receives
Raw prompts and raw AI responses.

## What it produces
Sanitized prompts and compliant responses.

## Success means
The software provider is protected from malpractice lawsuits, and law firms are protected from Attorney-Client Privilege breaches.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
