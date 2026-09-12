# Legal AI Platform (Backend Database Standards)

> **Purpose:** Complete implementation blueprint for `Backend Database Standards`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Backend Database Standards`

## 1.2 Service ID

`sys-backend-db-core-platform`

## 1.3 Service Category

`Platform Engineering & Core Logic`

## 1.4 Service Type

`Development Standard`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Backend Database Standards must:

* Dictate how SQLAlchemy ORM models are written.
* Define strict rules for tenant isolation (making sure Workspace A never sees Workspace B's data).
* Enforce schema migration workflows using Alembic.
* Standardize common database patterns like UUID primary keys, soft deletes, and automatic audit timestamps.

The service must **not** manage the physical database infrastructure (e.g., PostgreSQL tuning, which belongs to Deployment Architecture) or vector search specifics (which belongs to AI Architecture).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Data leaks in a legal platform are catastrophic. If a query accidentally omits a `WHERE workspace_id = ?` clause, a lawyer might see another law firm's confidential contract. These strict database standards, specifically the enforcement of the Repository Pattern and tenant IDs, ensure that such data leaks are mathematically impossible at the code level.

## 1.7 User Value

Explain what the user gains from this service.
Absolute data privacy and data integrity. They can trust that their files will never be crossed with another user's files.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A standard set of SQLAlchemy Base classes, Mixins, and Repository classes that developers inherit from when building new features.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* SQLAlchemy Base Model configuration.
* UUIDv4 Primary Key enforcement.
* Audit Mixins (`created_at`, `updated_at`).
* Soft Delete mechanisms (`is_deleted`, `deleted_at`).
* Alembic migration tracking.
* The Repository Pattern for isolating database calls.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Business logic decisions (e.g., "Can this user delete this row?"). That belongs in the Service layer.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `SQLAlchemy` | ORM logic | - |
| `Alembic` | Migration logic | - |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Backend Services** consume the Repositories defined by this standard.

---

# 3. USER EXPERIENCE

N/A - This defines developer standards.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Creating a New Database Table

```text
DEVELOPER CREATES ORM MODEL (`models/document.py`)
  Inherits from `Base`, `UUIDMixin`, `AuditMixin`, `WorkspaceMixin`.
  ↓
DEVELOPER RUNS ALEMBIC (`alembic revision --autogenerate -m "Add docs"`)
  Alembic compares Python models to Postgres schema and generates a migration script.
  ↓
DEVELOPER CREATES REPOSITORY (`repositories/document_repo.py`)
  Writes methods like `get_by_id_and_workspace(id, workspace_id)`.
  ↓
SERVICE LAYER CALLS REPOSITORY
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs
N/A

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Repositories should accept either plain Python types (strings, ints) or Pydantic schemas (e.g., `DocumentCreate`). They must NOT accept FastAPI `Request` objects.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
SQLAlchemy Model Instances or Pydantic objects.

## 6.2 Output Structure
N/A

## 6.3 Output Rules
* If a single row is expected but not found, Repositories should return `None` (not raise an Exception). The Service layer decides if returning `None` constitutes a `404 Not Found` error.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Tenant Isolation:** Every table that belongs to a user's workspace MUST include a `workspace_id` foreign key.
* **Repository Isolation:** The ONLY files allowed to import `sqlalchemy.orm.Session` are files inside the `repositories/` folder.
* **Never Auto-commit:** Repositories must not call `db.commit()` internally for single operations. They should flush (`db.flush()`) and let the Service layer handle the final `commit()` to ensure transactional atomicity.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* **Soft Delete vs Hard Delete:** Legal data is sensitive. Default to Soft Deletes. Add a boolean `is_deleted` flag. Hard deletes (actual `DELETE FROM` SQL) are reserved for compliance purges (e.g., GDPR Right to be Forgotten) or temporary staging tables.

## 7.4 Failure Rules
* SQLAlchemy `IntegrityError` (e.g., trying to insert a duplicate unique value) must be caught by the Repository and translated into a custom business exception (e.g., `DuplicateEmailError`) so the Service layer doesn't leak SQL details to the frontend.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* Documents are large. Do not store the actual raw text or binary PDF inside PostgreSQL. Store a reference (e.g., `s3_key`) to where the file lives in the Object Storage layer.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
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

