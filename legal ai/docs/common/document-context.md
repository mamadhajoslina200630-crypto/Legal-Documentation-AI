# Legal AI Platform (Document Context)

> **Purpose:** Complete implementation blueprint for `Document Context`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Document Context Management`

## 1.2 Service ID

`sys-common-document-context`

## 1.3 Service Category

`Common Infrastructure / Prompt Engineering`

## 1.4 Service Type

`Internal Library / Middleware`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Document Context service must:

* Act as the central engine for assembling, truncating, and managing the text payload sent to LLMs.
* Manage **Context Windows**: Ensure that the total token count of the prompt never exceeds the LLM's maximum limit.
* Provide **Surrounding Context**: When the RAG engine finds a matching chunk (e.g., Chunk 45), this service automatically fetches Chunks 44 and 46 so the AI understands the preamble and caveats surrounding the matched text.
* Inject necessary metadata (e.g., Document Title, Governing Law) into the context window so the AI always knows *what* it is reading.

The service must **not** perform the actual vector search or generate the final AI response. It strictly prepares the text payload for the AI Gateway.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Legal clauses rarely exist in isolation. A clause on Page 12 might say, "Subject to the limitations in Section 4..." If the AI only reads Page 12, it gives wrong advice because it doesn't know what Section 4 says. This service ensures that the AI is always fed the necessary "surrounding context" without blowing up the token limit and crashing the request.

## 1.7 User Value

Explain what the user gains from this service.
High-accuracy AI responses that don't suffer from "tunnel vision." The AI feels smarter because it rarely misinterprets isolated sentences.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A Python/Node library or internal API that takes a list of `chunk_ids`, expands them to include surrounding context, calculates token usage, and outputs a perfectly formatted string ready to be injected into an LLM prompt.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Fetching adjacent `document_chunks` based on sequential ordering.
* Token counting (using libraries like `tiktoken`).
* Priority-based truncation (dropping the least relevant chunks if the limit is reached).
* Formatting context blocks with clear XML/Markdown tags (e.g., `<document title="...">`).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector searching (Handled by Legal Search).
* Direct LLM API calls (Handled by AI Gateway).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `DocumentRepository` | To fetch chunk text | `document_chunks` table |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Legal AI Chat**, **Legal Risk Detection**, **Document Summarization** (Any service that feeds document text to an LLM).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A - This is purely an internal backend service.

## 3.2 User Input
N/A

## 3.3 User Flow
N/A

## 3.4 User States
N/A

## 3.5 User-Visible Result
Users notice that the AI correctly understands references like "as stated above" because the backend intelligently included the "above" text.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Context Expansion Workflow

```text
CALL `ContextManager.build_context(primary_chunk_ids, max_tokens)`
  ↓
For each `chunk_id` in `primary_chunk_ids`:
  Query DB for `chunk_sequence`.
  Fetch the chunk itself, plus `chunk_sequence - 1` and `chunk_sequence + 1`.
  ↓
Deduplicate chunks (in case `primary_chunk_ids` were adjacent).
  ↓
Order chunks sequentially by `chunk_sequence`.
  ↓
Calculate total tokens of the assembled text.
  ↓
Is total tokens > `max_tokens`?
  ├── YES: Drop the "surrounding" chunks one by one starting from the edges until within limit.
  └── NO: Proceed.
  ↓
Format output string:
  "<document title='...'>\n[Text]\n</document>"
  ↓
RETURN formatted string.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `primary_chunk_ids` | `List[UUID]` | Yes | The core chunks matched by a search |
| `max_tokens` | `Integer` | Yes | The token budget allocated for context |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `expansion_radius` | `Integer` | 1 | How many chunks before/after to include |

## 5.3 Input Validation Rules
* Must handle empty `primary_chunk_ids` gracefully (returning an empty string).

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A formatted text string and a list of actually used chunk IDs (for source citation).

## 6.2 Output Structure
```json
{
  "context_string": "<document id='...'>\nText goes here...\n</document>",
  "used_chunk_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "token_count": 3450
}
```

