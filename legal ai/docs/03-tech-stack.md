# Legal AI Platform (Tech Stack)

> **Purpose:** Complete technology stack blueprint for the `Legal AI Platform`.
>
> This document is the authoritative specification for the tools, frameworks, and libraries used to build this platform. Developers must be able to understand **what technologies are used, what they are responsible for, and how they connect** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Tech Stack`

## 1.2 Service ID

`sys-tech-stack-core-platform`

## 1.3 Service Category

`Technology & Infrastructure Specification`

## 1.4 Service Type

`Full Stack Specification`

## 1.5 Primary Responsibility

This specification must:

* Define the exact languages, frameworks, and tools used for the Frontend, Backend, AI processing, and Infrastructure.
* Enforce consistency across development teams so they do not introduce redundant technologies (e.g., using both Redux and Zustand).

## 1.6 Business Purpose

To establish a modern, scalable, and maintainable technology foundation that attracts good engineering talent and ensures the platform can handle complex AI workflows in production reliably.

## 1.7 User Value

Users benefit from a fast, secure, and highly responsive application (thanks to Vite, React, and FastAPI) that doesn't crash during heavy document analysis.

## 1.8 Final Outcome

A definitive list of approved technologies that all developers working on the Legal AI Platform must adhere to.

---

# 2. SCOPE

## 2.1 In Scope

* Frontend frameworks and libraries.
* Backend frameworks and Python libraries.
* Database and Caching engines.
* AI, RAG, and OCR pipelines.
* DevOps, CI/CD, and Monitoring tools.

## 2.2 Out of Scope

* Legacy frameworks (e.g., no Angular, no Django unless explicitly migrated).
* Vendor-locked proprietary tools where open-source alternatives were mandated (e.g., using Qdrant instead of Pinecone).

## 2.3 Dependencies on Other Services

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `System Architecture` | Dictates where these technologies are deployed | Topology |
| `Product Requirements` | Dictates what capabilities these technologies must support | Features |

## 2.4 Services Depending on This Service

All development teams (Team 1 & Team 2) depend on this stack.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

The tech stack enables the UX via **React.js**.

## 3.2 User Input

Captured via React forms and handled by **React Hook Form + Zod** for robust client-side validation.

## 3.3 User Flow

N/A for Tech Stack.

## 3.4 User States

Managed via **Zustand** (global state) and **TanStack Query** (server state/loading states).

## 3.5 User-Visible Result

Rendered via **Tailwind CSS** and **shadcn/ui** for a clean, premium, modern interface.

---

# 4. SERVICE WORKFLOW

```text
REACT (Frontend)
  ↓ (Axios / Socket.IO)
FASTAPI (Backend)
  ↓ (SQLAlchemy / Pydantic)
POSTGRESQL (Database)
  &
CELERY (Background)
  ↓ (PyMuPDF / PaddleOCR / LlamaIndex)
