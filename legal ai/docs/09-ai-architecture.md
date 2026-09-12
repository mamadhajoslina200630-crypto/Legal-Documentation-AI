# Legal AI Platform (AI Architecture)

> **Purpose:** Complete implementation blueprint for `AI Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - AI Architecture`

## 1.2 Service ID

`sys-ai-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & AI Standards`

## 1.4 Service Type

`Core Infrastructure Specification`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The AI Architecture must:

* Dictate exactly how external LLMs (Large Language Models) are integrated into the platform.
* Enforce the "AI Gateway" abstraction pattern so the platform is never locked into a single provider (e.g., OpenAI, Google, Anthropic).
* Define how prompts are versioned, managed, and executed.
* Ensure all AI outputs are returned in deterministic, parsable JSON structures for the frontend.

The service must **not** include the specific business logic prompts themselves (e.g., the exact wording to find a legal risk). It only governs the *architecture* that executes those prompts.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
AI models change rapidly; what is best today may be obsolete in six months. By architecting an abstraction layer, the business can seamlessly switch from GPT-4 to Gemini 1.5 Pro to Claude 3.5 Sonnet without rewriting a single line of business logic or API routing.

## 1.7 User Value

Explain what the user gains from this service.
Users experience higher reliability. If one AI provider goes down, the architecture can automatically fail over to a backup provider, ensuring the Legal AI chat and analysis tools remain online.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A defined Python module structure for the AI Gateway, a strict Pydantic contract for sending requests and receiving responses from the AI, and rules for prompt management.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* The internal AI Gateway Service.
* Provider Adapters (OpenAI, Gemini, Anthropic interfaces).
* Prompt Registry (how templates are loaded and versioned).
* Model Routing (deciding which model to use based on task complexity).
* Structured Output enforcement (JSON schema validation).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector Database chunking and embedding logic (This belongs in RAG Architecture).
* Specific business logic rules for legal analysis.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `System Architecture` | Network egress rules | HTTP limits |
| `API Standards` | Determines how the AI payload is wrapped | JSON structure |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
All Core Legal Services (Team 1) and Language/Accessibility Services (Team 2) depend entirely on this AI Architecture to execute their prompts.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

N/A - Users do not interact directly with the AI Architecture.

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

Define the complete internal workflow for an AI request.

```text
BUSINESS SERVICE
  ↓ (Pydantic Request)
AI GATEWAY ROUTER
  ↓ (Selects Model based on config)
PROMPT REGISTRY
  ↓ (Injects Context + User Query into Template)
PROVIDER ADAPTER (e.g., Google Gemini Adapter)
  ↓ (HTTP API Call)
EXTERNAL LLM PROVIDER
  ↓ (Returns Raw Output)
PROVIDER ADAPTER
  ↓ (Parses & Validates against JSON Schema)
AI GATEWAY ROUTER
  ↓
BUSINESS SERVICE
```

For each step define:

### Step 1 — Request Construction
**Purpose:** Standardize the AI ask.
**Input:** Task Name, Context String, User Query.
**Output:** Unified `AIRequest` object.
**Rules:**
* Context must be strictly truncated to fit the chosen model's token limit before this step.

### Step 2 — Provider Execution
**Purpose:** Call the actual model.
**Input:** Formatted Prompt.
**Output:** Raw String.
**Rules:**
* Must implement an exponential backoff retry mechanism (e.g., `tenacity` library in Python) for HTTP 429 (Rate Limit) errors.

### Step 3 — Response Validation
**Purpose:** Ensure UI doesn't crash on bad AI output.
**Input:** Raw String.
**Output:** Validated Pydantic Object.
**Rules:**
* If the AI fails to return valid JSON, the Adapter must attempt an automatic repair or throw a structured `AIOutputException`.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs (Internal Python API)

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `task_id` | `String` | Yes | Maps to a specific prompt template (e.g., `extract_risks`). |
| `context` | `String` | Yes | The legal text to analyze. |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `model_override` | `Enum` | `Config Default` | Force a specific model (e.g., `claude-3-haiku` for speed). |
| `temperature` | `Float` | `0.0` | Lower is more deterministic. Default to 0 for legal analysis. |

## 5.3 Input Validation Rules

