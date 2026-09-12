# SERVICE 6 --- DOCUMENT Q&A / LEGAL AI CHAT

## 1. Service Overview

**Service Name:** Document Q&A / Legal AI Chat

**Service Number:** 6

**Project:** AI-Driven Multilingual Legal Document Simplifier

**Purpose:**\
Allow the user to ask questions about an uploaded legal document and
receive clear, document-grounded answers supported by evidence from that
document.

Service 6 is **not a generic chatbot**. It is a conversational interface
specifically connected to the user's uploaded legal document.

The user should feel that they are **chatting with their legal
document**.

------------------------------------------------------------------------

# 2. Position of Service 6 in the Project

The project's overall experience is:

``` text
COMPLEX LEGAL DOCUMENT
        ↓
DOCUMENT UNDERSTANDING
        ↓
IMPORTANT INFORMATION EXTRACTION
        ↓
LEGAL SUMMARY
        ↓
PLAIN-LANGUAGE SIMPLIFICATION
        ↓
REGIONAL-LANGUAGE SIMPLIFICATION
        ↓
ASK QUESTIONS ABOUT THE DOCUMENT
        ↓
SOURCE / PAGE EVIDENCE
```

Service 6 represents the **ASK QUESTIONS ABOUT THE DOCUMENT** stage.

The service must reuse the shared document context instead of creating a
separate document-processing pipeline.

------------------------------------------------------------------------

# 3. Main Objective

The main objective is to let users ask natural-language questions such
as:

-   What is this agreement about?
-   What are my responsibilities?
-   What happens if I terminate this agreement?
-   What did the court decide?
-   Explain section 4.
-   Explain this in simple Tamil.
-   Is there a deadline?
-   What penalty is mentioned?
-   Who is responsible for payment?

The answer must be based primarily on the uploaded document whenever the
question is document-specific.

------------------------------------------------------------------------

# 4. What the User Sees

After the document is uploaded, processed, and marked **READY**, the
user can select:

``` text
[ Ask Document ]
```

The user is then shown a conversational screen.

Example:

``` text
┌─────────────────────────────────────────────────────────────┐
│                    ASK YOUR DOCUMENT                        │
│                                                             │
│ Ask questions about your uploaded legal document.           │
│                                                             │
│ Suggested Questions                                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ What is this document about?                            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ What are my responsibilities?                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Are there any deadlines?                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ What happens if I terminate the agreement?              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Language: English ▼                                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ask a question about this document...             ➤     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

The application remains inside the single Legal AI Workspace.

------------------------------------------------------------------------

# 5. How the Service Answer Will Look

Answers should not be displayed as one large, unstructured paragraph.

A typical response should contain:

1.  Direct answer
2.  Important points where needed
3.  Source/evidence
4.  Page number
5.  Section/clause where available
6.  Option to view the source in the document

Example:

``` text
USER

What happens if I terminate this agreement?


AI ANSWER

You can terminate the agreement by providing 30 days'
written notice to the other party.

If the required notice is not provided, the agreement
continues according to the termination conditions
specified in the contract.


SOURCE / EVIDENCE

Document: Lease Agreement
Page: 7
Clause: 12.2

Relevant source text:
[Relevant clause shown here]

[ View Source ]
```

The exact answer depends on the actual contents of the uploaded
document.

The system must never create facts that are not supported by the
document.

------------------------------------------------------------------------

# 6. Short Answer Format

For simple questions, the answer can be compact:

``` text
🤖 Answer

The tenant must pay the monthly rent by the date
specified in the agreement.

📌 Source
Page 5 • Clause 8.1

[ View Source ]
```

------------------------------------------------------------------------

# 7. Detailed Answer Format

For questions requiring multiple pieces of information:

``` text
🤖 Answer

According to the agreement, the tenant has the
following responsibilities:

• Pay rent according to the agreed schedule.
• Maintain the premises.
• Follow the conditions specified in the agreement.

📌 Evidence

Page 5
Clause 8

[ View Source ]
```

The UI should adapt the response size to the question.

------------------------------------------------------------------------

# 8. Source / Evidence Display

Source traceability is a core requirement.

Whenever possible, the answer should show:

``` text
📌 Evidence

Page: 7
Section: Termination
Clause: 12.2

[Relevant source text]

