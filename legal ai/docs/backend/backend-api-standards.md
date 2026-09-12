# Legal AI Platform (Backend API Standards)

> **Purpose:** Complete implementation blueprint for `Backend API Standards`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Backend API Standards`

## 1.2 Service ID

`sys-api-standards-core-platform`

## 1.3 Service Category

`Platform Engineering & Core Logic`

## 1.4 Service Type

`Development Standard`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Backend API Standards must:

* Define the exact URL structures, HTTP verbs, and payload shapes for all endpoints in the FastAPI application.
* Enforce RESTful principles strictly across the platform.
* Standardize how pagination, filtering, sorting, and versioning are implemented.

The service must **not** define how business logic is executed (that is the domain of Backend Service Standards).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
If the frontend team has to guess whether the backend expects `/getDocuments`, `/documents/getAll`, or `/api/documents`, development slows to a crawl. A strict, predictable API contract means frontend developers can confidently build UIs without constantly asking backend engineers how an endpoint works.

## 1.7 User Value

Explain what the user gains from this service.
Faster feature delivery. Predictable APIs allow mobile apps, web dashboards, and third-party integrations to be built rapidly and securely.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A pristine, auto-generated OpenAPI (Swagger) documentation page (`/docs`) that is 100% accurate because all FastAPI routes adhere strictly to these defined standards.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* RESTful URL naming conventions.
* Standard HTTP methods (GET, POST, PUT, PATCH, DELETE).
* Payload validation (Pydantic).
* Standardized Query Parameters (Sorting, Filtering, Pagination).
* API Versioning.
* Rate Limiting headers.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Database table design.
* Service layer execution logic.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI` | Web framework | Routing mechanism |
| `Pydantic` | Payload schemas | Data validation |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend Architecture** depends entirely on this standard to build its API integration layer.

---

# 3. USER EXPERIENCE

N/A - This defines a Developer experience.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Standard Request/Response Lifecycle

```text
HTTP CLIENT SENDS REQUEST (e.g., `POST /api/v1/workspaces/123/documents`)
  ↓
FASTAPI ROUTER INTERCEPTS
  ↓
PYDANTIC VALIDATES INCOMING JSON (HTTP 422 if invalid)
  ↓
DEPENDENCIES RESOLVED (Auth checked, DB injected)
  ↓
ROUTE HANDLER EXECUTES SERVICE LOGIC
  ↓
PYDANTIC FILTERS OUTGOING DATA (via `response_model`)
  ↓
HTTP RESPONSE RETURNED (HTTP 201 Created)
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

* **URL Parameters:** Used to identify specific resources (e.g., `/{workspace_id}/documents/{document_id}`).
* **JSON Body:** Used for `POST`, `PUT`, and `PATCH` requests.

## 5.2 Optional Inputs

* **Query Parameters:** Used for filtering and pagination (e.g., `?status=completed&limit=50`).

## 5.3 Input Validation Rules

* **Strict Validation:** Do not write custom `if data.get('email') is None:` logic in the router. You MUST define a Pydantic schema, and FastAPI will automatically reject bad input.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Standardized JSON objects.

## 6.2 Output Structure

* Lists must be returned as arrays. If paginated, they must be wrapped in a standard pagination envelope.
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 50
  }
}
```

## 6.3 Output Rules
* Responses MUST NOT contain internal database ID types (like Postgres row IDs) if they are not meant to be public. Always expose UUIDs.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Nouns, not Verbs:** URLs must represent resources (nouns), not actions.
  * *Wrong:* `POST /api/v1/uploadDocument`
  * *Right:* `POST /api/v1/documents`
* **Plurals:** Resource names in URLs must always be plural.
  * *Wrong:* `/api/v1/user/123`
  * *Right:* `/api/v1/users/123`
* **Kebab-case:** URLs must use kebab-case.
  * *Wrong:* `/api/v1/legal_documents`
  * *Right:* `/api/v1/legal-documents`

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules

* `PUT` vs `PATCH`: `PUT` replaces the entire resource. `PATCH` applies partial updates. Prefer `PATCH` for most updating operations.

## 7.4 Failure Rules

* See `Error Handling` documentation. Do not invent new error formats in individual routers.

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

* If an API endpoint triggers a Celery task that will take 5 minutes, it MUST return `202 Accepted` immediately, along with a `task_id` so the frontend can poll for status. It must NOT hang the HTTP connection waiting for the task to finish.

---

# 13. DATABASE RESPONSIBILITY

## 13.5 Database Rules

* Do not leak database schema names in the API. If the DB column is `usr_created_dt`, the API JSON should expose it as `created_at`. Map this in Pydantic.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

*(This entire document defines the API Contract).*

---

# 16. ERROR HANDLING

## Error Rules

* Standardize HTTP Status Codes:
  * `200 OK` (Success GET/PUT/PATCH)
  * `201 Created` (Success POST)
  * `202 Accepted` (Background task queued)
  * `204 No Content` (Success DELETE)

---

# 17. AUTHORIZATION & SECURITY

## 17.4 Security Rules

* Security Dependencies (JWT validation, Workspace validation) MUST be applied at the `APIRouter` level if possible, to prevent a developer from accidentally forgetting to secure a specific route inside that file.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Synchronous API requests (DB lookups) should return in `< 200ms`.

## 20.2 Large Input Handling

* **Pagination is Mandatory:** Any endpoint returning a list of items MUST be paginated (default limit 50). An endpoint returning 10,000 records in a single JSON array will crash the browser.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Router Config  | `backend/app/api/v1/router.py` | Main API index |
| Route Handlers | `backend/app/api/v1/endpoints/` | Specific files (e.g., `users.py`) |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

N/A

---

# 25. OBSERVABILITY

## Metrics

* Monitor the frequency of `422 Unprocessable Entity` responses. A high rate indicates the Frontend is sending bad data that doesn't match the API schema.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* API routes are tested using FastAPI's `TestClient` (which wraps `httpx`). These tests verify that hitting the URL with specific JSON returns the expected HTTP Status Code and matches the expected JSON structure.

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

## Compatibility Rules

* The URL MUST contain the major version (e.g., `/v1/`).
* Breaking changes (renaming fields, deleting endpoints) require a bump to `/v2/`.
* Additive changes (adding a new optional field) do not require a version bump.

---

# 29. CONFIGURATION

N/A

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] All endpoints use standard HTTP verbs correctly.
* [ ] All lists are paginated.
* [ ] Pydantic models are used for `response_model`.
* [ ] FastAPI Swagger docs at `/docs` correctly display all expected inputs and outputs.

---

# 32. DEFINITION OF DONE

The Backend API Standards are **DONE** when a frontend developer can navigate to `localhost:8000/docs`, view the auto-generated Swagger UI, and instantly know how to integrate with the backend without needing to look at Python source code.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Routers only route; they don't calculate).
2. **Unsupported input must fail safely.** (Pydantic HTTP 422).
3. **Repeated requests must not create unintended duplicate data.** (Use idempotent `PUT`/`PATCH` or unique DB constraints on `POST`).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Defines the language and grammar the frontend uses to talk to the backend.

## What the user sees
N/A (Internal).

## What happens in the background
FastAPI intercepts URL requests, validates incoming JSON strictly against Pydantic schemas, routes the data to the correct business service, and guarantees the shape of the outgoing response.

## What it receives
HTTP Traffic.

## What it produces
JSON Responses.

## Success means
Seamless communication between the React Frontend and the Python Backend, with zero ambiguity about what data is required.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
