# Legal AI Simplifier

An AI-powered legal document assistant designed for Indian citizens, businesses, and legal professionals.

Upload legal agreements, contracts, court orders, and judgments to receive:
- **Comprehensive summaries & key info extraction**: Parties, execution dates, financial amounts, liabilities.
- **In-depth risk detection & compliance**: Indian Contract Act, DPDP Act 2023, Arbitration Act compliance.
- **Plain-language simplification & translations**: Plain English and Indian regional languages (Hindi, Tamil, Telugu, etc.).
- **Grounded conversational Q&A**: Powered by semantic RAG with exact clause citations.
- **Contract redlines & comparison**: Compare document versions and identify added, modified, and risky clauses.
- **Drafting & clause rewriting**: Pro-customer, pro-vendor, or balanced contract templates.

---

## Architecture at a Glance

- **Frontend**: React + Vite SPA (`frontend/`)
- **Backend API**: FastAPI + Pydantic v2 (`backend/app/api/v1/`)
- **Core Services**: 10 modular legal domain packages (`backend/app/services/`)
- **Data & Storage**: SQLite (local zero-config) / PostgreSQL + Local Vector Store + Local Object Storage
- **AI Routing**: Model-agnostic router (`ai_layer/provider_router.py`) supporting Google Gemini, OpenAI, Claude, and built-in offline legal heuristics.

---

## Quickstart (Local Native Development)

### Prerequisites
- Python 3.11+ (Python 3.13 tested)
- Node.js 18+ and npm

### 1. Setup & Launch Both Services
You can run the unified development runner from the root directory:
```bash
python run_dev.py
```

Or start the backend and frontend in separate terminals:

#### Backend (Terminal 1)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # On Windows (.venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Swagger Interactive API Docs**: `http://localhost:8000/docs`

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
- **Frontend Web App**: `http://localhost:5173`

---

## Testing
Run the backend test suite:
```bash
backend\.venv\Scripts\pytest backend/tests -v
```
Run frontend build verification:
```bash
cd frontend && npm run build
```
