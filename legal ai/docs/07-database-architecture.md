# Legal AI Platform (Database Architecture)

> **Purpose:** Complete implementation blueprint for `Database Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Database Architecture`

## 1.2 Service ID

`sys-db-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & Standards`

## 1.4 Service Type

`Full Data Infrastructure Specification`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Database Architecture must:

* Define exactly how data is structured, persisted, and retrieved across the platform.
* Manage the relationships between Relational Data (PostgreSQL), Vector Data (Qdrant), and Cache Data (Redis).
* Enforce strict multi-tenancy rules (Workspace isolation) at the data layer.

The service must **not** include business logic or API routing. It strictly governs the state and persistence of the application.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Legal applications deal with highly sensitive data. A robust database architecture prevents data leaks between users, ensures data integrity (no orphaned records when a document is deleted), and allows for high-speed semantic search (RAG) across millions of vectors without slowing down standard API queries.

## 1.7 User Value

Explain what the user gains from this service.
Users experience a platform where their confidential documents are strictly isolated, their chat history loads instantly, and semantic search queries return relevant clauses in milliseconds.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully defined Database Schema (ERD), a configured Vector Database topology, and a strict set of rules for how backend developers must interact with SQLAlchemy and Alembic.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* **Relational Schema:** Tables, Foreign Keys, Indexes in PostgreSQL 15+.
* **Vector Schema:** Collections, Payloads, and Embeddings in Qdrant.
* **Key-Value Schema:** Session state, Celery queues, and caching in Redis.
* **ORM Standards:** SQLAlchemy 2.0 syntax rules.
* **Migrations:** Alembic migration workflows.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Specific AI Model configurations (these belong in AI Architecture).
* Object storage bucket configuration (these belong in Storage Architecture).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `System Architecture` | Defines where databases are hosted | Network Topology |
| `API Standards` | Determines what data must be returned | JSON Schemas |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
Every backend business service (e.g., Document Summarization, Legal AI Chat) depends entirely on the Database Architecture to read and write state.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

N/A - Users do not interact directly with the database.

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

Define the complete internal workflow for Data Persistence.

```text
BUSINESS SERVICE
  ↓
SQLALCHEMY SESSION
  ↓
TRANSACTION BEGIN
  ↓
VALIDATE CONSTRAINTS (e.g. workspace_id check)
  ↓
COMMIT / ROLLBACK
  ↓
TRIGGER BACKGROUND QDRANT SYNC (if document changed)
```

For each step define:

### Step 1 — Relational Persistence
**Purpose:** Save structured business data.
**Input:** SQLAlchemy Model instances.
**Output:** Inserted/Updated DB Row.
**Rules:**
* All writes must happen inside a transaction.
* Exceptions must trigger an automatic `session.rollback()`.

### Step 2 — Vector Persistence
**Purpose:** Save AI embeddings for RAG.
**Input:** Text chunks + Metadata payload.
**Output:** Inserted Vector Points in Qdrant.
**Rules:**
* Vector insertion must happen asynchronously via Celery after the Relational DB commit succeeds, to prevent hanging the API request.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `SQLAlchemy Models` | `Python Class` | Yes | Must map exactly to PostgreSQL tables. |
| `Alembic Revisions` | `Python Script` | Yes | Must contain standard `upgrade()` and `downgrade()` functions. |

## 5.2 Optional Inputs

N/A

## 5.3 Input Validation Rules

* Database constraints (NOT NULL, UNIQUE) validate incoming data automatically.
* Check Constraints must be used for simple logic (e.g., `CHECK (price >= 0)`).

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

Persistent State.

## 6.2 Output Structure

```text
Database
├── PostgreSQL (Users, Workspaces, Documents, Chat History)
├── Qdrant (Chunks, Embeddings, Workspace Metadata Payload)
└── Redis (Celery Broker, Caching, Rate Limits)
```

## 6.3 Output Rules

* The database must enforce Referential Integrity (Foreign Keys).
* `ON DELETE CASCADE` must be carefully evaluated; soft deletes are preferred for critical data.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Multi-Tenancy:** Every major entity table (Documents, Chats, Analyses) MUST have a `workspace_id` foreign key.
* **Time Tracking:** Every table MUST have `created_at` and `updated_at` columns.
* **UUIDs:** Primary keys for all user-facing resources must be UUIDv4, not auto-incrementing integers, to prevent ID enumeration attacks (Insecure Direct Object Reference).

