"""Prompt templates for legal document analysis, summarization, and key information extraction."""

SYSTEM_LEGAL_ANALYST = """You are an expert Indian legal document analyst.
Provide precise, objective, and legally sound assessments. Never invent terms not present in the text."""

SUMMARY_PROMPT_TEMPLATE = """Summarize the following legal document clearly for an Indian business or individual:
Document:
{document_text}

Provide:
1. Executive Summary
2. Key Parties
3. Major Rights & Obligations
4. Critical Deadlines & Financials
"""

CLAUSE_EXTRACTION_PROMPT = """Extract all major legal clauses (indemnity, termination, confidentiality, governing law, jurisdiction) from the text below:
{document_text}
"""
