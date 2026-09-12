# Legal AI — Complete Project Structure (v2, matches refined architecture)

This follows your corrected split: **Frontend (5–6 user-facing areas)** → **Backend (10 business services)** → **Background Processing (invisible pipelines)** → **Shared AI Layer** → **DB/Storage Layer**.

```
legal-ai-simplifier/
│
├── backend/
│   ├── app/
│   │   ├── main.py                          # FastAPI app, router + middleware registration
│   │   ├── config.py                        # env vars, model keys, feature flags
│   │   ├── dependencies.py                  # auth, db session, current workspace/doc context
│   │   │
│   │   ├── services/                        # === 2. BACKEND BUSINESS SERVICES ===
│   │   │   │
│   │   │   ├── workspace_service/           # A. Workspace Service
│   │   │   │   ├── users.py
│   │   │   │   ├── workspaces.py
│   │   │   │   ├── permissions.py
│   │   │   │   └── conversations.py
│   │   │   │
│   │   │   ├── document_service/            # B. Document Service
│   │   │   │   ├── upload.py
│   │   │   │   ├── validation.py
│   │   │   │   ├── storage.py
│   │   │   │   ├── metadata.py
│   │   │   │   └── status.py
│   │   │   │
│   │   │   ├── ai_chat_service/             # C. AI Chat Service
│   │   │   │   ├── chat.py                  # user questions, doc-based Q&A
│   │   │   │   ├── history.py               # conversation history, follow-ups
│   │   │   │   └── retrieval.py             # pulls from RAG/vector layer
│   │   │   │
│   │   │   ├── legal_intelligence_service/  # D. Legal Analysis Service
│   │   │   │   ├── analysis.py
│   │   │   │   ├── summary.py
│   │   │   │   ├── clause_extraction.py
│   │   │   │   ├── info_extraction.py
│   │   │   │   ├── risk_detection.py
│   │   │   │   ├── compliance.py
│   │   │   │   └── obligations.py
│   │   │   │
│   │   │   ├── comparison_service/          # E. Comparison Service
│   │   │   │   ├── document_diff.py
│   │   │   │   ├── version_compare.py
│   │   │   │   └── clause_diff.py
│   │   │   │
│   │   │   ├── drafting_service/            # F. Drafting Service
│   │   │   │   ├── document_generation.py
│   │   │   │   ├── clause_generation.py
│   │   │   │   ├── clause_rewrite.py
│   │   │   │   └── templates/
│   │   │   │
│   │   │   ├── language_service/            # G. Language Service
│   │   │   │   ├── translation.py           # Bhashini / IndicTrans2
│   │   │   │   ├── simple_explanation.py
│   │   │   │   └── regional_explanation.py
│   │   │   │
│   │   │   ├── indian_legal_service/        # H. Indian Legal Service
│   │   │   │   ├── judgment_processing.py
│   │   │   │   ├── court_order_processing.py
│   │   │   │   ├── indian_context_qa.py
│   │   │   │   └── acts_sections_kb/
│   │   │   │
│   │   │   ├── search_service/              # I. Search Service
│   │   │   │   ├── keyword_search.py
│   │   │   │   ├── semantic_search.py
│   │   │   │   └── section_locator.py
│   │   │   │
│   │   │   └── audit_security_service/      # J. Audit & Security Service
│   │   │       ├── activity_log.py
│   │   │       ├── permissions.py
│   │   │       └── access_control.py
│   │   │
│   │   ├── background/                      # === 3. BACKGROUND PROCESSING (invisible) ===
│   │   │   ├── pipelines/
│   │   │   │   ├── document_processing_pipeline.py   # upload → validate → extract → OCR → structure → classify → store
│   │   │   │   ├── legal_info_pipeline.py            # doc → sections → clauses → parties → dates → amounts → obligations
│   │   │   │   ├── ai_analysis_pipeline.py           # pre-generates summary/risk/compliance/obligations
│   │   │   │   ├── rag_pipeline.py                   # doc → chunks → embeddings → vector DB
│   │   │   │   ├── court_document_pipeline.py        # scanned PDF → OCR → structure → judgment parsing
│   │   │   │   ├── translation_pipeline.py           # doc/answer → translation → regional language → formatted result
│   │   │   │   └── voice_pipeline.py                 # voice → STT → AI → answer → TTS → audio
│   │   │   │
│   │   │   ├── workers/                     # Celery task definitions
│   │   │   │   ├── celery_app.py
│   │   │   │   └── tasks.py
│   │   │   │
│   │   │   └── ocr/
│   │   │       ├── ocr_engine.py
│   │   │       └── scanned_doc_handler.py
│   │   │
│   │   ├── ai_layer/                        # === 4. SHARED AI LAYER ===
│   │   │   ├── provider_router.py           # routes any service's request to active model
│   │   │   ├── gemini_client.py
│   │   │   ├── openai_client.py
│   │   │   ├── claude_client.py
│   │   │   └── prompts/                     # per-service prompt templates
│   │   │       ├── analysis_prompts.py
│   │   │       ├── risk_prompts.py
│   │   │       ├── drafting_prompts.py
│   │   │       └── translation_prompts.py
│   │   │
│   │   ├── data/                            # === 5. DATABASE / STORAGE LAYER ===
│   │   │   ├── postgres/
│   │   │   │   ├── session.py
│   │   │   │   ├── models/
│   │   │   │   │   ├── user.py
│   │   │   │   │   ├── workspace.py
│   │   │   │   │   ├── document.py
│   │   │   │   │   ├── conversation.py
│   │   │   │   │   ├── analysis_result.py
│   │   │   │   │   ├── risk.py
│   │   │   │   │   ├── clause.py
│   │   │   │   │   ├── obligation.py
│   │   │   │   │   ├── draft.py
│   │   │   │   │   └── audit_log.py
│   │   │   │   └── migrations/              # alembic
│   │   │   │
│   │   │   ├── vector_db/
│   │   │   │   └── qdrant_client.py         # embeddings, searchable knowledge
│   │   │   │
│   │   │   ├── cache_queue/
│   │   │   │   └── redis_client.py          # caching, queues, background jobs
│   │   │   │
│   │   │   └── object_storage/
│   │   │       └── storage_client.py        # PDFs, DOCX, images, generated docs, audio
│   │   │
│   │   ├── api/                             # thin route layer -> calls services/
│   │   │   └── v1/
│   │   │       ├── router.py                # aggregates all routers below
│   │   │       ├── workspace_routes.py
│   │   │       ├── document_routes.py
│   │   │       ├── chat_routes.py
│   │   │       ├── analysis_routes.py       # analysis/summary/clauses/risk/compliance/obligations
│   │   │       ├── comparison_routes.py
│   │   │       ├── drafting_routes.py
│   │   │       ├── language_routes.py
│   │   │       ├── indian_legal_routes.py
│   │   │       ├── search_routes.py
│   │   │       ├── audit_routes.py
│   │   │       └── auth_routes.py
│   │   │
│   │   └── utils/
│   │       ├── text_chunking.py
│   │       ├── pdf_utils.py
│   │       └── logging.py
│   │
│   ├── tests/
│   │   ├── test_document_service.py
│   │   ├── test_legal_intelligence.py
│   │   ├── test_language_service.py
│   │   ├── test_search_service.py
│   │   └── test_pipelines.py
│   │
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── router.jsx
│   │   │
│   │   ├── api/
│   │   │   └── client.js
│   │   │
│   │   ├── features/                        # === 1. FRONTEND: 5–6 user-facing areas ===
│   │   │   │
│   │   │   ├── ai-workspace/                # 1. AI Legal Workspace (main screen)
│   │   │   │   ├── AIWorkspacePage.jsx
│   │   │   │   ├── components/ChatPanel.jsx
│   │   │   │   ├── components/UploadDropzone.jsx
│   │   │   │   └── components/QuickActions.jsx   # analyze/summary/risk/explain/translate shortcuts
│   │   │   │
│   │   │   ├── document-workspace/          # 2. Document Workspace
│   │   │   │   ├── DocumentWorkspacePage.jsx
│   │   │   │   └── tabs/
│   │   │   │       ├── OverviewTab.jsx
│   │   │   │       ├── SummaryTab.jsx
│   │   │   │       ├── KeyInfoTab.jsx
│   │   │   │       ├── ClausesTab.jsx
│   │   │   │       ├── RisksTab.jsx
│   │   │   │       ├── ComplianceTab.jsx
│   │   │   │       ├── ObligationsTab.jsx
│   │   │   │       ├── ChatTab.jsx
│   │   │   │       └── SourcesTab.jsx
│   │   │   │
│   │   │   ├── compare/                     # 3. Compare Documents
│   │   │   │   ├── ComparePage.jsx
│   │   │   │   └── components/DiffView.jsx
│   │   │   │
│   │   │   ├── draft-rewrite/               # 4. Draft & Rewrite
│   │   │   │   ├── DraftPage.jsx
│   │   │   │   └── components/ClauseEditor.jsx
│   │   │   │
│   │   │   ├── language-accessibility/      # 5. Language & Accessibility (embeddable widgets)
│   │   │   │   ├── LanguageSwitcher.jsx
│   │   │   │   ├── SimpleExplanationToggle.jsx
│   │   │   │   └── VoicePlayer.jsx
│   │   │   │
│   │   │   ├── indian-legal/                # 6. Indian Legal
│   │   │   │   ├── IndianLegalPage.jsx
│   │   │   │   ├── JudgmentSummaryView.jsx
│   │   │   │   └── CourtOrderView.jsx
│   │   │   │
│   │   │   └── workspace-management/        # cross-cutting: search, collab, audit
│   │   │       ├── SearchBar.jsx
│   │   │       ├── CollaborationPanel.jsx
│   │   │       └── ActivityLog.jsx
│   │   │
│   │   ├── components/                      # shared UI (buttons, modals, cards)
│   │   ├── context/
│   │   │   ├── DocumentContext.jsx           # active document + selected language
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useDocument.js
│   │   │   └── useChat.js
│   │   └── styles/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docker-compose.yml                        # backend + frontend + celery worker + postgres + qdrant + redis
├── README.md
└── docs/
    ├── architecture.md                       # the diagrams from your services list, kept as living doc
    ├── api-spec.md
    └── team-split.md                         # Team 1 (frontend) / Team 2 (backend+AI+background)
```