## 7.2 Validation Rules

* Data must be validated by Pydantic *before* it ever reaches the SQLAlchemy Session.

## 7.3 Decision Rules

* **PostgreSQL vs Qdrant:** Exact text of a document chunk goes into PostgreSQL. The semantic vector of that chunk goes into Qdrant.
* **PostgreSQL vs Redis:** Long-term chat history goes into PostgreSQL. Real-time active chat typing state goes into Redis.

## 7.4 Failure Rules

* Deadlocks or connection timeouts must be caught by the backend and retried if safe, or surfaced as a 503 Service Unavailable error.

## 7.5 Boundary Rules

* The Vector DB (Qdrant) must never be the Source of Truth for business relationships. It is strictly an index for semantic search.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* **PostgreSQL `documents` table:** Stores `id`, `filename`, `s3_url`, `status`, `workspace_id`, `uploaded_by`.
* **PostgreSQL `document_chunks` table:** Stores extracted text paragraphs.

## 8.2 Context Rules

* Deleting a document in PostgreSQL must trigger a Celery task to delete all associated vectors in Qdrant.

## 8.3 Section-Level Context

* Sections are tracked relationally (e.g., `document_id`, `page_number`, `chunk_index`).

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

N/A - The Database just stores the output of the AI.

## 9.2 AI Input
N/A

## 9.3 AI Output
N/A

## 9.4 AI Rules
N/A

## 9.5 AI Provider Independence
N/A

## 9.6 Model Requirements
N/A

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

Use only when the service requires retrieval.

## 11.1 Knowledge Sources

* **Qdrant Vector Database.**

## 11.2 Retrieval Requirements

* Fast K-Nearest Neighbors (KNN) search.

## 11.3 Source Rules

* Every vector stored in Qdrant MUST include a metadata payload containing `workspace_id` and `document_id`.

## 11.4 Context Rules

* RAG queries against Qdrant MUST always include a hard filter for `workspace_id = [current_workspace]` to guarantee zero data leakage between tenants.

---

# 12. BACKGROUND PROCESSING

Use this section for work that should happen asynchronously.

## 12.1 Background Tasks

* Database cleanup tasks (purging soft-deleted data after 30 days).
* Qdrant/PostgreSQL synchronization checks.

## 12.2 Processing Trigger

* Celery Beat (Cron jobs).

## 12.3 Processing Status

N/A

## 12.4 Retry Rules

N/A

## 12.5 Idempotency

* Deletion scripts must be idempotent (running them twice should not throw errors).

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

The Database Architecture governs ALL data.

## 13.2 Read Data
N/A

## 13.3 Written Data
N/A

## 13.4 Database Entities

| Entity     | Ownership   | Purpose     |
| ---------- | ----------- | ----------- |
| `users` | `Auth Layer` | Track identity |
| `workspaces` | `Auth Layer` | Tenant isolation boundary |
| `documents` | `Doc Services` | Metadata and S3 references |
| `document_analysis` | `AI Services` | Caching LLM extractions (Risks, Summary) |
| `chat_threads` | `Chat Services` | Conversation history |
| `chat_messages` | `Chat Services` | Individual LLM/User messages |

## 13.5 Database Rules

* No table can exist without a clear domain owner.
* Avoid massive generic JSONB columns unless the schema is genuinely dynamic (e.g., raw AI provider response cache). Prefer strictly typed relational columns.

---

# 14. STORAGE REQUIREMENTS

## 14.1 Stored Objects

* The database stores URLs/paths pointing to S3, not the binary BLOBs themselves.

## 14.2 Storage Rules

* Never store PDF binaries in PostgreSQL.

---

# 15. API CONTRACT

N/A - Databases are accessed internally.

---

# 16. ERROR HANDLING

## Error Rules

* PostgreSQL `IntegrityError` (e.g., unique constraint violation on email) must be caught by SQLAlchemy and returned as a graceful `400 Bad Request` or `422 Unprocessable Entity` by the API layer, rather than crashing the app with a `500 Internal Server Error`.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Application connects to PostgreSQL using a role with strictly bounded privileges (cannot drop tables, cannot alter roles).

## 17.2 Data Isolation

* Enforced via backend application logic applying `WHERE workspace_id = ?` on every single query.

## 17.3 Sensitive Data

* Encrypted at rest via AWS KMS (RDS encryption).
* Connection strings must require SSL/TLS (e.g., `?sslmode=require`).

