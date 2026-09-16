# SERVICE 5 — MULTILINGUAL LEGAL SIMPLIFICATION

## 1. Service Overview

### Service Name
**Service 5 — Multilingual Legal Simplification**

### Purpose

Multilingual Legal Simplification converts complex legal language into understandable plain language and then presents that meaning in the user's selected Indian regional language.

This service is **not ordinary word-for-word translation**.

The intended transformation is:

```text
COMPLEX LEGAL DOCUMENT
        ↓
LEGAL UNDERSTANDING
        ↓
PLAIN-LANGUAGE MEANING
        ↓
REGIONAL LANGUAGE
        ↓
SIMPLE REGIONAL-LANGUAGE EXPLANATION
```

The primary goal is to make difficult legal content understandable to a normal user while preserving the original legal meaning.

---

# 2. Position of Service 5 in the Project

The project is an **AI-Driven Multilingual Legal Document Simplifier**.

The core product workflow is:

```text
UPLOAD
  ↓
UNDERSTAND
  ↓
EXTRACT
  ↓
SUMMARIZE
  ↓
SIMPLIFY
  ↓
TRANSLATE
  ↓
ASK
  ↓
VERIFY
```

Service 5 specifically handles the:

```text
COMPLEX LEGAL LANGUAGE
        ↓
LEGAL MEANING
        ↓
SIMPLE MEANING
        ↓
REGIONAL-LANGUAGE EXPLANATION
```

It works inside the unified Legal AI Workspace and uses the shared document context rather than creating a separate document-processing pipeline.

---

# 3. User-Facing Service

After the user uploads a legal document and the document becomes ready, the application exposes the main services.

Service 5 is shown as:

```text
[ Simplify & Translate ]
```

Example service card:

```text
┌──────────────────────────────────────────────┐
│ 🌐 Simplify & Translate                      │
│                                              │
│ Understand complex legal language in simple  │
│ language and your preferred regional         │
│ language.                                    │
│                                              │
│ Language: [ Tamil ▼ ]                        │
│                                              │
│ [ Simplify Document ]                        │
└──────────────────────────────────────────────┘
```

The user should feel that this is a capability of the same legal workspace, not a separate translation application.

---

# 4. What the User Provides

The main input is an uploaded legal document.

Supported documents can include:

- Court judgments
- Court orders
- Contracts
- Agreements
- Employment agreements
- Lease agreements
- NDAs
- Service agreements
- Sale agreements
- Legal notices
- Other supported legal documents

The service uses the already-created shared document context.

The shared context may contain:

- Document ID
- Document type
- Language
- Pages
- Extracted text
- Sections
- Clauses
- Entities
- Chunks
- Metadata
- Sources
- Citations
- Relevant retrieved content

Common document extraction should happen once and be reused by Service 5.

---

# 5. User Input Options

The user can select:

### A. Content to simplify

Possible choices:

```text
○ Entire document
○ Selected section
○ Selected clause
○ Selected paragraph
○ Selected text
```

### B. Output language

Potential languages:

- English
- Tamil
- Hindi
- Telugu
- Malayalam
- Kannada
- Bengali
- Marathi
- Other Indian languages as implementation permits

The architecture should allow additional languages later.

### C. Output mode

The UI can provide:

```text
[ Simple Explanation ]
[ Simple English + Regional Language ]
```

The exact UI may be simplified for the MVP, but the result should remain structured.

---

# 6. How the Service Answer Will Look

The result should **not** be one large block of translated text.

It should be structured and easy to compare with the original.

Recommended format:

```text
┌─────────────────────────────────────────────────────┐
│ Multilingual Legal Simplification                   │
│                                                     │
│ Language: Tamil                                     │
├─────────────────────────────────────────────────────┤
│ ORIGINAL LEGAL TEXT                                 │
│                                                     │
│ "Either party may terminate this Agreement by      │
│ providing thirty (30) days' prior written notice   │
│ to the other party."                                │
│                                                     │
│ Page 7 • Clause 12.2                                │
├─────────────────────────────────────────────────────┤
│ SIMPLE ENGLISH                                      │
│                                                     │
│ Either party can end the agreement by giving       │
│ 30 days' notice to the other party.                │
├─────────────────────────────────────────────────────┤
│ SIMPLE TAMIL                                        │
│                                                     │
│ இந்த ஒப்பந்தத்தில் உள்ள எந்த ஒரு தரப்பும்           │
│ மற்றொரு தரப்புக்கு 30 நாட்களுக்கு முன் தகவல்        │
│ கொடுத்து ஒப்பந்தத்தை முடிக்கலாம்.                  │
├─────────────────────────────────────────────────────┤
│ SOURCE                                              │
│ Page 7 • Clause 12.2                                │
│ [ View Original ]                                   │
└─────────────────────────────────────────────────────┘
```

