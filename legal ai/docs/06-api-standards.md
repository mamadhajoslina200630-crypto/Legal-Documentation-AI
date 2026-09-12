# Legal AI Platform (API Standards)

> **Purpose:** Complete implementation blueprint for `API Standards`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - API Standards`

## 1.2 Service ID

`sys-api-standards-core-platform`

## 1.3 Service Category

`Platform Engineering & Standards`

## 1.4 Service Type

`Shared capability`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The API Standards must:

* Define the exact URL structures, HTTP methods, and status codes used across the platform.
* Enforce Pydantic schema validation rules for all incoming requests and outgoing responses.
* Dictate how authentication (JWT) and authorization (Workspace permissions) are applied to endpoints.

The service must **not** own business logic. It dictates *how* business logic communicates with the outside world.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
As multiple backend developers and frontend developers build the application, inconsistent API endpoints (e.g., mixing `camelCase` with `snake_case`, or using `POST` when `PUT` is appropriate) cause endless integration bugs. This document establishes a single source of truth for API design to ensure the React frontend can consume the FastAPI backend seamlessly.

## 1.7 User Value

Explain what the user gains from this service.
Users experience a snappy and reliable application because the frontend knows exactly how to parse backend responses, gracefully handle errors, and manage loading states via standardized contracts.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully standardized FastAPI routing ecosystem where every endpoint looks, behaves, and fails in a predictable manner, fully documented via OpenAPI (Swagger).

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* RESTful routing conventions (`/api/v1/...`).
* WebSocket connections for real-time chat.
* Request body and query parameter validation (Pydantic).
* Standardized JSON response formatting.
* Error message structures and HTTP status codes.
* Pagination, filtering, and sorting conventions.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Internal Python function signatures (e.g., how a service calls a database repository).
* Database ORM query structures.
* Third-party AI provider API structures (e.g., OpenAI's specific JSON payload).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI Framework` | Underpins the entire API layer | HTTP protocol handling |
| `Pydantic` | Enforces the input/output schemas | Type hints & constraints |
| `Tech Stack` | Determines the allowed technologies | Python 3.12+ constraints |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
The `Frontend (React/Axios)` and `External API Consumers` heavily depend on these rules.

---

# 3. USER EXPERIENCE (DEVELOPER EXPERIENCE)

## 3.1 User Entry Point

Describe how the user reaches this capability.
Frontend developers interact with the APIs via Axios calls. Backend developers interact with this by writing `@router.get(...)` decorators.

## 3.2 User Input

Define everything the user can provide.
Developers provide Pydantic schemas defining the Request and Response models.

## 3.3 User Flow

Define the complete user journey:

```text
Frontend Axios Request
    ↓
Nginx Reverse Proxy
    ↓
FastAPI Router
    ↓
Pydantic Validation (422 Unprocessable Entity if failed)
    ↓
Authentication Dependency (401 Unauthorized if failed)
    ↓
Authorization Dependency (403 Forbidden if failed)
    ↓
Business Service Execution
    ↓
Pydantic Response Serialization
    ↓
Frontend State Update
```

## 3.4 User States

Define UI behavior for:

* Initial state: Request initiated (Frontend loading state).
* Input state: JSON payload transmitted.
* Processing state: Server processes request.
* Success state: HTTP 200/201 returned.
* Empty state: HTTP 200 with empty list `[]`.
* Partial result state: HTTP 206 (if streaming large files).
* Error state: HTTP 400/500 returned with standard error JSON.
* Retry state: Frontend retries 5xx errors via TanStack Query.
* Permission denied state: HTTP 401/403 returned.
* Unsupported input state: HTTP 415 or 422 returned.

## 3.5 User-Visible Result

Define exactly what the frontend must display.
An automatically generated OpenAPI / Swagger UI documentation page at `/docs` reflecting these exact standards.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
INPUT (HTTP Request)
  ↓
VALIDATION (Headers & JWT)
  ↓
CONTEXT PREPARATION (Extract User & Workspace ID)
  ↓
PROCESSING (Pass to Business Service)
  ↓
AI / LOGIC (Business Execution)
  ↓
VALIDATION (Response matches Pydantic Schema)
  ↓
RESULT (JSON Serialization)
  ↓
STORAGE (N/A for routing)
  ↓
