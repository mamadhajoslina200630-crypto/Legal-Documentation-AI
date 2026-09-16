# Legal AI Platform: Transition to Production (Post-Demo)

> [!CAUTION]
> **Post-Hackathon Roadmap**
> This document outlines the architectural surgery required to convert this "Wizard of Oz" Demo MVP into a real, generative AI application capable of parsing unseen documents. **Do not execute these steps until the demo is successfully completed.**

---

## 1. Decommissioning the Mock Engine

The first step to building a real AI platform is ripping out the dummy logic.

### Actions Required:
1. Delete `backend/app/services/demo_response_service.py`.
2. Delete `backend/app/data/predefined_answers.json`.
3. In `backend/app/services/legal_intelligence_service/*`, remove all imports and calls to `process_demo_request()`.

---

## 2. Activating the Real Generative AI (`provider_router.py`)

The scaffolding for real AI exists in `backend/app/ai_layer/provider_router.py`. 

### Actions Required:
1. Ensure your `.env` contains valid keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.).
2. Update the `legal_intelligence_service` routes (e.g., `summary.py`) to actually pass the `document_text` to `provider_router.generate_completion(prompt)`.

**Example Production Summary Route:**
```python
def generate_document_summary(db: Session, document_id: str, document_text: str) -> Dict[str, Any]:
    # 1. Verify Document Exists
    doc = db.query(Document).filter(Document.id == document_id).first()
    
    # 2. Call Real LLM
    prompt = f"Summarize this legal document:\n{document_text}"
    ai_response = provider_router.generate_completion(prompt)
    
    # 3. Format Strict Envelope
    return {
        "success": True,
        "data": { "summary": ai_response.get("text") }
    }
```

---

## 3. Activating RAG (Retrieval-Augmented Generation)

Currently, the backend expects `document_text` to magically exist. In production, parsing a 100-page PDF requires RAG.

### Actions Required:
1. **Vector DB Initialization:** Stand up Qdrant (Docker or Cloud) using the settings in `config.py` (`settings.vector_db`).
2. **Embeddings Pipeline:** Write a pipeline that takes the physical PDF from `storage_data`, chunks it (e.g., 512 tokens), embeds it via OpenAI/Gemini, and upserts it into Qdrant.
3. **Chat Service Update:** In `chat.py`, activate `retrieve_context_chunks(document_id, question)` to hit Qdrant instead of returning fake citations.

---

## 4. Activating Asynchronous OCR

Currently, when a user uploads a document, the `status` is forced to `"ready"` instantly.

### Actions Required:
1. **Message Broker:** Stand up Redis using `settings.db.redis_url`.
2. **Celery Workers:** Implement Celery tasks in `backend/app/background/pipelines/` to pick up the uploaded PDF, run OCR (e.g., Tesseract), and extract text in the background.
3. **Status Polling:** The frontend must use `GET /api/v1/documents/{id}/status` to wait for `"processing"` to turn into `"ready"` before querying the AI services.

---
*Generated for Legal AI Engineering Team | Version: 1.0.0*
