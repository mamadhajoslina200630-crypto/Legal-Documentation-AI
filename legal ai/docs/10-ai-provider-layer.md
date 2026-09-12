# Legal AI Platform (AI Provider Layer)

> **Purpose:** Complete implementation blueprint for `AI Provider Layer`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - AI Provider Layer`

## 1.2 Service ID

`sys-ai-provider-core-platform`

## 1.3 Service Category

`Platform Engineering & External Integration`

## 1.4 Service Type

`Backend API Adapter`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The AI Provider Layer must:

* Translate unified, platform-agnostic AI requests into the exact, specific REST HTTP payloads required by OpenAI, Google Gemini, and Anthropic Claude.
* Handle the physical network connections, authentication, and HTTP error catching (e.g., rate limits, timeouts) for external AI vendors.

The service must **not** decide *what* prompt to send. It only handles the *how*.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Each AI vendor (Google, OpenAI, Anthropic) has completely different SDKs, JSON formats, and error codes. If this complexity bleeds into the core business logic, the platform becomes vendor-locked and brittle. This layer acts as a translator, allowing the business to swap AI models freely.

## 1.7 User Value

Explain what the user gains from this service.
Users experience uninterrupted service. If OpenAI's API goes down globally, this layer catches the HTTP 503 error, transparently translates the request to Anthropic's format, and fulfills the user's request without them ever noticing the failure.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A set of interchangeable Python "Adapter" classes (`OpenAIAdapter`, `GeminiAdapter`, `ClaudeAdapter`) that all adhere to a single `BaseAIAdapter` interface.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Interacting with the `openai`, `google-generativeai`, and `anthropic` Python SDKs (or raw HTTP endpoints).
* Managing API Keys and Provider Authentication.
* Mapping provider-specific error codes (e.g., OpenAI `RateLimitError`) to internal platform errors (`AIRateLimitError`).
* Calculating token usage accurately based on provider responses.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Business logic (e.g., deciding that a contract is risky).
* Prompt templates (Prompts are injected *before* reaching the provider layer).
* RAG Vector embeddings (Handled by the RAG architecture).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `AI Architecture (Gateway)` | Orchestrates these adapters | Unified Request |
| `External Vendors` | Does the actual inference | API endpoints |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
The `AI Gateway` relies on this layer to execute physical network calls.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

N/A - Users do not interact directly with this backend adapter.

## 3.2 User Input

N/A

## 3.3 User Flow

N/A

## 3.4 User States

N/A

## 3.5 User-Visible Result

N/A

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
AI GATEWAY ROUTER
  ↓ (Passes Unified Request)
PROVIDER ADAPTER (e.g., OpenAIAdapter)
  ↓ (Formats specific JSON payload for OpenAI)
HTTP NETWORK CALL (To api.openai.com)
  ↓ (Receives Raw OpenAI JSON Response)
ADAPTER PARSING
  ↓ (Converts to Unified AIResponse)
AI GATEWAY ROUTER
```

For each step define:

### Step 1 — Translation
**Purpose:** Match vendor specifications.
**Input:** Unified `AIRequest`.
**Output:** Vendor-specific payload.
**Rules:**
* Must correctly map system prompts, user prompts, and temperature settings to the vendor's specific API structure (e.g., converting a single string into an array of `{"role": "user", "content": "..."}` objects).

### Step 2 — Execution & Retry
**Purpose:** Send the request over the internet.
**Input:** Vendor payload.
**Output:** Raw response string.
**Rules:**
* Must use `tenacity` for exponential backoff on HTTP 429 errors. Max 3 retries.

### Step 3 — Normalization
**Purpose:** Standardize the output.
**Input:** Raw response string.
**Output:** Unified `AIResponse`.
**Rules:**
* Must extract `completion_tokens` and `prompt_tokens` from the vendor's unique response metadata.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `messages` | `List[Dict]` | Yes | `[{"role": "system", "content": "..."}, ...]` |
| `model_name` | `String` | Yes | E.g., `"gpt-4o"` or `"gemini-1.5-pro"` |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `temperature` | `Float` | `0.0` | 0.0 to 1.0 |
| `response_format` | `Dict` | `None` | JSON Schema for forced structured output. |

## 5.3 Input Validation Rules

* Adapters must strictly validate that the requested `model_name` is actually supported by that specific provider before making the HTTP call.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A generic `AIResponse` object that looks identical regardless of which vendor generated it.

## 6.2 Output Structure

```python
@dataclass
class AIResponse:
    content: str
    raw_response: dict
    prompt_tokens: int
    completion_tokens: int
    provider: str
```

## 6.3 Output Rules

* The `content` string must contain exactly the text generated by the AI, stripped of any vendor-specific metadata wrapping.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Interface Adherence:** Every new AI Provider (e.g., adding Llama 3 on AWS Bedrock later) must implement the exact same Python `BaseAIAdapter` Abstract Base Class.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* **Schema Enforcement:** If `response_format` is provided, the Adapter must use the provider's native "JSON Mode" (e.g., `response_format={"type": "json_object"}` for OpenAI).

## 7.4 Failure Rules

* Adapters MUST catch specific vendor exceptions (e.g., `openai.RateLimitError`) and re-raise them as generic platform exceptions (e.g., `PlatformRateLimitError`).

