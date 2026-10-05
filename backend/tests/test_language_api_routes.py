"""Verification of language routes and Telugu support using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.demo_response_service import get_predefined_answer

client = TestClient(app)


def test_api_supported_languages_contains_telugu():
    """Verify GET /api/v1/language/supported-languages returns 'te' with FLORES-200 code."""
    response = client.get("/api/v1/language/supported-languages")
    assert response.status_code == 200
    data = response.json()
    assert "languages" in data
    te_entry = next((l for l in data["languages"] if l["code"] == "te"), None)
    assert te_entry is not None
    assert te_entry["name"] == "Telugu"
    assert te_entry["flores_code"] == "tel_Telu"


def test_api_translate_post_telugu():
    """Verify POST /api/v1/language/translate directly via API with Telugu request payload."""
    payload = {
        "text": "The Lessee shall pay a monthly base rent of INR 3,50,000 on or before the 5th calendar day of each month.",
        "source_lang": "en",
        "target_lang": "te"
    }
    response = client.post("/api/v1/language/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["target_lang"] == "te"
    assert data["flores_target"] == "tel_Telu"
    assert "translated_text" in data
    assert len(data["translated_text"]) > 0


def test_api_translate_empty_text():
    """Verify POST /api/v1/language/translate handles empty text gracefully."""
    payload = {
        "text": "",
        "source_lang": "en",
        "target_lang": "te"
    }
    response = client.post("/api/v1/language/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert "error" in data


def test_predefined_answer_telugu_support():
    """Verify get_predefined_answer returns Telugu translations for configured sample files."""
    ans_divorce = get_predefined_answer("vaj divorce petition.pdf", "translation_te")
    assert ans_divorce is not None
    assert "తెలుగు అనువాదం" in ans_divorce

    ans_notice = get_predefined_answer("legal notice draft.pdf", "translation_te")
    assert ans_notice is not None
    assert "తెలుగు అనువాదం" in ans_notice