QDRANT (Vector DB)
```

---

# 5. INPUT CONTRACT

N/A for Tech Stack.

---

# 6. OUTPUT CONTRACT

N/A for Tech Stack.

---

# 7. BUSINESS RULES

## 7.1 Core Rules

* **Frontend Language:** TypeScript ONLY. No plain JavaScript.
* **Backend Language:** Python 3.12+ ONLY.
* **Styling:** Tailwind CSS ONLY. Avoid raw CSS files where possible.

## 7.2 Validation Rules

* All backend data validation must use **Pydantic**.
* All frontend data validation must use **Zod**.

## 7.3 Decision Rules

* Do not introduce a new library if an existing approved library in the stack can achieve the same goal.

## 7.4 Failure Rules

* Unhandled exceptions in production must be caught and reported to **Sentry**.

## 7.5 Boundary Rules

* No Node.js backend services. The backend must remain purely Python to seamlessly integrate with the AI/ML ecosystem.

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

The tech stack processes documents using specific tools:
* **PDF Processing:** PyMuPDF / react-pdf.
* **Word Documents:** python-docx.
* **Scanned/Image Docs:** OCRmyPDF, PaddleOCR, Tesseract OCR.
* **Document Parsing/Chunking:** LlamaIndex.

## 8.2 Context Rules

N/A

## 8.3 Section-Level Context

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

Powered by the AI Tech Stack.

## 9.2 AI Input

Managed via **LlamaIndex** or custom Python integration layers.

## 9.3 AI Output

Parsed back into Pydantic models.

## 9.4 AI Rules

N/A

## 9.5 AI Provider Independence

The stack relies on `httpx` and standard REST calls inside the custom **AI Gateway** to connect to Gemini/GPT/Claude, rather than rigidly coupling to one provider's specific SDK.

## 9.6 Model Requirements

N/A

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Sources

* Vector Database: **Qdrant**.

## 11.2 Retrieval Requirements

* Framework: **LlamaIndex** (preferred for RAG) or LangChain.
* Reranking: **BGE Reranker** or specific provider APIs.

## 11.3 Source Rules

N/A

## 11.4 Context Rules

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

Powered by:
* **Message Broker:** Redis.
* **Worker Framework:** Celery.

## 12.2 Processing Trigger

FastAPI enqueues tasks to Redis.

## 12.3 Processing Status

Tracked in Redis/Postgres via Celery result backend.

## 12.4 Retry Rules

Celery `@task(bind=True, max_retries=3)` configurations.

## 12.5 Idempotency

N/A

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

The stack uses:
* **Relational Database:** PostgreSQL 15+.
* **ORM:** SQLAlchemy 2.0.
* **Migrations:** Alembic.

## 13.2 Read Data
N/A

## 13.3 Written Data
N/A

## 13.4 Database Entities
N/A

## 13.5 Database Rules
N/A

---

# 14. STORAGE REQUIREMENTS

## 14.1 Stored Objects

* **Object Storage Provider:** AWS S3, Cloudflare R2, or MinIO (for local dev).

## 14.2 Storage Rules
N/A

---

# 15. API CONTRACT

## 15.1 API List

Powered by **FastAPI** (REST) and **Socket.IO / WebSockets** (Real-time chat).

## 15.2 API Request

Frontend calls APIs using **Axios**.

## 15.3 API Response

Serialized via **Pydantic**.

## 15.4 API Rules

API Documentation is automatically generated by FastAPI using **OpenAPI / Swagger UI**.

---

# 16. ERROR HANDLING

## Error Rules

* Handled on the frontend via React Error Boundaries and TanStack Query error states.
* Handled globally in production via **Sentry**.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Implemented via **JWT (JSON Web Tokens)** and **OAuth 2.0**.

## 17.2 Data Isolation
N/A

## 17.3 Sensitive Data
* Passwords must be hashed using **Argon2** (or bcrypt).

## 17.4 Security Rules
* HTTPS/TLS enforced everywhere via Nginx/Load Balancers.
* CORS configured strictly in FastAPI.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

FastAPI on top of **Uvicorn** (ASGI server) provides extremely high-throughput asynchronous request handling.

## 20.2 Large Input Handling

Heavy file uploads are streamed securely to S3.

## 20.3 Concurrent Usage

Handled via Docker Swarm / Kubernetes scaling.

## 20.4 Resource Limits

N/A

---

# 21. FOLDER STRUCTURE

N/A for Tech Stack list, but relies on a Monorepo or cleanly separated Frontend/Backend repos.

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Python `logging` module configured with structured JSON logs.

## 24.2 Audit Logging
N/A

## 24.3 Sensitive Data Rules
N/A

---

# 25. OBSERVABILITY

## Metrics

* **Metrics Engine:** Prometheus.
* **Visualization:** Grafana.

## Health

* Built-in FastAPI health-check endpoints.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Backend: **Pytest**.
* Frontend: **Vitest**.

## 26.2 Integration Testing

* API testing via **Postman** or Pytest `TestClient`.

## 26.3 End-to-End Testing

* Browser automation via **Playwright**.

## 26.4 AI Testing
N/A
## 26.5 Security Testing
N/A

---

# 27. EDGE CASES

N/A

---

# 28. VERSIONING

## Compatibility Rules

All dependencies must be pinned (e.g., `requirements.txt` / `poetry.lock` for Python, `package-lock.json` for Node).

---

# 29. CONFIGURATION

## Environment Management

* Backend: `pydantic-settings` for parsing `.env` files.
* Frontend: Vite environment variables (`import.meta.env`).

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* **Containerization:** Docker.
* **Local Orchestration:** Docker Compose.

## Environment Requirements

* **CI/CD:** GitHub Actions.
* **Reverse Proxy:** Nginx.
* **Cloud Infrastructure:** AWS / Azure / GCP.
* **Infrastructure as Code:** Terraform.

## Startup Requirements
N/A

---

# 31. ACCEPTANCE CRITERIA

* [ ] Frontend stack initialized with Vite, React, TS, Tailwind, and shadcn.
* [ ] Backend stack initialized with FastAPI, SQLAlchemy, and Alembic.
* [ ] Background stack initialized with Celery and Redis.
* [ ] Infrastructure codified via Docker Compose.

---

# 32. DEFINITION OF DONE

The Tech Stack specification is **DONE** when all developers are aligned on these tools and no unauthorized foundational frameworks are used in the codebase.

---

# 33. IMPLEMENTATION RULES

1. **Do not use untested, unapproved beta libraries for core infrastructure.**
2. **Stick strictly to TypeScript (Frontend) and Python (Backend).**
3. **Use the specified tools for the specified jobs (e.g., Celery for background jobs, NOT standard threading).**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Defines the complete list of technologies, frameworks, libraries, and infrastructure tools required to build and deploy the Legal AI Platform.

## What the user sees
A modern React application.

## What happens in the background
A Python-driven ecosystem powering AI, OCR, and databases via Docker containers.

## Success means
Engineering teams can move fast without arguing over which library or framework to use, ensuring a stable, unified codebase.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