## 7.5 Boundary Rules

* Adapters must not alter the text of the prompt or inject business logic.

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* The Adapter receives the document text pre-injected into the `messages` array. It does not parse documents itself.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
This layer wraps the AI.

## 9.2 AI Input
Translated to vendor format.

## 9.3 AI Output
Translated back to platform format.

## 9.4 AI Rules
N/A

## 9.5 AI Provider Independence
This layer *enables* the independence by burying the SDKs here.

## 9.6 Model Requirements
* Provider must support an API accessible via HTTP/REST or gRPC.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* Polling for async AI tasks (if the provider supports batch processing).

## 12.2 Processing Trigger

* Synchronous `async def generate()` calls via `httpx` or async SDKs.

## 12.3 Processing Status
N/A

## 12.4 Retry Rules

* Max Retries: 3
* Backoff: Exponential (e.g., 2s, 4s, 8s)
* Errors to Retry: 429 (Rate Limit), 500/502/503/504 (Server Errors).
* Errors NOT to Retry: 400 (Bad Request - Prompt too long), 401 (Invalid API Key).

## 12.5 Idempotency
N/A

---

# 13. DATABASE RESPONSIBILITY

N/A - This layer is stateless.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A

---

# 16. ERROR HANDLING

## Error Rules

Must map external errors to internal errors:

| Vendor Error | Platform Exception |
| ------------ | ------------------ |
| `openai.RateLimitError` | `AIRateLimitError` |
| `google.api_core.exceptions.ResourceExhausted` | `AIRateLimitError` |
| `anthropic.AuthenticationError` | `AIAuthenticationError` |

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Only the AI Gateway can instantiate Provider Adapters.

## 17.2 Data Isolation

N/A

## 17.3 Sensitive Data

* API Keys for OpenAI, Google, Anthropic.

## 17.4 Security Rules

* API Keys MUST be loaded from environment variables (e.g., `os.environ.get("OPENAI_API_KEY")`).
* Keys must never be logged.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Adapters must use asynchronous I/O (`asyncio`) to ensure the FastAPI worker thread is not blocked while waiting 30 seconds for an LLM response.

## 20.2 Large Input Handling

N/A

## 20.3 Concurrent Usage

* Async network clients (like `httpx.AsyncClient`) must be reused across requests to benefit from HTTP connection pooling.

## 20.4 Resource Limits

N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Interface      | `backend/app/ai/providers/base.py` | `BaseAIAdapter` ABC |
| OpenAI         | `backend/app/ai/providers/openai.py` | `OpenAIAdapter` class |
| Gemini         | `backend/app/ai/providers/gemini.py` | `GeminiAdapter` class |
| Anthropic      | `backend/app/ai/providers/anthropic.py`| `ClaudeAdapter` class |

---

# 22. SERVICE CONNECTIONS

```text
[AI Gateway]
    │
    ├─► [OpenAIAdapter] ──► [api.openai.com]
    │
    ├─► [GeminiAdapter] ──► [generativelanguage.googleapis.com]
    │
    └─► [ClaudeAdapter] ──► [api.anthropic.com]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log HTTP status codes and latencies for every call to external vendors.

## 24.2 Audit Logging
N/A

## 24.3 Sensitive Data Rules

* DO NOT LOG THE PROMPT OR RESPONSE TEXT.

---

# 25. OBSERVABILITY

## Metrics

* Token usage must be bubbled up to the Gateway for tracking.
* Network latency to vendor APIs.

## Health

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Every Adapter must be unit-tested using `pytest-httpx` or `respx` to mock the external vendor API responses.
* Test that Rate Limits correctly trigger the exponential backoff logic.

## 26.2 Integration Testing
N/A
## 26.3 End-to-End Testing
N/A
## 26.4 AI Testing
N/A
## 26.5 Security Testing
N/A

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `API Key Revoked` | Immediately fail and alert devops; do not retry. |
| `Context Too Large` | Catch vendor 400 error and throw `AIContextWindowExceededError`. |

---

# 28. VERSIONING

## Compatibility Rules

* Adapters must pin the vendor SDK version in `requirements.txt` (e.g., `openai==1.14.0`) to prevent breaking changes from upstream providers.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Auth | Yes (if enabled) | - |
| `GEMINI_API_KEY` | Auth | Yes (if enabled) | - |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] OpenAIAdapter successfully generates text.
* [ ] GeminiAdapter successfully generates text.
* [ ] ClaudeAdapter successfully generates text.
* [ ] All three adapters return the exact same `AIResponse` object format.

---

# 32. DEFINITION OF DONE

The AI Provider Layer is **DONE** when the AI Gateway can hot-swap between `OpenAIAdapter` and `GeminiAdapter` without changing any other code in the platform.

---

# 33. IMPLEMENTATION RULES

1. **Do not duplicate common platform capabilities.**
2. **Errors must be handled explicitly (translate vendor errors).**
3. **Secrets must never be committed to source control.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides physical network adapters to interact with third-party LLM providers.

## What the user sees
N/A

## What happens in the background
Translates platform AI requests into vendor-specific API payloads and handles HTTP network resilience.

## What it receives
Generic instructions from the AI Gateway.

## What it produces
Generic text responses from the AI Provider.

## Success means
The application code remains clean and free of vendor-specific logic, SDKs, and error types.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
