# Legal AI Platform (Clause Drafting & Rewriting)

> **Purpose:** Complete implementation blueprint for `Clause Drafting & Rewriting`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Clause Drafting & Rewriting`

## 1.2 Service ID

`sys-clause-rewrite-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Synchronous AI Generation Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Clause Drafting & Rewriting service must:

* Take a specific snippet of existing legal text (a clause) and a user instruction (e.g., "Make this mutual", "Soften this language", "Change net-30 to net-60").
* Use the AI Gateway to generate a new version of the clause that fulfills the instruction while maintaining the surrounding legal context and tone.
* Return the rewritten text synchronously so the frontend can immediately display it as a suggested redline to the user.

The service must **not** rewrite the entire document at once (Handled by Document Drafting) or decide on its own what needs rewriting without an explicit rule or instruction (Handled by Risk Detection).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Negotiating a contract requires constant redlining (editing) of clauses. Junior lawyers often struggle to find the precise legal phrasing to alter a counterparty's clause without breaking the contract's mechanics. This service acts as an instant redlining assistant, allowing a lawyer to simply dictate the *intent* of the change and letting the AI handle the exact legal phrasing.

## 1.7 User Value

Explain what the user gains from this service.
Speed in negotiation. When Risk Detection flags an "Unlimited Liability" clause, the user can click one button ("Mitigate") and this service instantly rewrites the clause to cap liability at $1M, providing perfectly formatted text they can paste directly into Word.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
An API endpoint that takes original text + an instruction prompt, passes it to the LLM, and returns the rewritten text synchronously to the client.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining context (understanding the clause within the broader document).
* Applying specific redline instructions.
* Preserving formatting and defined terms (e.g., not accidentally renaming "The Company" to "The Employer" during the rewrite).
* Generating the replacement text.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Actually modifying the underlying source PDF/Word file (This service only provides the *suggested* text; the user must accept it in their own editor).
* Long-running background jobs (This is a fast, interactive service).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AIGateway` | To generate the rewrite | Text output |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the rewrite suggestion UI).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user highlights a paragraph in the document viewer and types an instruction into a pop-up box, OR clicks a "Suggest Mitigation" button next to an identified risk.

## 3.2 User Input
Original Text + Instruction string.

## 3.3 User Flow

```text
User highlights text: "Party B shall indemnify Party A..."
User types: "Make this mutual." and clicks "Rewrite".
  ↓
UI shows a quick loading spinner (1-3 seconds).
  ↓
Service passes text + instruction to AI.
  ↓
Service returns rewritten text.
  ↓
UI displays the new text in a "diff" view, showing insertions in green and deletions in red.
User clicks "Copy to Clipboard" or "Accept Change" (if using the internal editor).
```

## 3.4 User States
* `Rewriting`
* `Reviewing Suggestion`

## 3.5 User-Visible Result
A text diff showing the exact changes required to fulfill the user's intent.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Rewriting Workflow

```text
HTTP REQUEST `POST /api/v1/clauses/rewrite`
  Body: { "original_text": "...", "instruction": "..." }
  ↓
Construct Prompt:
  System: "You are a senior lawyer revising a contract. You must alter the provided clause exactly as instructed. Do not change anything else."
  Original: [original_text]
  Instruction: [instruction]
  ↓
Send Prompt to AI Gateway.
  ↓
Receive generated text.
  ↓
(Optional Validation): If the AI output is 10x longer than the original, it hallucinated. Reject and retry.
  ↓
HTTP RESPONSE 200 OK -> `{ "rewritten_text": "..." }`
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `original_text`| `String` | Yes | The text to be changed |
| `instruction`  | `String` | Yes | How to change it |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `context_text` | `String` | `null` | Surrounding paragraphs to help the AI understand defined terms |

## 5.3 Input Validation Rules
* If `original_text` is empty, return a 400 Bad Request.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A JSON payload containing the new text.

## 6.2 Output Structure
```json
{
  "original_text": "Party B shall indemnify Party A...",
  "rewritten_text": "Each Party shall indemnify the other Party...",
  "explanation": "Modified to create a mutual indemnification obligation."
}
```

