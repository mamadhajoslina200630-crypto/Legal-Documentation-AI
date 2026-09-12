"""Prompt templates for legal risk detection and compliance checking."""

RISK_DETECTION_PROMPT = """Analyze the following legal text for unfavorable terms, missing protections, and legal vulnerabilities under Indian law:
Document:
{document_text}

For each risk found, provide:
- Severity (Low / Medium / High / Critical)
- Category
- Clause Reference
- Risk Explanation
- Recommended Mitigation
"""

COMPLIANCE_CHECK_PROMPT = """Verify compliance of this document against standard Indian statutory requirements and regulatory norms:
Document:
{document_text}
"""
