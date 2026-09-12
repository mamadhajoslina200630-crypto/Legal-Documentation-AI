# Legal AI Platform (Indian Legal Context Assistant)

> **Purpose:** Complete implementation blueprint for `Indian Legal Context Assistant`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Indian Legal Context Assistant`

## 1.2 Service ID

`sys-indian-context-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Backend Domain Service / Specialized Prompt Engine`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Indian Legal Context Assistant service must:

* Inject deep, specialized knowledge of the Indian legal and regulatory framework into the AI Platform's core services (Chat, Risk Detection, Document Drafting).
* Identify and validate India-specific legal mechanics within documents (e.g., verifying Stamp Duty clauses, Notarization requirements, Aadhaar/PAN data compliance, GSTIN formats).
* Map old penal codes (IPC/CrPC/IEA) to the newly enacted criminal laws (BNS/BNSS/BSA) when analyzing legacy court judgments or drafting new complaints.
* Flag contracts that are legally unenforceable under Indian Contract Act, 1872 (e.g., agreements in restraint of trade/marriage).

The service must **not** act as a replacement for certified Indian legal counsel or process physical Stamp Papers (that requires physical logistics).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Most general-purpose LLMs (like GPT-4) are heavily biased towards US/UK law. If you ask a generic AI to draft a contract, it might suggest a "Notary Public" process that is invalid in India, or fail to mention the mandatory Stamp Paper required for the contract to be admissible in an Indian court. This service acts as a localization engine, ensuring all AI outputs are strictly compliant with the realities of Indian law.

## 1.7 User Value

Explain what the user gains from this service.
Absolute confidence that the AI understands their local jurisdiction. Indian lawyers and businesses don't have to constantly correct the AI for using American legal concepts; the AI proactively guides them through Indian compliance requirements.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A middleware service and specialized Prompt Library that intercepts requests to the AI Gateway, injecting India-specific grounding rules (RAG context about Indian statutes) and returning localized, legally valid evaluations.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining a curated knowledge base of core Indian statutes (Constitution, IPC/BNS, Companies Act 2013, Contract Act).
* Intercepting Risk Detection workflows to flag India-specific violations (e.g., Unstamped agreements).
* Providing a translation layer between old criminal codes and new criminal codes.
* Validating India-specific entities (PAN, Aadhaar format, GSTIN, CIN).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Processing actual payment of Stamp Duty (Handled by external government portals like SHCIL).
* Generating regional language translations (Handled by Regional Language Explanation).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AIGateway` | For text generation | Text output |
| `Qdrant` | To search Indian statutes | Legal Context |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Legal Risk Detection**, **Legal AI Chat**, **Document Drafting**. (This service acts as an enhancement layer to the others).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user interacts with standard features (Chat, Risk Analysis), but selects "India" as their primary jurisdiction in their Workspace settings.

## 3.2 User Input
A standard query or document upload.

## 3.3 User Flow

```text
User (Workspace set to India) uploads a Lease Agreement.
  ↓
Risk Detection service triggers.
  ↓
Indian Context Assistant injects a rule: "Verify Stamp Duty clause".
  ↓
AI detects no mention of Stamp Paper.
  ↓
UI displays a HIGH RISK alert: "Under the Indian Registration Act and State Stamp Acts, this lease must be executed on appropriate non-judicial stamp paper and registered. It is currently unenforceable."
```

## 3.4 User States
* `Processing`
* `Localized Analysis Complete`

## 3.5 User-Visible Result
Standard AI features suddenly demonstrate a hyper-specific understanding of Indian law (e.g., referencing "Section 138 of Negotiable Instruments Act" when analyzing a bounced cheque).

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Context Injection Workflow