API RESPONSE (HTTP Response)
```

For each step define:

### Step 1 — Routing Definition
**Purpose:** Map URLs to functions.
**Input:** Endpoint URL.
**Output:** FastAPI Router object.
**Rules:**
* Plural nouns must be used for resources (e.g., `/documents`, not `/document`).
* Lowercase and hyphens for URLs (e.g., `/risk-analysis`, not `/riskAnalysis`).

### Step 2 — Validation Dependency
**Purpose:** Ensure valid inputs.
**Input:** Query params, Path params, JSON body.
**Output:** Parsed Python native types.
**Rules:**
* Pydantic `Field(..., min_length=1)` must be heavily utilized.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `Authorization Header` | `String` | Yes | `Bearer <JWT_TOKEN>` |
| `workspace_id` | `UUID` | Yes | Usually passed as a path parameter or derived from auth context. |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `page` | `Integer` | `1` | Pagination (must be > 0) |
| `limit` | `Integer` | `20` | Pagination (max 100) |

## 5.3 Input Validation Rules

Define:

* Supported formats: `application/json` for REST, `multipart/form-data` for file uploads.
* Naming Convention: JSON payloads must use `snake_case` for keys (FastAPI will enforce this via Pydantic).

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

Standardized JSON payloads.

## 6.2 Output Structure

Define the logical structure of the result.

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## 6.3 Output Rules

* Output must be strictly typed via a `response_model` in the FastAPI decorator.
* Output must not contain database-specific attributes (e.g., internal ORM foreign keys that the frontend doesn't need).
* Missing information must be represented as `null`, not omitted entirely from the schema.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Method Semantics:** 
  * `GET` for fetching data (must be idempotent).
  * `POST` for creating resources or triggering complex AI jobs.
  * `PUT` for complete resource replacement.
  * `PATCH` for partial resource updates.
  * `DELETE` for removing resources.

## 7.2 Validation Rules

* Custom validation logic (e.g., "End date must be after start date") must reside inside the Pydantic `@model_validator` methods.

## 7.3 Decision Rules

* Define how the service decides between different outcomes: If an API takes longer than 2 seconds, it MUST immediately return HTTP 202 Accepted with a `job_id`, and the client must poll for results or wait for a WebSocket event.

## 7.4 Failure Rules

* Define what happens when processing cannot be completed: Unhandled exceptions trigger a global Exception Handler that returns a standard HTTP 500 JSON envelope without leaking the stack trace.

## 7.5 Boundary Rules

* No API route function may exceed 50 lines of code. It must delegate to a service layer.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* APIs manipulating documents must receive `document_id` in the URL path: `/api/v1/workspaces/{workspace_id}/documents/{document_id}`

## 8.2 Context Rules

* Always use the selected document version.
* Do not mix unrelated workspace documents. A global dependency must verify the `document_id` belongs to the `workspace_id`.
* Preserve document/page/section references.
* Respect document permissions.

## 8.3 Section-Level Context

N/A for API Standards.

---

# 9. AI RESPONSIBILITY

N/A for API Standards (Handled in AI Architecture).

---

# 10. AI PROMPT RESPONSIBILITY

N/A for API Standards.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A for API Standards.

---

# 12. BACKGROUND PROCESSING

Use this section for work that should happen asynchronously.

## 12.1 Background Tasks

* Polling APIs for background tasks.

## 12.2 Processing Trigger

* HTTP POST triggers a Celery task.

## 12.3 Processing Status

```text
GET /api/v1/tasks/{task_id}

{
  "status": "processing",
  "progress": 45
}
```

## 12.4 Retry Rules

N/A for API routing.

## 12.5 Idempotency

* Important endpoints like `POST /payments` or `POST /analyze` must accept an `Idempotency-Key` header to prevent double execution on network retries.

---

# 13. DATABASE RESPONSIBILITY

N/A for API Standards. API routes must never import SQLAlchemy sessions directly; they receive them via FastAPI `Depends()` and pass them to the service layer.

---

# 14. STORAGE REQUIREMENTS

N/A for API Standards.

---

# 15. API CONTRACT

Define every API required by this service.

## 15.1 API List (Core Module Examples)

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `POST` | `/api/v1/auth/login` | Retrieve JWT |
| `GET`  | `/api/v1/workspaces` | List workspaces |
| `POST` | `/api/v1/workspaces/{id}/documents` | Upload document |
| `GET`  | `/api/v1/documents/{id}/analysis` | Get intelligence |
| `WS`   | `/ws/v1/chat/{workspace_id}` | Real-time AI chat |

## 15.2 API Request

For each endpoint define:

* Authentication: Forced via `Depends(get_current_active_user)`.
* Authorization: Forced via `Depends(verify_workspace_access)`.

## 15.3 API Response

Define:

* Success response: `200 OK`
* Creation response: `201 Created`
* Accepted response: `202 Accepted`

## 15.4 API Rules

* APIs must be versioned. (e.g., `/api/v1`).
* Authentication is required where applicable.
* Authorization must be checked server-side.
* Never trust frontend permissions.
* Never expose internal implementation details.
* Never expose secrets or provider credentials.

---

# 16. ERROR HANDLING

Define service-specific errors.

| Error Code | HTTP Status | User Result       | Recovery   |
| ---------- | ----------- | ----------------- | ---------- |
| `VALIDATION_ERROR` | `422` | Form highlight | Correct fields |
| `UNAUTHORIZED` | `401` | Redirect to Login | Log in again |
| `FORBIDDEN` | `403` | "Access Denied" msg | Request access |
| `NOT_FOUND` | `404` | "Resource missing" | Go back |
| `RATE_LIMITED` | `429` | "Too many requests" | Wait 60s |
| `INTERNAL_ERROR` | `500` | "Something went wrong" | Retry later |

## Error Rules

The service must distinguish between:

* Invalid input (422)
* Unauthorized access (401)
* Processing failure (500)
* Temporary failure (503)

Errors must be understandable to the frontend without exposing sensitive internal details. The JSON error envelope must look like:
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "details": [{"field": "email", "issue": "missing @"}]
}
```

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