[ View Source ]
```

The shared source system may provide:

-   Document ID
-   Page number
-   Section
-   Clause
-   Source chunk
-   Citation
-   Relevant source text
-   Grounding/confidence information where appropriate

The user should be able to verify where the answer came from.

------------------------------------------------------------------------

# 9. View Source Behavior

When the user selects **View Source**:

``` text
┌───────────────────────┬─────────────────────────────────────┐
│ DOCUMENT              │ AI ANSWER                          │
│                       │                                     │
│ Page 7                │ You can terminate the agreement    │
│                       │ by providing 30 days' notice.       │
│ Clause 12.2           │                                     │
│                       │ SOURCE                              │
│ ┌───────────────────┐ │ Page 7                              │
│ │ Relevant clause   │ │ Clause 12.2                        │
│ │ highlighted in    │ │                                     │
│ │ the document      │ │ [Open Page]                        │
│ └───────────────────┘ │                                     │
└───────────────────────┴─────────────────────────────────────┘
```

The source should point to the most relevant page, section, clause, or
retrieved document chunk available.

------------------------------------------------------------------------

# 10. How the Answer Is Got

The answer-generation process is:

``` text
USER QUESTION
      ↓
QUESTION UNDERSTANDING
      ↓
IDENTIFY DOCUMENT-RELATED INTENT
      ↓
SEARCH / RETRIEVE RELEVANT DOCUMENT CONTENT
      ↓
SELECT RELEVANT CHUNKS
      ↓
BUILD DOCUMENT CONTEXT
      ↓
SEND CONTEXT + QUESTION TO AI GATEWAY
      ↓
AI GENERATES GROUNDED ANSWER
      ↓
SOURCE / EVIDENCE VALIDATION
      ↓
STRUCTURED RESPONSE
      ↓
FRONTEND
      ↓
USER
```

For the MVP, deterministic fixture retrieval may simulate this process.

For production, the retrieval layer can use embeddings, semantic search,
vector databases, reranking, and context assembly.

------------------------------------------------------------------------

# 11. Detailed Working Logic

## Step 1 --- User Uploads Document

The user uploads a legal document.

Possible documents include:

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

------------------------------------------------------------------------

## Step 2 --- Document Processing

The shared document pipeline processes the document:

``` text
UPLOAD
  ↓
VALIDATE
  ↓
STORE
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
INDEXING
  ↓
READY
```

Service 6 should not duplicate this pipeline.

------------------------------------------------------------------------

# 12. Shared Document Context

Service 6 uses the existing document context.

The context may contain:

``` text
Document ID
Document Type
Language
Pages
Extracted Text
Sections
Clauses
Entities
Chunks
Metadata
Sources
Citations
Relevant Retrieved Content
```

This shared context is important because all services should operate on
the same processed document.

------------------------------------------------------------------------

# 13. Step 3 --- User Asks a Question

Example:

``` text
What are my responsibilities?
```

The frontend sends the question to the backend.

Conceptually:

``` text
POST /documents/{id}/chat
```

The frontend should not directly access the database, AI provider,
vector database, or file system.

------------------------------------------------------------------------

# 14. Step 4 --- Question Understanding

The backend determines:

-   What is the user asking?
-   Is the question about the uploaded document?
-   Which parts of the document may contain the answer?
-   Does the question require a specific clause?
-   Does the question require a page-level citation?
-   Is the requested language different from the document language?

Example:

``` text
Question:
"What are my responsibilities?"

Intent:
Document Q&A

Topic:
Responsibilities / obligations

Required context:
Relevant obligation clauses
```

------------------------------------------------------------------------

# 15. Step 5 --- Document Retrieval

The system retrieves relevant document content.

Conceptual flow:

``` text
QUESTION
   ↓
QUERY PROCESSING
   ↓
DOCUMENT RETRIEVAL
   ↓
RELEVANT CHUNKS
```

For example:

``` text
Question:
"What happens if I terminate the agreement?"

Retrieved content:

