# Service 1 --- Legal Document Understanding

## 1. Service Overview

**Service Name:** Legal Document Understanding

**Purpose:**\
Legal Document Understanding is the foundation service of the AI-Driven
Multilingual Legal Document Simplifier. Its purpose is to understand the
nature, identity, structure, and important metadata of an uploaded legal
document before the other AI services operate on it.

The service should answer:

> **"What is this legal document, who/what is involved, what structure
> does it have, and what important legal information can be identified
> from it?"**

It is **not** primarily a summarization service, translation service,
legal advice service, or generic chatbot.

The service fits into the project flow:

**Upload → Validate → Extract → Structure → Understand → Index → Ready →
Use other services**

The project defines this service as the foundation for the other
services because common document information should be extracted once
and reused by the rest of the system.

------------------------------------------------------------------------

## 2. Where Service 1 Fits in the Project

The overall product vision is:

**Complex Legal Document**\
↓\
**Document Understanding**\
↓\
**Important Information Extraction**\
↓\
**Legal Summary**\
↓\
**Plain-Language Simplification**\
↓\
**Regional-Language Simplification**\
↓\
**Document Q&A**\
↓\
**Source / Page Evidence**

Service 1 is the first intelligence layer after document processing.

It prepares a shared understanding of the uploaded document that can
later be reused by:

-   Legal Document Summarization
-   Clause & Key Information Extraction
-   Legal Risk Detection
-   Multilingual Legal Simplification
-   Document Q&A
-   Court Judgment & Order Understanding
-   Regional-Language Voice Legal Assistant

The project specifically states that common document information should
be extracted once and reused instead of creating a separate extraction
pipeline for every service.

------------------------------------------------------------------------

# 3. What the User Sees

After the user uploads a document and the document reaches **READY**
status, the application displays the main services.

The user selects:

**\[ Understand Document \]**

The system processes the document and displays a structured
understanding screen.

A recommended user interface is:

``` text
┌──────────────────────────────────────────────────────────────┐
│  ← Legal AI Workspace                         📄 Document    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LEGAL DOCUMENT UNDERSTANDING                                │
│  AI-generated understanding of your uploaded document        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 📄 DOCUMENT TYPE                                       │  │
│  │ Employment Agreement                                   │  │
│  │                                                        │  │
│  │ Detection: High confidence                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │ 👥 PARTIES              │  │ 🌐 LANGUAGE                │ │
│  │                         │  │                            │ │
│  │ Employer: ABC Ltd.     │  │ English                    │ │
│  │ Employee: [Name]       │  │                            │ │
│  └────────────────────────┘  └────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │ 📅 IMPORTANT DATES      │  │ ⚖️ LEGAL REFERENCES        │ │
│  │                         │  │                            │ │
│  │ Effective: 01/09/2026 │  │ Section 10                 │ │
│  │ Duration: 2 years     │  │ Section 12                 │ │
│  └────────────────────────┘  └────────────────────────────┘ │
│                                                              │
│  📑 DOCUMENT STRUCTURE                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 1. Introduction                          Page 1        │  │
│  │ 2. Employment Terms                      Page 2        │  │
│  │ 3. Compensation                          Page 3        │  │
│  │ 4. Responsibilities                      Page 4        │  │
│  │ 5. Termination                           Page 7        │  │
│  │ 6. Confidentiality                       Page 8        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  💡 DOCUMENT OVERVIEW                                        │
│  This document is an employment agreement between the        │
│  employer and employee. It defines employment terms,         │
│  responsibilities, compensation and termination conditions.  │
│                                                              │
│  📌 SOURCES                                                   │
│  Page 1 • Page 2 • Page 4 • Page 7 • Page 8                  │
│                                                              │
│  [ Summarize ] [ Extract Key Information ] [ Detect Risks ] │
│  [ Simplify ] [ Ask Document ]                              │
└──────────────────────────────────────────────────────────────┘
```

The actual values must come from the uploaded document. The example
values above are only an illustration of how the UI can look.

------------------------------------------------------------------------

# 4. Information the Service Identifies

According to the project specification, Service 1 should identify, where
possible:

1.  Document type
2.  Parties
3.  Court
4.  Case number
5.  Case title
6.  Dates
7.  Sections
8.  Clauses
9.  Important entities
10. Legal references
11. Document structure
12. Language

Not every field will exist in every document.