## 6.3 Output Rules
* The `rewritten_text` must NOT contain markdown formatting (unless the original did) and must NOT contain conversational filler (e.g., "Here is the rewritten clause:"). It must be pure drop-in replacement text.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Minimal Intervention:** The LLM MUST be instructed to change *only* the words necessary to fulfill the instruction. It must not aggressively rewrite the entire paragraph in a different tone, as this annoys counterparties during negotiations.
* **Defined Term Preservation:** If the original text capitalizes "The Company", the rewritten text must preserve that capitalization and not change it to "the business".

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Passing `context_text` (the paragraph before and after the target clause) is highly recommended so the LLM understands who "Party A" is, but it is not strictly required.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Precision text editing and legal logic application.

## 9.4 AI Rules
* Set `temperature=0.0`. This task requires absolute determinism. We want a precise surgical edit, not a creative rewriting exercise.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are an expert contract negotiator. Your task is to rewrite the provided clause based strictly on the user's instruction.
CRITICAL RULES:
1. Make ONLY the changes necessary to fulfill the instruction. Preserve the original phrasing, tone, and formatting as much as possible.
2. Preserve all Defined Terms exactly as written (e.g., do not change "Client" to "Customer").
3. Output ONLY the rewritten text. No conversational introductions.
```

## 10.2 User Prompt
```text
INSTRUCTION: {instruction}

SURROUNDING CONTEXT:
{context_text}

CLAUSE TO REWRITE:
{original_text}
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Direct text transformation based on user prompt.

---

# 12. BACKGROUND PROCESSING

N/A - Must be a fast, synchronous API call (Wait time < 5 seconds).

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. This is a stateless transformation service.

## 13.5 Database Rules
* The service may optionally log the prompt/response to an `ai_audit_logs` table for telemetry, but it does not maintain business state.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/clauses/rewrite`

---

# 16. ERROR HANDLING

## Error Rules
* Standard API error handling for AI provider timeouts.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Standard JWT bearer token authentication.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must remind users to read the rewritten text carefully to ensure it aligns with their strategic intent before sending it to a counterparty.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Synchronous API request must complete in `< 5 seconds`. Since clauses are usually short (100-300 words), the LLM generation time will be low.

## 20.2 Large Input Handling
* If the user highlights a 10-page document and hits "Rewrite", the API should reject it with a 400 Bad Request. This service is designed for clause-level (paragraph) edits. Document-level rewrites are handled by the Document Drafting service.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/clause_rewriting.py` | Prompt orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Route] ──► [Clause Rewriting Service] ──► [AIGateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Rewrote clause. Instruction: "Make mutual". Tokens: 150 In / 160 Out.`

---

# 25. OBSERVABILITY

## Metrics
* Track `clause_rewrite_latency`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Assert that the service strips leading/trailing quotes from the AI's response (a common LLM artifact when asked to "output only the text").

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Impossible Instructions` | If the instruction is "Turn this into a recipe for cake", the LLM should be prompted via System prompt to refuse the instruction and return: "Instruction not applicable to legal text." |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `REWRITE_MODEL` | Which LLM to use | Yes | `gpt-4o` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Returns only the raw rewritten text without conversational filler.
* [ ] Preserves defined terms and original tone.
* [ ] Responds in under 5 seconds.
* [ ] Rejects requests that are too large (e.g., > 1000 words).

---

# 32. DEFINITION OF DONE

The Clause Drafting & Rewriting service is **DONE** when a user can highlight a one-sided indemnification clause, click "Make Mutual", and instantly receive a perfectly drafted redline that they can paste directly into Microsoft Word.

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
Acts as a surgical redlining assistant, rewriting specific paragraphs based on human instructions.

## What the user sees
An instant "Track Changes" diff showing exactly how to edit a paragraph to achieve their negotiation goals.

## What happens in the background
The service takes the original text, injects strict "Minimal Intervention" rules, and uses an LLM at temperature 0.0 to surgically edit the words to fulfill the instruction without altering the surrounding legal context.

## What it receives
Original Text and an Instruction.

## What it produces
Rewritten Text.

## Success means
Junior lawyers can instantly draft complex redlines, drastically speeding up the back-and-forth of contract negotiations.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