Page 7
Clause 12.2
Termination conditions
```

Only relevant content should be supplied to the AI whenever possible.

------------------------------------------------------------------------

# 16. Step 6 --- AI Answer Generation

The AI receives:

``` text
User Question
+
Document Context
+
Relevant Retrieved Content
+
Answer Language
+
Grounding Rules
```

The AI then generates the answer.

The prompt should instruct the model to:

-   Use the supplied document/context for document-specific questions.
-   Do not invent facts.
-   Preserve legal meaning.
-   Use simple language.
-   Clearly separate document facts from general legal knowledge.
-   Cite source pages/sections where possible.
-   Respect the selected language.
-   State uncertainty when evidence is insufficient.

------------------------------------------------------------------------

# 17. Step 7 --- Evidence Validation

Before the answer reaches the user, the system should check whether the
answer has supporting evidence.

Conceptually:

``` text
AI ANSWER
   ↓
SOURCE CHECK
   ↓
SUPPORTED?
   ├── YES → SHOW ANSWER + SOURCE
   │
   └── NO  → MODIFY / REJECT / RETURN UNCERTAINTY
```

The purpose is to reduce unsupported answers.

------------------------------------------------------------------------

# 18. Step 8 --- Structured Output

The backend should return structured data rather than only raw text.

Example:

``` json
{
  "answer": "You can terminate the agreement by providing 30 days' written notice.",
  "language": "en",
  "sources": [
    {
      "page": 7,
      "section": "Termination",
      "clause": "12.2",
      "text": "Relevant source text..."
    }
  ],
  "grounded": true
}
```

The exact schema can evolve with the project's API standards.

------------------------------------------------------------------------

# 19. Step 9 --- Frontend Rendering

The frontend converts the structured response into:

``` text
AI ANSWER
    ↓
KEY INFORMATION
    ↓
SOURCE
    ↓
PAGE / CLAUSE
    ↓
VIEW SOURCE
```

The user sees an understandable answer rather than raw JSON.

------------------------------------------------------------------------

# 20. Follow-Up Questions

Service 6 must support conversational follow-ups.

Example:

``` text
User:
What is this agreement about?

AI:
This is a lease agreement between the landlord and tenant...


User:
What are my responsibilities?

AI:
Your main responsibilities are...


User:
What happens if I don't pay rent?

AI:
According to Clause 9...


User:
Explain that in Tamil.

AI:
[Simple Tamil explanation]
```

The same document remains active throughout the conversation.

------------------------------------------------------------------------

# 21. Conversation Context

The service should maintain enough conversation context to understand
follow-up questions.

Example:

``` text
User:
What is the termination period?

AI:
30 days.

User:
What happens if I don't give it?
```

The system should understand that **"it"** refers to the termination
notice.

However, document evidence remains the primary authority for
document-specific answers.

------------------------------------------------------------------------

# 22. Multilingual Q&A

Service 6 should work with regional languages.

Example:

``` text
User:
இந்த agreement-ல் என்னுடைய responsibilities என்ன?
```

The system should:

``` text
Regional-language question
        ↓
Question understanding
        ↓
Relevant document retrieval
        ↓
Answer generation
        ↓
Regional-language response
        ↓
Source evidence
```

Example:

``` text
🤖 பதில்

இந்த ஒப்பந்தத்தின்படி, உங்கள் முக்கிய பொறுப்புகள்
குறிப்பிட்ட காலத்திற்குள் பணம் செலுத்துதல் மற்றும்
ஒப்பந்தத்தில் குறிப்பிடப்பட்ட நிபந்தனைகளைப் பின்பற்றுதல்.

📌 ஆதாரம்
Page 5 • Clause 8
```

------------------------------------------------------------------------

# 23. Language Selection

The interface may provide:

``` text
Answer Language: English ▼
```

Possible languages:

-   English
-   Tamil
-   Hindi
-   Telugu
-   Malayalam
-   Kannada
-   Bengali
-   Marathi
-   Other supported Indian languages

The architecture must allow additional languages later.

------------------------------------------------------------------------

# 24. Question Types

Service 6 should support different document-grounded question types.

## A. General document questions

``` text
What is this document about?
```

## B. Responsibility questions

``` text
What are my responsibilities?
```

## C. Obligation questions

``` text
What am I required to do?
```

## D. Deadline questions

``` text
Is there a deadline?
```

## E. Payment questions

``` text
Who is responsible for payment?
```

## F. Penalty questions

``` text
What penalty is mentioned?
```

## G. Termination questions

``` text
What happens if I terminate this agreement?
```

## H. Clause questions

``` text
Explain clause 7.
```

## I. Judgment questions

``` text
What did the court decide?
```

## J. Simplification questions

``` text
Explain this in simple language.
```

## K. Regional-language questions

``` text
இந்த judgment-ஐ simple-ஆ explain பண்ணுங்க.
```

------------------------------------------------------------------------

# 25. Handling Information Not Present

This is a critical business rule.

If the information cannot be found in the uploaded document, the system
should respond:

``` text
I could not find this information in the uploaded document.
```

It should not guess.

Example:

``` text
User:
What is the lawyer's phone number?

