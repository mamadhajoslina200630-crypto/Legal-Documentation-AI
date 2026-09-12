# Legal AI Simplifier — Team Responsibilities & Ownership

## Team Split Overview

### Team 1: Frontend Engineers
- **Ownership Scope**: Everything located under `frontend/`.
- **Core Stack**: React, Vite, React Router, Context API, CSS Design Tokens.
- **Responsibilities**:
  - Implement all 6 user-facing feature areas (`src/features/*`) and workspace management.
  - Interface exclusively with the backend via the `/api/v1` REST endpoints defined in `docs/api-spec.md`.
  - Handle loading states, optimistic UI updates, polling mechanisms (e.g. document processing status), and error handling.
  - Team 1 never directly interacts with database layers, vector stores, Celery pipelines, or AI provider SDKs.

### Team 2: Backend, AI & Data Engineers
- **Ownership Scope**: Everything located under `backend/`, root infrastructure (`docker-compose.yml`), and Celery workers.
- **Core Stack**: Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic, Celery, Redis, Qdrant, Bhashini/IndicTrans2, Gemini/OpenAI/Claude SDKs.
- **Responsibilities**:
  - Implement the 10 core business services under `backend/app/services/*`.
  - Build asynchronous pipelines (`backend/app/background/pipelines/*`) and Celery tasks.
  - Manage database schemas, migrations, vector indexing, caching, and file storage.
  - Maintain the unified AI Provider Router (`backend/app/ai_layer/provider_router.py`) and prompt libraries.
  - Expose clean, typed, thin FastAPI routes under `backend/app/api/v1/*`.