* Prompt contexts must not exceed the maximum token limit of the designated provider.
* The Gateway must strip trailing whitespace and sanitize strange hidden characters from OCR'd text before sending.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A Pydantic Model representing the AI's structured response.

## 6.2 Output Structure

```python
class AIResponse(BaseModel):
    raw_response: dict
    provider_used: str
    tokens_consumed: int
    processing_time_ms: int
```

## 6.3 Output Rules

* The AI Gateway must ALWAYS return a strongly-typed object. The Business Service should never have to parse raw JSON strings manually using `json.loads()`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Provider Agnosticism:** Business Services (like Risk Detection) MUST NOT import specific provider SDKs (like `openai` or `google-generativeai`). They must only import the internal `AIGateway`.
* **Deterministic Configuration:** Tasks requiring high accuracy (Risk, Drafting) must use `temperature=0.0`. Tasks requiring natural conversation (Chat, Simple Explanation) can use `temperature=0.7`.

## 7.2 Validation Rules

* The AI Gateway must track token usage for every request and log it.

## 7.3 Decision Rules

* **Model Routing:** Fast, simple tasks (e.g., formatting a date) should route to a fast/cheap model (e.g., Gemini Flash). Complex reasoning (e.g., finding contract loopholes) must route to a frontier model (e.g., Gemini Pro).

## 7.4 Failure Rules

* **Failover:** If the primary provider (e.g., OpenAI) is down or timing out after 3 retries, the AI Gateway must automatically failover to the secondary provider (e.g., Anthropic) using the exact same prompt structure.

## 7.5 Boundary Rules

* The AI Architecture does NOT handle the user's HTTP request. That is the job of the FastAPI route.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* The AI Architecture only receives raw `string` context. It does not know what a "PDF" is.

## 8.2 Context Rules

* To prevent Prompt Injection, document context must be clearly demarcated within the prompt using XML tags (e.g., `<legal_document> {context} </legal_document>`).

## 8.3 Section-Level Context

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

To perform all natural language understanding and generation for the platform.

## 9.2 AI Input

Structured text prompts.

## 9.3 AI Output

Structured JSON outputs.

## 9.4 AI Rules

* The AI must be constrained via "System Prompts" to never act outside of its persona as a neutral legal analyzer.

## 9.5 AI Provider Independence

This is the core tenet of this architecture (See Section 7.1).

## 9.6 Model Requirements

* Providers must support JSON mode or structured outputs natively to reduce parsing errors.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Instructions

Every prompt dispatched by the gateway must prepend a base Legal AI System instruction (e.g., "You are an expert Indian Legal Assistant...").

## 10.2 Task Instructions

Stored in the Prompt Registry.

## 10.3 Context Instructions

The Prompt Registry handles injecting the document text into the template safely.

## 10.4 Output Instructions

The Prompt Registry must append instructions like: "You must respond ONLY in the following JSON format..."

## 10.5 Safety Instructions

The system prompt must include constraints preventing the AI from drafting illegal documents or offering definitive legal counsel.

## 10.6 Prompt Versioning

Prompts must be stored in `backend/app/ai/prompts/` as `.yaml` or `.py` files. They must be version-controlled via Git. When a prompt is updated, the previous version must be kept in the repository (e.g., `v1_risk_prompt.yaml`, `v2_risk_prompt.yaml`) for A/B testing and rollback capability.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A for core AI Architecture (Defined in RAG Architecture).

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* Large AI requests (e.g., summarizing a 100-page document) must be executed by a Celery worker that calls the AI Gateway, rather than blocking the FastAPI thread.

## 12.2 Processing Trigger

* Triggered by Business Services via Redis queue.

## 12.3 Processing Status

N/A

## 12.4 Retry Rules

* See Section 4.

## 12.5 Idempotency

N/A

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

The AI Architecture does not own relational data. It is stateless.

## 13.5 Database Rules

N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A - The AI Gateway is an internal Python service, not an HTTP API exposed to the frontend.

---

# 16. ERROR HANDLING

## Error Rules

The AI Gateway must raise internal Python exceptions:
* `AIProviderTimeoutError`
* `AIValidationError` (If JSON parsing fails)
* `AIRateLimitError`

The calling Business Service is responsible for catching these and deciding whether to fail the HTTP request or return a partial response.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

N/A (Handled at the HTTP boundary).

## 17.2 Data Isolation

N/A (Handled by the Business Service preparing the context).

