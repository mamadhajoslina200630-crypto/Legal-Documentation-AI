# Legal AI Platform (Backend Service Standards)

> **Purpose:** Complete implementation blueprint for `Backend Service Standards`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Backend Service Standards`

## 1.2 Service ID

`sys-backend-services-core-platform`

## 1.3 Service Category

`Platform Engineering & Core Logic`

## 1.4 Service Type

`Development Standard`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Backend Service Standards must:

* Define exactly how business logic is written inside the `app/services/` directory.
* Guarantee that Services are completely isolated from HTTP logic (FastAPI) and SQL logic (SQLAlchemy).
* Standardize how Services handle external AI calls and Database operations via dependency injection.

The service must **not** deal with API routing or database table schemas.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Business rules change frequently. If the rule "A contract is high risk if it contains the word 'indemnity'" is hardcoded inside an HTTP API endpoint, it becomes impossible to run that same rule from a background Celery worker. By enforcing strict Service standards, business logic becomes reusable, testable, and completely independent of how it was triggered.

## 1.7 User Value

Explain what the user gains from this service.
Consistency. Features behave exactly the same whether they are triggered via the web dashboard, the mobile app, or an automated background job.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A standard pattern (usually a Python Class or a set of pure functions) that receives data, applies rules, and returns results, completely ignorant of the outside world.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Service Class structure (e.g., `DocumentService`).
* Dependency Injection via `__init__` for repositories.
* Business rule validation.
* Exception raising standards.
* Transaction management boundaries.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* HTTP Response formatting (e.g., Returning `JSONResponse`).
* Raw SQL queries.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Repositories` | To fetch/save data | Pydantic/Dict objects |
| `AI Gateway` | To perform AI logic | AI Requests |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**API Routers** and **Background Celery Tasks** consume these services.

---

# 3. USER EXPERIENCE

N/A - Internal developer experience.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Standard Service Method Execution

```text
CALLER (Router or Worker) calls `DocumentService.summarize_document(doc_id)`
  ↓
SERVICE VALIDATION
  Checks if `doc_id` is valid and user has permissions via `DocumentRepository`.
  ↓
BUSINESS LOGIC
  Extracts text via `StorageService`.
  Builds the AI Prompt.
  Calls `AIGatewayService`.
  ↓
STATE MUTATION
  Updates the Document status to "Summarized" via `DocumentRepository`.
  ↓
RETURN
  Returns the summary text to the caller.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs
* Plain Python primitives (UUIDs, Strings).
* Pydantic validation schemas (e.g., `DocumentCreate` schema).

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* **No HTTP Objects:** Services MUST NEVER accept FastAPI `Request`, `Response`, or `HTTPException` objects. A Service should not know it is running inside a web server.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Domain entities (Pydantic models) or plain primitives.

## 6.2 Output Structure
N/A

## 6.3 Output Rules
* Services must not return HTTP Status Codes (like returning a `404`). If something is not found, the service must `raise DocumentNotFoundError()`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Single Responsibility:** A `UserService` manages users. A `DocumentService` manages documents. If a complex operation involves both, create an Orchestrator service (e.g., `WorkspaceOnboardingService`) rather than tangling the two basic services.
* **Pure Logic:** Services should be as "pure" as possible. They take inputs, apply rules, and return outputs.

## 7.2 Validation Rules
* Business validation (e.g., "End date must be after Start date") belongs in the Service layer, NOT in the Database layer or the Router layer.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* Services must raise explicit custom exceptions defined in `core/exceptions.py`.

## 7.5 Boundary Rules
* If a Service needs a Database connection, it must be injected into the Service constructor by the Router (using FastAPI `Depends`), rather than the Service importing a global `db_session` object.

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

N/A

---

# 10. AI PROMPT RESPONSIBILITY

## 10.4 Prompt Rules
* The Service layer is where AI prompts are dynamically constructed before being handed off to the AI Gateway. The Service is responsible for ensuring the prompt has the correct business context.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Celery tasks must be thin wrappers that simply import and call the Service layer. (e.g., The Celery task `run_ocr` should just be 2 lines of code calling `DocumentService.process_ocr()`).

---

# 13. DATABASE RESPONSIBILITY

## 13.5 Database Rules
* **Transactions:** The Service layer is responsible for defining the boundary of a database transaction. If a Service needs to create a User and a Workspace together, it should wrap both repository calls in a single database commit/rollback block to ensure atomicity.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A

---

# 16. ERROR HANDLING

## Error Rules
* See 6.3 and 7.4. Raise Exceptions, do not return error dictionaries.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Services should generally trust that the Router has already verified the user's `workspace_id`. However, for highly sensitive operations, the Service signature should require the `current_user` object to double-check permissions internally.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Heavy operations (like looping over 10,000 document chunks) must be optimized (e.g., using bulk repository inserts) or pushed to a background Celery task.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Interfaces     | `backend/app/services/interfaces.py` | Optional ABCs for testing |
| Implementation | `backend/app/services/document.py` | Concrete classes |

---

# 22. SERVICE CONNECTIONS

```text
[Router] ──► [Service] ──► [Repository]
               │
               ▼
           [AI Gateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Services should heavily utilize the application logger. Every major business decision (e.g., `INFO: Document 123 flagged as high risk`) should be logged here.

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Because Services take Repositories and external clients as injected parameters, testing them is trivial.
* Example: `service = DocumentService(mock_repo)`
* You can test business logic purely in memory without spinning up a Docker database container.

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

N/A

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] No `fastapi` imports exist inside the `services/` directory.
* [ ] No `sqlalchemy.orm` imports exist inside the `services/` directory.
* [ ] Services can be executed successfully from both an API route and a Python REPL.

---

# 32. DEFINITION OF DONE

The Backend Service Standards are **DONE** when the separation of concerns is so strict that a developer could theoretically rip out FastAPI, replace it with Flask, and not have to change a single line of code in the `services/` folder.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (This is the absolute core rule of this document).
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Through Repositories).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Houses the actual "brain" of the application—the business rules that make the legal platform valuable.

## What the user sees
N/A (Internal).

## What happens in the background
Data is passed from the web, validated, and handed to these services. The services apply legal rules, orchestrate AI prompts, and coordinate database saves.

## What it receives
Clean, validated Python objects.

## What it produces
Executed business processes.

## Success means
The application's core logic is highly readable, universally testable, and completely insulated from changes in web frameworks or database engines.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
