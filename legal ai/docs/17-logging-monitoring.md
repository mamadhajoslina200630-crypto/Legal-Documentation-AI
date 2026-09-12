# Legal AI Platform (Logging & Monitoring)

> **Purpose:** Complete implementation blueprint for `Logging & Monitoring`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Logging & Monitoring`

## 1.2 Service ID

`sys-observability-core-platform`

## 1.3 Service Category

`Platform Engineering & DevOps`

## 1.4 Service Type

`Observability Infrastructure`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Logging & Monitoring service must:

* Provide a unified mechanism for all backend services and Celery workers to output structured diagnostic information.
* Aggregate error reports automatically so developers are alerted when the system breaks.
* Collect performance metrics (CPU, RAM, API Latency) to enable dashboards and scaling alarms.
* Ensure absolute compliance by strictly redacting all sensitive legal data and PII from log streams.

The service must **not** perform business logic.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Without observability, the platform is a black box. If an AI provider starts timing out, or if memory leaks cause the Celery workers to crash, developers need immediate alerts and exact stack traces to fix the issue before users complain.

## 1.7 User Value

Explain what the user gains from this service.
High availability. Problems are detected and patched by the engineering team proactively, often before the user even realizes there was a degradation in service.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
Configured integrations with Prometheus, Grafana, Sentry, and a standardized Python `logging` configuration that outputs JSON.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Standardized Application Logging (JSON format to `stdout`).
* Error Tracking & Alerting (Sentry integration).
* APM (Application Performance Monitoring) metrics.
* Infrastructure metrics (Prometheus endpoint).
* Log scrubbing/redaction rules for compliance.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Business Audit Logs (e.g., "User X viewed Document Y"). These belong in the PostgreSQL database so they can be shown in the UI.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI` | To attach logging middleware | HTTP Requests |
| `Celery` | To attach task event monitors | Task Statuses |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every service** depends on this architecture to record its state.

---

# 3. USER EXPERIENCE

N/A - This is a developer/DevOps experience.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
BUSINESS SERVICE
  ↓ (Calls `logger.info()`)
PYTHON LOGGING MODULE
  ↓ (JSON Formatter & PII Redactor)
STDOUT (Console)
  ↓ (Captured by Docker / Kubernetes)
LOG AGGREGATOR (e.g., Datadog, CloudWatch, ELK)

---

BUSINESS SERVICE THROWS EXCEPTION
  ↓
SENTRY SDK INTERCEPTOR
  ↓
SENDS TRACE TO SENTRY.IO
  ↓
ALERTS ENGINEERING SLACK CHANNEL
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `Log Message` | `String` | Yes | - |
| `Log Level` | `Enum` | Yes | `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `Context` | `Dict` | `{}` | e.g., `{"workspace_id": "uuid", "document_id": "uuid"}` |

## 5.3 Input Validation Rules

* The Python logger must accept a standardized dictionary of context to append to the JSON output.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

Structured JSON strings printed to standard output.

## 6.2 Output Structure

```json
{
  "timestamp": "2026-09-05T21:26:00Z",
  "level": "INFO",
  "module": "app.services.rag.engine",
  "message": "Successfully indexed document",
  "context": {
    "workspace_id": "123e4567-e89b-12d3-a456-426614174000",
    "document_id": "987fcdeb-51a2-43d7-9012-345678901234",
    "duration_ms": 1450
  }
}
```

## 6.3 Output Rules

* Logs MUST be in JSON format in production to allow log aggregators to parse and query the fields easily.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Traceability:** Every API request must generate a unique `trace_id` at the middleware layer. This ID must be injected into the logger context and passed to all downstream systems (including Celery tasks) so a single user action can be tracked across the distributed system.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* `DEBUG`: Used only in local development. Must be disabled in production to save disk space and reduce noise.
* `INFO`: Normal application events (Login, Upload, Job Complete).
* `WARNING`: Recoverable errors (Rate Limit hit, Retry triggered).
* `ERROR`: Unrecoverable errors affecting a single user (Failed OCR).
* `CRITICAL`: System-wide failures (DB Connection Lost).

## 7.4 Failure Rules

* If the logging system fails (e.g., disk full), the application MUST prioritize crashing over silently dropping critical audit trails.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* Always log the `document_id` when performing operations on a document.

## 8.2 Context Rules

* **CRITICAL:** Do NOT log the contents of the document. Do not log the extracted text. Do not log the AI's summary of the document.

---

# 9. AI RESPONSIBILITY

N/A

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* Sentry SDK must be initialized inside the Celery worker process to catch background task crashes.

---

# 13. DATABASE RESPONSIBILITY

N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 API List

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `GET`  | `/metrics` | Expose Prometheus metrics |

## 15.4 API Rules
* The `/metrics` endpoint should NOT be exposed to the public internet; only internal scrapers should access it.

---

# 16. ERROR HANDLING

## Error Rules

* Unhandled exceptions must be sent to Sentry immediately via the `SentryAsgiMiddleware`.

---

# 17. AUTHORIZATION & SECURITY

## 17.3 Sensitive Data

* The most common security vulnerability in modern systems is logging PII (Passwords, Tokens, Social Security Numbers) into Datadog/CloudWatch, violating compliance.

## 17.4 Security Rules

* Implement a custom Python `logging.Filter` that uses regex to find and redact strings that look like Bearer tokens, Credit Cards, or API Keys before they are printed to stdout.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Logging must be asynchronous or extremely fast. Writing to stdout is generally acceptable, but network-based log handlers (e.g., directly sending logs to an HTTP endpoint from Python) must not block the ASGI thread.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Config         | `backend/app/core/logging.py` | JSON Formatter setup |
| Middleware     | `backend/app/api/middleware.py` | Inject `trace_id` |

---

# 22. SERVICE CONNECTIONS

```text
[All Services] ──► [Python Logger (stdout)] ──► [Docker daemon] ──► [CloudWatch/Datadog]
       │
   (on Error)
       │
       ▼
    [Sentry]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

*(This entire document defines this section)*

---

# 25. OBSERVABILITY

## Metrics

Expose via Prometheus:
* `http_requests_total`
* `http_request_duration_seconds`
* `db_connection_pool_size`
* `celery_tasks_pending`

## Health

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test the Redaction filter: Pass a string with a fake Bearer token into the logger and assert the output string replaces it with `[REDACTED]`.

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `LOG_LEVEL` | Verbosity | Yes | `INFO` |
| `SENTRY_DSN` | Where to send crashes | No | - |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* The hosting environment (Docker/Kubernetes) is entirely responsible for capturing `stdout` and shipping it to the log aggregator. The Python app should not manage log rotation or file writing.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Application startup outputs structured JSON logs.
* [ ] HTTP requests generate a `trace_id` visible in the logs.
* [ ] Sentry captures unhandled exceptions with full stack traces.
* [ ] Sensitive tokens are redacted from log outputs.

---

# 32. DEFINITION OF DONE

The Logging & Monitoring service is **DONE** when a developer can easily search a `trace_id` in the cloud console and see the exact path a request took through the API, Database, and Celery workers, without exposing any confidential legal data.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Secrets must never be committed to source control (Or Logs).**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the x-ray vision required to run the platform in production.

## What the user sees
N/A (Internal).

## What happens in the background
Every action generates structured JSON records. Crashes are caught by Sentry and sent to the engineering team. Metrics are scraped by Prometheus to draw Grafana dashboards.

## What it receives
Diagnostic events from the code.

## What it produces
Searchable telemetry.

## Success means
Bugs are fixed faster, performance bottlenecks are easily identified, and compliance is maintained.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
