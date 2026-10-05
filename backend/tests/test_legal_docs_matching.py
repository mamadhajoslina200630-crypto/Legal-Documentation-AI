"""Tests for matching uploaded legal documents with accurate service answers."""

import io
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ORIGINAL_DOCS_DIR = Path(__file__).resolve().parent.parent / "Original doc"


def test_legal_doc_1_matching():
    """Verify legal doc 1 upload and accurate Service 4 risk detection matching."""
    doc_path = ORIGINAL_DOCS_DIR / "legal doc 1.pdf"
    assert doc_path.exists(), f"Original file {doc_path} must exist"

    with open(doc_path, "rb") as f:
        file_bytes = f.read()

    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("legal doc 1.pdf", io.BytesIO(file_bytes), "application/pdf")},
    )
    assert upload_res.status_code == 202
    doc_id = upload_res.json()["id"]

    # 1. Summary
    sum_res = client.get(f"/api/v1/analysis/{doc_id}/summary")
    assert sum_res.status_code == 200
    assert "Shriram Finance" in sum_res.json()["summary"]
    assert "Dhanachezhiyan" in sum_res.json()["summary"]
    assert "dismissed for default" in sum_res.json()["summary"].lower()

    # 2. Risks (Service 4)
    risk_res = client.get(f"/api/v1/analysis/{doc_id}/risks")
    assert risk_res.status_code == 200
    risks = risk_res.json()
    assert isinstance(risks, list)
    assert any("dismissal for default" in r["title"].lower() for r in risks)

    # 3. Chat Q&A
    chat_res = client.post(
        "/api/v1/chat/ask",
        json={"conversation_id": "test-c1", "question": "What are the legal risks?", "document_id": doc_id},
    )
    assert chat_res.status_code == 200
    assert "Dismissal for default" in chat_res.json()["answer"]


def test_legal_doc_2_matching():
    """Verify legal doc 2 upload and accurate Service 7 court proceeding understanding."""
    doc_path = ORIGINAL_DOCS_DIR / "legal doc 2.pdf"
    assert doc_path.exists(), f"Original file {doc_path} must exist"

    with open(doc_path, "rb") as f:
        file_bytes = f.read()

    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("legal doc 2.pdf", io.BytesIO(file_bytes), "application/pdf")},
    )
    assert upload_res.status_code == 202
    doc_id = upload_res.json()["id"]

    # 1. Judgment & Court Order (Service 7)
    order_res = client.get(f"/api/v1/indian-legal/{doc_id}/court-order")
    assert order_res.status_code == 200
    order_text = str(order_res.json())
    assert "Muthukumarasamy" in order_text or "முத்துகுமாரசாமி" in order_text
    assert "cross-examination" in order_text.lower() or "குறுக்கு" in order_text

    # 2. Key Info
    info_res = client.get(f"/api/v1/analysis/{doc_id}/key-info")
    assert info_res.status_code == 200
    assert any("Muthukumarasamy" in p.get("name", "") for p in info_res.json()["parties"])


def test_legal_doc_3_matching():
    """Verify legal doc 3 upload and accurate Service 2 summarization matching."""
    doc_path = ORIGINAL_DOCS_DIR / "legal doc 3.pdf"
    assert doc_path.exists(), f"Original file {doc_path} must exist"

    with open(doc_path, "rb") as f:
        file_bytes = f.read()

    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("legal doc 3.pdf", io.BytesIO(file_bytes), "application/pdf")},
    )
    assert upload_res.status_code == 202
    doc_id = upload_res.json()["id"]

    # 1. Summary (Service 2)
    sum_res = client.get(f"/api/v1/analysis/{doc_id}/summary")
    assert sum_res.status_code == 200
    sum_text = sum_res.json()["summary"]
    assert "Booma Devi" in sum_text
    assert "Items 6 and 7" in sum_text or "Items 6 & 7" in sum_text
    assert "removal of the attachment" in sum_text.lower() or "attachment" in sum_text.lower()

    # 2. Key Info
    info_res = client.get(f"/api/v1/analysis/{doc_id}/key-info")
    assert info_res.status_code == 200
    assert any("Booma Devi" in p.get("name", "") for p in info_res.json()["parties"])