## 17.4 Security Rules

* No hardcoded database credentials. Use AWS Secrets Manager or secure `.env` variables.
* Limit network access: The database port (5432) must ONLY be exposed to the private subnet containing the backend containers.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* P99 query latency should be < 50ms for relational lookups.

## 20.2 Large Input Handling

* Bulk inserts (e.g., saving 5,000 document chunks) must use SQLAlchemy `insert().values()` bulk methodologies, rather than looping and committing individually.

## 20.3 Concurrent Usage

* Use connection pooling (PgBouncer or SQLAlchemy QueuePool) to manage high concurrency without exhausting database memory.

## 20.4 Resource Limits

* Ensure database instances have adequate RAM to hold frequently accessed indexes in memory.

---

# 21. FOLDER STRUCTURE

Define where this service belongs in the project.

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Migrations     | `backend/alembic/` | Schema version history |
| Models         | `backend/app/db/models/` | SQLAlchemy ORM classes |
| Sessions       | `backend/app/db/session.py` | Connection pooling config |
| Vector Config  | `backend/app/db/qdrant.py` | Qdrant client setup |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Backend]
       │ (SQLAlchemy via AsyncPG)
       ↓
  [PostgreSQL]

[Celery Worker]
       │ (Qdrant Client via gRPC)
       ↓
    [Qdrant]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log slow queries (e.g., `log_min_duration_statement = 1000` in Postgres config).

## 24.2 Audit Logging

* Deletion of workspaces or documents must leave a soft-delete trail.

## 24.3 Sensitive Data Rules

* DO NOT log raw SQL strings that contain user data (e.g., avoid `echo=True` in production SQLAlchemy configs).

---

# 25. OBSERVABILITY

## Metrics

* Monitor PostgreSQL Connections, CPU, Memory, and IOPS via AWS CloudWatch.
* Monitor Qdrant memory utilization.

## Health

* `/health` API endpoint executes a `SELECT 1` query to verify DB availability.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Backend tests must use an isolated Test Database (e.g., `pytest-postgresql` or a separate schema) that rolls back completely after every test.

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
| `Database Connection Lost` | Backend API automatically returns `503 Service Unavailable`. Celery tasks auto-retry. |
| `Qdrant out of memory` | Alert triggered. AI Gateway fails gracefully and informs user "Search unavailable". |

---

# 28. VERSIONING

## Database Version

* Managed strictly by **Alembic**.
* Every schema change MUST have a corresponding Alembic revision file.

## Compatibility Rules

* Database migrations must be forward and backward compatible where possible. Avoid dropping columns directly if they are still being referenced by live code.

---

# 29. CONFIGURATION

| Configuration | Purpose     | Required   | Default   |
| ------------- | ----------- | ---------- | --------- |
| `POSTGRES_URI` | Connection | Yes | - |
| `QDRANT_URI` | Connection | Yes | - |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* Managed Database service (AWS RDS / Aurora) is strongly preferred over self-hosting Postgres in Docker for production.
* Qdrant Cloud or self-hosted Qdrant cluster.

## Startup Requirements

* Alembic `upgrade head` must run automatically during the CI/CD deployment pipeline before traffic is routed to new backend containers.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] SQLAlchemy connects successfully.
* [ ] Alembic migrations run cleanly up and down.
* [ ] Qdrant collections can be created and queried.

---

# 32. DEFINITION OF DONE

The Database Architecture is **DONE** when the complete ERD is understood by the backend team, Qdrant payload filters are standardized, and migrations can be executed reliably.

---

# 33. IMPLEMENTATION RULES

These rules apply to the entire service.

1. **Do not duplicate common platform capabilities.**
2. **Do not put business logic in database triggers.** Use Python services instead.
3. **Database ownership must be explicit.**
4. **Documents must remain associated with the correct workspace and permissions.**
5. **Errors must be handled explicitly.**
6. **Secrets must never be committed to source control.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Governs how all application state, user data, and AI embeddings are stored securely and efficiently.

## What the user sees
N/A

## What happens in the background
SQLAlchemy ORM maps Python objects to PostgreSQL rows; Qdrant indexes dense vectors for AI retrieval.

## What it receives
Data write/read requests from the FastAPI Backend and Celery Workers.

## What it produces
Persistent, isolated, and highly available data.

## Success means
No data leaks, no orphaned rows, fast queries, and reliable automated schema migrations.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