For example:

### Contract

Possible information:

-   Document type
-   Parties
-   Agreement title
-   Effective date
-   Duration
-   Sections
-   Clauses
-   Important entities
-   Legal references
-   Language
-   Document structure

### Court Judgment

Possible information:

-   Document type
-   Court
-   Case number
-   Case title
-   Parties
-   Judgment date
-   Judges
-   Sections
-   Legal references
-   Important entities
-   Document structure
-   Language

### Legal Notice

Possible information:

-   Document type
-   Sender
-   Recipient
-   Date
-   Legal references
-   Demand
-   Sections
-   Important entities
-   Language
-   Document structure

Missing information should not be invented.

------------------------------------------------------------------------

# 5. How the Service Answer Is Obtained

The answer should not be generated directly from a raw uploaded PDF
without processing.

The intended flow is:

``` text
USER UPLOADS DOCUMENT
        ↓
DOCUMENT VALIDATION
        ↓
DOCUMENT STORAGE
        ↓
DOCUMENT TYPE DETECTION
        ↓
TEXT EXTRACTION
        ↓
OCR IF REQUIRED
        ↓
PAGE / STRUCTURE EXTRACTION
        ↓
CHUNKING
        ↓
DOCUMENT UNDERSTANDING
        ↓
METADATA + STRUCTURE
        ↓
SOURCE MAPPING
        ↓
STRUCTURED OUTPUT
        ↓
FRONTEND DISPLAY
```

------------------------------------------------------------------------

# 6. Detailed Working Logic

## Step 1 --- Document Upload

The user uploads a legal document.

Possible document types include:

-   Court judgment
-   Court order
-   Contract
-   Agreement
-   Legal notice
-   Employment agreement
-   Lease agreement
-   NDA
-   Service agreement
-   Sale agreement
-   Other legal documents

The frontend sends the document to the backend.

Example:

``` text
Frontend
   ↓
POST /documents
   ↓
FastAPI Backend
```

The frontend must not directly communicate with the database, AI
provider, or file system.

------------------------------------------------------------------------

# 7. Step 2 --- Document Validation

The backend validates the uploaded document.

Validation may include:

-   File existence
-   Supported file type
-   File size
-   File readability
-   Basic document integrity
-   Security checks
-   Whether usable text can be extracted

If the document is invalid, the service should not continue with normal
analysis.

Possible status:

``` text
UPLOADING
    ↓
PROCESSING
    ↓
ERROR
```

The UI should clearly show the error.

------------------------------------------------------------------------

# 8. Step 3 --- Store the Document

After validation, the document is stored.

The system creates a document context.

The shared document context can contain:

-   Document ID
-   Document type
-   Language
-   Pages
-   Extracted text
-   Sections
-   Clauses
-   Entities
-   Chunks
-   Metadata
-   Sources
-   Citations
-   Relevant retrieved content

This shared context is important because all major AI services should
work from the same document context.

------------------------------------------------------------------------

# 9. Step 4 --- Document Type Detection

The system identifies what kind of legal document was uploaded.

Possible types:

``` text
Court Judgment
Court Order
Contract
Agreement
Legal Notice
Employment Agreement
Lease Agreement
NDA
Service Agreement
Sale Agreement
Other Legal Document
```

The classification can use:

-   Document title
-   Heading patterns
-   Page content
-   Legal terminology
-   Structural patterns
-   Court/case information
-   Contract language
-   AI classification where required

Example:

``` text
Input:
"IN THE HIGH COURT OF ..."

Detected:
Document Type = Court Judgment
```

Another example:

``` text
Input:
"THIS EMPLOYMENT AGREEMENT is entered into between..."

Detected:
Document Type = Employment Agreement
```

The system should not force every document into a judgment or contract
category.

------------------------------------------------------------------------

# 10. Step 5 --- Text Extraction

The system extracts the text from the document.

For PDFs with usable embedded text:

``` text
PDF
 ↓
Native Text Extraction
 ↓
Page-wise Text
```

For scanned PDFs or documents where text quality is insufficient:

``` text
Scanned PDF
 ↓
OCR
 ↓
Recognized Text
 ↓
Page-wise Text
```

The project specifically requires OCR to be conditional.

The system should not blindly OCR every document.

Possible document-processing technologies in the project direction
include:

-   PyMuPDF
-   python-docx
-   Tesseract
-   PaddleOCR
-   OpenCV where required

------------------------------------------------------------------------

# 11. Step 6 --- Page and Structure Extraction

The system preserves page information.

For example:

``` text
Page 1
 ├── Title
 ├── Parties
 └── Introduction

Page 2
 ├── Section 1
 └── Section 2

Page 3
 ├── Section 3
 └── Section 4
```

The service identifies structural elements such as:

-   Title
-   Headings
-   Sections
-   Subsections
-   Clauses
-   Numbered paragraphs
-   Schedules
-   Annexures
-   Tables where relevant

Page numbers must be retained so that later answers can point back to
evidence.

------------------------------------------------------------------------

# 12. Step 7 --- Identify Important Entities

The service identifies important entities from the document.

Examples:

-   Person names
-   Organization names
-   Courts
-   Judges
-   Locations
-   Dates
-   Case numbers
-   Acts
-   Sections
-   Contract parties

Example:

``` text
Entity:
ABC Private Limited

Role:
Employer

Source:
Page 1
```

The system should distinguish the entity's role where the document
supports it.

------------------------------------------------------------------------

# 13. Step 8 --- Identify Legal References

The service identifies legal references that appear in the document.

Examples:

``` text
Act:
[Detected Act]

Section:
[Detected Section]

Case Citation:
[Detected Citation]

Court:
[Detected Court]
```

The system should only report references that are actually present or
reliably identified from the document.

It should not invent laws, sections, precedents, or citations.

------------------------------------------------------------------------

# 14. Step 9 --- Identify Dates

The service extracts important dates where possible.

Examples:

-   Agreement date
-   Effective date
-   Judgment date
-   Filing date
-   Hearing date
-   Termination date
-   Deadline
-   Notice date

Each date should ideally retain its source.

Example:

``` text
Effective Date
01 September 2026

Source:
Page 1
```

If a date is ambiguous, the system should communicate uncertainty rather
than silently guessing.

------------------------------------------------------------------------

# 15. Step 10 --- Identify Sections and Clauses

The system identifies the document's internal structure.

Example:

``` text
1. Introduction
2. Definitions
3. Scope
4. Responsibilities
5. Payment
6. Confidentiality
7. Termination
8. Dispute Resolution
```

For each item, the system can store:

``` text
Section Number
Section Title
Page
Text Range
```

This becomes useful later for:

-   Clause extraction
-   Risk detection
-   Q&A
-   Source citations
-   Simplification

------------------------------------------------------------------------

# 16. Step 11 --- Build the Document Understanding Result

The extracted information is assembled into a structured response.

A recommended conceptual structure is:

``` json
{
  "document_id": "DOC-001",
  "document_type": "Employment Agreement",
  "language": "English",
  "parties": [],
  "court": null,
  "case_number": null,
  "case_title": null,
  "dates": [],
  "sections": [],
  "clauses": [],
  "entities": [],
  "legal_references": [],
  "document_structure": [],
  "overview": "",
  "sources": []
}
```

This is an example of the output design. The exact API schema should
remain consistent with the project's existing API standards.

------------------------------------------------------------------------

# 17. Step 12 --- Source Mapping

Every important extracted item should preferably have evidence.

Example:

``` text
Document Type:
Employment Agreement

Source:
Page 1
```

Example:

``` text
Effective Date:
01 September 2026

Source:
Page 1, Clause 1
```

Example:

``` text
Termination Clause:
Clause 12

Source:
Page 7
```

The project requires source/evidence traceability wherever possible.

Possible evidence fields include:

-   Document ID
-   Page number
-   Section
-   Clause
-   Source chunk
-   Citation
-   Relevant source text
-   Confidence/grounding information where appropriate

------------------------------------------------------------------------

# 18. How AI Is Used

The application architecture should use an AI Gateway.

The intended architecture is:

``` text
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

The frontend should not directly communicate with a provider such as
Gemini, OpenAI, Claude, or another model.

Possible providers can include:

-   Gemini
-   OpenAI
-   Claude
-   Mistral
-   Groq
-   Local/open-source models

The provider should be replaceable through configuration.

------------------------------------------------------------------------

# 19. AI Prompt Logic for Service 1

The Service 1 analysis prompt should instruct the AI to:

1.  Analyze only the supplied document/context for document-specific
    information.
2.  Identify the document type.
3.  Identify parties where present.
4.  Identify court information where present.
5.  Identify case number and case title where present.
6.  Identify important dates.
7.  Identify sections and clauses.
8.  Identify important entities.
9.  Identify legal references.
10. Identify the document's structure.
11. Identify the language.
12. Preserve source/page information.
13. Never invent missing information.
14. Clearly communicate uncertainty.
15. Return structured output.

A conceptual instruction is:

``` text
Understand the supplied legal document.

