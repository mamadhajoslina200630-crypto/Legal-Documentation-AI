"""Demo response service for exact predefined answers matching.

Matches uploaded document filenames (e.g. 'vaj divorce') and requested options
('summary', 'translation', etc.) to deliver exact predefined demo answers,
falling back gracefully to the dynamic legal AI engine if unmapped.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

CONFIG_PATH = Path(__file__).resolve().parent.parent / "data" / "predefined_answers.json"


def _normalize_name(name: str) -> str:
    """Normalize file name or query for fuzzy matching."""
    clean = re.sub(r"[_\-\.]+", " ", name.lower())
    clean = re.sub(r"\b(pdf|docx|txt|doc)\b", "", clean)
    return " ".join(clean.split())


def _normalize_action(action: str) -> str:
    """Normalize action name or prompt string to standard service key."""
    a = action.lower()
    if any(k in a for k in ["summary", "summarize", "overview", "brief"]):
        return "summary"
    if any(k in a for k in ["translat", "hindi", "tamil", "telugu", "regional", "language"]):
        return "translation"
    if any(k in a for k in ["key info", "party", "parties", "date", "dates", "amount", "financial"]):
        return "key_info"
    if any(k in a for k in ["clause", "clauses", "grounds", "terms"]):
        return "clauses"
    if any(k in a for k in ["risk", "risks", "vulnerability", "vulnerabilities", "exposure"]):
        return "risks"
    if any(k in a for k in ["complian", "statute", "act", "section"]):
        return "compliance"
    if any(k in a for k in ["obligation", "obligations", "deadline", "covenant"]):
        return "obligations"
    if any(k in a for k in ["simplif", "plain", "layman", "easy"]):
        return "simple_explanation"
    return a.strip()


def get_predefined_answer(filename: str, action_or_query: str) -> Optional[str]:
    """Check if there is an exact predefined response for the file and action."""
    if not CONFIG_PATH.exists() or not filename:
        return None

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return None

    norm_file = _normalize_name(filename)
    norm_action = _normalize_action(action_or_query)

    for pattern, options in data.items():
        norm_pattern = _normalize_name(pattern)
        # Check if file matches pattern
        if norm_pattern in norm_file or norm_file in norm_pattern:
            # Check if action matches
            for opt_key, ans_text in options.items():
                if _normalize_action(opt_key) == norm_action:
                    return ans_text
            # Direct action key check
            if norm_action in options:
                return options[norm_action]

    return None


def register_predefined_answer(filename_pattern: str, option_key: str, answer_text: str) -> bool:
    """Save or update a predefined answer dynamically."""
    try:
        data = {}
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

        pattern = filename_pattern.strip().lower()
        if pattern not in data:
            data[pattern] = {}

        data[pattern][option_key.strip().lower()] = answer_text

        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False
