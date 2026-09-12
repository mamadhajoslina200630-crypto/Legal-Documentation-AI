# Legal AI Platform

## 📖 Overview
A comprehensive B2B Legal AI Platform built to handle highly sensitive legal document analysis, summarization, risk detection, and collaborative drafting. The platform is designed from the ground up to ensure strict multi-tenant data isolation, hallucination-free citations, and ethical legal boundaries (preventing the unauthorized practice of law).

## 🏗️ Core Architecture & Design Principles
The platform is built on several foundational pillars, fully detailed in the `/docs` folder:
- **Multi-Tenancy & Workspace Isolation:** Strict boundary enforcement using Row-Level Security (RLS) and Authorization middlewares to absolutely separate competing law firms and clients.
- **AI Gateway:** A decoupled, vendor-agnostic router handling all external LLM calls (e.g., OpenAI, Anthropic, or Local Models) with automatic fallback, token cost tracking, and rate limiting.
- **RAG & Vector Database:** Uses Qdrant for semantic search and Retrieval-Augmented Generation. The Context Manager fetches surrounding document context so the AI never hallucinates or loses the thread of complex legal clauses.
- **Legal Safety & Compliance:** An interceptor that scans prompts to block UPL (Unauthorized Practice of Law), redacts PII before sending data to external APIs, and enforces mandatory legal disclaimers on all outputs.
- **Source Evidence Layer:** Enforces zero-hallucination policies by binding AI-generated claims directly to interactive geometric bounding boxes on the original PDF scans.
- **Real-Time Collaboration:** WebSocket-driven presence and notification systems allowing multiple users to view and annotate the same contract simultaneously.

## 🗃️ Legal Datasets & Context (Indian Law)
The platform is deeply integrated with Indian Legal Context (Acts, High Court/Supreme Court Judgments). To power the `Indian Legal Context Assistant` and `Judgment Summarization` services, we utilize a hybrid legal data strategy:
* **API-Based Retrieval:** Integrating with APIs (like Indian Kanoon) for real-time document search and metadata retrieval.
* **Public Knowledge Base:** Leveraging local, self-hosted datasets such as the `KanoonGPT Indian Case Laws` dataset (covering the Supreme Court + 25 High Courts) and the `Indian-Legal-Documents` repository to maintain a private, ultra-fast RAG knowledge base.

---

## 📁 Documentation & File Structure
The `/docs` directory acts as the single source of truth for the entire platform. It contains exhaustive blueprints, API standards, and architectural decisions.

### 1. High-Level Architecture (`/docs/`)
Top-level standards and infrastructure blueprints:
* `00-master-blueprint.md` - Master vision and scope
* `02-system-architecture.md` - Core system design
* `03-tech-stack.md` - Language and framework selections
* `07-database-architecture.md` - Relational schemas
* `08-security-architecture.md` - Multi-tenancy and data protection
* `09-ai-architecture.md` & `11-rag-architecture.md` - AI and Vector strategies
* *...and more covering testing, logging, and deployment.*

### 2. Microservices & Features (`/docs/services/`)
Detailed 36-section blueprints for the 14 core legal AI features:
* `legal-document-analysis.md`
* `legal-document-summarization.md`
* `clause-information-extraction.md`
* `legal-risk-detection.md`
* `compliance-checking.md`
* `document-comparison.md`
* `legal-ai-chat.md`
* `legal-search.md`
* `obligation-deadline-extraction.md`
* `legal-document-drafting.md`
* `clause-drafting-rewriting.md`
* `legal-document-translation.md`
* `simple-legal-explanation.md`
* `regional-language-explanation.md`
* `legal-voice-assistant.md`
* `judgment-court-order-summarization.md`
* `court-document-understanding.md`
* `indian-legal-context-assistant.md`

### 3. Common Infrastructure (`/docs/common/`)
Blueprints for the foundational middleware and background engines that power the features above:
* `workspace.md` (Multi-Tenancy)
* `ai-gateway.md` (LLM Routing)
* `legal-safety.md` (Compliance & PII)
* `source-evidence.md` (Citation engine)
* `document-upload-ingestion.md` (S3 Uploads)
* `ocr-text-extraction.md` (Async Parsing)
* `document-understanding.md` (Vectorization)
* `document-context.md` (Context Windows)
* `collaboration.md` (Real-time WebSockets)
* `audit-activity.md` (Immutable logs)

### 4. Client & Server Standards
* `/docs/frontend/` - React/Next.js architecture, routing, design systems, and state management.
* `/docs/backend/` - FastAPI service standards, background jobs, and API integration rules.

---

## 🚀 Execution
Implementation is structured into 4 sequential phases, beginning with backend infrastructure (Workspace & Database) and progressing through the AI Gateway, Legal Services, and finally the Frontend Dashboard.