---

# 7. Recommended Answer Structure

Each simplified legal item should contain:

1. Original legal text
2. Simple English meaning
3. Selected regional-language explanation
4. Source/page
5. Section or clause where available
6. Optional source highlight/view-original action

Conceptually:

```text
{
  "original_text": "...",
  "simple_english": "...",
  "regional_language": "...",
  "language": "Tamil",
  "source": {
    "page": 7,
    "section": "...",
    "clause": "12.2"
  }
}
```

The exact implementation schema can follow the project's API standards.

---

# 8. Example

## Original

```text
"Either party may terminate this Agreement by
providing thirty (30) days' prior written notice
to the other party."
```

## Simple English

```text
Either party can end the agreement by giving
30 days' notice to the other party.
```

## Tamil

```text
இந்த ஒப்பந்தத்தில் உள்ள எந்த ஒரு தரப்பும்
மற்றொரு தரப்புக்கு 30 நாட்களுக்கு முன் தகவல்
கொடுத்து ஒப்பந்தத்தை முடிக்கலாம்.
```

The purpose is not merely to translate the original sentence.

The system first identifies its legal meaning, simplifies that meaning, and then explains it in the selected regional language.

---

# 9. How the Answer Is Obtained

The answer is generated using the shared document-processing and AI architecture.

High-level flow:

```text
USER SELECTS "SIMPLIFY & TRANSLATE"
                 ↓
IDENTIFY TARGET CONTENT
                 ↓
GET SHARED DOCUMENT CONTEXT
                 ↓
RETRIEVE RELEVANT TEXT
                 ↓
UNDERSTAND LEGAL MEANING
                 ↓
PRESERVE LEGAL MEANING
                 ↓
GENERATE PLAIN-LANGUAGE MEANING
                 ↓
GENERATE SELECTED REGIONAL LANGUAGE
                 ↓
CHECK SOURCE / GROUNDING
                 ↓
STRUCTURED OUTPUT
                 ↓
FRONTEND RENDERING
```

---

# 10. Step-by-Step Working Logic

## Step 1 — User selects the service

The user clicks:

```text
[ Simplify & Translate ]
```

The frontend sends a request to the backend.

Conceptually:

```text
POST /documents/{id}/simplify
```

The exact endpoint must remain consistent with the project's existing API standards.

---

## Step 2 — Validate the document

The backend verifies:

- Document exists
- Document is accessible to the user
- Document processing is complete
- Required extracted content exists
- Target language is supported
- Requested content is valid

If the document is not ready:

```text
Document is still being processed.
Please try again when processing is complete.
```

---

## Step 3 — Retrieve shared document context

Service 5 does not independently extract the document again.

It uses the shared document context containing information such as:

- Extracted text
- Pages
- Sections
- Clauses
- Chunks
- Document type
- Document language
- Sources
- Citations

This follows the project's principle that common information should be extracted once and reused.

---

## Step 4 — Identify the target content

The service determines what should be simplified.

For example:

```text
Entire document
```

or:

```text
Clause 12.2
```

or:

```text
Selected paragraph
```

For a full-document request, the service should process the content in manageable sections/chunks rather than treating an extremely long document as one uncontrolled prompt.

---

## Step 5 — Understand the legal meaning

Before simplification, the AI must understand what the legal text means in its document context.

The model should identify:

- Who is involved
- What action is required
- What right is given
- What obligation exists
- Conditions
- Exceptions
- Deadlines
- Amounts
- Restrictions
- Legal relationships

The purpose is to avoid changing meaning while making the wording easier.

---

# 11. Meaning Preservation

This is one of the most important rules of Service 5.

The AI must:

```text
UNDERSTAND
    ↓
PRESERVE MEANING
    ↓
SIMPLIFY
    ↓
EXPLAIN
```

It must not:

- Add facts
- Remove important legal conditions
- Change obligations
- Change rights
- Change deadlines
- Change amounts
- Change exceptions
- Invent legal consequences
- Invent information that is absent from the document

For example, if the original says:

```text
30 days' prior written notice
```

the simplified output must not become:

```text
You can cancel whenever you want.
```

The second statement removes an important condition and therefore changes the legal meaning.

---