AI:
I could not find this information in the uploaded document.
```

Do not generate:

``` text
The lawyer's phone number is 9876543210.
```

unless that information actually exists in the document and is supported
by evidence.

------------------------------------------------------------------------

# 26. Handling Ambiguous Questions

If the question is unclear:

``` text
User:
What about termination?
```

The AI can answer from the available termination content if the intent
is sufficiently clear.

If clarification is genuinely necessary:

``` text
Could you clarify whether you want to know:

• The termination procedure
• The notice period
• The termination penalty
```

The system should avoid inventing an interpretation when the document
context is insufficient.

------------------------------------------------------------------------

# 27. Document vs General Legal Knowledge

The service must distinguish between:

``` text
WHAT THE DOCUMENT SAYS
```

and:

``` text
WHAT LAW GENERALLY SAYS
```

For example:

``` text
User:
What does this contract say about termination?
```

Use the uploaded document.

If the user asks:

``` text
Is this termination clause generally enforceable under Indian law?
```

that is a broader legal question and may require a separate
legal-knowledge capability and appropriate caution.

Service 6 should not silently present general legal knowledge as if it
came from the uploaded document.

------------------------------------------------------------------------

# 28. Legal Safety

Service 6 is an explanation and document-understanding service.

It should:

-   Explain
-   Simplify
-   Answer document questions
-   Extract relevant information
-   Highlight evidence
-   Communicate uncertainty

It should not:

-   Invent laws
-   Invent court decisions
-   Invent clauses
-   Claim unsupported certainty
-   Pretend to be a lawyer
-   Guarantee legal outcomes

For high-risk legal decisions, appropriate professional/legal review
should be recommended.

------------------------------------------------------------------------

# 29. Business Logic of Service 6

The core business logic is:

``` text
IF document is not READY
    → Do not process Q&A
    → Show document processing status

IF document is READY
    → Accept user question

IF question is document-specific
    → Retrieve relevant document content
    → Generate answer from document context
    → Attach source evidence
    → Return structured answer

IF information is not present
    → Return "I could not find this information
       in the uploaded document."

IF evidence is insufficient
    → Communicate uncertainty
    → Do not fabricate an answer

IF user requests another language
    → Generate the grounded answer in selected language
    → Preserve legal meaning
    → Keep source evidence

IF user asks a follow-up
    → Use conversation context
    → Retrieve relevant document content again
    → Generate grounded response
```

------------------------------------------------------------------------

# 30. Core Business Rule

The most important rule is:

``` text
DOCUMENT > GENERAL KNOWLEDGE
```

For questions specifically asking about the uploaded document, the
uploaded document is the primary source.

The AI must not replace missing document information with guesses.

------------------------------------------------------------------------

# 31. Service 6 Architecture

The high-level architecture is:

``` text
USER
  ↓
REACT FRONTEND
  ↓
FASTAPI BACKEND
  ↓
DOCUMENT Q&A SERVICE
  ↓
SHARED DOCUMENT CONTEXT
  ↓
QUERY PROCESSING
  ↓
DOCUMENT RETRIEVAL
  ↓
RELEVANT CHUNKS
  ↓
AI GATEWAY
  ↓
MOCK / REAL AI PROVIDER
  ↓
STRUCTURED OUTPUT
  ↓
SOURCE VALIDATION
  ↓
FRONTEND
  ↓
USER
```

The frontend should not directly communicate with the AI provider.

------------------------------------------------------------------------

# 32. AI Gateway

Service 6 should communicate with the provider through the project's AI
Gateway.

Conceptually:

``` text
Document Q&A Service
        ↓
AI Gateway
        ↓
Provider
```

Possible providers include:

-   Gemini
-   OpenAI
-   Claude
-   Mistral
-   Groq
-   Local/open-source models

The frontend should not know which provider is being used.

------------------------------------------------------------------------

# 33. Deterministic Demo Mode

For the SIH MVP, Service 6 can use deterministic mock responses.

Architecture:

``` text
Frontend
   ↓