Identify the document type, parties, court/case information where
applicable, important dates, sections, clauses, important entities,
legal references, language, and document structure.

Use only information supported by the supplied document.

Do not invent missing information.

For each important extracted item, provide the relevant page,
section, clause, or source where available.

Return the result in the required structured format.
```

------------------------------------------------------------------------

# 20. Business Logic of Service 1

The business logic is the core decision-making flow of the service.

``` text
function understand_document(document_id):

    document = get_document(document_id)

    if document does not exist:
        return document_not_found

    validate_document(document)

    context = get_document_context(document_id)

    if context is not ready:
        return processing_not_complete

    document_type = detect_document_type(context)

    structure = extract_document_structure(context)

    entities = extract_entities(context)

    dates = extract_dates(context)

    legal_references = extract_legal_references(context)

    parties = extract_parties(context)

    court_info = extract_court_information(context)

    case_info = extract_case_information(context)

    language = detect_language(context)

    overview = generate_document_overview(
        document_type,
        parties,
        structure,
        context
    )

    sources = map_sources_to_extracted_information(context)

    result = build_understanding_result(
        document_type,
        language,
        parties,
        court_info,
        case_info,
        dates,
        structure,
        entities,
        legal_references,
        overview,
        sources
    )

    validate_result_against_document(result)

    return result
```

The exact implementation can be AI-assisted, deterministic, or hybrid
depending on the component.

------------------------------------------------------------------------

# 21. Recommended Hybrid Logic

For reliability, Service 1 can use a combination of deterministic
extraction and AI understanding.

``` text
                 DOCUMENT
                     ↓
              TEXT EXTRACTION
                     ↓
             STRUCTURE PARSING
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
DETERMINISTIC EXTRACTION       AI ANALYSIS
        ↓                         ↓
Dates / Sections / Pages      Document Type
Entities / Patterns           Meaning / Roles
        └────────────┬────────────┘
                     ↓
             RESULT VALIDATION
                     ↓
              SOURCE MAPPING
                     ↓
             STRUCTURED OUTPUT
```

This approach helps preserve predictable information such as page
numbers and section numbers while using AI for higher-level document
understanding.

------------------------------------------------------------------------

# 22. Deterministic Demo Mode

For the SIH MVP, the project allows deterministic mock/fixture
responses.

The architecture is:

``` text
Frontend
   ↓
FastAPI
   ↓
Service
   ↓
AI Gateway
   ↓
Mock Provider
   ↓
JSON Fixture
```

The Mock Provider should behave like a real AI provider from the
application's point of view.

Example fixture structure:

``` text
fixtures/
└── intelligence/
    └── document-001/
        ├── understanding.json
        ├── summary.json
        ├── extraction.json
        ├── risks.json
        ├── simplification.json
        ├── translation.json
        ├── judgment.json
        └── chat.json
```

For Service 1, the relevant fixture is:

``` text
understanding.json
```

The fixture must match the actual demo document.

Do not create random generic responses.

Do not put document-specific `if/else` logic inside API routers.
Document/action mapping belongs inside the Mock Provider or fixture
layer.

------------------------------------------------------------------------

# 23. Example Service 1 Answer

For a sample employment agreement, the answer could look like:

``` text
LEGAL DOCUMENT UNDERSTANDING

Document Type
Employment Agreement

Language
English

Parties
• Employer: ABC Private Limited
• Employee: [Name]

Important Dates
• Effective Date: 01 September 2026
• Duration: 2 years

Legal References
• Section 10
• Section 12

Document Structure
1. Introduction — Page 1
2. Employment Terms — Page 2
3. Compensation — Page 3
4. Responsibilities — Page 4
5. Termination — Page 7
6. Confidentiality — Page 8

Document Overview
This document is an employment agreement between the employer
and employee. It defines the terms of employment, responsibilities,
compensation and conditions relating to termination.