# 12. Plain-Language Generation

After understanding the legal meaning, the system generates a simple English explanation.

The explanation should:

- Use simple vocabulary
- Use shorter sentences where appropriate
- Explain difficult legal terminology
- Preserve important legal terms when necessary
- Preserve conditions and exceptions
- Preserve numbers and dates
- Preserve obligations and rights
- Avoid unsupported interpretation

The objective is:

```text
COMPLEX LEGAL LANGUAGE
          ↓
EASY-TO-UNDERSTAND LEGAL MEANING
```

This is legal simplification, not merely shortening.

---

# 13. Regional-Language Generation

After producing the simplified meaning, the system generates the selected regional-language explanation.

Example:

```text
Complex Legal English
        ↓
Legal Meaning
        ↓
Simple English
        ↓
Tamil
        ↓
Simple Tamil Explanation
```

The system should not blindly translate every word from the original legal text.

The regional-language output should communicate the already-understood legal meaning clearly.

---

# 14. Translation Rules

The AI prompt should instruct the model to:

- Preserve legal meaning
- Use the selected language
- Use simple language
- Preserve important legal terminology where necessary
- Preserve dates
- Preserve amounts
- Preserve names
- Preserve clause references
- Preserve conditions
- Preserve exceptions
- Avoid adding information
- Avoid deleting legally important information

If a legal term does not have a safe/simple equivalent, the original legal terminology can be retained with an explanation.

---

# 15. Source and Evidence

Service 5 must remain document-grounded.

Whenever possible, the result should show:

```text
Source:
Page 7
Clause 12.2
```

The user should be able to select:

```text
[ View Original ]
```

and navigate back to the original source.

This allows the user to verify the simplified explanation against the actual document.

---

# 16. Complete Backend Logic

Conceptually:

```text
REQUEST
   ↓
AUTHENTICATION / AUTHORIZATION
   ↓
DOCUMENT VALIDATION
   ↓
TARGET CONTENT VALIDATION
   ↓
LANGUAGE VALIDATION
   ↓
SHARED DOCUMENT CONTEXT
   ↓
RELEVANT CONTENT RETRIEVAL
   ↓
LEGAL MEANING ANALYSIS
   ↓
MEANING-PRESERVATION CHECK
   ↓
PLAIN-LANGUAGE GENERATION
   ↓
REGIONAL-LANGUAGE GENERATION
   ↓
SOURCE / EVIDENCE ATTACHMENT
   ↓
STRUCTURED RESPONSE
   ↓
FRONTEND
```

---

# 17. AI Gateway Architecture

Service 5 should not directly depend on a single AI provider.

The project architecture is:

```text
FRONTEND
   ↓
FASTAPI BACKEND
   ↓
BUSINESS / SERVICE LAYER
   ↓
AI GATEWAY
   ↓
AI PROVIDER
```

Possible providers include:

- Gemini
- OpenAI
- Claude
- Mistral
- Groq
- Local/open-source models

The frontend should not know which provider is being used.

---

# 18. Real AI Mode

In production-style implementation:

```text
Service 5
   ↓
Document Context
   ↓
Relevant Context
   ↓
AI Gateway
   ↓
Selected AI Provider
   ↓
Simplification
   ↓
Regional Language Generation
   ↓
Source Validation
   ↓
Structured Output
```

---

# 19. Deterministic Demo Mode

For the SIH MVP, Service 5 can use deterministic fixture responses.

Architecture:

```text
FRONTEND
   ↓
FASTAPI
   ↓
SERVICE 5
   ↓
AI GATEWAY
   ↓
MOCK PROVIDER
   ↓
JSON FIXTURE
```

The fixture should contain document-specific outputs.

Example:

```text
fixtures/
└── intelligence/
    └── document-001/
        └── simplification.json
```

The mock response should behave like a real AI provider from the application's perspective.

Do not put document-specific `if/else` logic inside API routers.

---

# 20. Example Mock Response

Conceptually:

```json
{
  "document_id": "document-001",
  "service": "multilingual_legal_simplification",
  "language": "ta",
  "items": [
    {
      "source": {
        "page": 7,
        "clause": "12.2"
      },
      "original_text": "Either party may terminate this Agreement by providing thirty (30) days' prior written notice to the other party.",
      "simple_english": "Either party can end the agreement by giving 30 days' notice to the other party.",
      "regional_language": "இந்த ஒப்பந்தத்தில் உள்ள எந்த ஒரு தரப்பும் மற்றொரு தரப்புக்கு 30 நாட்களுக்கு முன் தகவல் கொடுத்து ஒப்பந்தத்தை முடிக்கலாம்."
    }
  ]
}
```

