# Legal AI Platform (System Architecture)

> **Purpose:** Complete system architecture blueprint for the `Legal AI Platform`.
>
> This document is the authoritative specification for how the system is constructed at a high level. Developers and architects must be able to understand **how the frontend, backend, background workers, AI gateway, and databases connect and communicate** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - System Architecture`

## 1.2 Service ID

`sys-arch-core-platform`

## 1.3 Service Category

`System Architecture Specification`

## 1.4 Service Type

`Full System Infrastructure`

## 1.5 Primary Responsibility

The architecture must:

* Provide a highly scalable, decoupled web application.
* Separate user-facing UI from heavy background document processing (OCR/Embedding).
* Ensure the AI Provider Layer is completely independent and interchangeable.
* Ensure data persistence is split correctly between relational (PostgreSQL), vector (Qdrant), and blob storage (S3).

## 1.6 Business Purpose

To ensure the platform can scale to handle massive 100+ page legal documents, thousands of users, and high-concurrency LLM requests without degrading performance or locking the business into a single AI provider.

## 1.7 User Value

Users experience a fast, responsive interface because all heavy lifting (OCR, RAG embedding) is offloaded to background workers, and AI responses stream in real-time.

## 1.8 Final Outcome

A defined topological map of all servers, databases, queues, and external APIs required to run the Legal AI Platform.

---

# 2. SCOPE

## 2.1 In Scope

* **Frontend:** React SPA delivered via CDN / Nginx.
* **Backend API Gateway:** FastAPI REST/WebSocket servers.
* **Background Processing:** Celery workers backed by Redis.
* **AI Abstraction Layer:** Common AI Gateway service.
* **Data Persistence:** PostgreSQL, Qdrant, S3, Redis.
* **Infrastructure:** Docker, Load Balancers, Cloud Provider (AWS/GCP).

## 2.2 Out of Scope

* Detailed UI/UX component design (See Frontend Architecture).
* Detailed API endpoint schemas (See API Standards).
* Prompt engineering specifics (See AI Architecture).

## 2.3 Dependencies on Other Services

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Cloud Load Balancer` | Distribute traffic across FastAPI instances | HTTP/HTTPS Traffic |
| `Managed Databases` | Ensure high availability for PG/Qdrant/Redis | Structured/Vector Data |
| `External AI APIs` | Actual LLM inference | API Keys & Context |

## 2.4 Services Depending on This Service

All development teams (Team 1 and Team 2) depend on this architectural layout to deploy their specific services.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

* The user accesses the platform via a web browser (HTTPS).
* Traffic hits the Cloud Load Balancer / CDN.

## 3.2 User Input

* HTTP REST requests (Uploads, Fetching data).
* WebSocket connections (Real-time AI Chat streaming).

## 3.3 User Flow

```text
Browser (React)
    ↓ (HTTPS / WSS)
Load Balancer
    ↓
Nginx Reverse Proxy
    ↓
FastAPI Backend (Uvicorn)
```

## 3.4 User States

* Fast initial load times due to CDN caching of static frontend assets.
* Non-blocking UI during heavy document processing (using polling or WebSockets to update state).

## 3.5 User-Visible Result

A highly responsive SPA that does not freeze while waiting for the AI or OCR to complete.

---

# 4. SERVICE WORKFLOW

```text
INPUT (User HTTP Request)
  ↓
API LAYER (FastAPI Routes & Validation)
  ↓
SERVICE LAYER (Business Logic)
  ↓
MESSAGE BROKER (Redis Queue for heavy tasks)
  ↓
BACKGROUND WORKER (Celery processing OCR/RAG)
  ↓
AI GATEWAY (Provider Abstraction)
  ↓
DATABASE LAYER (Postgres/Qdrant/S3 Update)
  ↓
API RESPONSE (REST JSON or WebSocket Push)
```

### Step 1 — Synchronous API Flow
**Purpose:** Handle fast requests (fetching workspaces, sending chat).
**Input:** HTTP Request.
**Output:** HTTP Response.
**Rules:** Must respond in < 500ms.

### Step 2 — Asynchronous Job Flow
**Purpose:** Handle slow requests (Document Upload, Full Translation).
**Input:** HTTP Request → Pushed to Redis Queue.
**Output:** Job ID returned instantly. Worker updates DB when done.
**Rules:** UI must subscribe to job status.

---

# 5. INPUT CONTRACT

N/A for high-level architecture (Defined in API Standards).

---

# 6. OUTPUT CONTRACT

N/A for high-level architecture.

---

# 7. BUSINESS RULES

## 7.1 Core Rules

* **Decoupling:** The Frontend must only communicate with the Backend APIs. It must never communicate directly with the Database or AI Providers.
* **Statelessness:** FastAPI servers must be completely stateless to allow horizontal scaling. Session data must live in Redis.

## 7.2 Validation Rules

* All requests must be authenticated at the FastAPI layer before reaching business services.

## 7.3 Decision Rules

