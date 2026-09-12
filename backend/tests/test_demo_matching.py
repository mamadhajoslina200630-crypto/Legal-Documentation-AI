"""Tests for predefined demo answer matching engine (e.g. 'vaj divorce')."""

import io
from fastapi.testclient import TestClient
from app.main import app
from app.services.demo_response_service import get_predefined_answer

client = TestClient(app)


def test_demo_predefined_lookup_direct():
    """Verify demo_response_service matches 'vaj divorce' for summary and translation."""
    summary = get_predefined_answer("vaj divorce.pdf", "summary")
    assert summary is not None
    assert "Section 13B of the Hindu Marriage Act" in summary

    translation = get_predefined_answer("vaj_divorce_petition.docx", "translation")
    assert translation is not None
    assert "हिंदी अनुवाद" in translation

    # Unmapped file returns None
    unmapped = get_predefined_answer("random_contract.pdf", "summary")
    assert unmapped is None


def test_demo_chat_api_matching():
    """Verify end-to-end chat API with 'vaj divorce' file upload."""
    file_bytes = b"Sample petition content for divorce proceedings."
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("vaj divorce.pdf", io.BytesIO(file_bytes), "application/pdf")},
    )
    assert upload_res.status_code == 202
    doc_id = upload_res.json()["id"]

    # 1. Ask for summary
    sum_res = client.post(
        "/api/v1/chat/ask",
        json={
            "conversation_id": "test-conv-vaj",
            "question": "summary",
            "document_id": doc_id,
        },
    )
    assert sum_res.status_code == 200
    assert "Section 13B of the Hindu Marriage Act" in sum_res.json()["answer"]

    # 2. Ask for translation
    trans_res = client.post(
        "/api/v1/chat/ask",
        json={
            "conversation_id": "test-conv-vaj",
            "question": "translation",
            "document_id": doc_id,
        },
    )
    assert trans_res.status_code == 200
    assert "हिंदी अनुवाद" in trans_res.json()["answer"]
