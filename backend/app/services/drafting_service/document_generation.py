"""Drafting Service - Full legal document generation."""

import uuid
from typing import Any, Dict
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.drafting_prompts import DOCUMENT_DRAFT_PROMPT
from app.data.postgres.models.draft import Draft


def generate_document_draft(
    db: Session, workspace_id: str, agreement_type: str, parties: str, key_terms: str, jurisdiction: str = "India"
) -> Dict[str, Any]:
    """Generate a full first draft of a legal agreement and persist to DB."""
    prompt = DOCUMENT_DRAFT_PROMPT.format(
        agreement_type=agreement_type,
        parties=parties,
        key_terms=key_terms,
        jurisdiction=jurisdiction,
    )
    ai_res = provider_router.generate_completion(prompt)
    content = ai_res.get("text", "Standard legal draft content.")
    title = f"{agreement_type} - {parties}"

    draft_id = f"draft-{uuid.uuid4().hex[:10]}"
    if db:
        try:
            draft_rec = Draft(
                id=draft_id,
                workspace_id=workspace_id,
                title=title,
                content=content,
                version=1,
            )
            db.add(draft_rec)
            db.commit()
        except Exception:
            db.rollback()

    return {
        "id": draft_id,
        "title": title,
        "content": content,
        "status": "drafted",
        "agreement_type": agreement_type,
    }
