"""API v1 master router aggregating all sub-routers."""

from fastapi import APIRouter
from app.api.v1.auth_routes import router as auth_router
from app.api.v1.workspace_routes import router as workspace_router
from app.api.v1.document_routes import router as document_router
from app.api.v1.chat_routes import router as chat_router
from app.api.v1.analysis_routes import router as analysis_router
from app.api.v1.comparison_routes import router as comparison_router
from app.api.v1.drafting_routes import router as drafting_router
from app.api.v1.language_routes import router as language_router
from app.api.v1.indian_legal_routes import router as indian_legal_router
from app.api.v1.search_routes import router as search_router
from app.api.v1.audit_routes import router as audit_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(workspace_router)
api_v1_router.include_router(document_router)
api_v1_router.include_router(chat_router)
api_v1_router.include_router(analysis_router)
api_v1_router.include_router(comparison_router)
api_v1_router.include_router(drafting_router)
api_v1_router.include_router(language_router)
api_v1_router.include_router(indian_legal_router)
api_v1_router.include_router(search_router)
api_v1_router.include_router(audit_router)


@api_v1_router.get("/health", tags=["Health"])
def v1_health():
    """V1 API sub-tree health check."""
    return {"status": "healthy", "version": "v1"}