Sources
• Page 1
• Page 2
• Page 3
• Page 4
• Page 7
• Page 8
```

This is the **presentation style**. Actual values must be generated from
the uploaded document.

------------------------------------------------------------------------

# 24. Example for a Court Judgment

For a court judgment, the same service should adapt to the document
type.

``` text
LEGAL DOCUMENT UNDERSTANDING

Document Type
Court Judgment

Court
[Detected Court]

Case Number
[Detected Case Number]

Case Title
[Detected Case Title]

Parties
• Petitioner: [Name]
• Respondent: [Name]

Judgment Date
[Date]

Judges
• [Judge Name]

Legal References
• [Act / Section]
• [Precedent / Citation]

Document Structure
1. Background
2. Facts
3. Issues
4. Arguments
5. Legal Provisions
6. Court Reasoning
7. Decision
8. Final Order

Document Overview
This document is a court judgment concerning [document-supported
description].

Sources
Page 1 • Page 2 • Page 5 • Page 10
```

The judgment-specific deeper interpretation belongs primarily to
**Service 7 --- Court Judgment & Order Understanding**. Service 1
identifies the document and its structure; it should not duplicate the
complete judgment-analysis workflow.

------------------------------------------------------------------------

# 25. Example for a Legal Notice

``` text
LEGAL DOCUMENT UNDERSTANDING

Document Type
Legal Notice

Sender
[Detected Sender]

Recipient
[Detected Recipient]

Notice Date
[Detected Date]

Legal References
[Detected References]

Document Structure
1. Background
2. Facts
3. Legal Basis
4. Demand
5. Required Action
6. Deadline

Document Overview
This document is a legal notice concerning [document-supported
description].

Sources
Page 1 • Page 2 • Page 3
```

------------------------------------------------------------------------

# 26. Difference Between Service 1 and Other Services

## Service 1 --- Understanding

Answers:

> What is this document?

It identifies:

-   Type
-   Parties
-   Court/case information
-   Dates
-   Structure
-   Entities
-   Legal references
-   Language

## Service 2 --- Summarization

Answers:

> What does this document say in a concise form?

It produces:

-   TL;DR
-   Facts
-   Issues
-   Arguments
-   Reasoning
-   Decision
-   Outcome
-   Important points

## Service 3 --- Key Information Extraction

Answers:

> What specific information do I need from this document?

It extracts:

-   Obligations
-   Deadlines
-   Payment
-   Responsibilities
-   Rights
-   Termination
-   Penalties
-   Important clauses

## Service 4 --- Risk Detection

Answers:

> Which parts may create risk or concern?

It identifies:

-   Potentially unfavorable clauses
-   Penalties
-   Liability
-   Restrictions
-   Automatic renewal
-   One-sided obligations
-   Other supported risks

## Service 5 --- Multilingual Simplification

Answers:

> Can I understand this legal content in simple language and my regional
> language?

## Service 6 --- Document Q&A

Answers:

> Can I ask questions about this uploaded document?

## Service 7 --- Judgment Understanding

Answers:

> What happened in this court judgment and how did the court reach its
> decision?

## Service 8 --- Voice Assistant

Answers:

> Can I interact with this document using my regional language and
> voice?

------------------------------------------------------------------------

# 27. Important UI States

Service 1 should not only have a successful output screen.

It should support:

## Loading State

``` text
Understanding your document...

✓ Document uploaded
✓ Text extracted
✓ Document structure identified
● Understanding document
○ Preparing sources
```

## Success State

``` text
Document Understanding Complete

[Structured result]
```

## Empty / Missing Information

Example:

``` text
Case Number
Not identified in the uploaded document.
```

Do not invent a value.

## Error State

``` text
Unable to understand the document.

The document could not be processed successfully.
Please try uploading a readable document.
```

------------------------------------------------------------------------

# 28. Source and Evidence Design

Legal AI must be traceable.

A source card can look like:

``` text
SOURCE

Page 7
Clause 12.2

"Relevant source text..."

[View Page]
```

The user should be able to move from an extracted item to the
corresponding page or source when possible.

This supports the project's requirement for evidence and source
traceability.

------------------------------------------------------------------------

# 29. Confidence Handling

Confidence can be displayed where appropriate.

Example:

``` text
Document Type
Employment Agreement

Confidence
High
```

Or:

``` text
Document Type
Legal Agreement

Confidence
Medium

