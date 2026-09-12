"""Prompt templates for plain-language simplification and regional Indian language explanations."""

SIMPLE_EXPLANATION_PROMPT = """Explain the following complex legal clause in plain, simple everyday English so that a non-lawyer can easily understand their rights and obligations:
Clause:
{clause_text}
"""

REGIONAL_EXPLANATION_PROMPT = """Explain this legal concept/clause in {language} with simple terminology accessible to ordinary citizens:
Text:
{clause_text}
"""