This is an example structure. The actual fixture must match the selected demo document.

---

# 21. Frontend Rendering Logic

The frontend should receive structured data.

Conceptually:

```text
API RESPONSE
     ↓
Parse structured result
     ↓
Display simplification cards
     ↓
Display language
     ↓
Display source
     ↓
Enable "View Original"
```

The frontend should not perform the legal simplification itself.

Business logic belongs in the backend/service layer.

---

# 22. Suggested UI Components

Service 5 can contain:

### Header

```text
Multilingual Legal Simplification
```

### Language selector

```text
[ Tamil ▼ ]
```

### Original content card

```text
Original Legal Text
```

### Simple English card

```text
Simple English
```

### Regional-language card

```text
Simple Tamil
```

### Source card

```text
Page 7
Clause 12.2
[ View Original ]
```

### Follow-up interaction

```text
Ask about this explanation...
```

---

# 23. Full-Document View

For an entire document:

```text
Multilingual Legal Simplification

Document: Employment Agreement

Output Language: Tamil

────────────────────────────────────

Section 1
Original
[Original text]

Simple English
[Simple explanation]

Simple Tamil
[Simple Tamil explanation]

Source
Page 2 • Section 1

────────────────────────────────────

Section 2
Original
[Original text]

Simple English
[Simple explanation]

Simple Tamil
[Simple Tamil explanation]

Source
Page 3 • Section 2
```

The UI can allow the user to scroll through the simplified document while retaining source traceability.

---

# 24. Clause-Level View

For a selected clause:

```text
Clause 7 — Termination

Original:
[Original legal clause]

Simple English:
[Simple meaning]

Tamil:
[Simple Tamil explanation]

Why this matters:
[Only if supported by the document/context]

Source:
Page 8 • Clause 7

[ View Original ]
```

The system should not automatically turn this into legal advice.

---

# 25. Follow-Up Questions

After receiving the explanation, the user can ask:

```text
"Explain this in even simpler Tamil."

"What does this clause require me to do?"

"Who can terminate the agreement?"

"Is there a notice period?"

"Explain section 7 in Tamil."
```

If the question is document-specific, the answer must remain grounded in the uploaded document.

If the information cannot be found:

```text
I could not find this information in the uploaded document.
```

---

# 26. Relationship With Other Services

Service 5 should reuse the project's shared capabilities.

### Service 1 — Understanding

Provides document structure and type.

### Service 2 — Summarization

Can provide summarized content that may later be simplified.

### Service 3 — Key Information Extraction

Provides clauses, dates, obligations and other structured information.

### Service 4 — Risk Detection

Can identify relevant clauses that a user may then ask to simplify.

### Service 5 — Multilingual Legal Simplification

Transforms complex legal meaning into simple regional-language explanations.

### Service 6 — Document Q&A

Allows the user to ask follow-up questions about the simplified content/document.

### Service 7 — Judgment Understanding

Provides specialized judgment structure that can be simplified into regional languages.

### Service 8 — Voice Assistant

Can use Service 5's regional-language capability for voice-based explanations.

---

# 27. Important Difference From Translation

Ordinary translation:

```text
English Text
     ↓
Tamil Translation
```

Service 5:

```text
Complex Legal English
        ↓
Legal Understanding
        ↓
Meaning Preservation
        ↓
Plain English
        ↓
Simple Tamil
```

Therefore Service 5 is a combination of:

```text
LEGAL MEANING
+
SIMPLIFICATION
+
REGIONAL LANGUAGE ACCESSIBILITY
```

This is the unique feature of the service.

---

# 28. Business Logic of Service 5

The core business logic is:

```text
IF document is READY
    ↓
Validate target language
    ↓
Identify requested content
    ↓
Retrieve shared document context
    ↓
Understand legal meaning
    ↓
Preserve legal meaning
    ↓
Generate plain-language explanation
    ↓
Generate selected regional-language explanation
    ↓
Attach source/page/section evidence
    ↓
Return structured result
ELSE
    ↓
Return processing/error state
```

The business logic must not be placed in the frontend.

It should belong to the backend/service layer.

---

# 29. Simplification Rules

The service should:

### DO

- Simplify complex sentences
- Explain difficult legal wording
- Preserve legal meaning
- Preserve conditions
- Preserve exceptions
- Preserve dates
- Preserve amounts
- Preserve obligations
- Preserve rights
- Preserve clause references
- Use simple regional language
- Provide source references
- State uncertainty where evidence is insufficient