The document structure does not clearly identify a more specific type.
```

Confidence should not be presented as a guarantee of correctness.

If evidence is insufficient:

``` text
Not confidently identified from the uploaded document.
```

------------------------------------------------------------------------

# 30. Legal Safety Rules

Service 1 must not:

-   Invent parties
-   Invent dates
-   Invent case numbers
-   Invent legal sections
-   Invent court names
-   Invent clauses
-   Claim that a document is legally valid
-   Claim that a document is illegal
-   Provide unsupported legal conclusions
-   Pretend to be a lawyer
-   Guarantee legal outcomes

Its job is to **understand and organize what the document contains**.

For missing information:

``` text
This information could not be identified from the uploaded document.
```

For uncertain information:

``` text
This information could not be confidently verified from the
uploaded document.
```

------------------------------------------------------------------------

# 31. Backend API Concept

The project gives the following API principle:

``` text
POST /documents
GET /documents/{id}
POST /documents/{id}/summarize
POST /documents/{id}/analyze
POST /documents/{id}/risks
POST /documents/{id}/chat
POST /documents/{id}/simplify
POST /documents/{id}/translate
...
```

Service 1 can logically be represented by an analysis/understanding
endpoint according to the existing API standards.

A conceptual request:

``` http
POST /documents/{document_id}/analyze
```

A conceptual response:

``` json
{
  "document_id": "DOC-001",
  "service": "legal_document_understanding",
  "document_type": "...",
  "language": "...",
  "parties": [],
  "court": null,
  "case_number": null,
  "case_title": null,
  "dates": [],
  "sections": [],
  "clauses": [],
  "entities": [],
  "legal_references": [],
  "document_structure": [],
  "overview": "...",
  "sources": []
}
```

This is a conceptual structure; it should be reconciled with the
project's actual API contract before implementation.

------------------------------------------------------------------------

# 32. Frontend Component Structure

A possible frontend component organization is:

``` text
LegalWorkspace
│
├── DocumentHeader
│
├── ServiceSelector
│   └── UnderstandDocumentButton
│
├── UnderstandingPanel
│   ├── DocumentTypeCard
│   ├── PartiesCard
│   ├── CourtCaseCard
│   ├── DatesCard
│   ├── LanguageCard
│   ├── LegalReferencesCard
│   ├── EntitiesCard
│   ├── StructureCard
│   ├── OverviewCard
│   └── SourcesPanel
│
└── RelatedServices
    ├── Summarize
    ├── Extract
    ├── Detect Risks
    ├── Simplify
    └── Ask Document
```

Not every card needs to be displayed for every document type.

For example, a contract normally does not need an empty court card.

------------------------------------------------------------------------

# 33. Document-Type-Aware UI

The UI should adapt according to the document.

### Contract

Prioritize:

``` text
Document Type
Parties
Effective Date
Duration
Language
Sections
Clauses
Legal References
Overview
Sources
```

### Judgment

Prioritize:

``` text
Document Type
Court
Case Number
Case Title
Parties
Judgment Date
Judges
Legal References
Structure
Overview
Sources
```

### Legal Notice

Prioritize:

``` text
Document Type
Sender
Recipient
Date
Legal References
Structure
Overview
Sources
```

The project explicitly states that not every service needs to be
available for every document type, and the UI should prioritize
appropriate actions.

------------------------------------------------------------------------

# 34. Data Reuse

Service 1 should not create a completely separate document-processing
pipeline.

The common pipeline is:

``` text
UPLOAD
 ↓
VALIDATE
 ↓
STORE
 ↓
EXTRACT
 ↓
OCR IF REQUIRED
 ↓
STRUCTURE
 ↓
CHUNK
 ↓
UNDERSTAND
 ↓
INDEX
 ↓
READY
```

The resulting document context is reused by the other services.

For example:

``` text
Service 1
   ↓
Document Context
   ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Summary       Risk           Q&A
```

This reduces duplicated processing and keeps the system architecture
consistent.

------------------------------------------------------------------------

# 35. What Happens When the User Asks Through Chat

The service can also be triggered internally.

For example, the user asks:

> "What type of document is this?"

The system can internally use Service 1.

Another example:

> "Who are the parties in this agreement?"

The system can use the understanding/extraction capabilities already
created from the shared document context.

The project explicitly states that services are backend capabilities and
do not necessarily need to exist as separate pages.

------------------------------------------------------------------------

# 36. Service 1 End-to-End Flow

``` text
USER
 ↓
