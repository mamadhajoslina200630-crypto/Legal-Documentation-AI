"""End-to-end integration test suite verifying native local execution."""

import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_checks():
    """Verify health endpoints."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_document_lifecycle_and_analysis():
    """Verify document upload, status polling, metadata, and listing."""
    file_content = b"""
    MASTER SERVICES AGREEMENT
    This Agreement is entered into between Acme Solutions Pvt Ltd ("Vendor") and Beta Global Inc ("Customer").
    1. Term: This agreement shall remain in effect for 24 months from the effective date.
    2. Termination: Either party may terminate with 30 days prior written notice.
    3. Indemnity: Vendor shall indemnify Customer against third party claims up to INR 50,00,000.
    4. Dispute Resolution: All disputes governed by the Indian Arbitration and Conciliation Act, 1996 in New Delhi.
    5. Governing Law: Laws of India.
    """
    
    # 1. Upload document
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("test_agreement.txt", io.BytesIO(file_content), "text/plain")},
    )
    assert upload_res.status_code == 202
    doc_data = upload_res.json()
    assert "id" in doc_data
    doc_id = doc_data["id"]

    # 2. List documents
    list_res = client.get("/api/v1/documents")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert any(d["id"] == doc_id for d in docs)

    # 3. Check status
    status_res = client.get(f"/api/v1/documents/{doc_id}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "ready"

    # 4. Check metadata
    meta_res = client.get(f"/api/v1/documents/{doc_id}/metadata")
    assert meta_res.status_code == 200
    assert meta_res.json()["document_id"] == doc_id

    # 5. Check analysis endpoints
    summary_res = client.get(f"/api/v1/analysis/{doc_id}/summary")
    assert summary_res.status_code == 200
    assert "summary" in summary_res.json()

    key_info_res = client.get(f"/api/v1/analysis/{doc_id}/key-info")
    assert key_info_res.status_code == 200
    assert "parties" in key_info_res.json()

    clauses_res = client.get(f"/api/v1/analysis/{doc_id}/clauses")
    assert clauses_res.status_code == 200
    assert isinstance(clauses_res.json(), list)

    risks_res = client.get(f"/api/v1/analysis/{doc_id}/risks")
    assert risks_res.status_code == 200
    assert isinstance(risks_res.json(), list)

    compliance_res = client.get(f"/api/v1/analysis/{doc_id}/compliance")
    assert compliance_res.status_code == 200
    assert isinstance(compliance_res.json(), list)

    obligations_res = client.get(f"/api/v1/analysis/{doc_id}/obligations")
    assert obligations_res.status_code == 200
    assert isinstance(obligations_res.json(), list)


def test_ai_chat_flow():
    """Verify grounded chat Q&A with citations and conversation history."""
    chat_payload = {
        "conversation_id": "test-conv-1",
        "question": "What is the notice period for termination?",
        "document_id": "doc-1",
    }
    chat_res = client.post("/api/v1/chat/ask", json=chat_payload)
    assert chat_res.status_code == 200
    ans_data = chat_res.json()
    assert "answer" in ans_data
    assert "citations" in ans_data

    # History
    hist_res = client.get("/api/v1/chat/conversations/test-conv-1/history")
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) >= 2


def test_comparison_flow():
    """Verify redline comparison endpoint."""
    comp_payload = {
        "doc_a_id": "doc-version-1",
        "doc_b_id": "doc-version-2",
    }
    res = client.post("/api/v1/comparison/documents", json=comp_payload)
    assert res.status_code == 200
    data = res.json()
    assert "diff_items" in data
    assert len(data["diff_items"]) > 0


def test_drafting_and_rewrite():
    """Verify contract generation and clause rewriting."""
    rewrite_payload = {
        "clause_text": "Vendor shall be liable for all indirect and consequential damages.",
        "target_party": "Vendor",
        "objective": "Cap liability",
    }
    rewrite_res = client.post("/api/v1/drafting/rewrite-clause", json=rewrite_payload)
    assert rewrite_res.status_code == 200
    assert "rewritten_clause" in rewrite_res.json()

    draft_payload = {
        "agreement_type": "Non-Disclosure Agreement",
        "parties": "Alpha Corp & Beta LLC",
        "key_terms": "2 years term, mutual confidentiality",
        "jurisdiction": "India",
    }
    draft_res = client.post("/api/v1/drafting/generate", json=draft_payload)
    assert draft_res.status_code == 200
    assert "content" in draft_res.json()


def test_language_translation_and_simplification():
    """Verify translation and simplification endpoints."""
    simp_payload = {"clause_text": "Indemnifying party shall hold harmless the indemnified party."}
    simp_res = client.post("/api/v1/language/simplify", json=simp_payload)
    assert simp_res.status_code == 200
    assert "simple_explanation" in simp_res.json()

    trans_payload = {
        "text": "This agreement is governed by the laws of India.",
        "target_lang": "hi",
    }
    trans_res = client.post("/api/v1/language/translate", json=trans_payload)
    assert trans_res.status_code == 200
    assert "translated_text" in trans_res.json()