* Heavy tasks (> 2 seconds expected execution) MUST be sent to Celery. They cannot run synchronously in FastAPI.

## 7.4 Failure Rules

* If a background worker crashes, the job must remain in the Redis queue and be retried by another worker.

## 7.5 Boundary Rules

* The AI Gateway is the strictly enforced boundary. No business service may import an OpenAI or Google SDK directly.

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* Architecture supports storing raw files in S3 and parsed structural data in PostgreSQL.

## 8.2 Context Rules

* S3 bucket access must be restricted to backend servers only. Frontend receives short-lived pre-signed URLs to download/view files.

## 8.3 Section-Level Context

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

To provide intelligence abstracted away from the specific provider.

## 9.2 AI Input

Structured requests from Backend Services → AI Gateway.

## 9.3 AI Output

Standardized AI responses returned from AI Gateway → Backend Services.

## 9.4 AI Rules

* The AI Gateway must standardize rate-limiting, error handling, and prompt formatting across all underlying providers.

## 9.5 AI Provider Independence

```text
[Business Service] (e.g., Risk Detection)
       ↓
[AI Gateway Service]
       ↓
[Model Adapter] (OpenAI / Google / Anthropic)
       ↓
[External API]
```
The architecture dictates this specific pattern to ensure zero vendor lock-in.

## 9.6 Model Requirements

N/A

---

# 10. AI PROMPT RESPONSIBILITY

Prompts are managed as code within the Backend Service layer (or AI Gateway), not the Frontend.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Sources

* Document processing pipeline writes to Qdrant.

## 11.2 Retrieval Requirements

* Fast vector similarity search via Qdrant's gRPC/REST APIs.

## 11.3 Source Rules

* Vector metadata must include `workspace_id` to strictly partition searches via Qdrant payload filters.

## 11.4 Context Rules

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* Document Pipeline (Validation, OCR, Extraction, Structure Detection, Chunking, Embedding, Indexing).
* Translation Pipeline.
* Judgment Processing Pipeline.

## 12.2 Processing Trigger

* Redis Queue (Celery Broker).

## 12.3 Processing Status

* Managed via Celery Result Backend (Redis or PostgreSQL).

## 12.4 Retry Rules

* Exponential backoff configured on Celery tasks.

## 12.5 Idempotency

* Celery tasks must be idempotent to handle "at-least-once" delivery semantics safely.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

The architecture splits data persistence:

## 13.4 Database Entities

| Database | Technology | Purpose |
| --- | --- | --- |
| `Relational DB` | `PostgreSQL (AWS RDS)` | Users, Workspaces, Metadata, Extracted Clauses, Audit Logs |
| `Vector DB` | `Qdrant` | Document embeddings for semantic search and RAG |
| `Cache / Queue` | `Redis (ElastiCache)` | Session state, Rate limiting, Celery task broker |

## 13.5 Database Rules

* Qdrant and PostgreSQL must stay in sync. If a document is deleted in Postgres, its vectors must be wiped from Qdrant.

---

# 14. STORAGE REQUIREMENTS

## 14.1 Stored Objects

* Object Storage (AWS S3 / Cloudflare R2).

## 14.2 Storage Rules

* **Structure:**
  * `/original-documents/`
  * `/processed-documents/`
  * `/page-images/`
  * `/generated-documents/`
* **Access:** Private buckets. IAM roles restrict access to the Backend/Worker EC2/ECS instances.

---

# 15. API CONTRACT

## 15.1 API List

* The architecture supports standard REST (JSON over HTTP) and WebSockets (for chat streaming).

## 15.2 API Request

* Handled by FastAPI's Pydantic validation layer.

## 15.3 API Response

* Handled by FastAPI.

## 15.4 API Rules

* A Reverse Proxy (Nginx) must sit in front of FastAPI/Uvicorn to handle TLS termination and slow-client protection.

---

# 16. ERROR HANDLING

## Error Rules

* Centralized error handling via FastAPI exception handlers to ensure consistent JSON error structures are sent to the Frontend.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* JWT validation happens at the FastAPI dependency layer on every request.

## 17.2 Data Isolation

* Multi-tenant architecture enforced via `workspace_id` checks on every DB query.

## 17.3 Sensitive Data

* Encrypted in transit (HTTPS/TLS).
* Encrypted at rest (AWS KMS for S3 and RDS).

## 17.4 Security Rules

* Network segregation: Databases and Redis must reside in private subnets, accessible only by the Backend and Worker instances. Only the Load Balancer is exposed to the public internet.

---

# 18. SOURCE & TRACEABILITY

N/A for architectural layout.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* The system must horizontally scale. If API traffic increases, more FastAPI Docker containers must be spun up. If document uploads increase, more Celery Docker containers must be spun up.

## 20.2 Large Input Handling

* Large PDF parsing must stream data or use localized tmp file storage on worker nodes to prevent memory exhaustion.

## 20.3 Concurrent Usage

