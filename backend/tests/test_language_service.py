"""Language Service tests for translation, IndicTrans2 mapping, and Telugu support."""

from app.services.language_service.simple_explanation import simplify_legal_text
from app.services.language_service.translation import (
    translate_legal_text,
    ISO_TO_INDICTRANS2,
    SUPPORTED_LANGUAGES,
    BHASHINI_CONFIG,
)


def test_simplify_stub():
    """Verify simplification returns output structure."""
    res = simplify_legal_text("Indemnity clause here.")
    assert "simple_explanation" in res


def test_indictrans2_telugu_mapping():
    """Verify ISO 639-1 code 'te' maps to FLORES-200 'tel_Telu'."""
    assert "te" in ISO_TO_INDICTRANS2
    assert ISO_TO_INDICTRANS2["te"] == "tel_Telu"


def test_supported_languages_telugu():
    """Verify Telugu is registered in SUPPORTED_LANGUAGES."""
    assert "te" in SUPPORTED_LANGUAGES
    assert SUPPORTED_LANGUAGES["te"] == "Telugu"


def test_bhashini_tts_telugu_model():
    """Verify Telugu TTS model is registered in BHASHINI_CONFIG."""
    assert "te" in BHASHINI_CONFIG["tts_models"]
    assert BHASHINI_CONFIG["tts_models"]["te"] == "ai4bharat/vkg-indic-tts-te"


def test_translate_legal_text_telugu():
    """Verify translation to Telugu returns valid structure and FLORES-200 code."""
    sample_legal_clause = (
        "Either party may terminate this agreement with seven (7) days written notice. "
        "Upon early termination, the Lessee shall forfeit the security deposit."
    )
    result = translate_legal_text(sample_legal_clause, source_lang="en", target_lang="te")
    assert result["success"] is True
    assert result["target_lang"] == "te"
    assert result["flores_target"] == "tel_Telu"
    assert len(result["translated_text"]) > 0
    assert "bhashini_pipeline" in result


def test_translate_empty_text_error_fallback():
    """Verify translation error fallback for empty input."""
    result = translate_legal_text("", source_lang="en", target_lang="te")
    assert result["success"] is False
    assert "error" in result
    assert result["target_lang"] == "te"