N/A

---

# 13. DATABASE RESPONSIBILITY

*(This entire document defines Database Responsibilities).*

## 13.1 Owned Data
* PostgreSQL schemas.

## 13.5 Database Rules

* **UUIDs:** Do not use auto-incrementing integers (`id = 1, 2, 3`) for primary keys. They allow attackers to guess the size of your database and easily scrape endpoints. Use UUIDv4 for all primary keys.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A

---

# 16. ERROR HANDLING

## Error Rules

* Repositories catch DB-specific errors (`sqlalchemy.exc.DatabaseError`) and wrap them in internal exceptions.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* **CRITICAL:** Every single repository `GET`, `UPDATE`, or `DELETE` method MUST require the `workspace_id` as an argument and include it in the `WHERE` clause.
* Example: `db.query(Document).filter(Document.id == doc_id, Document.workspace_id == workspace_id).first()`
* This makes it impossible to retrieve a document without proving you belong to its workspace.

## 17.3 Sensitive Data
* Passwords must be hashed using `bcrypt` before reaching the database.
* API Keys for AI Providers (if stored) must be encrypted at rest using AES-256 before insertion into PostgreSQL.

## 17.4 Security Rules
* Prevent SQL Injection by using SQLAlchemy's ORM strictly. Never construct raw SQL strings.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Queries should generally return in < 50ms.

## 20.2 Large Input Handling

* **Pagination:** Database `SELECT` queries that can return unbounded amounts of data MUST use `.limit()` and `.offset()` (or cursor-based logic) to prevent memory exhaustion on the Python server.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Database Core  | `backend/app/db/` | Base class, mixins, session maker |
| Models         | `backend/app/models/` | SQLAlchemy ORM Classes |
| Repositories   | `backend/app/repositories/` | Data access functions/classes |
| Migrations     | `backend/alembic/` | Database schema migrations |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* SQLAlchemy can be configured to log raw SQL queries (`echo=True`). This MUST be turned off in Production, but can be enabled in Local Development to debug slow queries.

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Repositories should be tested against a real, isolated test database (e.g., using `pytest-postgresql` or spinning up a throwaway SQLite/Postgres container) rather than mocking SQLAlchemy. This ensures the SQL generated by the ORM actually executes correctly.

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

## Compatibility Rules

* **No Destructive Migrations:** Alembic migrations should strive to be additive. Dropping a column that the old version of the API still expects will cause downtime during deployments. If you must drop a column, do it in two deployments (Deploy 1: Code stops using column. Deploy 2: DB drops the column).

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `DATABASE_URL` | Postgres connection string | Yes | `postgresql://user:pass@localhost:5432/legal_db` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* Alembic migrations (`alembic upgrade head`) MUST be executed automatically by the CI/CD pipeline immediately before the new FastAPI application code is booted.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] All tables use UUIDv4 for Primary Keys.
* [ ] All tables have `created_at` and `updated_at` columns automatically populated.
* [ ] Repositories enforce `workspace_id` filtering on all operations.
* [ ] The API routes never interact with the database directly.

---

# 32. DEFINITION OF DONE

The Backend Database Standards are **DONE** when the SQLAlchemy Base models and Mixins are created, allowing a developer to create a new table simply by declaring the columns, knowing that UUIDs, timestamps, and tenant IDs are handled automatically via inheritance.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Repositories only save and fetch; they do not calculate).
2. **Database ownership must be explicit.**
3. **Secrets must never be committed to source control.** (No database passwords in `alembic.ini`).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the strict blueprints for how the Python application interacts with the PostgreSQL database.

## What the user sees
N/A (Internal).

## What happens in the background
SQLAlchemy maps Python objects to SQL rows. Alembic tracks schema changes. The Repository layer isolates database calls so the rest of the application doesn't have to worry about SQL syntax or connection pooling.

## What it receives
Requests from the Service Layer.

## What it produces
Persistent state in PostgreSQL.

## Success means
Data is perfectly isolated between legal firms, database migrations happen flawlessly during deployments, and SQL Injection attacks are impossible.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