FastAPI
   ↓
Document Q&A Service
   ↓
AI Gateway
   ↓
Mock Provider
   ↓
JSON Fixture
```

This provides:

-   Reliable demonstration
-   Predictable outputs
-   No dependency on internet/API availability
-   Stable judge presentation
-   Repeatable results

The mock provider should behave like a real AI provider from the
application's perspective.

------------------------------------------------------------------------

# 34. Mock Fixture Structure

A document-specific fixture may contain:

``` text
fixtures/
└── intelligence/
    └── document-001/
        └── chat.json
```

Example:

``` json
{
  "questions": [
    {
      "question": "What is this agreement about?",
      "answer": "This is a lease agreement...",
      "sources": [
        {
          "page": 1,
          "section": "Purpose"
        }
      ]
    }
  ]
}
```

Do not put document-specific `if/else` logic inside API routers.

Document/action mapping belongs in the Mock Provider / fixture layer.

------------------------------------------------------------------------

# 35. Real RAG Mode

For production, the service can use:

``` text
USER QUESTION
      ↓
QUERY PROCESSING
      ↓
EMBEDDING / SEMANTIC SEARCH
      ↓
VECTOR DATABASE
      ↓
RELEVANT CHUNKS
      ↓
RERANKING
      ↓
CONTEXT ASSEMBLY
      ↓
AI MODEL
      ↓
ANSWER
      ↓
CITATIONS
```

Possible components:

-   Embeddings
-   Vector database
-   Semantic retrieval
-   Reranking
-   Context assembly
-   Grounded generation

The uploaded document remains the primary source for document-specific
questions.

------------------------------------------------------------------------

# 36. API Concept

A conceptual endpoint is:

``` text
POST /documents/{id}/chat
```

Request:

``` json
{
  "message": "What are my responsibilities?",
  "language": "en"
}
```

Response:

``` json
{
  "answer": "Your main responsibilities include...",
  "language": "en",
  "sources": [
    {
      "page": 5,
      "section": "Responsibilities",
      "clause": "8"
    }
  ]
}
```

The exact endpoint and schema must remain consistent with the existing
project API standards.

------------------------------------------------------------------------

# 37. Input Contract

Service 6 should accept at minimum:

``` text
document_id
user_question
selected_language
conversation_context (when required)
```

Optional information may include:

``` text
conversation_id
message_id
requested_source_detail
```

------------------------------------------------------------------------

# 38. Output Contract

The service should return structured information such as:

``` text
answer
language
sources
grounded status
confidence/grounding information where appropriate
```

Example:

``` json
{
  "answer": "...",
  "language": "ta",
  "sources": [
    {
      "page": 7,
      "section": "Termination",
      "clause": "12.2",
      "text": "..."
    }
  ],
  "grounded": true
}
```

------------------------------------------------------------------------

# 39. Loading State

While processing:

``` text
🤖 Analyzing your document...

Finding the relevant section...
```

Possible stages:

``` text
Understanding question...
Finding relevant content...
Generating answer...
Checking sources...
```

The exact stages depend on backend implementation.

------------------------------------------------------------------------

# 40. Empty State

Before the first question:

``` text
Ask anything about this document

I can help you understand:

✓ Responsibilities
✓ Deadlines
✓ Payments
✓ Penalties
✓ Clauses
✓ Termination
✓ Court decisions
✓ Other information found in the document
```

------------------------------------------------------------------------

# 41. Error State

If the request fails:

``` text
Unable to answer right now.

Please try again.

[ Retry ]
```

Do not display raw backend errors to normal users.

------------------------------------------------------------------------

# 42. Document Processing Error

If the document is not ready:

``` text
Your document is still being processed.

Please wait until processing is complete
before asking questions.
```

If processing failed:

``` text
The document could not be processed.

Please upload the document again or try another file.
```

------------------------------------------------------------------------

# 43. Conversation History

The UI should display the conversation in chronological order:

``` text
USER QUESTION
      ↓
AI ANSWER
      ↓
SOURCE
      ↓
USER FOLLOW-UP
      ↓
AI ANSWER
      ↓
