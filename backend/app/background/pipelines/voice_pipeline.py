"""Voice Pipeline: voice → STT → AI answer → TTS → audio."""

from typing import Any, Dict


def run_voice_pipeline(audio_bytes: bytes, language: str = "en") -> Dict[str, Any]:
    """Execute speech-to-text, generate legal response, and synthesize text-to-speech audio."""
    # TODO (Task 6): STT -> AI Chat -> TTS
    return {
        "transcribed_question": "What is the penalty for early termination?",
        "ai_answer": "The penalty is equivalent to one month's service fee.",
        "audio_url": "/api/v1/language/audio/sample.mp3",
    }
