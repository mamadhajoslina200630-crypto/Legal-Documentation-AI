<div align="center">

# ⚖️ Legal AI Simplifier — Democratizing Legal Comprehension

### _8 Autonomous Legal Microservices. Infinite Context. Zero Jargon._

[![Status](https://img.shields.io/badge/Status-Demo_MVP-blue?style=for-the-badge)](#)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)

---

**Legal AI Simplifier** is an enterprise-grade platform designed to shatter the barrier of complex legal jargon. Powered by a decoupled API and generative AI logic, it provides users with **8 distinct legal comprehension tools**, ranging from automated risk detection to multilingual legal simplification.

</div>

---

## 📋 Table of Contents

- [🎯 The Problem We Solve](#-the-problem-we-solve)
- [💡 The Legal AI Solution](#-the-legal-ai-solution)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Core Service Capabilities](#-core-service-capabilities)
- [⚙️ Tech Stack](#️-tech-stack)
- [🎭 Demo Mode (Wizard of Oz)](#-demo-mode-wizard-of-oz)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🗺️ Roadmap](#️-roadmap)

---

## 🎯 The Problem We Solve

> ### 🚨 The Current State of Legal Tech
> Understanding legal contracts, petitions, and judgments is incredibly difficult for the average citizen. 
>
> - 📍 **Jargon Overload:** Documents are written in archaic, complex language.
> - 🌐 **Language Barriers:** In India and globally, citizens cannot read English legal petitions but face devastating consequences.
> - 🧠 **Hidden Risks:** Hidden clauses, financial obligations, and asymmetric compliance rules trap everyday individuals.
>
> **The Real-World Need:** An accessible, scalable platform that reads 100-page contracts in seconds and explains them as if speaking to a 10-year-old in their native language.

---

## 💡 The Legal AI Solution

**Legal AI Simplifier** shifts the paradigm from "expensive lawyer consultations" to "instant, accessible AI comprehension."

```text
┌──────────────────┐         ┌────────────────────┐         ┌──────────────┐
│ 📄 LEGAL PDF/DOC │ ──────▶ │ 🧠 LEGAL AI ROUTER │ ──────▶ │ 🤖 8 SERVICES│
│ Upload & Store   │         │ Context Extraction │         │ Analyze/Chat │
└──────────────────┘         └────────────────────┘         └──────────────┘
```

### ✅ Why Legal AI is the Future

| Traditional Legal Review | Legal AI Simplifier |
|---|---|
| 🔴 Takes days/weeks to review a contract | 🟢 **Sub-second semantic processing** |
| 🔴 Single human perspective | 🟢 **8 Specialized Agent Pipelines** scanning simultaneously |
| 🔴 High consulting fees | 🟢 **Fractional computing cost** |
| 🔴 English only | 🟢 **Regional language translation & voice output** |

---

## 🏗️ System Architecture

The platform is designed as a decoupled, micro-monolith API architecture optimized for cloud-native deployment. 

```mermaid
graph TD
    %% Define styles
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef router fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef service fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef data fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    %% Nodes
    Client[🖥️ React UI Dashboard]:::client
    Router[🌐 FastAPI Router<br/>(API Gateway)]:::router
    Services[🧠 Legal Services Layer]:::service
    DB[(SQLAlchemy ORM<br/>SQLite/Postgres)]:::data
    Blob[(Object Storage<br/>S3/Local)]:::data
    Vector[(Qdrant Vector DB<br/>RAG Engine)]:::data

    %% Flow
    Client -->|REST HTTP| Router
    Router -->|Pydantic Data| Services
    Services -->|State Management| DB
    Services -->|Save/Read PDF| Blob
    Services -->|Semantic Search| Vector

    style Client fill:#4CAF50,stroke:#2E7D32,color:#fff
    style Router fill:#2196F3,stroke:#1565C0,color:#fff
    style DB fill:#47A248,stroke:#2E7D32,color:#fff
    style Services fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🔄 Core Service Capabilities

The platform exposes 8 deep-dive intelligent endpoints tied to an isolated `document_id`.

1. **📄 Auto-Summary:** Condense 50 pages into 5 bullet points.
2. **⚖️ Clause Extraction:** Identify termination, indemnification, and arbitration clauses instantly.
3. **🚨 Risk Detection:** Red-flag asymmetrical liabilities.
4. **💰 Obligation Tracking:** Timeline mapping for financial and performance deliverables.
5. **✅ Compliance Check:** Cross-reference against local regulations.
6. **🗣️ Simplification Engine:** "Explain it to me like I'm 5."
7. **🌍 Regional Translation:** Convert legalese into native Indian regional languages with Voice output.
8. **💬 Contextual Chat (RAG):** Ask arbitrary questions directly to the document.

---

## ⚙️ Tech Stack

<table>
<tr>
<th width="200">Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><b>🤖 Intelligence</b></td>
<td>
  <img src="https://img.shields.io/badge/LangChain-121212?logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white" />
</td>
<td>Agentic reasoning and Generative AI logic layer (designed to support Gemini/Claude).</td>
</tr>
<tr>
<td><b>⚡ Core Backend</b></td>
<td>
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" />
</td>
<td>High-performance, async API gateway ensuring maximum throughput.</td>
</tr>
<tr>
<td><b>🗄️ Database & Memory</b></td>
<td>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Qdrant-black?logo=qdrant&logoColor=red" />
</td>
<td>Relational state management (SQLAlchemy) mapped with highly semantic Vector Retrieval (RAG).</td>
</tr>
<tr>
<td><b>🖥️ Frontend UI</b></td>
<td>
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
</td>
<td>Dynamic, state-isolated dashboards allowing users to traverse documents easily.</td>
</tr>
</table>

---

## 🎭 Demo Mode (Wizard of Oz)

> [!CAUTION]
> **MVP Constraints**
> The current version of this repository is rigged for a high-stakes Hackathon / Investor Pitch. 

To prevent network latency or AI hallucinations from ruining a live presentation, the backend uses a **Stateless Interception Engine**.
When a document is uploaded, the backend generates an ID. When a service (e.g., Risk Detection) is called for that ID, the system bypasses real LLM networks and serves flawless, pre-configured JSON payloads stored in `backend/app/data/predefined_answers.json`. 

*To transition to production, read `docs/ai_knowledge/05_transition_to_production.md`.*

---

## 📂 Project Structure

```text
Legal AI Simplifier/
├── 🧠 backend/               # FastAPI Server Core
│   ├── app/
│   │   ├── api/v1/           # Exposed Endpoints (REST)
│   │   ├── services/         # Business & AI Mock Logic
│   │   └── data/             # Object Storage & DB Session
│   └── storage_data/         # Physical PDF Uploads
│
├── 🎨 frontend/              # React Interface (To Be Built)
│
├── 📚 docs/                  # System Blueprints & AI Knowledge
│   └── ai_knowledge/         # Masterclass architecture files
│
└── 📄 README.md              # You are here!
```

> 📖 **Developers & AI Agents:** Ensure you read the rules mapped in `docs/ai_knowledge/` before modifying backend logic!

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Virtualenv or Conda

### Installation

**1. Clone & Setup Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

**2. Configure Environment:**
Create a `.env` file in the `backend/` directory:
```env
# Using SQLite for instant local setup
DATABASE_URL=sqlite:///./legal_ai.db
SECRET_KEY=your_secure_dev_key
CORS_ORIGINS=*
```

**3. Launch FastAPI:**
```bash
uvicorn app.main:app --reload --port 8000
```
Visit `http://localhost:8000/docs` to explore the Interactive Swagger UI.

---

## 🗺️ Roadmap

- [x] Phase 1: Stand up FastAPI monolithic structure.
- [x] Phase 2: Complete Relational Database mapping (Users, Workspaces, Documents).
- [x] Phase 3: Implement Demo Mock Engine ("Wizard of Oz" architecture).
- [ ] Phase 4: Build robust React frontend UI and upload mechanics.
- [ ] Phase 5: Rip out Demo Engine and activate real Qdrant RAG + Gemini parsing.
- [ ] Phase 6: Integrate Celery workers for heavy Tesseract OCR on scanned PDFs.

---

<div align="center">

### ⭐ Welcome to the Future of Legal Processing.

</div>