Define who can access API routes based on JWT scopes.

## 17.2 Data Isolation

User and workspace data must never cross unauthorized boundaries. Every URL with a `{workspace_id}` must be cryptographically verified against the user's token.

## 17.3 Sensitive Data

All JSON payloads containing extracted legal text must be sent over HTTPS.

## 17.4 Security Rules

* Validate all external input.
* Enforce authorization on backend via FastAPI Dependencies.
* Protect stored documents via signed URLs.
* Never expose secrets to frontend.

---

# 18. SOURCE & TRACEABILITY

N/A for API Standards.

---

# 19. LEGAL SAFETY

N/A for API Standards.

---

# 20. PERFORMANCE REQUIREMENTS

Define expected behavior without specifying implementation unnecessarily.

## 20.1 Response Requirements

* All synchronous GET requests must complete in < 200ms.
* API Gateway (Nginx) must enforce request timeouts (e.g., 30s max).

## 20.2 Large Input Handling

* File uploads must use `UploadFile` (Streaming) in FastAPI, not `bytes` (which loads entirely into RAM).

## 20.3 Concurrent Usage

* N/A

## 20.4 Resource Limits

Define:

* Request limits: Global rate limiter applied via Redis (e.g., 100 requests per minute per IP).

---

# 21. FOLDER STRUCTURE

Define where this service belongs in the project.

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| API Routers    | `backend/app/api/v1/` | Define routes and schemas |
| Schemas        | `backend/app/schemas/` | Pydantic models for I/O |
| Dependencies   | `backend/app/api/deps.py` | Auth and DB injection |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

FastAPI middleware must log every incoming request and outgoing response status code, omitting the request body to preserve privacy.

## 24.2 Audit Logging

Specific mutating endpoints (POST/PUT/DELETE) on documents must trigger an audit log insertion in the database.

## 24.3 Sensitive Data Rules

Logs must not contain:
* Passwords
* API keys
* Authentication tokens

---

# 25. OBSERVABILITY

## Metrics

* Request count per endpoint.
* Success/Failure rate per endpoint.
* P95 and P99 latency per endpoint.

## Health

`/health` endpoint returns `200 OK` if the API can reach the DB and Redis.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

Test:

* Validation logic in Pydantic models.

## 26.2 Integration Testing

Test:

* Every API route using FastAPI `TestClient`.
* Ensure HTTP 403 is returned when trying to access another user's workspace.

## 26.3 End-to-End Testing
N/A
## 26.4 AI Testing
N/A
## 26.5 Security Testing
N/A

---

# 27. EDGE CASES

List known edge cases.

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Missing Auth Header` | `HTTP 401 Unauthorized` |
| `Malformed JSON` | `HTTP 400 Bad Request` |
| `UUID format invalid` | `HTTP 422 Unprocessable Entity` |

---

# 28. VERSIONING

Define how service behavior changes are managed.

## API Version

`v1` is embedded in the path: `/api/v1/`.
When breaking changes are introduced, a `/api/v2/` router must be created, allowing older clients to gracefully deprecate.

## Compatibility Rules

Adding fields to a JSON response is NOT a breaking change. Removing fields or changing types IS a breaking change.

---

# 29. CONFIGURATION

N/A

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

The service is considered complete only when:

### Functional
* [ ] N/A

### API
* [ ] All routes follow the `/api/v1/resource` naming convention.
* [ ] All routes use Pydantic `response_model`.
* [ ] All routes use `Depends(get_current_user)`.

---

# 32. DEFINITION OF DONE

The API Standards are **DONE** when every developer understands how to construct a new URL route, validate its data, and return a consistent error without having to ask the architect.

---

# 33. IMPLEMENTATION RULES

These rules apply to the entire service.

1. **Do not duplicate common platform capabilities.**
2. **Keep business logic inside the service responsible for it (NOT IN THE ROUTER).**
3. **Frontend must not contain authoritative business logic.**
4. **Services must communicate through defined contracts (Pydantic).**
5. **Errors must be handled explicitly.**
6. **Unsupported input must fail safely.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does

Dictates the absolute rules for how the Frontend communicates with the Backend via HTTP REST APIs and WebSockets.

## What the user sees

A stable application that doesn't crash when unexpected data is returned, and form errors that highlight exactly which field is invalid.

## What happens in the background

FastAPI automatically parses incoming JSON, validates it against strict Python types, and serializes the outgoing responses, all while generating live OpenAPI documentation.

## What it receives

Developer adherence to routing and schema rules.

## What it produces

A highly consistent API layer.

## Success means

Zero integration bugs between the Frontend and Backend teams.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
