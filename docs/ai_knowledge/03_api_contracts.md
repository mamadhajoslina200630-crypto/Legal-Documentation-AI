# Legal AI Platform: API Contracts & Envelope Rules

> [!IMPORTANT]
> **API Strict Standardization Rule**
> Every single REST endpoint in `backend/app/api/v1/` must return a standardized JSON envelope. Returning raw strings, naked lists, or un-enveloped dictionaries is strictly prohibited. This rule allows the React frontend to uniformly handle loading states, data extraction, and error rendering.

---

## 1. The Standard Envelope

Regardless of the service (Chat, Analysis, Language), the root response object must always contain two primary keys: `success` (boolean) and either `data` (payload) or `error` (string).

### A. Successful Response Structure (200 OK)

```json
{
  "success": true,
  "data": {
     // Service-specific payload goes here
     "summary": "This is a non-disclosure agreement...",
     "document_id": "doc_123"
  }
}
```

### B. Graceful Error Response Structure (200 OK or 400/404)

> [!TIP]
> **Demo Survival Tactic:** Do not throw 500 Internal Server Errors if a user uploads an unmapped document. Return a 200 OK with `success: false` so the UI can render a graceful alert rather than crashing.

```json
{
  "success": false,
  "error": "This document is not fully mapped for 'summary' in the Demo Version."
}
```

---

## 2. Integration with `demo_response_service`

During the MVP phase, you do not need to manually format these envelopes in your route definitions. 

The `process_demo_request` helper function located in `backend/app/services/demo_response_service.py` is guaranteed to return the exact strict envelope based on whether it found the document in the JSON or not.

**Correct Route Implementation Example:**

```python
@router.get("/{document_id}/summary")
def get_summary(document_id: str, db: Session = Depends(get_db)):
    """Retrieve document summary (Mocked Demo)."""
    # Simply return the helper. The envelope is handled automatically!
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "summary")
```

---
*Generated for Legal AI Engineering Team | Version: 1.0.0*
