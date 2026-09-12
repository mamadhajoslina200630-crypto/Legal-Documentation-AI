# Legal AI Simplifier — API Specification

This document details the REST API specifications for `/api/v1/*`.
All endpoints return JSON and use standard HTTP status codes.

## Base URL
- Local Dev: `http://localhost:8000/api/v1`
- Docker: `http://backend:8000/api/v1`

---

## Route Modules Summary

| Module | Route Prefix | Primary Purpose | Implemented in |
|---|---|---|---|
| Health Checks | `/health`, `/api/health` | Service liveness & readiness checks | Task 1 |
| Auth | `/api/v1/auth` | User signup, login, JWT token refresh | Task 2 |
| Workspaces | `/api/v1/workspaces` | Workspace creation, member management, conversations | Task 2 |
| Documents | `/api/v1/documents` | Document upload, metadata, processing status | Task 3 |
| Analysis | `/api/v1/analysis` | Summary, key info, clauses, risks, compliance, obligations | Task 4 |
| Chat | `/api/v1/chat` | RAG-grounded legal chat & conversation history | Task 5 |
| Language | `/api/v1/language` | Bhashini translation, plain-language explanation, voice | Task 6 |
| Indian Legal | `/api/v1/indian-legal` | Judgment analysis, court orders, Indian context Q&A | Task 7 |
| Search | `/api/v1/search` | Full-text & semantic document search | Task 8 |
| Comparison | `/api/v1/comparison` | Document diffing, version & clause comparisons | Task 8 |
| Drafting | `/api/v1/drafting` | Document and clause generation & rewrites | Task 8 |
| Audit | `/api/v1/audit` | Activity logging and security compliance | Task 8 |