```text
HTTP REQUEST `POST /api/v1/chat/stream` (from an Indian Workspace)
  ↓
Chat Service calls `IndianContextService.enhance_prompt(user_query)`.
  ↓
Indian Context Service analyzes query. 
  - If query mentions "Cheque bounce", fetch summary of Section 138 NI Act from Qdrant.
  - If query mentions "Murder", map IPC Sec 302 to BNS Sec 103.
  ↓
Construct Enhanced Prompt:
  System: "You are an Indian Legal Expert..."
  Indian Legal Context: [Injected Statutes/Rules]
  User: [Original Query]
  ↓
Return Enhanced Prompt to Chat Service.
  ↓
Chat Service calls AI Gateway and streams response.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `query_text` | `String` | Yes | The prompt or clause to be localized |
| `context_type`| `String`| Yes | e.g., `CHAT`, `RISK_EVALUATION`, `DRAFTING` |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Only triggers if the Workspace jurisdiction is set to `IN`.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
An enhanced Prompt object or a localized Risk Assessment block.

## 6.2 Output Structure
```json
{
  "enhanced_system_prompt": "You are a legal expert practicing in India...",
  "injected_knowledge": "Under the Bharatiya Nyaya Sanhita (BNS), 2023, Section 103 deals with Punishment for Murder, replacing Section 302 of the IPC.",
  "validation_flags": ["REQUIRES_STAMP_DUTY", "REQUIRES_NOTARY"]
}
```

## 6.3 Output Rules
N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Code Migration Supremacy:** The Indian criminal justice system recently overhauled its core codes (IPC to BNS, CrPC to BNSS, Evidence Act to BSA). The AI MUST be explicitly prompted to recognize this transition. If a user asks about an old IPC section, the AI must provide the answer but explicitly map it to the new BNS equivalent.
* **Format Validation:** If extracting Indian corporate data, it must validate against Indian formats (PAN must be `[A-Z]{5}[0-9]{4}[A-Z]{1}`, GSTIN must be 15 chars, CIN must be 21 chars).

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a contract is drafted, it must default to "Courts of [User's State], India" as the exclusive jurisdiction unless overridden.

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Localization and jurisdictional grounding.

## 9.4 AI Rules
* General purpose LLMs are notoriously bad at Indian tax law (GST) and procedural law. The system prompt MUST instruct the LLM: "Do not rely on your pre-trained knowledge for Indian tax/procedural law. Rely ONLY on the provided RAG context."

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt (Example for Drafting)
```text
You are drafting a contract governed by Indian Law.
CRITICAL RULES:
1. Ensure the contract complies with the Indian Contract Act, 1872. Do not include clauses in restraint of trade (Section 27) or legal proceedings (Section 28), as they are void.
2. Ensure dispute resolution defaults to the Arbitration and Conciliation Act, 1996.
3. Include a placeholder for the requisite Non-Judicial Stamp Paper value at the top of the document.
```

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* The platform must maintain a highly curated, global Qdrant collection of Indian Bare Acts (statutes). This is not user-uploaded data; this is system-owned reference data.

## 11.2 Chunking Rules
* Bare Acts must be chunked by Section/Article (e.g., `Section 138` is one chunk) to ensure the LLM retrieves the exact, complete wording of the law.

---

# 12. BACKGROUND PROCESSING

N/A - Acts as synchronous middleware.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `indian_statutes` table (System-wide knowledge base).

## 13.5 Database Rules
* This data is globally readable by all Workspaces but writable only by Platform Administrators.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/context/india/enhance-prompt` (Internal API used by other services)

---

# 16. ERROR HANDLING

## Error Rules
N/A

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Internal service-to-service authentication.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* When the AI cites an Indian law, it MUST cite the specific Act and Section (e.g., `Section 43A of the Information Technology Act, 2000`).

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* Standard disclaimers apply. Emphasize that state-specific amendments (e.g., Maharashtra's amendments to the central acts) might not be fully captured by the AI.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Because this service sits in front of other AI services (like Chat), its execution time (fetching local context) must be `< 200ms` so it doesn't degrade the Time-To-First-Token.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/indian_context.py` | Middleware and Prompt Injection |
| Validators     | `backend/app/core/validators/india.py` | PAN, GSTIN, CIN regex validators |

---

# 22. SERVICE CONNECTIONS

```text
[Chat Service] ──► [Indian Context Service] ──► [System Qdrant (Bare Acts)]
                          │
                          └──► Return Enhanced Prompt ──► [AIGateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Injected Indian Context (BNS mapping) into Chat session 123.`

---

# 25. OBSERVABILITY

## Metrics
* Track `indian_bare_act_retrievals` to see which statutes are being queried the most.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Format Validators:** Pass a valid GSTIN and an invalid GSTIN to the validator and assert correct boolean responses.
* **Test Code Mapping:** Mock a user query containing "IPC 420". Assert the enhanced prompt explicitly instructs the LLM to reference "BNS Section 318 (Cheating)".

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `State vs Central Law` | Property law in India varies heavily by state (e.g., Rent Control Acts). The AI must be prompted to explicitly ask the user for their specific State if the query involves real estate or stamp duty, rather than hallucinating a central rule. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

N/A - Inherits LLM configuration from the calling service.

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Intercepts queries and injects India-specific legal context.
* [ ] Accurately maps old penal codes (IPC) to new penal codes (BNS).
* [ ] Validates Indian corporate and tax identifiers (PAN/GSTIN).
* [ ] Overrides generic US-centric LLM behaviors (e.g., prioritizing Indian Arbitration Act over US Federal Arbitration Act).

---

# 32. DEFINITION OF DONE

The Indian Legal Context Assistant is **DONE** when a user can ask the Chat service "How do I punish a bounced cheque?" and the AI immediately replies citing "Section 138 of the Negotiable Instruments Act", rather than citing some irrelevant American banking regulation.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (This is a middleware layer, it does not execute the final AI call).
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (System statutes are global).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as a localization engine, ensuring the AI platform thinks and operates like an Indian lawyer rather than an American one.

## What the user sees
Hyper-accurate, localized legal advice and document drafting that respects Indian statutes, stamp duties, and recent penal code changes.

## What happens in the background
The service intercepts requests, queries a system-owned vector database of Indian Bare Acts, and injects strict guardrails into the LLM prompt to prevent US-centric hallucinations and enforce Indian legal formats (PAN/GST).

## What it receives
User queries and context types.

## What it produces
Enhanced prompts and localized legal rules.

## Success means
Indian law firms can trust the AI out-of-the-box without constantly fighting it to unlearn American legal concepts.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