SOURCE
```

This makes the workspace feel conversational rather than like a
collection of independent search boxes.

------------------------------------------------------------------------

# 44. Page Navigation

When evidence is available, the user should be able to navigate directly
to the relevant page.

Example:

``` text
Source: Page 7 • Clause 12.2

[ View Source ]
```

Clicking it can open the document preview at Page 7.

------------------------------------------------------------------------

# 45. Interaction With Other Services

Service 6 should reuse other capabilities when required.

Example:

``` text
User:
Explain clause 7 in Tamil.

Service 6
   ↓
Find Clause 7
   ↓
Document Context
   ↓
Plain-Language Simplification
   ↓
Regional Language Simplification
   ↓
Answer + Evidence
```

Another example:

``` text
User:
What are the risky clauses?

Service 6
   ↓
Legal Risk Detection capability
   ↓
Relevant risk information
   ↓
Answer + Evidence
```

Services are backend capabilities and do not necessarily need to become
separate UI pages.

------------------------------------------------------------------------

# 46. Interaction With Judgment Understanding

For a judgment:

``` text
User:
What did the court finally decide?

Service 6
      ↓
Judgment Understanding
      ↓
Relevant decision / final order
      ↓
Document Q&A
      ↓
Answer
      ↓
Page / source evidence
```

This allows Service 6 to act as the conversational access layer over
specialized legal analysis.

------------------------------------------------------------------------

# 47. Interaction With Multilingual Simplification

For:

``` text
Explain section 4 in simple Tamil.
```

The workflow becomes:

``` text
Question
   ↓
Find Section 4
   ↓
Understand legal meaning
   ↓
Simplify
   ↓
Tamil explanation
   ↓
Attach original source
```

The system must preserve the legal meaning during simplification.

------------------------------------------------------------------------

# 48. UI Components Required

Service 6 frontend can contain:

``` text
1. Service Header
2. Document Name
3. Language Selector
4. Chat History
5. User Message Bubble
6. AI Answer Card
7. Suggested Question Cards
8. Source / Evidence Card
9. View Source Button
10. Page Navigation
11. Question Input
12. Send Button
13. Voice Input Button where available
14. Loading Indicator
15. Error State
16. Empty State
```

These should remain inside the unified Legal AI Workspace.

------------------------------------------------------------------------

# 49. Accessibility

The interface should support:

-   Regional-language questions
-   Simple explanations
-   Clear typography
-   Readable answer cards
-   Source visibility
-   Voice input where the voice service is available
-   Keyboard-friendly interaction
-   Clear loading and error messages

Service 6 should make legal information accessible to non-lawyers.

------------------------------------------------------------------------

# 50. Security Considerations

Because uploaded legal documents may contain sensitive information:

-   Authenticate users.
-   Authorize document access.
-   Ensure users can access only documents they are permitted to view.
-   Do not expose document content through unauthorized APIs.
-   Protect AI provider credentials.
-   Keep provider credentials out of the frontend.
-   Log important operations appropriately.
-   Follow the project's audit/security architecture.

------------------------------------------------------------------------

# 51. Performance Considerations

The service should avoid reprocessing the entire document for every
question.

Instead:

``` text
DOCUMENT PROCESSED ONCE
        ↓
SHARED DOCUMENT CONTEXT
        ↓
RETRIEVE ONLY RELEVANT CONTENT
        ↓
ANSWER
```

This reduces unnecessary computation and improves response time.

------------------------------------------------------------------------

# 52. Hallucination Prevention

Important controls:

``` text
1. Retrieve relevant document content.
2. Provide retrieved content to the AI.
3. Instruct AI to stay grounded.
4. Validate sources.
5. Reject unsupported claims where possible.
6. Tell the user when information is unavailable.
```

Never claim that the system has zero hallucinations.

------------------------------------------------------------------------

# 53. Important Prompt Rules

The Service 6 AI prompt should communicate:

``` text
You are answering a question about an uploaded legal document.

Use the supplied document context as the primary source.

Do not invent facts, clauses, dates, parties, legal provisions,
court decisions, or other information.

If the requested information is not present in the supplied
document context, clearly say that you could not find it.

Preserve the legal meaning.

Answer in the user's selected language.

Use simple language where appropriate.

Provide source/page/section/clause evidence whenever available.

Do not present unsupported general legal knowledge as if it came
from the uploaded document.
```

------------------------------------------------------------------------

# 54. Example --- Contract

### User Question

``` text
What is my notice period?
```

### Internal Logic

``` text
Question
   ↓
