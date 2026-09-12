# Legal AI Platform (AI Gateway)

> **Purpose:** Complete implementation blueprint for `AI Gateway`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - AI Gateway`

## 1.2 Service ID

`sys-common-ai-gateway`

## 1.3 Service Category

`Common Infrastructure / API Routing`

## 1.4 Service Type

`Internal Middleware Proxy`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The AI Gateway service must:

* Act as the single, centralized exit point for all LLM (Large Language Model) and API requests from the internal platform to external providers (e.g., OpenAI, Anthropic, Azure, AWS Bedrock).
* Provide a vendor-agnostic interface so internal services (like Chat or Summarization) do not need to know whether they are talking to GPT-4 or Claude.
* Handle API rate limits, automatic retries with exponential backoff, and model fallback (e.g., switching to Azure if OpenAI is down).
* Enforce exact token counting and log all LLM usage for billing and cost-tracking purposes.

The service must **not** contain specific legal business logic or prompt templates. It is a dumb, highly resilient pipe.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Relying directly on a single LLM provider (like OpenAI) creates massive vendor lock-in and catastrophic points of failure. If OpenAI goes down, the entire Legal AI Platform dies. Furthermore, without a centralized gateway, it is impossible to track which customer is burning through expensive API credits. The AI Gateway solves vendor lock-in, ensures 99.99% uptime via routing, and controls costs.

## 1.7 User Value

Explain what the user gains from this service.
Uninterrupted service. Even if the primary AI provider experiences an outage, the Gateway seamlessly routes the user's request to a backup provider without them ever noticing an error.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A robust internal API that accepts standardized generation requests, normalizes them into provider-specific payloads, executes the request, tracks the token cost in the database, and returns the result (or stream) to the calling service.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Standardized API wrapper (e.g., matching the OpenAI schema for interoperability).
* Provider Routing (Primary -> Secondary -> Fallback).
* Rate Limit Handling (HTTP 429).
* Token Calculation and Cost Auditing.
* Streaming response support (Server-Sent Events / WebSockets).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector Databases.
* Business-specific system prompts (e.g., no "You are a lawyer" prompts live here).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `External LLMs` | To generate text/embeddings | Text, Vectors |
| `Redis` | For rate limiting / caching | Usage metrics |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Literally every AI feature** (Chat, Summarization, Drafting, OCR, etc.).

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
A highly stable platform that never shows "Model Overloaded" errors.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### AI Gateway Routing Workflow

```text
INTERNAL REQUEST `POST /gateway/v1/chat/completions`
  Body: { "model": "smart-reasoning", "messages": [...], "workspace_id": "uuid" }
  ↓
[Step 1: Check Quota]
Query Redis: Has `workspace_id` exceeded their monthly LLM budget?
  If YES -> Reject HTTP 402 Payment Required.
  ↓
[Step 2: Model Resolution]
Map logical model "smart-reasoning" to physical model (e.g., Primary: `gpt-4o`, Fallback: `claude-3.5-sonnet`).
  ↓
[Step 3: Execution]
Transform payload to provider's format.
Call External API (e.g., `api.openai.com`).
  If HTTP 429 (Rate Limit) or HTTP 500 -> Retry with backoff.
  If still failing -> Swap to Fallback provider and try again.
  ↓
[Step 4: Audit & Return]
Receive completion.
Calculate Tokens In / Tokens Out.
Write `AIAuditLog` to Postgres (workspace_id, model, tokens, cost).
  ↓
RETURN completion to calling service.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `model` | `String` | Yes | Use logical names (e.g., `fast-text`, `reasoning`) |
| `messages` | `Array` | Yes | Standard chat message format |
| `workspace_id`| `UUID` | Yes | For quota tracking |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `temperature` | `Float` | 0.0 | Controls creativity |
| `stream` | `Boolean`| false | Return streaming tokens |

## 5.3 Input Validation Rules
* Must validate that `messages` array is not empty and conforms to basic role standards (`system`, `user`, `assistant`).

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Standardized completion object or stream.

## 6.2 Output Structure
```json
{
  "id": "chatcmpl-123",
  "model": "gpt-4o",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "The contract expires on..."
    }
  }],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 31,
    "total_tokens": 87,
    "cost_usd": 0.0012
  }
}
```

## 6.3 Output Rules
* Even if the underlying provider (e.g., Anthropic) uses a different response format, the Gateway MUST normalize the output back into a single standard format (like the OpenAI schema) so internal microservices only ever need to parse one format.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Logical Model Abstraction:** Internal services MUST NOT request physical models like `gpt-4o`. They must request logical classes like `class_a_reasoning` or `class_c_fast`. The Gateway's configuration controls which physical model maps to which class. This allows administrators to swap out OpenAI for Anthropic instantly without rewriting any microservices.
* **Strict Cost Tracking:** Every single byte of data sent to an LLM costs money. The Gateway MUST log `workspace_id`, `user_id`, `feature_id`, and `cost` for every request.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* **Fallback Logic:** If the primary model fails 3 times, switch to the fallback. Do NOT switch to a fallback model if the failure was a `400 Bad Request` (which means the prompt was too long or invalid), only switch on `429`, `500`, `502`, `503`.