### DO NOT

- Invent facts
- Invent clauses
- Invent obligations
- Change deadlines
- Change financial amounts
- Remove important conditions
- Claim that a clause is illegal without support
- Provide unsupported legal conclusions
- Pretend to be a lawyer
- Guarantee a legal outcome
- Treat translation as simple word replacement

---

# 30. Error Handling

Service 5 should handle:

### Document not found

```text
The requested document could not be found.
```

### Document still processing

```text
This document is still being processed.
Please try again when it is ready.
```

### Unsupported language

```text
This language is not currently supported.
Please select another available language.
```

### Missing text

```text
The requested content could not be extracted from the document.
```

### AI/provider failure

```text
We could not generate the simplification right now.
Please try again.
```

### Insufficient evidence

```text
I could not reliably simplify this content because
the required source information could not be verified.
```

---

# 31. Loading State

While processing:

```text
🌐 Simplifying legal content...

Understanding legal meaning
        ✓

Generating plain-language explanation
        ●

Generating Tamil explanation
        ○

Preparing source references
        ○
```

For the MVP, a simpler loading state is acceptable:

```text
Simplifying and translating...
```

---

# 32. Empty State

If there is no selected content:

```text
Select a clause, section, or document content
to simplify and translate.
```

If the document contains no usable text:

```text
No readable legal text was found in this document.
```

---

# 33. Security Considerations

The service operates on potentially sensitive legal documents.

Therefore:

- Authenticate users
- Authorize document access
- Do not expose another user's document
- Do not expose document IDs unnecessarily
- Protect uploaded content
- Keep provider credentials on the backend
- Do not send credentials to the frontend
- Maintain auditability where required
- Follow appropriate document storage/security practices

The frontend must never directly access the database, AI provider, vector database, or file system.

---

# 34. Legal Safety

Service 5 is an explanation and accessibility feature.

It should:

- Explain
- Simplify
- Translate
- Highlight source content
- Assist understanding

It should not:

- Replace a lawyer
- Guarantee a legal result
- Declare a clause definitely illegal
- Invent legal rules
- Give unsupported legal conclusions

For high-risk legal decisions, the system can recommend professional/legal review where appropriate.

---

# 35. Source Traceability

Every output should retain the relationship:

```text
Simplified Answer
      ↓
Original Text
      ↓
Page
      ↓
Section / Clause
```

Example:

```text
Answer:
Either party can end the agreement with 30 days' notice.

Source:
Employment Agreement
Page 7
Clause 12.2
```

This is essential because users must be able to verify the AI-generated explanation.

---

# 36. Prompt Logic for Service 5

The AI prompt should communicate the following rules:

```text
You are performing multilingual legal simplification.

Use the supplied legal document/context.

1. Understand the legal meaning first.
2. Preserve the original legal meaning.
3. Do not invent facts or legal information.
4. Do not remove legally important conditions.
5. Do not change dates, amounts, obligations, rights, or exceptions.
6. Generate a clear plain-language explanation.
7. Translate/explain that meaning in the selected regional language.
8. Preserve important legal terminology when necessary.
9. Use only the supplied document/context for document-specific claims.
10. Provide source/page/section references where available.
11. Clearly communicate uncertainty when evidence is insufficient.
12. Do not provide unsupported legal conclusions.
```

The key transformation is:

```text
UNDERSTAND
→ PRESERVE
→ SIMPLIFY
→ EXPLAIN
```

---

# 37. Input Contract

Conceptual input:

```json
{
  "document_id": "document-001",
  "language": "ta",
  "content_scope": "clause",
  "section": "12.2"
}
```

Possible content scopes:

```text
document
section
clause
paragraph
selection
```

The exact API schema should remain aligned with the project's existing API conventions.

---

# 38. Output Contract

Conceptual output:

```json
{
  "service": "multilingual_legal_simplification",
  "document_id": "document-001",
  "language": "ta",
  "results": [
    {
      "original_text": "...",
      "simple_english": "...",
      "regional_language": "...",
      "source": {
        "page": 7,
        "section": "...",
        "clause": "12.2"
      }
    }
  ]
}
```

The structured output makes the frontend predictable and allows source references to be rendered consistently.

---

# 39. Performance Considerations

For a long document:

```text
Long Document
     ↓
Relevant Sections / Chunks
     ↓
Simplification
     ↓
Regional Language Generation
     ↓
Combine Structured Results
```

