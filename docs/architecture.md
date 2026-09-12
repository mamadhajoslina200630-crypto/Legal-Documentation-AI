# Legal AI Simplifier — System Architecture

## Overview
Legal AI Simplifier is an AI-powered legal document assistant designed for Indian users. It enables users to upload contracts, judgments, and court orders, and receive summaries, risk & clause analyses, plain-language and regional-language explanations (via Bhashini/IndicTrans2), and document-grounded conversational Q&A powered by RAG.

---

## Canonical Folder Tree

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
│   │   │   ├── workspace_service/           # A. Workspace Service
│   │   │   │   ├── users.py
│   │   │   │   ├── workspaces.py
│   │   │   │   ├── permissions.py
│   │   │   │   └── conversations.py
│   │   │   ├── document_service/            # B. Document Service
│   │   │   │   ├── upload.py
│   │   │   │   ├── validation.py
│   │   │   │   ├── storage.py
│   │   │   │   ├── metadata.py
│   │   │   │   └── status.py
│   │   │   ├── ai_chat_service/             # C. AI Chat Service
│   │   │   │   ├── chat.py                  # user questions, doc-based Q&A
│   │   │   │   ├── history.py               # conversation history, follow-ups
│   │   │   │   └── retrieval.py             # pulls from RAG/vector layer
│   │   │   ├── legal_intelligence_service/  # D. Legal Analysis Service
│   │   │   │   ├── analysis.py
│   │   │   │   ├── summary.py
│   │   │   │   ├── clause_extraction.py
│   │   │   │   ├── info_extraction.py
│   │   │   │   ├── risk_detection.py
│   │   │   │   ├── compliance.py
│   │   │   │   └── obligations.py
│   │   │   ├── comparison_service/          # E. Comparison Service
│   │   │   │   ├── document_diff.py
│   │   │   │   ├── version_compare.py
│   │   │   │   └── clause_diff.py
│   │   │   ├── drafting_service/            # F. Drafting Service
│   │   │   │   ├── document_generation.py
│   │   │   │   ├── clause_generation.py
│   │   │   │   ├── clause_rewrite.py
│   │   │   │   └── templates/
│   │   │   ├── language_service/            # G. Language Service
│   │   │   │   ├── translation.py           # Bhashini / IndicTrans2
│   │   │   │   ├── simple_explanation.py
│   │   │   │   └── regional_explanation.py
│   │   │   ├── indian_legal_service/        # H. Indian Legal Service
│   │   │   │   ├── judgment_processing.py
│   │   │   │   ├── court_order_processing.py
│   │   │   │   ├── indian_context_qa.py
│   │   │   │   └── acts_sections_kb/
│   │   │   ├── search_service/              # I. Search Service
│   │   │   │   ├── keyword_search.py
│   │   │   │   ├── semantic_search.py
│   │   │   │   └── section_locator.py
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
│   │   │   ├── workers/                     # Celery task definitions
│   │   │   │   ├── celery_app.py
│   │   │   │   └── tasks.py
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
│   │   │   ├── vector_db/
│   │   │   │   └── qdrant_client.py         # embeddings, searchable knowledge
│   │   │   ├── cache_queue/
│   │   │   │   └── redis_client.py          # caching, queues, background jobs
│   │   │   └── object_storage/
│   │   │       └── storage_client.py        # PDFs, DOCX, images, generated docs, audio
│   │   │
│   │   ├── api/                             # thin route layer -> calls services/
│   │   │   └── v1/
│   │   │       ├── router.py                # aggregates all routers below
│   │   │       ├── auth_routes.py
│   │   │       ├── workspace_routes.py
│   │   │       ├── document_routes.py
│   │   │       ├── chat_routes.py
│   │   │       ├── analysis_routes.py       # analysis/summary/clauses/risk/compliance/obligations
│   │   │       ├── comparison_routes.py
│   │   │       ├── drafting_routes.py
│   │   │       ├── language_routes.py
│   │   │       ├── indian_legal_routes.py
│   │   │       ├── search_routes.py
│   │   │       └── audit_routes.py
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
│   │   │   ├── ai-workspace/                # 1. AI Legal Workspace (main screen)
│   │   │   │   ├── AIWorkspacePage.jsx
│   │   │   │   ├── components/ChatPanel.jsx
│   │   │   │   ├── components/UploadDropzone.jsx
│   │   │   │   └── components/QuickActions.jsx
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
│   │   ├── components/                      # shared UI (Header, Sidebar, Button, Card, Modal)
│   │   ├── context/
│   │   │   ├── DocumentContext.jsx           # active document + selected language
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useDocument.js
│   │   │   └── useChat.js
│   │   └── styles/
│   │       └── index.css
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docker-compose.yml                        # backend + frontend + celery worker + postgres + qdrant + redis
├── README.md
└── docs/
    ├── architecture.md                       # living architecture reference
    ├── api-spec.md                           # OpenAPI / route contracts
    └── team-split.md                         # Team 1 (Frontend) / Team 2 (Backend+AI+Data)
```

---

## Architecture Layers & Responsibilities

1. **Data Layer (`backend/app/data/*`)**:
   - `postgres`: Relational storage for users, workspaces, document metadata, clauses, risks, obligations, drafts, and audit logs.
   - `vector_db`: Qdrant vector database for document embeddings and semantic search.
   - `cache_queue`: Redis for task queuing and cached responses.
   - `object_storage`: File storage abstraction for original PDFs, DOCX files, OCR assets, and audio.

2. **Shared AI Layer (`backend/app/ai_layer/*`)**:
   - `provider_router.py`: Central router directing requests to Gemini, OpenAI, or Claude based on runtime configuration. Services never call LLM SDKs directly.
   - `prompts/*`: Isolated prompt templates for analysis, risk detection, drafting, and translation.

3. **Backend Services (`backend/app/services/*`)**:
   - 10 modular subpackages implementing legal document domain logic.
   - Services do not cross-call each other directly; they collaborate through the shared data and AI layers.

4. **Background Pipelines (`backend/app/background/*`)**:
   - Asynchronous Celery workers handling document extraction, OCR, RAG embedding, pre-generation of analysis, translations, and voice processing.

5. **API Routes (`backend/app/api/v1/*`)**:
   - Ultra-thin route controllers that parse HTTP requests, authenticate users/workspaces, call the appropriate service, and return standard JSON schemas.

6. **Frontend Features (`frontend/src/features/*`)**:
   - 6 user-facing feature areas built with React and Vite, interacting strictly via the `/api/v1` REST endpoints.