Identify topic = termination / notice
   ↓
Retrieve termination clauses
   ↓
Find relevant clause
   ↓
Generate answer
   ↓
Attach source
```

### User Output

``` text
🤖 Answer

The agreement requires 30 days' written notice
before termination.

📌 Source
Page 7 • Clause 12.2

[ View Source ]
```

------------------------------------------------------------------------

# 55. Example --- Court Judgment

### User Question

``` text
What did the court finally decide?
```

### Internal Logic

``` text
Question
   ↓
Identify judgment decision intent
   ↓
Retrieve decision / final order
   ↓
Use Judgment Understanding context
   ↓
Generate concise answer
   ↓
Attach judgment source
```

### User Output

``` text
🤖 Court Decision

The court dismissed the petition and upheld the
decision described in the final order.

📌 Source
Page 38 • Final Order

[ View Source ]
```

The exact answer must always come from the actual judgment.

------------------------------------------------------------------------

# 56. Example --- Missing Information

### User Question

``` text
What is the lawyer's email address?
```

### Output

``` text
🤖 Answer

I could not find the lawyer's email address
in the uploaded document.

📌 Evidence
No supporting information was found.
```

------------------------------------------------------------------------

# 57. Example --- Regional Language

### User Question

``` text
இந்த agreement-ல் என்னுடைய responsibilities என்ன?
```

### Output

``` text
🤖 பதில்

இந்த ஒப்பந்தத்தின்படி, உங்கள் முக்கிய பொறுப்புகள்
குறிப்பிட்ட காலத்திற்குள் பணம் செலுத்துதல் மற்றும்
ஒப்பந்தத்தில் குறிப்பிடப்பட்ட நிபந்தனைகளைப் பின்பற்றுதல்.

📌 ஆதாரம்
Page 5 • Clause 8
```

------------------------------------------------------------------------

# 58. Acceptance Criteria

Service 6 is considered complete when:

-   [ ] User can select **Ask Document**.
-   [ ] User can type a question.
-   [ ] Backend receives the document ID and question.
-   [ ] The question is processed using the shared document context.
-   [ ] Relevant document content is retrieved.
-   [ ] AI generates a document-grounded answer.
-   [ ] Answer is rendered in a structured UI.
-   [ ] Source evidence is displayed when available.
-   [ ] Page/section/clause information is shown when available.
-   [ ] User can open the source.
-   [ ] User can ask follow-up questions.
-   [ ] User can change answer language.
-   [ ] Missing information produces a safe "not found" response.
-   [ ] Loading state is available.
-   [ ] Error state is available.
-   [ ] Authentication/authorization is respected.
-   [ ] Mock/demo mode works deterministically.
-   [ ] At least one test covers a grounded answer.
-   [ ] At least one test covers missing information.
-   [ ] At least one test covers source evidence.
-   [ ] At least one test covers a follow-up question.
-   [ ] At least one test covers multilingual output.

------------------------------------------------------------------------

# 59. Testing Examples

## Test 1 --- Basic Question

Input:

``` text
What is this agreement about?
```

Expected:

``` text
Relevant document explanation
+
Source
```

------------------------------------------------------------------------

## Test 2 --- Clause Question

Input:

``` text
Explain clause 7.
```

Expected:

``` text
Clause 7 explanation
+
Clause 7 source
```

------------------------------------------------------------------------

## Test 3 --- Missing Information

Input:

``` text
What is the lawyer's phone number?
```

Expected:

``` text
I could not find this information in the uploaded document.
```

------------------------------------------------------------------------

## Test 4 --- Follow-Up

Input sequence:

``` text
What is the termination period?
```

then:

``` text
What happens if I don't follow it?
```

Expected:

The second answer should use the conversation context and retrieve
relevant termination information.

------------------------------------------------------------------------

## Test 5 --- Regional Language

Input:

``` text
இந்த agreement-ல் என்னுடைய responsibilities என்ன?
```

Expected:

``` text
Tamil answer
+
Relevant source
```

------------------------------------------------------------------------

# 60. Service 6 Data Flow

``` text
                  ┌──────────────────────┐
                  │       USER           │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  CHAT UI             │
                  │  Question + Language │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  FASTAPI BACKEND     │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ DOCUMENT Q&A SERVICE │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
      ┌──────────────────┐       ┌─────────────────┐
      │ Conversation     │       │ Document        │
      │ Context          │       │ Context         │
      └────────┬─────────┘       └────────┬────────┘
               │                          │
               └────────────┬─────────────┘
                            ▼
                  ┌──────────────────────┐
                  │ Document Retrieval   │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Relevant Chunks      │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ AI Gateway           │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ AI Provider          │
                  │ Mock / Real          │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Answer + Sources     │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Source Validation    │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Frontend Answer Card │
                  └──────────────────────┘