Uploads Legal Document
 ↓
Frontend
 ↓
FastAPI
 ↓
Document Validation
 ↓
Document Storage
 ↓
Text Extraction
 ↓
OCR if required
 ↓
Page Detection
 ↓
Structure Detection
 ↓
Document Type Detection
 ↓
Entity / Party / Date Extraction
 ↓
Legal Reference Detection
 ↓
AI Understanding
 ↓
Source Mapping
 ↓
Result Validation
 ↓
Structured JSON
 ↓
Frontend
 ↓
UNDERSTANDING SCREEN
```

------------------------------------------------------------------------

# 37. Business Rules

The main business rules are:

### Rule 1 --- Document First

The service must operate on the uploaded legal document.

### Rule 2 --- No Unsupported Information

If information is absent, do not invent it.

### Rule 3 --- Preserve Source

Page/section/clause references should be preserved whenever possible.

### Rule 4 --- Document-Type Awareness

The information displayed should depend on the type of legal document.

### Rule 5 --- Shared Context

Use the common document context rather than processing the same document
independently for every service.

### Rule 6 --- Legal Meaning Preservation

Understanding must preserve the meaning of the original document.

### Rule 7 --- No Legal Advice

The service explains the document; it does not replace professional
legal review.

### Rule 8 --- Provider Independence

The service should communicate through the AI Gateway rather than
directly depending on a specific AI provider.

### Rule 9 --- Demo Reliability

The SIH MVP should support deterministic fixture-based responses.

### Rule 10 --- Structured Output

The service must return structured data that the frontend can render
consistently.

------------------------------------------------------------------------

# 38. Validation of AI Output

Before displaying the result, the backend should validate the response.

Validation can check:

-   Required fields
-   Correct data types
-   Valid document ID
-   Valid page references
-   Valid source objects
-   No malformed structured output
-   No unsupported fields
-   Source availability
-   Consistency with extracted document context

If the AI produces unsupported information, the system should not
blindly display it.

------------------------------------------------------------------------

# 39. Testing Requirements

Service 1 should have test cases covering:

### Test 1 --- Contract

Input:

``` text
Employment Agreement
```

Expected:

``` text
Document type = Employment Agreement
Parties detected
Dates detected where present
Sections detected
Sources returned
```

### Test 2 --- Court Judgment

Expected:

``` text
Document type = Court Judgment
Court detected
Case information detected where present
Parties detected
Judgment date detected
Structure detected
```

### Test 3 --- Legal Notice

Expected:

``` text
Document type = Legal Notice
Sender detected
Recipient detected
Date detected
Structure detected
```

### Test 4 --- Missing Information

Expected:

``` text
Field = Not identified in uploaded document
```

The system must not invent data.

### Test 5 --- Scanned PDF

Expected:

``` text
Native extraction insufficient
→ OCR triggered
→ Text extracted
→ Understanding generated
```

### Test 6 --- Invalid Document

Expected:

``` text
Validation failure
→ Error state
```

### Test 7 --- Source Verification

Expected:

``` text
Extracted information
→ Page/section source
→ Source exists in document
```

------------------------------------------------------------------------

# 40. Acceptance Criteria

Service 1 can be considered complete when:

-   [ ] User can upload a supported legal document.
-   [ ] Document validation works.
-   [ ] Processing status is visible.
-   [ ] Text is extracted.
-   [ ] OCR is triggered only when required.
-   [ ] Document type can be identified.
-   [ ] Parties can be identified where present.
-   [ ] Court can be identified where applicable.
-   [ ] Case number can be identified where applicable.
-   [ ] Case title can be identified where applicable.
-   [ ] Important dates can be identified.
-   [ ] Sections can be identified.
-   [ ] Clauses can be identified.
-   [ ] Important entities can be identified.
-   [ ] Legal references can be identified.
-   [ ] Language can be identified.
-   [ ] Document structure can be displayed.
-   [ ] A short document overview can be displayed.
-   [ ] Sources/page references are shown where possible.
-   [ ] Missing information is not invented.
-   [ ] Errors are handled.
-   [ ] Loading state is handled.
-   [ ] Empty/missing fields are handled.
-   [ ] Output is structured.
-   [ ] Frontend renders the result.
-   [ ] Backend implements the service.
-   [ ] Mock/demo mode is supported.
-   [ ] Test cases are available.
-   [ ] Legal-safety requirements are respected.

------------------------------------------------------------------------

# 41. SIH Demo Presentation

For the SIH demonstration, Service 1 should be shown quickly and
visually.

Recommended flow:

``` text
1. Upload Indian legal document
          ↓
