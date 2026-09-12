# Legal AI Platform (Error Handling)

> **Purpose:** Complete implementation blueprint for `Error Handling`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Error Handling`

## 1.2 Service ID

`sys-errors-core-platform`

## 1.3 Service Category

`Platform Engineering & Standards`

## 1.4 Service Type

`Cross-Cutting Concern`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Error Handling architecture must:

* Standardize how the backend catches, formats, and returns exceptions to the frontend.
* Prevent the leakage of sensitive backend information (like database queries or stack traces) to the end user.
* Provide clear, actionable error messages so the frontend can display helpful UI states instead of crashing.

The service must **not** fix the errors; it only manages how they are reported.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
When a user uploads a corrupted PDF, or the OpenAI API goes down, the application will inevitably throw an exception. If that exception is unhandled, the server might return an ugly HTML "500 Internal Server Error" page, breaking the React frontend and frustrating the user. This architecture ensures the platform fails gracefully and predictably.

## 1.7 User Value

Explain what the user gains from this service.
Users are never left guessing why something didn't work. Instead of a blank screen, they see actionable messages like "This document is password protected, please remove the password and try again."

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A centralized FastAPI `Exception Handler` middleware, a library of custom Python Exception classes, and a standard JSON error envelope format.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Global FastAPI exception handlers (`@app.exception_handler`).
* Base custom exceptions (e.g., `PlatformBaseException`).
* HTTP status code mapping (e.g., mapping `DocumentNotFound` to `404`).
* Pydantic validation error formatting.
* Celery background task error handling and retries.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Specific retry logic for business tasks (This belongs in Background Processing).
* Frontend UI error components (This belongs in Frontend Design System).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI` | Core routing framework | Exception Middleware |
| `Logging System` | To record the actual stack trace | Log Streams |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every service** depends on this architecture to handle its failures safely.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A (Triggered automatically when a failure occurs).

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
BUSINESS SERVICE THROWS EXCEPTION (e.g., `raise DocumentNotFoundError()`)
  ↓
FASTAPI GLOBAL EXCEPTION HANDLER CATCHES EXCEPTION
  ↓
LOGGER: Records Full Stack Trace & Context (Internal)
  ↓
FORMATTER: Translates Exception into Standard JSON Envelope (External)
  ↓