```

------------------------------------------------------------------------

# 61. What Service 6 Is NOT

Service 6 is not:

-   A generic ChatGPT clone
-   A general-purpose chatbot
-   A legal search engine
-   A replacement for a lawyer
-   A standalone translation tool
-   A system that answers from arbitrary internet knowledge
-   A system that invents missing document information

Its purpose is specifically:

``` text
CHAT
+
UPLOADED LEGAL DOCUMENT
+
DOCUMENT RETRIEVAL
+
GROUNDED AI ANSWER
+
SOURCE EVIDENCE
```

------------------------------------------------------------------------

# 62. Relationship With the Main Project

The project combines:

``` text
LEGAL DOCUMENT UNDERSTANDING
        +
LEGAL SIMPLIFICATION
        +
SUMMARIZATION
        +
MULTILINGUAL ACCESSIBILITY
        +
DOCUMENT-GROUNDED AI
```

Service 6 is the conversational layer that allows the user to access
this intelligence naturally through questions.

------------------------------------------------------------------------

# 63. Recommended User Experience

The ideal experience is:

``` text
UPLOAD DOCUMENT
      ↓
DOCUMENT READY
      ↓
SELECT "ASK DOCUMENT"
      ↓
SEE SUGGESTED QUESTIONS
      ↓
ASK QUESTION
      ↓
GET SIMPLE ANSWER
      ↓
SEE PAGE / CLAUSE EVIDENCE
      ↓
OPEN SOURCE
      ↓
ASK FOLLOW-UP
      ↓
CHANGE LANGUAGE IF REQUIRED
      ↓
CONTINUE CHAT
```

The user should never need to understand the internal retrieval, RAG, AI
Gateway, or provider architecture.

------------------------------------------------------------------------

# 64. Final Service 6 Logic

The complete business logic can be summarized as:

``` text
IF document is READY
    ACCEPT QUESTION

    UNDERSTAND QUESTION

    IDENTIFY RELEVANT DOCUMENT CONTENT

    RETRIEVE RELEVANT CHUNKS

    BUILD GROUNDED CONTEXT

    SEND QUESTION + CONTEXT TO AI GATEWAY

    GENERATE SIMPLE, MEANING-PRESERVING ANSWER

    CHECK AVAILABLE EVIDENCE

    IF EVIDENCE EXISTS
        RETURN ANSWER + PAGE/SECTION/CLAUSE
    ELSE IF INFORMATION IS NOT PRESENT
        RETURN "I could not find this information
        in the uploaded document."
    ELSE
        COMMUNICATE UNCERTAINTY

    RENDER STRUCTURED ANSWER

    ALLOW FOLLOW-UP QUESTIONS

    ALLOW LANGUAGE CHANGE

ELSE
    SHOW DOCUMENT PROCESSING STATUS
```

------------------------------------------------------------------------

# 65. Final Definition

**Service 6 --- Document Q&A / Legal AI Chat** is a document-grounded
conversational service that allows users to ask natural-language
questions about an uploaded legal document and receive simple, accurate,
multilingual answers supported by page, section, clause, or source
evidence whenever available.

Its core principle is:

``` text
ASK
 ↓
UNDERSTAND
 ↓
RETRIEVE
 ↓
GROUND
 ↓
ANSWER
 ↓
VERIFY
```

The service must preserve:

``` text
DOCUMENT FOCUS
+
LEGAL MEANING
+
PLAIN-LANGUAGE EXPLANATION
+
MULTILINGUAL ACCESSIBILITY
+
DOCUMENT-GROUNDED ANSWERS
+
SOURCE TRACEABILITY
+
LEGAL SAFETY
+
CHATGPT-LIKE EXPERIENCE
```

This keeps Service 6 fully consistent with the project's defined
architecture and MVP scope.