The service should avoid unnecessarily sending the entire document for every small clause request.

Shared chunking and retrieval infrastructure should be reused.

---

# 40. MVP Implementation

For the SIH MVP, prioritize:

1. Document-ready validation
2. Language selector
3. Clause/section simplification
4. Simple English output
5. Regional-language output
6. Source/page reference
7. Structured result cards
8. Mock fixture support
9. Follow-up interaction through Document Q&A

Advanced capabilities can be added later.

---

# 41. Production Enhancement

Future versions can add:

- More Indian languages
- Better multilingual legal models
- OCR for scanned regional-language documents
- Semantic retrieval
- Embeddings
- Vector database
- Reranking
- Advanced source verification
- Translation quality evaluation
- Human/legal review workflows
- Improved regional-language terminology handling
- Voice integration through Service 8

These enhancements should continue supporting the same Service 5 objective.

---

# 42. Evaluation and Testing

Service 5 should be tested for:

### Meaning preservation

Does the simplified version preserve the legal meaning?

### Translation correctness

Does the regional-language output communicate the same meaning?

### Completeness

Were important conditions, exceptions, dates and obligations retained?

### Grounding

Can the output be traced to the source document?

### Language quality

Is the selected regional language understandable?

### Hallucination control

Did the AI introduce information absent from the document?

### Formatting

Does the frontend correctly render original text, simple English, regional language and source?

---

# 43. Acceptance Criteria

Service 5 is complete when:

- [ ] User can select "Simplify & Translate"
- [ ] User can select an output language
- [ ] Service uses the shared document context
- [ ] Legal meaning is understood before simplification
- [ ] Plain-language meaning is generated
- [ ] Regional-language explanation is generated
- [ ] Important legal meaning is preserved
- [ ] Dates and amounts are preserved
- [ ] Conditions and exceptions are preserved
- [ ] Source/page/section is shown where available
- [ ] User can view the original source
- [ ] Errors are handled
- [ ] Loading state exists
- [ ] Empty state exists
- [ ] Backend owns the business logic
- [ ] AI provider is accessed through the AI Gateway
- [ ] Mock/demo mode is supported
- [ ] Document-specific fixture data matches the demo document
- [ ] Follow-up questions can continue through the unified workspace
- [ ] The system does not present itself as a lawyer or legal replacement

---

# 44. Final Service 5 Architecture

```text
                    USER
                      ↓
             LEGAL AI WORKSPACE
                      ↓
             "SIMPLIFY & TRANSLATE"
                      ↓
              SELECT LANGUAGE
                      ↓
                FASTAPI API
                      ↓
             SERVICE 5 LOGIC
                      ↓
           SHARED DOCUMENT CONTEXT
                      ↓
           RELEVANT CONTENT / CHUNKS
                      ↓
             LEGAL UNDERSTANDING
                      ↓
            MEANING PRESERVATION
                      ↓
            PLAIN-LANGUAGE OUTPUT
                      ↓
          REGIONAL-LANGUAGE OUTPUT
                      ↓
            SOURCE / EVIDENCE CHECK
                      ↓
             STRUCTURED RESPONSE
                      ↓
               REACT FRONTEND
                      ↓
       ┌──────────────────────────────┐
       │ Original Legal Text          │
       │ Simple English               │
       │ Simple Regional Language     │
       │ Page / Section / Clause      │
       │ View Original                │
       └──────────────────────────────┘
```

---

# 45. Final Business Logic

The complete business logic of Service 5 can be summarized as:

```text
COMPLEX LEGAL CONTENT
        ↓
IDENTIFY WHAT THE CONTENT MEANS
        ↓
PRESERVE THE LEGAL MEANING
        ↓
REMOVE UNNECESSARY COMPLEXITY
        ↓
CREATE PLAIN-LANGUAGE MEANING
        ↓
EXPRESS THAT MEANING IN THE
USER'S SELECTED REGIONAL LANGUAGE
        ↓
ATTACH ORIGINAL SOURCE
        ↓
SHOW RESULT
        ↓
ALLOW FOLLOW-UP QUESTIONS
```

The central rule is:

> **Do not translate the complexity. Understand the legal meaning first, simplify that meaning, and then make the simplified meaning accessible in the user's regional language.**

---

# 46. Service 5 in One Sentence

**Multilingual Legal Simplification enables a user to take complex legal content from an uploaded document, understand its meaning in simple language, and receive that explanation in a selected Indian regional language while retaining the original legal meaning and source evidence.**
