"""AI Prompts package."""

from app.ai_layer.prompts.analysis_prompts import (
    SYSTEM_LEGAL_ANALYST,
    SUMMARY_PROMPT_TEMPLATE,
    CLAUSE_EXTRACTION_PROMPT,
)
from app.ai_layer.prompts.risk_prompts import (
    RISK_DETECTION_PROMPT,
    COMPLIANCE_CHECK_PROMPT,
)
from app.ai_layer.prompts.drafting_prompts import (
    DOCUMENT_DRAFT_PROMPT,
    CLAUSE_REWRITE_PROMPT,
)
from app.ai_layer.prompts.translation_prompts import (
    SIMPLE_EXPLANATION_PROMPT,
    REGIONAL_EXPLANATION_PROMPT,
)

__all__ = [
    "SYSTEM_LEGAL_ANALYST",
    "SUMMARY_PROMPT_TEMPLATE",
    "CLAUSE_EXTRACTION_PROMPT",
    "RISK_DETECTION_PROMPT",
    "COMPLIANCE_CHECK_PROMPT",
    "DOCUMENT_DRAFT_PROMPT",
    "CLAUSE_REWRITE_PROMPT",
    "SIMPLE_EXPLANATION_PROMPT",
    "REGIONAL_EXPLANATION_PROMPT",
]