* Connection pooling (PgBouncer or SQLAlchemy pooling) must be used to prevent PostgreSQL connection limits from being breached under high concurrent load.

## 20.4 Resource Limits

* Nginx must enforce maximum upload sizes (e.g., `client_max_body_size 50M`).

---

# 21. FOLDER STRUCTURE

```text
project-root/
├── frontend/               # React SPA
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI Routes
│   │   ├── core/           # Config, Security
│   │   ├── db/             # SQLAlchemy Models & Sessions
│   │   ├── services/       # Business Logic (Team 1 & 2)
│   │   ├── ai/             # AI Gateway & Providers
│   │   └── worker/         # Celery Tasks
│   └── Dockerfile
├── docker-compose.yml      # Local dev environment
└── terraform/              # Infrastructure as Code
```

---

# 22. SERVICE CONNECTIONS

```text
                     [USER BROWSER]
                           │ (HTTPS)
                  [CLOUD LOAD BALANCER]
                           │
                     [NGINX PROXY]
                           │
             ┌─────────────┴─────────────┐
             │                           │
      [FASTAPI BACKEND]           [FASTAPI BACKEND]  (Auto-scaled)
             │                           │
    ┌────────┼────────┐         ┌────────┼────────┐
    │        │        │         │        │        │
[POSTGRES] [REDIS] [QDRANT]  [POSTGRES] [REDIS] [QDRANT]
             │                           │
      [CELERY WORKERS]            [CELERY WORKERS]
             │                           │
             └─────────────┬─────────────┘
                           │
                      [AI GATEWAY]
                           │
                  [EXTERNAL AI APIS]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Structured JSON logs exported to a centralized system (e.g., Datadog, AWS CloudWatch, or ELK Stack).

## 24.2 Audit Logging

* Stored permanently in PostgreSQL.

## 24.3 Sensitive Data Rules

* Log sanitization middleware must run on FastAPI to mask JWTs and passwords.

---

# 25. OBSERVABILITY

## Metrics

* Exposed via Prometheus endpoint `/metrics` on all FastAPI and Celery nodes.

## Health

* `/health` endpoint checks DB, Redis, and Qdrant. Load balancer uses this to kill unhealthy containers.

---

# 26. TESTING REQUIREMENTS

* **Local Dev:** `docker-compose up` must spin up the entire stack (Postgres, Qdrant, Redis, API, Worker, Frontend) for easy local integration testing.

---

# 27. EDGE CASES

| Case | Expected Behavior |
| --- | --- |
| Node Failure | Stateless architecture ensures load balancer redirects traffic; Redis ensures jobs are not lost. |
| DB Disconnect | SQLAlchemy reconnects automatically; API returns 503 until resolved. |

---

# 28. VERSIONING

## Compatibility Rules

* API responses must remain backwards compatible so mobile apps or older frontend clients do not break during deployments.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `DATABASE_URL` | Postgres connection string | Yes | - |
| `REDIS_URL` | Redis connection string | Yes | - |
| `QDRANT_URL` | Vector DB connection | Yes | - |
| `AWS_S3_BUCKET` | File storage location | Yes | - |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* Docker containers for all services (Frontend built to static files, Backend via `python:3.12-slim`).

## Environment Requirements

* **CI/CD:** GitHub Actions to build Docker images and run tests.
* **Production:** AWS ECS (Fargate) or EKS (Kubernetes) for container orchestration.

## Startup Requirements

* Database migrations (Alembic) must run successfully before new backend containers start accepting traffic.

---

# 31. ACCEPTANCE CRITERIA

* [ ] Frontend can connect to Backend via load balancer.
* [ ] Backend successfully reads/writes to Postgres, Redis, and Qdrant.
* [ ] Background workers successfully pick up jobs from Redis.
* [ ] AI Gateway successfully reaches external APIs.
* [ ] The entire stack can be launched locally via one Docker Compose command.

---

# 32. DEFINITION OF DONE

The System Architecture phase is **DONE** when the complete infrastructure topology is documented, understood by DevOps/Engineering, and the local Docker environment is configured to reflect this architecture.

---

# 33. IMPLEMENTATION RULES

1. **Frontend must not directly access databases.**
2. **Heavy processing must never run on the web server (FastAPI).**
3. **Database connections must be pooled.**
4. **Secrets must be injected via environment variables (e.g., AWS Secrets Manager), never hardcoded.**

---

# 34. SERVICE DEPENDENCY MAP

(See Section 22 for diagram)

---

# 35. FINAL SERVICE SUMMARY

## What it does
Defines the physical and logical layout of servers, databases, and message queues required to run the Legal AI Platform.

## What the user sees
A fast, responsive web application that doesn't hang.

## What happens in the background
A distributed system of stateless APIs, background workers, and specialized databases communicating via secure networks to process heavy AI and OCR workloads.

## Success means
The application can scale horizontally under heavy load, recovers automatically from node failures, and keeps user data isolated and secure.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
