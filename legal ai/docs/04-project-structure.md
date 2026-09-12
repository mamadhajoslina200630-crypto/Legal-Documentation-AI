# Legal AI Platform (Project Structure)

> **Purpose:** Complete project structure blueprint for the `Legal AI Platform`.
>
> This document is the authoritative specification for how the codebase is organized. Developers must be able to understand **where files belong, how the monorepo is divided, and what architectural boundaries exist** without requiring additional organizational decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Project Structure`

## 1.2 Service ID

`sys-structure-core-platform`

## 1.3 Service Category

`Codebase Organization Specification`

## 1.4 Service Type

`Full Repository Specification`

## 1.5 Primary Responsibility

This specification must:

* Define the exact folder layout for the entire monorepo.
* Ensure clear separation of concerns between Frontend (React), Backend (FastAPI), AI processing, and Background Workers.
* Enforce logical grouping of domains (e.g., separating Team 1 Legal Intelligence from Team 2 Accessibility features).

## 1.6 Business Purpose

To prevent a "spaghetti codebase" as the project scales. A well-defined project structure allows multiple developers (and multiple teams) to work concurrently without constant merge conflicts or confusion about where business logic should live.

## 1.7 User Value

Indirectly, a clean codebase means fewer bugs reach production and new features (like a new language translation or a new risk check) can be shipped significantly faster.

## 1.8 Final Outcome

A definitive directory tree and ruleset that all developers must follow when creating new files, modules, or services.

---

# 2. SCOPE

## 2.1 In Scope

* Root repository structure (Monorepo setup).
* Frontend directory structure (React/Vite).
* Backend directory structure (FastAPI/Python).
* Worker directory structure (Celery).
* Infrastructure files (Docker, Terraform).
* Documentation directory structure.

## 2.2 Out of Scope

* Detailed module-level code (e.g., exactly what goes inside a specific React component).
* External repositories (if any microservices are explicitly kept in separate repos, though this assumes a monorepo).

## 2.3 Dependencies on Other Services

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `System Architecture` | Dictates what components exist | Architectural layout |
| `Tech Stack` | Dictates the frameworks that require specific folder structures | Framework conventions |

## 2.4 Services Depending on This Service

All development teams (Team 1 & Team 2) depend on this structure.

---

# 3. USER EXPERIENCE

N/A for Codebase Project Structure.

---

# 4. SERVICE WORKFLOW

N/A for Codebase Project Structure.

---

# 5. INPUT CONTRACT

N/A for Codebase Project Structure.

---

# 6. OUTPUT CONTRACT

N/A for Codebase Project Structure.

---

# 7. BUSINESS RULES

## 7.1 Core Rules

* **Strict Boundary:** The `frontend/` and `backend/` directories must never import code from each other. They must remain completely decoupled, communicating only via APIs.
* **Service Independence:** Inside the backend, specific domains (e.g., `services/translation` vs `services/risk_detection`) should avoid importing deeply from each other unless through a shared internal interface.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* If adding a new feature that touches the database, updates an API, and adds a UI button, the developer must touch the `backend/db/models`, `backend/api/routes`, `backend/services`, and `frontend/src/` directories respectively.

## 7.4 Failure Rules

* Code that violates these structural boundaries during PR review must be rejected.

## 7.5 Boundary Rules

* No business logic in the `frontend/` directory. The frontend handles display, state, and routing only.

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
N/A

## 9.2 AI Input
N/A

## 9.3 AI Output
N/A

## 9.4 AI Rules
N/A

## 9.5 AI Provider Independence

To enforce this, all AI provider integrations MUST live inside `backend/ai/providers/` and expose a unified interface to `backend/services/`.

## 9.6 Model Requirements
N/A

---

# 10. AI PROMPT RESPONSIBILITY

All AI prompts must be stored as modular text/yaml files or Python constants inside `backend/ai/prompts/`. They must **never** be hardcoded directly inside frontend components or scattered randomly across backend services.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

All asynchronous Celery workers must live in `backend/workers/`. They share the same Django/FastAPI environment but execute in a separate process.

---

# 13. DATABASE RESPONSIBILITY

All Database Models (SQLAlchemy) must live centrally in `backend/db/models/`.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

All API routing must live centrally in `backend/api/routes/` and delegate immediately to `backend/services/`.

---

# 16. ERROR HANDLING

N/A

---

# 17. AUTHORIZATION & SECURITY

N/A

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

This is the exact folder structure for the Legal AI Platform monorepo:

```text
legal-ai-platform/
│
├── frontend/                     # React.js SPA (User Interface)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # Axios clients and API hooks (TanStack Query)
│   │   ├── components/           # Reusable UI components (shadcn/ui, buttons, modals)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Top-level page views (e.g., Workspace, Dashboard)
│   │   ├── store/                # Zustand global state stores
│   │   ├── types/                # TypeScript interfaces & types
│   │   └── utils/                # Frontend helper functions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Python FastAPI (Core Logic)
│   ├── alembic/                  # Database migration scripts
│   ├── app/
│   │   ├── api/                  # FastAPI routers and endpoints
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── documents.py
│   │   │       └── chat.py
│   │   ├── core/                 # App configuration, security, JWT
│   │   ├── db/                   # Database setup and SQLAlchemy models
│   │   │   └── models/
│   │   ├── schemas/              # Pydantic validation schemas (In/Out)
│   │   ├── services/             # Core Business Logic (Team 1 & 2)
│   │   │   ├── document/         # Ingestion, OCR
│   │   │   ├── intelligence/     # Risk, Summary, Clauses
│   │   │   ├── language/         # Translation, Simple Explanation
│   │   │   ├── indian_legal/     # Judgments, Court Orders
│   │   │   └── workspace/        # Collab, Audit, Users
│   │   ├── ai/                   # AI Gateway & Prompt Management
│   │   │   ├── providers/        # Gemini, GPT, Claude adapters
│   │   │   └── prompts/          # Version-controlled prompt templates
│   │   ├── worker/               # Celery background tasks
│   │   │   └── tasks/
│   │   └── main.py               # FastAPI application entry point
│   ├── requirements.txt / pyproject.toml
│   └── pytest.ini
│
├── infrastructure/               # DevOps and Deployment
│   ├── docker/                   # Dockerfiles (Frontend, Backend, Worker)
│   ├── terraform/                # IaC for AWS/GCP provisioning
│   └── nginx/                    # Reverse proxy configurations
│
├── docs/                         # Architecture & Service Blueprints
│   ├── 00-master-blueprint.md
│   ├── 01-product-requirements.md
│   ├── ... (all markdown files)
│   └── services/                 # Detailed API/Service specific docs
│
├── .github/                      # CI/CD Workflows
│   └── workflows/
│
├── docker-compose.yml            # Local development orchestration
├── README.md                     # Project overview and setup instructions
└── .env.example                  # Environment variable template
```

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| API Routes     | `backend/app/api/` | Handle HTTP requests, auth, and return JSON |
| Business Logic | `backend/app/services/` | Execute core legal features, interact with AI |
| Database       | `backend/app/db/models/` | Define Postgres tables |
| AI Prompts     | `backend/app/ai/prompts/` | Store LLM instructions |
| Background     | `backend/app/worker/` | Handle OCR, embedding, async jobs |
| Tests          | `backend/tests/` & `frontend/tests/` | QA & Automated testing |

---

# 22. SERVICE CONNECTIONS

N/A for Folder Structure.

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

N/A

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

* Tests must reflect the folder structure. E.g., a test for `backend/app/services/intelligence/risk.py` should live in `backend/tests/services/intelligence/test_risk.py`.

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

* [ ] Root repository contains `frontend`, `backend`, `infrastructure`, and `docs` folders.
* [ ] The `backend` separates API routes, Business Services, AI Prompts, and DB models clearly.
* [ ] The `frontend` separates UI Components, API Hooks, Pages, and State clearly.

---

# 32. DEFINITION OF DONE

The Project Structure phase is **DONE** when the repository layout matches this blueprint exactly, and all developers understand where to place their code.

---

# 33. IMPLEMENTATION RULES

1. **Do not create random root-level folders.**
2. **Keep Business Logic out of API Routes.** API routes should only validate input and call a function in `services/`.
3. **Do not put AI logic in the Frontend.**
4. **All dependencies must be cleanly separated** (Python packages in the backend, Node packages in the frontend).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Defines the exact folder and file structure for the entire Legal AI Platform monorepo.

## What the user sees
N/A (Internal developer architecture).

## What happens in the background
Organizes the codebase to ensure logical separation of Frontend UI, Backend APIs, Core Legal Services, AI Provider Abstractions, and Background Workers.

## Success means
A new developer can join the team and immediately know exactly where to find the code for "Risk Detection", "AI Prompts", or the "Document Viewer UI", preventing codebase rot as the project scales.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
