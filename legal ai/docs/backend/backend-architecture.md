# Legal AI Platform (Backend Architecture)

> **Purpose:** Complete implementation blueprint for `Backend Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Backend Architecture`

## 1.2 Service ID

`sys-backend-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & Core Logic`

## 1.4 Service Type

`Backend System Blueprint`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Backend Architecture must:

* Define the overarching structure of the FastAPI application (Modular Monolith).
* Establish the strict separation of concerns across three layers: Routers (API), Services (Business Logic), and Repositories (Database Access).
* Orchestrate how domain modules (e.g., Auth, Documents, AI) communicate with each other securely without creating circular dependencies.

The service must **not** define specific database schemas (that belongs to Database Architecture) or physical infrastructure (that belongs to Deployment Architecture).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
A chaotic backend where database queries, API routing, and AI business logic are all mixed into one massive file is impossible to maintain. If a developer needs to change how documents are summarized, they shouldn't accidentally break the billing system. This architecture enforces clean, isolated domains, allowing a large team to move fast without breaking things.

## 1.7 User Value

Explain what the user gains from this service.
Speed and reliability. A well-architected backend processes their legal documents faster, doesn't crash during peak hours, and enables the rapid rollout of new AI features.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A standardized Python repository structure, leveraging FastAPI's Dependency Injection system, where every line of code has an obvious, predictable location.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Application lifecycle (Startup, Shutdown events).
* Dependency Injection (`Depends()`).
* Routing organization (`APIRouter`).
* The Service Layer pattern (Business Logic isolation).
* The Repository Layer pattern (Data Access isolation).
* Configuration management (Pydantic `BaseSettings`).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Background task queues (Handled by Background Processing).
* The specific AI models used (Handled by AI Architecture).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI` | Core web framework | - |
| `SQLAlchemy` | ORM for database access | - |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every backend micro-service and feature** inherits from this architecture.

---

# 3. USER EXPERIENCE

N/A - The backend is a headless API; it has no UI.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### The Request Lifecycle (3-Tier Architecture)

```text
HTTP REQUEST GET `/api/v1/documents/123`
  ↓
ROUTER LAYER (`api/v1/endpoints/documents.py`)
  Parses HTTP request, validates JWT token via `Depends`.
  ↓
SERVICE LAYER (`services/document_service.py`)
  Contains business rules ("Does this user have permission to view this?").
  ↓
REPOSITORY LAYER (`repositories/document_repo.py`)
  Constructs SQLAlchemy query, fetches raw row from Postgres.
  ↓
SERVICE LAYER
  Formats row into business object.
  ↓
ROUTER LAYER
  Formats object into Pydantic JSON response.
  ↓
HTTP RESPONSE 200 OK
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs
N/A - See API Standards for payload definitions.

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* **Pydantic Everywhere:** The Router layer MUST use Pydantic models to validate incoming JSON payloads. If the payload is invalid, FastAPI automatically returns a `422 Unprocessable Entity` before the code ever reaches the Service Layer.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Standardized JSON responses.

## 6.2 Output Structure
* Must use `response_model` in the FastAPI route decorator to guarantee the shape of the outgoing JSON and automatically filter out internal database fields (like `hashed_password`).

## 6.3 Output Rules
N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Modular Monolith:** Do not build 50 microservices. Build one FastAPI application, but internally separate it into strict domain folders (e.g., `app/domains/auth`, `app/domains/documents`).
* **Strict Layering:** A Router can call a Service. A Service can call a Repository. A Repository MUST NOT call a Service. A Router MUST NOT call a Repository directly (no SQL queries inside API endpoints!).

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* Handled globally via the Error Handling architecture. Services throw exceptions; Routers do not catch them (the global middleware does).

## 7.5 Boundary Rules
* **Dependency Injection:** Services must not instantiate their own database sessions. The database `Session` must be passed into the service via FastAPI's `Depends(get_db)`. This makes unit testing incredibly easy.

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

N/A - The backend orchestrates AI, but AI is governed by the AI Architecture doc.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
N/A

## 13.5 Database Rules

* The Repository Layer is the ONLY place where SQLAlchemy ORM models (`db.query(Document)`) are allowed.
* The Service layer receives Pydantic schemas or standard Python dictionaries from the Repository, ensuring the business logic isn't tightly coupled to the SQL database engine.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

*(Defined in API Standards document)*

---

# 16. ERROR HANDLING

*(Defined in Error Handling document)*

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Every route in the Router layer must explicitly declare its required permissions using FastAPI `Security()` or `Depends()`.

## 17.4 Security Rules

* CORS (Cross-Origin Resource Sharing) must be strictly configured in `main.py` to only allow requests from the official frontend domain (e.g., `https://app.legalplatform.com`).

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* **Asynchronous I/O:** All FastAPI routes that talk to the Database or AI Providers MUST be defined as `async def` to ensure the server can handle thousands of concurrent requests without blocking the main event loop.

## 20.2 Large Input Handling
N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

```text
backend/
├── app/
│   ├── main.py                 # FastAPI application instance
│   ├── core/                   # App-wide settings, security, DB setup
│   ├── api/                    # Routers (Controllers)
│   │   ├── dependencies.py     # Shared `Depends()` logic
│   │   └── v1/                 # Versioned API endpoints
│   ├── services/               # Business logic
│   ├── repositories/           # Database access logic (SQLAlchemy)
│   ├── schemas/                # Pydantic models (Input/Output validation)
│   └── models/                 # SQLAlchemy ORM models (Database schema)
```

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

## Events Produced

* FastAPI `startup` event: Used to initialize the DB connection pool and Redis connections.
* FastAPI `shutdown` event: Used to gracefully close connections.

---

# 24. LOGGING & AUDIT

*(Defined in Logging & Monitoring document)*

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Because of the strict 3-tier layering, the Service Layer can be unit tested perfectly by mocking the Repository layer. You don't need a real database to test business rules.

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

## Compatibility Rules

* All API routes must be prefixed with a version (e.g., `/api/v1/`). When breaking changes are introduced, they must go into `/api/v2/` to avoid breaking older mobile apps or third-party API consumers.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `pydantic.BaseSettings` | Parses `.env` variables | Yes | - |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* The backend must be run using an ASGI server (like `uvicorn` or `gunicorn` with `uvicorn` workers) to support asynchronous execution.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Codebase follows strict Router -> Service -> Repository flow.
* [ ] No raw SQL or ORM queries exist inside API endpoint functions.
* [ ] Application utilizes `async/await` for all I/O operations.
* [ ] Database sessions are injected via `Depends()`.

---

# 32. DEFINITION OF DONE

The Backend Architecture is **DONE** when the foundational FastAPI `main.py` is configured, the folder structure is scaffolded, and a developer can add a new feature simply by dropping three new files into `api/`, `services/`, and `repositories/`.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Specifically, inside the `services/` directory).
2. **Database ownership must be explicit.** (Only `repositories/` touch the DB).
3. **Unsupported input must fail safely.** (Pydantic catches bad JSON).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the structural skeleton for the entire Python backend codebase.

## What the user sees
N/A (Internal).

## What happens in the background
FastAPI routes HTTP requests, Pydantic validates the data, Services execute the heavy lifting and business rules, and Repositories save the results safely into PostgreSQL.

## What it receives
Raw HTTP Traffic.

## What it produces
Executed business logic and JSON responses.

## Success means
The codebase can grow to hundreds of thousands of lines of code without collapsing under its own weight, and developers can work on separate features without creating merge conflicts.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
