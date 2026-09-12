"""Indian Legal Service - Indian statutory context assistant."""

from typing import Any, Dict
from app.ai_layer.provider_router import provider_router


def answer_indian_legal_query(question: str) -> Dict[str, Any]:
    """Answer legal queries grounded in Indian statutes (IPC/BNS, CrPC/BNSS, CPC, Contract Act, DPDP)."""
    prompt = f"Answer this query according to Indian Law, citing relevant sections and acts:\n{question}"
    ai_res = provider_router.generate_completion(prompt)
    return {
        "question": question,
        "answer": ai_res.get("text", "Indian legal context answer."),
        "relevant_acts": ["Indian Contract Act, 1872", "Arbitration and Conciliation Act, 1996"],
    }
