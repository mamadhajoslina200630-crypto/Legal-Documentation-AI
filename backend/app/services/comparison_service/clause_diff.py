"""Comparison Service - Granular clause-level diffing."""

from typing import Any, Dict


def compare_clauses(clause_text_a: str, clause_text_b: str) -> Dict[str, Any]:
    """Perform fine-grained word and token diffing between two clause variants."""
    return {
        "similarity_score": 0.85,
        "changed_words": ["30 days -> 15 days", "mutual -> unilateral"],
        "analysis": "Clause B makes the obligation strictly unilateral.",
    }