## 7.4 Failure Rules
* See 7.3.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Routing and execution layer.

## 9.4 AI Rules
* **Zero Data Retention:** The Gateway must configure all external API calls with strict privacy headers (e.g., OpenAI's Enterprise Data Privacy settings) to ensure user data is NOT used to train public models.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - The Gateway does not write prompts.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Writing cost audits to the database should be done asynchronously (e.g., via a Redis queue) so it doesn't slow down the synchronous chat response.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `ai_usage_logs` table.

## 13.5 Database Rules
* The logs table will grow massively. It should be partitioned by month (e.g., `ai_usage_logs_2024_10`) to allow for efficient archiving and billing queries.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /gateway/v1/chat/completions`
* `POST /gateway/v1/embeddings`

---

# 16. ERROR HANDLING

## Error Rules
* If all fallback models fail, the Gateway must return a standardized internal error: `HTTP 503 AI Gateway Unreachable`, so the UI can display a graceful "We are experiencing heavy load" message.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* This API must not be exposed to the public internet. It is strictly for internal cluster networking.

## 17.4 Security Rules
* The Gateway is the ONLY service allowed to hold the physical API keys (e.g., `OPENAI_API_KEY`). No other microservice should have access to these secrets.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* By managing API keys centrally, the platform can quickly switch to Azure/AWS hosted models if a specific enterprise client demands strict geographic data residency (e.g., "Our data must not leave European servers").

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* The Gateway's internal routing and tracking logic must add `< 10ms` of overhead to the request.

## 20.2 Large Input Handling
* **Streaming Pass-Through:** For streaming requests, the Gateway must use lightweight proxy buffering to pass tokens back to the client immediately as they arrive from the provider, rather than waiting for the whole response.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Gateway Logic  | `backend/app/core/ai_gateway.py` | Routing and Normalization |
| Cost Tracker   | `backend/app/core/billing.py` | Token auditing |

---

# 22. SERVICE CONNECTIONS

```text
[Internal Microservices] ──► [AI Gateway] ──► [OpenAI / Anthropic]
                                  │
                                  ├──► [Redis] (Rate Limits)
                                  │
                                  └──► [PostgreSQL] (Audit Logs)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Gateway routed request to Primary (GPT-4o). Status: 200. Cost: $0.02. Workspace: 123.`
* `WARN: Primary (GPT-4o) returned 429. Falling back to Secondary (Claude 3.5).`

---

# 25. OBSERVABILITY

## Metrics
* Track `gateway_provider_latency` (OpenAI vs Anthropic speed).
* Track `gateway_fallback_trigger_rate`.
* Track `cost_per_feature` (e.g., is Summarization costing more than Chat?).

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Fallback:** Mock the external `requests.post` to return a `429 Too Many Requests`. Assert that the Gateway catches this and automatically triggers a second `requests.post` to the fallback URL.
* **Test Normalization:** Mock an Anthropic format response and assert the Gateway translates it perfectly into the OpenAI format for the internal caller.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Streaming Token Counting` | You don't know the token count of a stream until it finishes. The Gateway must keep an internal counter during the stream loop and write the final cost to the DB *after* the stream closes. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `GATEWAY_CLASS_A_MODEL` | Primary reasoning model | Yes | `gpt-4o` |
| `GATEWAY_CLASS_A_FALLBACK` | Backup reasoning model | Yes | `claude-3.5-sonnet` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Run the Gateway as a separate, highly-scalable deployment (e.g., multiple Kubernetes pods) because all traffic funnels through it.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Normalizes multiple LLM providers into a single API schema.
* [ ] Automatically retries and falls back on 429/5xx errors.
* [ ] Logs exact token usage and cost per Workspace.
* [ ] Supports fast, low-overhead SSE streaming.

---

# 32. DEFINITION OF DONE

The AI Gateway service is **DONE** when the underlying LLM provider goes offline for 10 minutes, but the platform's users experience zero downtime because the Gateway instantly and seamlessly routed all traffic to the backup provider.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (No legal prompts go here).
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Gateway owns the billing logs).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the central nervous system and proxy for all AI traffic in the platform.

## What the user sees
Nothing directly. They just experience a remarkably fast, stable platform that never seems to go down.

## What happens in the background
Internal services ask the Gateway for a "Class A Reasoning" response. The Gateway dynamically picks the best provider (OpenAI, Anthropic, etc.), formats the payload, executes the call, handles any timeouts or errors, translates the response back to a standard format, and silently logs the exact cost to the user's workspace for billing.

## What it receives
Standardized internal AI requests.

## What it produces
Provider-agnostic responses and audit logs.

## Success means
Zero vendor lock-in, perfect cost tracking, and complete resilience against external API outages.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