HTTP RESPONSE: Returns to Frontend (e.g., 404 Not Found)
```

For each step define:

### Step 1 — Raise
**Purpose:** Stop execution predictably.
**Input:** Custom Python Exception.
**Output:** Propagated Exception.
**Rules:**
* Developers MUST raise custom exceptions (e.g., `raise AIProviderTimeout()`) rather than returning complex error dictionaries from services.

### Step 2 — Catch & Log
**Purpose:** Record the failure for debugging.
**Input:** Exception object.
**Output:** Log entry.
**Rules:**
* Use `logger.exception()` to capture the full stack trace securely in the backend logs.

### Step 3 — Format & Return
**Purpose:** Inform the client safely.
**Input:** Exception object.
**Output:** JSON Response.
**Rules:**
* Hide the stack trace from the JSON response if `ENV == 'production'`.

---

# 5. INPUT CONTRACT

N/A - This is a cross-cutting concern.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A standard JSON Error Envelope.

## 6.2 Output Structure

```json
{
  "status": "error",
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "The requested document could not be found.",
    "details": null
  }
}
```

## 6.3 Output Rules

* The `code` must be a `SCREAMING_SNAKE_CASE` string that the frontend can use for programmatic translation or icon mapping.
* The `message` must be a human-readable string safe to display directly to the user.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Fail Securely:** No stack traces in production. No database query strings in error messages.
* **Semantic HTTP Codes:** Use HTTP codes correctly (400 for bad input, 401 for bad auth, 403 for bad permissions, 404 for missing resources, 500 for server bugs).

## 7.2 Validation Rules

* FastAPI's default 422 Unprocessable Entity errors (from Pydantic) MUST be intercepted and rewritten to match the standard JSON Error Envelope structure.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

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
N/A

## 12.2 Processing Trigger
N/A

## 12.3 Processing Status
N/A

## 12.4 Retry Rules

* Errors inside Celery tasks do NOT return HTTP responses to the user. They must update the task's state in Redis to `FAILED` and log the exception.

## 12.5 Idempotency
N/A

---

# 13. DATABASE RESPONSIBILITY

## Error Rules

* Catch `sqlalchemy.exc.IntegrityError` (e.g., trying to create a user with an email that already exists) and translate it into a `400 Bad Request` or `409 Conflict` rather than letting it bubble up as a 500 error.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

*(This entire document defines how APIs fail)*

---

# 16. ERROR HANDLING

## 16.1 Standard Error Categories

| Category | Base Exception | HTTP Code | Scenario |
| --- | --- | --- | --- |
| Client | `BadRequestException` | 400 | Invalid form data |
| Auth | `UnauthorizedException` | 401 | Expired JWT |
| Access | `ForbiddenException` | 403 | Wrong workspace |
| Resource | `NotFoundException` | 404 | Missing document |
| AI | `AIGatewayException` | 502/503 | OpenAI timeout |
| Server | `InternalServerException` | 500 | Unhandled Python bug |

---

# 17. AUTHORIZATION & SECURITY

## 17.4 Security Rules

* Timing attacks: If a user tries to access a document they don't own, return `404 Not Found` instead of `403 Forbidden` to prevent them from scanning UUIDs to see if documents exist.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Exceptions     | `backend/app/core/exceptions.py`| Base Exception classes |
| Handlers       | `backend/app/api/errors.py` | FastAPI `@app.exception_handler` definitions |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Handled errors (4xx) should be logged as `WARNING` or `INFO`.
* Unhandled errors (5xx) MUST be logged as `ERROR` or `CRITICAL` with full stack traces.

## 24.2 Audit Logging
N/A

## 24.3 Sensitive Data Rules

* The global exception handler MUST scrub the request body of passwords before dumping it to the logs during an error.

---

# 25. OBSERVABILITY

## Metrics

* Count of 4xx errors per endpoint (indicates bad UI UX or malicious scanning).
* Count of 5xx errors per endpoint (indicates a system bug needing immediate patching).

## Health
N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Write tests that intentionally trigger `404`, `401`, `422`, and `500` errors and assert that the JSON returned matches the Error Envelope schema exactly.

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
| `FastAPI internal crash` | Unhandled exceptions fall back to a generic catch-all handler that returns a sanitized 500 error. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `DEBUG` | If True, includes `stack_trace` in the JSON response | Yes | `False` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] FastAPI returns standard JSON envelope for Pydantic validation errors.
* [ ] FastAPI returns standard JSON envelope for Database Not Found errors.
* [ ] Unhandled exceptions do not leak stack traces in production.
* [ ] Frontend Axios interceptor can seamlessly parse the error JSON.

---

# 32. DEFINITION OF DONE

The Error Handling architecture is **DONE** when developers can simply `raise WorkspaceNotFoundError()` in their business logic, knowing it will automatically be converted to a clean `404` JSON response for the frontend.

---

# 33. IMPLEMENTATION RULES

1. **Errors must be handled explicitly.**
2. **Unsupported input must fail safely.**
3. **Secrets must never be committed to source control (or leaked in logs).**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides a centralized, standardized way to catch software failures and communicate them securely to the frontend.

## What the user sees
Clean, helpful error messages ("Document not found") instead of broken web pages.

## What happens in the background
FastAPI middleware intercepts Python Exceptions, formats them into a JSON envelope, strips out sensitive stack traces, logs the trace securely to the backend, and returns a semantic HTTP status code.

## What it receives
Python Exceptions.

## What it produces
JSON HTTP Responses.

## Success means
The application fails gracefully, developers have the logs they need to fix bugs, and users are never confused by ugly technical errors.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
