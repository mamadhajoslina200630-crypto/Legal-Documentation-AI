"""Celery Tasks wrapper module.

Wraps all 7 background processing pipelines as asynchronous Celery tasks.
"""

from typing import Any, Dict
from app.background.workers.celery_app import celery
from app.background.pipelines.document_processing_pipeline import run_document_processing_pipeline
from app.background.pipelines.legal_info_pipeline import run_legal_info_pipeline
from app.background.pipelines.ai_analysis_pipeline import run_ai_analysis_pipeline
from app.background.pipelines.rag_pipeline import run_rag_pipeline
from app.background.pipelines.court_document_pipeline import run_court_document_pipeline
from app.background.pipelines.translation_pipeline import run_translation_pipeline
from app.background.pipelines.voice_pipeline import run_voice_pipeline


@celery.task(name="tasks.process_document")
def task_process_document(document_id: str, file_path: str) -> Dict[str, Any]:
    """Asynchronously process uploaded document."""
    return run_document_processing_pipeline(document_id, file_path)


@celery.task(name="tasks.extract_legal_info")
def task_extract_legal_info(document_id: str, document_text: str) -> Dict[str, Any]:
    """Asynchronously extract clauses and metadata."""
    return run_legal_info_pipeline(document_id, document_text)


@celery.task(name="tasks.ai_analysis")
def task_ai_analysis(document_id: str) -> Dict[str, Any]:
    """Asynchronously pre-generate analysis and risks."""
    return run_ai_analysis_pipeline(document_id)


@celery.task(name="tasks.rag_indexing")
def task_rag_indexing(document_id: str, document_text: str) -> Dict[str, Any]:
    """Asynchronously embed chunks and populate Qdrant vector index."""
    return run_rag_pipeline(document_id, document_text)


@celery.task(name="tasks.process_court_document")
def task_process_court_document(document_id: str, file_path: str) -> Dict[str, Any]:
    """Asynchronously parse scanned court judgments and orders."""
    return run_court_document_pipeline(document_id, file_path)


@celery.task(name="tasks.translate_document")
def task_translate_document(text: str, target_lang: str) -> Dict[str, Any]:
    """Asynchronously translate legal text."""
    return run_translation_pipeline(text, target_lang)


@celery.task(name="tasks.process_voice")
def task_process_voice(audio_bytes: bytes, language: str = "en") -> Dict[str, Any]:
    """Asynchronously process voice query."""
    return run_voice_pipeline(audio_bytes, language)
