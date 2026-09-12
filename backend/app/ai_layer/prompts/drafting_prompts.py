"""Prompt templates for drafting legal agreements and rewriting clauses."""

DOCUMENT_DRAFT_PROMPT = """Draft a legally sound Indian agreement based on these specifications:
Agreement Type: {agreement_type}
Parties: {parties}
Key Terms: {key_terms}
Jurisdiction: {jurisdiction}
"""

CLAUSE_REWRITE_PROMPT = """Rewrite the following legal clause to make it more balanced, clear, and protective for {party}:
Original Clause:
{clause_text}
"""
