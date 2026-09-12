"""AI Chat Service package."""

from app.services.ai_chat_service.chat import ask_legal_question
from app.services.ai_chat_service.history import append_message, get_conversation_history
from app.services.ai_chat_service.retrieval import retrieve_context_chunks

__all__ = ["ask_legal_question", "append_message", "get_conversation_history", "retrieve_context_chunks"]