## How this maps to your document

| Your architecture layer | Folder |
|---|---|
| Frontend: 6 user-facing areas | `frontend/src/features/*` |
| Backend: 10 business services (A–J) | `backend/app/services/*` |
| Background processing (7 pipelines) | `backend/app/background/pipelines/*` |
| Shared AI Layer (Gemini/GPT/Claude) | `backend/app/ai_layer/*` |
| DB/Storage (Postgres, Qdrant, Redis, Object Storage) | `backend/app/data/*` |

## Team split (matches your doc)

- **Team 1 — Frontend:** everything under `frontend/`. They call the API layer only — they never need to know which background pipeline produced a result.
- **Team 2 — Backend + AI + Background:** everything under `backend/`, including the 10 services, all 7 background pipelines, the shared AI layer, and the data layer (Postgres + Qdrant + Redis + Object Storage).

## Build order suggestion for SIH

1. Document Service + Document Processing Pipeline (upload → OCR → structure → store)
2. Legal Intelligence Service (summary, extraction, risk) + AI Analysis Pipeline
3. AI Chat Service + RAG Pipeline (this is your demo centerpiece)
4. Language Service (translation + simple/regional explanation) — the multilingual differentiator
5. Indian Legal Service (judgment summarization) — strongest GovTech differentiator
6. Comparison, Drafting, Search, Audit — add only if time remains; otherwise list as roadmap in the pitch deck.
