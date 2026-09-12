# Legal AI Simplifier — Identity

## What this project is
An AI-powered legal document assistant for Indian users: upload contracts/judgments/court
orders, get summaries, risk & clause analysis, plain-language and regional-language
explanations, and document-grounded chat Q&A (RAG).

## Tech stack
- Backend: Python, FastAPI, Celery, Alembic
- Frontend: React + Vite
- Data: PostgreSQL (relational), Qdrant (vectors), Redis (cache/queue), object storage (files)
- AI: Gemini / OpenAI / Claude, routed through one shared provider_router — services never
  call a model client directly
- Translation: Bhashini / IndicTrans2 for Indian regional languages
- Docker + docker-compose runs backend, frontend, celery worker, postgres, qdrant, redis

## Layers (build/dependency order)
1. Data layer — backend/app/data/* (Postgres models, Qdrant client, Redis client, storage client)
2. Shared AI layer — backend/app/ai_layer/* (provider_router + prompt templates)
3. Backend services — backend/app/services/* (10 services, one subpackage each)
4. Background pipelines — backend/app/background/* (Celery tasks, run invisibly)
5. API routes — backend/app/api/v1/* (thin — no business logic, just calls services/*)
6. Frontend — frontend/src/features/* (6 user-facing areas, calls the API layer only)

## Conventions
- Routes never contain business logic; they call into services/
- Every AI call goes through ai_layer/provider_router.py
- Secrets/model keys/feature flags live only in config.py, loaded from .env — never hardcoded
- Canonical folder tree lives in /docs/architecture.md — read it, don't ask me to repeat it
