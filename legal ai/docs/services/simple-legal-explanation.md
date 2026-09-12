# Legal AI Platform (Simple Legal Explanation)

> **Purpose:** Complete implementation blueprint for `Simple Legal Explanation`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Simple Legal Explanation`

## 1.2 Service ID

`sys-simple-explanation-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Synchronous AI Generation Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Simple Legal Explanation service must:

* Take a snippet of dense, complex legal text ("legalese").
* Prompt the AI Gateway to "translate" that text into plain, accessible, everyday language.
* Break down complex mechanics (e.g., indemnification formulas) into simple analogies or step-by-step bullet points.
* Return the explanation synchronously to the client.

The service must **not** rewrite the original document (Handled by Clause Rewriting) or provide legal advice on whether the user *should* sign the document (Handled by Risk Detection).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers often send 50-page contracts to their business clients. The business client doesn't understand the dense Latin phrases or nested clauses and constantly emails the lawyer asking, "What does paragraph 14 actually mean?" This service empowers non-lawyers to instantly understand what they are reading without bothering their expensive legal counsel.

## 1.7 User Value

Explain what the user gains from this service.
An "Explain it to me like I'm 5" button for legal documents. The user gains immediate comprehension of their obligations and risks without needing a law degree.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
An API endpoint that takes original legal text, passes it to the LLM with a specialized "Plain English" prompt, and returns a short, highly readable explanation to the UI.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Managing the "Plain Language" prompt instructions.
* Stripping out unnecessary Latin terms and replacing them with modern equivalents.
* Formatting the output for maximum readability (bullet points, short sentences).
* Returning the explanation to the frontend UI.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Translating to foreign languages (Handled by Legal Document Translation).
* Modifying the actual underlying contract file.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AIGateway` | To generate the explanation | Text output |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the explanation popover/sidebar).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user highlights a confusing paragraph in the document viewer and clicks a lightbulb icon ("Explain").

## 3.2 User Input
Highlighted text.

## 3.3 User Flow

```text
User highlights text: "Party A shall indemnify and hold harmless Party B from all encumbrances..."
User clicks "Explain".
  ↓
UI shows a loading shimmer over a sidebar card.
  ↓
Service passes text to AI.
  ↓
Service returns plain-English explanation.
  ↓
UI displays the card: "If Party B gets sued because of something Party A did, Party A has to pay for the lawyers and any fines."
```

## 3.4 User States
* `Generating`
* `Viewing Explanation`

## 3.5 User-Visible Result
A conversational, easy-to-read pop-up box explaining the highlighted text.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Explanation Workflow

```text
HTTP REQUEST `POST /api/v1/clauses/explain`
  Body: { "text": "..." }
  ↓
Construct Prompt:
  System: "You are a friendly legal educator. Translate the provided legalese into plain, 8th-grade reading level English. Use analogies if helpful. Do not give legal advice."
  Text: [text]
  ↓
Send Prompt to AI Gateway.
  ↓
Receive generated explanation.
  ↓
HTTP RESPONSE 200 OK -> `{ "explanation": "..." }`
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `text`    | `String` | Yes | The legalese to be explained |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must reject requests where `text` exceeds a reasonable length (e.g., > 1000 words), as explaining a whole book at once defeats the purpose of "simple" explanations.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A JSON payload containing the plain-English text.

## 6.2 Output Structure
```json
{
  "original_text": "Party A shall indemnify...",
  "explanation": "If someone sues Party B because of Party A's mistake, Party A has to cover all the costs (like lawyer fees and court fines)."
}
```

## 6.3 Output Rules
* The explanation MUST NOT contain legal jargon. If the AI uses the word "Indemnify" in its explanation, the prompt has failed.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **No Legal Advice:** The AI must explicitly avoid telling the user what they *should* do. It must only explain what the text *says*. (e.g., DO NOT say: "This is a bad clause, you shouldn't sign it." DO say: "This clause means you will have to pay a fee if you cancel early.")
* **Reading Level:** The output should target an 8th-grade reading level (Flesch-Kincaid scale) to ensure maximum accessibility for non-native speakers and laypeople.

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
N/A - Operates on pure text snippets.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Simplification, summarization, and educational translation.

## 9.4 AI Rules
* Set `temperature=0.4`. A slightly higher temperature allows the LLM to come up with helpful analogies (e.g., comparing a software license to renting an apartment) rather than just swapping out synonyms.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a friendly legal educator helping a non-lawyer understand a contract.
Your task is to translate the provided "legalese" into plain, everyday English.
CRITICAL RULES:
1. Write at an 8th-grade reading level.
2. Absolutely no legal jargon (e.g., do not use words like 'indemnify', 'heretofore', 'injunctive').
3. Use bullet points or simple analogies if the clause describes a complex process.
4. Do NOT give legal advice. Just explain what the text means mechanics-wise.
```

## 10.2 User Prompt
```text
TEXT TO EXPLAIN:
{text}
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A - Synchronous API request.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. Stateless service.

## 13.5 Database Rules
N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/clauses/explain`

---

# 16. ERROR HANDLING

## Error Rules
N/A

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
* The UI must display: *"This is a simplified AI explanation for educational purposes. It is not legal advice and does not replace the binding language of the contract."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Synchronous API request must complete in `< 4 seconds`.

## 20.2 Large Input Handling
* See 5.3 (Reject massive text blocks).

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/clause_explanation.py` | Prompt orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Route] ──► [Clause Explanation Service] ──► [AIGateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Explained clause. Tokens: 120 In / 80 Out.`

---

# 25. OBSERVABILITY

## Metrics
* Track usage counts to see if users are relying heavily on explanations, which might indicate the platform's standard templates are too complex.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Feed the AI a string containing "Mutatis Mutandis". Assert the mocked output returns a string that does not contain "Mutatis Mutandis" but does contain "the necessary changes having been made."

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Non-Legal Text` | If the user highlights a recipe for cookies that happens to be in a document, the AI should simply explain the recipe simply, or politely note that it doesn't appear to be legal text. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `EXPLAIN_MODEL` | Which LLM to use | Yes | `gpt-4o-mini` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Outputs plain, jargon-free English.
* [ ] Formats complex processes as bullet points.
* [ ] Does not offer legal advice on whether to sign.
* [ ] Responds in under 4 seconds.

---

# 32. DEFINITION OF DONE

The Simple Legal Explanation service is **DONE** when a non-lawyer can highlight an impenetrable paragraph about "Limitation of Liability", click a button, and instantly understand exactly how much money they could lose if something goes wrong.

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
Acts as a friendly, patient legal tutor for non-lawyers.

## What the user sees
An instant pop-up that translates terrifying legal jargon into simple, everyday concepts.

## What happens in the background
The service intercepts the highlighted text and instructs an LLM to actively avoid jargon, target an 8th-grade reading level, and output a purely factual, educational translation of the mechanics of the clause.

## What it receives
Dense legal text.

## What it produces
Plain-English explanations.

## Success means
Business teams can review contracts faster without bottlenecking the legal department with constant questions about what standard clauses mean.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