2. Show processing
          ↓
3. Document becomes READY
          ↓
4. Click "Understand Document"
          ↓
5. Show Document Type
          ↓
6. Show Parties
          ↓
7. Show Court / Case details if applicable
          ↓
8. Show Important Dates
          ↓
9. Show Document Structure
          ↓
10. Show Legal References
          ↓
11. Show Overview
          ↓
12. Click source/page
          ↓
13. Continue to Summary / Simplification / Q&A
```

This demonstrates that the application first **understands the
document** and then allows the user to perform the other legal AI
operations.

------------------------------------------------------------------------

# 42. What Service 1 Is NOT

Service 1 should not become:

-   A generic chatbot
-   A legal search engine
-   A full legal research system
-   A legal advice system
-   A contract risk analyzer
-   A summarizer only
-   A translator
-   A replacement for a lawyer
-   A separate document-processing application

Its specific responsibility is:

> **Understand and organize the identity, nature, structure, metadata,
> and important document-supported information of the uploaded legal
> document.**

------------------------------------------------------------------------

# 43. Final Service 1 Architecture

``` text
                         USER
                           │
                           ▼
                CHATGPT-LIKE WORKSPACE
                           │
                           ▼
                    REACT FRONTEND
                           │
                           ▼
                    FASTAPI BACKEND
                           │
                           ▼
                 DOCUMENT SERVICE
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        TEXT EXTRACTION              OCR
              │                  (if required)
              └────────────┬────────────┘
                           ▼
                  DOCUMENT CONTEXT
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Structure      Metadata      Entities
              │            │            │
              └────────────┼────────────┘
                           ▼
                  UNDERSTANDING SERVICE
                           │
                           ▼
                      AI GATEWAY
                           │
                    ┌──────┴──────┐
                    ▼             ▼
               Mock Provider   Real Provider
                    │             │
                    └──────┬──────┘
                           ▼
                  STRUCTURED OUTPUT
                           │
                           ▼
                  SOURCE VALIDATION
                           │
                           ▼
                    REACT FRONTEND
                           │
                           ▼
             LEGAL DOCUMENT UNDERSTANDING
```

------------------------------------------------------------------------

# 44. Final Answer Structure for the User

The final Service 1 response should conceptually follow:

``` text
LEGAL DOCUMENT UNDERSTANDING

1. Document Type
   [Value]
   [Confidence if appropriate]

2. Parties
   [Party 1]
   [Party 2]

3. Court / Case Information
   [Only when applicable]

4. Important Dates
   [Date + description]

5. Language
   [Detected language]

6. Legal References
   [Acts / Sections / Citations]

7. Important Entities
   [Entities and roles]

8. Document Structure
   [Sections / clauses + pages]

9. Document Overview
   [Short document-supported explanation]

10. Sources
    [Page / section / clause evidence]

[Summarize]
[Extract Key Information]
[Detect Risks]
[Simplify & Translate]
[Ask Document]
```

------------------------------------------------------------------------

# 45. Core Principle

The most important rule for Service 1 is:

``` text
DO NOT JUST READ THE DOCUMENT.
UNDERSTAND ITS STRUCTURE AND IDENTITY.

DO NOT INVENT INFORMATION.
USE ONLY DOCUMENT-SUPPORTED INFORMATION.

DO NOT RETURN A GIANT PARAGRAPH.
RETURN STRUCTURED INFORMATION.

DO NOT LOSE PAGE/SECTION CONTEXT.
PRESERVE SOURCE EVIDENCE.

DO NOT CREATE A SEPARATE PIPELINE FOR EVERY SERVICE.
BUILD A SHARED DOCUMENT CONTEXT.

DO NOT GIVE LEGAL ADVICE.
HELP THE USER UNDERSTAND THE DOCUMENT.
```

Therefore, **Service 1 is the foundation layer of the Legal AI
Workspace**. It converts the uploaded legal document from an
unstructured file into a structured, traceable document context that the
remaining services can reuse.