## 17.3 Sensitive Data

* The AI Gateway sends sensitive PII (Personally Identifiable Information) and confidential legal documents to third-party APIs.

## 17.4 Security Rules

* Ensure Enterprise API agreements are in place with OpenAI/Google/Anthropic ensuring they **do not train on API data**.
* API Keys must be stored in secure environment variables, never hardcoded.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Accuracy

* Model temperature must be kept at `0.0` for extraction tasks to prevent hallucination.

## 19.2 Uncertainty

* Prompts should instruct the AI to return `"confidence_score": 0-100` alongside extracted facts.

## 19.3 Unsupported Claims

N/A

## 19.4 Disclaimer Requirements

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* The Gateway adds < 10ms of overhead. The bottleneck will always be the external Provider.

## 20.2 Large Input Handling

* If the context exceeds the model's context window (e.g., > 128k tokens), the Gateway must throw an `AIContextWindowExceededError` rather than sending a payload that the provider will reject.

## 20.3 Concurrent Usage

* The Gateway uses Python `asyncio` (`httpx`) to ensure multiple concurrent LLM calls do not block the ASGI worker thread.

## 20.4 Resource Limits

N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Gateway Core   | `backend/app/ai/gateway.py` | Main routing logic |
| Adapters       | `backend/app/ai/providers/` | `openai.py`, `gemini.py` |
| Registry       | `backend/app/ai/prompts/` | Versioned templates |
| Schemas        | `backend/app/ai/schemas.py` | Internal Pydantic interfaces |

---

# 22. SERVICE CONNECTIONS

```text
[Business Service]
       │
[AI Gateway Router]
       │
   ┌───┼───┐
   ↓   ↓   ↓
 [OAI][GEM][ANT] (Adapters)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Must log: Provider used, Model name, Latency (ms), and Tokens consumed.

## 24.2 Audit Logging
N/A

## 24.3 Sensitive Data Rules

* **CRITICAL:** Do NOT log the actual Prompt text or the raw AI Response payload to standard application logs (e.g., Datadog), as this will leak confidential legal data into observability tools.

---

# 25. OBSERVABILITY

## Metrics

* Token usage per workspace per day (for billing/cost analysis).
* Error rate per AI Provider.

## Health

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* The AI Gateway must have a `MockProvider` adapter used exclusively for Pytest. This mock returns deterministic JSON responses to test the Business Services without incurring API costs or latency.

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
| `JSON Parse Failure` | The Adapter attempts to strip markdown block ticks (````json ... ````) and re-parse. If it still fails, it raises `AIValidationError`. |

---

# 28. VERSIONING

## Compatibility Rules

* Changing a provider adapter must be fully transparent to the Business Services. The Pydantic output contract must remain identical.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `PRIMARY_AI_PROVIDER` | Decides default routing | Yes | `gemini` |
| `FALLBACK_AI_PROVIDER` | Decides failover routing | Yes | `openai` |
| `OPENAI_API_KEY` | Provider Auth | No | - |
| `GEMINI_API_KEY` | Provider Auth | No | - |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Gateway successfully routes to at least two different providers based on config.
* [ ] Gateway automatically catches provider timeouts and triggers failover.
* [ ] Prompts are loaded from `.yaml` files, not hardcoded strings.

---

# 32. DEFINITION OF DONE

The AI Architecture is **DONE** when the `AIGateway` class provides a unified, single-entry-point interface for all AI executions, and developers are no longer importing provider-specific SDKs.

---

# 33. IMPLEMENTATION RULES

1. **AI providers must remain replaceable.** (No vendor lock-in).
2. **Errors must be handled explicitly.** (Catch Rate Limits).
3. **Secrets must never be committed to source control.** (API Keys).
4. **Services must communicate through defined contracts.** (Pydantic Responses).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Creates a unified abstraction layer (AI Gateway) for all Large Language Model interactions across the platform.

## What the user sees
N/A (Internal).

## What happens in the background
Formats prompts, injects document context, executes HTTP requests to Google/OpenAI, catches errors, parses JSON, and logs token usage.

## What it receives
Requests from Business Services (e.g., "Analyze this contract for risks").

## What it produces
Strongly-typed Pydantic objects containing the AI's conclusions.

## Success means
The application is resilient against AI provider outages and completely immune to vendor lock-in.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