## 6.3 Output Rules
* The `context_string` must use clear delimiters (like XML tags or Markdown blocks) so the LLM knows where the context starts and ends.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Strict Token Limits:** The service MUST NOT exceed the `max_tokens` parameter. If it does, the downstream AI Gateway will throw an API error (e.g., HTTP 400 Context Length Exceeded), breaking the user's workflow.
* **Sequential Ordering:** Regardless of the order in which the `primary_chunk_ids` were provided (e.g., based on vector search relevance score), the output text MUST be ordered by `chunk_sequence` so it reads naturally like a continuous document.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* **Truncation Priority:** If the token limit is reached, the service must prioritize dropping the "expanded" context chunks first, preserving the `primary_chunk_ids` (the ones that actually matched the user's query).

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Operates heavily on `chunk_sequence` to stitch documents back together.

---

# 9. AI RESPONSIBILITY

N/A - This service manages the text *before* it goes to the AI.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* This is the core "Augmentation" step of Retrieval-Augmented Generation (RAG).

## 11.2 Chunking Rules
* Because chunks have a 10-15% overlap (defined in Document Understanding), this service must ideally stitch them together intelligently, attempting to merge the overlapping text rather than repeating it twice in the prompt.

---

# 12. BACKGROUND PROCESSING

N/A - Must execute synchronously and quickly.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. Read-only access to `document_chunks`.

## 13.5 Database Rules
* Must use optimized `IN` clauses to fetch multiple chunks simultaneously (`SELECT * FROM document_chunks WHERE chunk_id IN (...)`).

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* Internal service method: `build_context(chunk_ids, max_tokens)`

---

# 16. ERROR HANDLING

## Error Rules
* If `tiktoken` (or equivalent tokenizer) fails to load the encoding model, fallback to a safe character-based estimate (e.g., `characters / 4 = tokens`) rather than failing.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* As an internal library, it assumes the calling service (e.g., Legal Search) has already verified the user's `workspace_id`.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The service must return exactly which `used_chunk_ids` made it into the final `context_string`. The downstream service needs this list to generate the `[Source: 1]` UI citations. If a chunk was dropped due to token limits, it cannot be cited.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Must execute in `< 50ms`. String concatenation and basic math must be highly optimized.

## 20.2 Large Input Handling
N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/core/context_manager.py` | Token counting and text assembly |

---

# 22. SERVICE CONNECTIONS

```text
[Legal AI Chat] ──► [Context Manager] ──► [PostgreSQL] (Fetch chunks)
       │                  │
       │                  └──► (Returns formatted string)
       │
       └──► [AI Gateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `DEBUG: Built context for 5 chunks. Token count: 2100 / 4000 limit. 0 chunks truncated.`

---

# 25. OBSERVABILITY

## Metrics
* Track `context_truncation_rate` (how often chunks are dropped due to limits). A high rate indicates the token budget is too small or the search is returning too many results.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Truncation Logic:** Provide 5 chunks that total 1000 tokens. Set `max_tokens=600`. Assert the service successfully drops the least-priority chunks and returns a string under the token limit.
* **Test Ordering:** Provide `chunk_id_5` then `chunk_id_2`. Assert the output string places the text of chunk 2 before chunk 5.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Missing Chunks` | If `primary_chunk_id` is 1, it cannot fetch `chunk_sequence - 1` (chunk 0). It must handle boundary cases (start/end of document) gracefully without throwing index out-of-bounds errors. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `TOKENIZER_MODEL` | Which tokenizer to use | Yes | `cl100k_base` (OpenAI) |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] accurately counts tokens before hitting the API.
* [ ] Fetches surrounding context (N chunks before and after).
* [ ] Orders chunks sequentially.
* [ ] Never exceeds the provided `max_tokens` limit.

---

# 32. DEFINITION OF DONE

The Document Context service is **DONE** when the Chat AI consistently understands cross-references in legal text (e.g., knowing what "Section 3.1" means because the context engine smartly included it in the prompt payload).

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Do not generate AI responses here).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the intelligent text-assembler that ensures the AI is fed the right amount of context in the right order without exceeding memory limits.

## What the user sees
Nothing directly. They just experience an AI that doesn't hallucinate or get confused by out-of-context sentences.

## What happens in the background
When a search finds a matching paragraph, this service reaches into the database, grabs the paragraph above it and below it, stitches them together in perfect reading order, counts exactly how many tokens it uses, truncates it if necessary, and wraps it in XML tags for the LLM to read.

## What it receives
A list of raw Chunk IDs.

## What it produces
A perfectly formatted, token-safe prompt string.

## Success means
Zero "Token Limit Exceeded" API errors and highly accurate RAG responses.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
