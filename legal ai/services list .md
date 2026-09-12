Legal AI — Final Service List
A. COMMON CORE — Used by almost every service

These are not separate services in the product menu. They are shared capabilities.

1. Document Upload & Ingestion

Works: Upload PDF, DOCX, images, scanned court documents, etc.
Outcome: Any supported document becomes available inside the workspace.

2. Document Understanding

Works: Identify document type, pages, sections, headings, parties, and overall structure.
Outcome: AI understands what the document contains before other services operate on it.

3. OCR / Text Extraction

Works: Extract text from normal PDFs and scanned/image-based documents.
Outcome: Even scanned legal documents become searchable and usable.

4. Document Context

Works: Keep the selected document and its relevant sections available to AI services.
Outcome: Every service can work on the same document without uploading it again.

5. Source & Evidence

Works: Connect AI answers/findings back to the document, page, section, or clause.
Outcome: User can see where the answer came from.

6. AI Provider Layer

Works: Send tasks to the selected AI model through one common interface.
Outcome: Gemini, GPT, Claude, or another model can be changed without changing the services.

B. CORE LEGAL SERVICES

These are the actual services you are building.

1. Legal Document Analysis

Works:

Understand the legal purpose of the document
Identify important provisions
Identify important legal information
Produce an overall assessment

Outcome:
A clear “What is this document and what does it contain?” report.

2. Legal Document Summarization

Works:

Condense long documents
Extract important points
Highlight important sections
Present the document in structured form

Outcome:
A short, understandable summary of the document.

This is separate from general analysis: Analysis = deeper assessment; Summary = concise understanding.

3. Clause & Information Extraction

Works:

Find important clauses
Extract parties
Dates
Amounts
Duration
Payment terms
Termination
Liability
Confidentiality
Indemnity
Governing law, etc.

Outcome:
A structured view of the important legal information and clauses.

4. Legal Risk Detection

Works:

Find unfavorable clauses
Identify potential risks
Detect missing protections
Identify unusual terms
Explain why a clause may be risky

Outcome:
A risk list with the relevant clause/section and explanation.

5. Compliance Checking

Works:

Check document requirements against selected legal/compliance rules
Identify potentially missing or problematic requirements
Highlight areas requiring attention

Outcome:
A clear compliance findings report.

6. Document Comparison

Works:

Compare two documents
Compare different versions
Detect additions
Detect removals
Detect changed clauses
Highlight important differences

Outcome:
A clear before vs. after comparison.

7. Legal Document Q&A / AI Legal Chat

Works:

User asks normal legal questions
User asks questions about uploaded documents
AI answers using the available document context
User can ask follow-up questions

Outcome:
One conversational legal assistant instead of manually searching the document.

8. Legal Search

Works:

Search across user's documents
Find clauses/information
Search using normal language
Locate relevant documents and sections

Outcome:
Quickly find where the required legal information exists.

9. Legal Obligation & Deadline Extraction

Works:

Identify responsibilities of each party
Extract deadlines
Renewal dates
Notice periods
Payment dates
Termination dates
Other contractual obligations

Outcome:
An actionable “Who must do what, and when?” list.

10. Legal Document Drafting

Works:

Create a new legal document from user requirements
Generate a first draft
Use existing document/context when required

Outcome:
A usable first legal-document draft.

11. Clause Drafting & Rewriting

Works:

Create individual clauses
Rewrite existing clauses
Improve clarity
Adjust clause requirements
Produce alternative wording

Outcome:
A revised or newly created legal clause.

This belongs under Drafting, but is worth keeping as a separate user action/service because clause-level work is very different from creating a complete document.

C. LANGUAGE & ACCESSIBILITY SERVICES
12. Legal Document Translation

Works:

Translate complete legal documents
Translate selected sections
Preserve legal meaning and document structure as much as possible

Outcome:
A translated version of the legal document.

13. Simple Legal Explanation

Works:

Convert difficult legal language into simple language
Explain clauses
Explain rights/responsibilities
Explain implications in plain language

Outcome:
The user understands what the legal text actually means.

14. Regional-Language Legal Explanation

Works:

Give explanations in Tamil, Hindi, Telugu, Kannada, Malayalam, etc.
Explain legal terminology in the selected language

Outcome:
Users can understand legal information in their preferred Indian language.

This should not be a separate translation engine. It is the regional-language output of the explanation service.

15. Legal Voice Assistant

Works:

Convert AI answers to speech
Read summaries
Read translations
Allow voice questions where supported

Outcome:
Users can listen and interact with legal information through voice.

D. INDIAN LEGAL SERVICES
16. Judgment & Court Order Summarization

Works:

Process Indian judgments
Court orders
Legal decisions
Identify facts
Issues
Decision
Reasoning
Important directions

Outcome:
A structured, easy-to-understand judgment/order summary.

17. Court Document Understanding

Works:

Handle scanned court orders
OCR court documents
Understand pages and sections
Make scanned documents usable by other services

Outcome:
A scanned court document becomes searchable, understandable and usable.

OCR itself is common infrastructure. The court-document understanding workflow is the actual Indian legal service.

18. Indian Legal Context Assistant

Works:

Answer questions with Indian legal context
Understand Indian legal terminology
Work with Acts, sections, rules and Indian legal documents
Connect answers to available legal sources where supported

Outcome:
Answers specifically oriented toward the Indian legal environment.

E. WORKSPACE / MANAGEMENT SERVICES
19. Legal Document Workspace

Works:

Organize documents
Keep document conversations
Keep analysis results
Keep generated documents
Access previous work

Outcome:
One place where the user's complete legal work is maintained.

20. Collaboration & Review

Works:

Share documents/workspaces
Add comments
Review documents
Track review activity

Outcome:
Multiple users can work on the same legal matter.

21. Audit & Activity History

Works:

Record important actions
Track document changes
Track analysis activity
Track user activity

Outcome:
A clear history of what happened inside the workspace.

F. TRUST & SAFETY
22. Legal Accuracy & Source Verification

Works:

Show supporting document/source
Identify uncertainty
Avoid presenting unsupported information as fact
Distinguish extracted information from AI interpretation

Outcome:
Users can verify important AI-generated information.

23. Legal Disclaimer & User Safeguards

Works:

Clearly communicate that AI output is informational
Encourage verification for important legal decisions
Provide appropriate warnings where needed

Outcome:
A safer and more responsible legal-AI experience.

Final Clean Structure

Instead of thinking of this as 23 unrelated services, your application should have:

COMMON CORE
Document Upload & Ingestion
Document Understanding
OCR / Text Extraction
Document Context
Source & Evidence
AI Provider Layer
LEGAL INTELLIGENCE
Legal Document Analysis
Legal Document Summarization
Clause & Information Extraction
Legal Risk Detection
Compliance Checking
Document Comparison
Legal Document Q&A / AI Chat
Legal Search
Obligation & Deadline Extraction
CREATION
Legal Document Drafting
Clause Drafting & Rewriting
LANGUAGE & ACCESSIBILITY
Legal Document Translation
Simple Legal Explanation
Regional-Language Legal Explanation
Legal Voice Assistant
INDIAN LEGAL
Judgment & Court Order Summarization
Court Document Understanding
Indian Legal Context Assistant
WORKSPACE
Legal Document Workspace
Collaboration & Review
Audit & Activity History
TRUST
Accuracy & Source Verification
Legal Disclaimer & Safeguards
The important correction

Some things I previously counted as separate services should not be services:

Previously separate	Correct treatment
Regional Language Output	Part of Translation/Explanation
OCR	Common document capability
Document Context	Common capability
Source Linking	Common capability
AI Provider	Common AI infrastructure
Clause Rewriting	Part of Drafting
Legal Knowledge Assistant	Mostly AI Chat + Search + RAG
Document Management	Workspace capability
Risk Dashboard	UI for Risk Detection, not separate AI service

So the actual product services are much cleaner:

Analyze → Summarize → Extract → Detect Risk → Check Compliance → Compare → Ask AI → Search → Track Obligations → Draft → Rewrite → Translate → Simplify → Regional Language → Voice → Summarize Judgments → Understand Court Documents → Indian Legal Assistant.

Everything else supports these services rather than competing with them.


Legal AI — Frontend / Backend / Background Split
                    LEGAL AI WORKSPACE
                           │
              ┌────────────┴────────────┐
              │                         │
          FRONTEND                  BACKEND
       User-facing UI             Business Logic
              │                         │
              │                  ┌──────┴──────┐
              │                  │             │
              │              API Services   Background
              │                              Processing
              │                                  │
              └──────────────┬───────────────────┘
                             │
                       AI / DB / Storage
1. FRONTEND — What the User Actually Sees

Don't expose 23 services.

The user mainly sees 5–6 major areas.

1. AI Legal Workspace

This is the main screen and heart of the application.

User can:
Chat with AI
Upload documents
Ask questions
Select a document
Ask for analysis
Ask for summary
Ask for risks
Ask for explanation
Ask for translation
Ask about clauses
Ask what actions are required
Outcome

One place to perform most legal-AI work.

2. Document Workspace

When the user opens a document:

Document
 ├── Overview
 ├── Summary
 ├── Key Information
 ├── Clauses
 ├── Risks
 ├── Compliance
 ├── Obligations
 ├── AI Chat
 └── Sources

The user doesn't need to know which backend service produced these.

Outcome

A complete interactive view of the document.

3. Compare Documents

A dedicated interface because comparing two documents needs its own UI.

Document A     ↔     Document B
       ↓
   Differences
       ↓
Added / Removed / Changed
Outcome

Easy visual comparison between two legal documents.

4. Draft & Rewrite

User can:

Create document
Create clause
Rewrite clause
Improve wording
Generate alternative wording
Outcome

A dedicated place for creating and modifying legal content.

5. Language & Accessibility

User-facing options:

Translate
Explain simply
Regional language
Listen / Voice

These can appear inside the document workspace and chat rather than necessarily being separate pages.

Outcome

Legal information becomes easier to read, understand and hear.

6. Indian Legal

User-facing area for:

Judgments
Court orders
Indian legal questions
Court-document summaries
Outcome

A dedicated experience for Indian legal material.

2. BACKEND — Main Application Services

The frontend talks to these through APIs.

These are the actual business services.

A. Workspace Service

Handles:

Users
Workspaces
Documents
Permissions
Conversations
Workspace data

Outcome: Everything belongs to the correct user/workspace.

B. Document Service

Handles:

Upload
File validation
Document storage
Document metadata
Document status
Document retrieval

Outcome: Documents are properly managed.

C. AI Chat Service

Handles:

User questions
Conversation history
Document-based questions
AI responses
Follow-up questions

Outcome: One common AI conversation system.

D. Legal Analysis Service

Handles:

Document analysis
Summary
Clause extraction
Information extraction
Risk detection
Compliance checking
Obligation extraction

These can be separate internal functions but belong to one Legal Intelligence area.

Outcome: All core legal understanding is handled consistently.

E. Comparison Service

Handles:

Two-document comparison
Version comparison
Changed clauses
Added content
Removed content

Outcome: Structured comparison results for the frontend.

F. Drafting Service

Handles:

Document generation
Clause generation
Clause rewriting
Alternative wording

Outcome: Generated legal content.

G. Language Service

Handles:

Translation
Simple explanation
Regional-language explanation

Outcome: Legal content in the user's required language and complexity.

H. Indian Legal Service

Handles:

Judgment processing
Court-order processing
Indian legal context
Court-document workflows

Outcome: Indian-specific legal functionality.

I. Search Service

Handles:

Document search
Legal content search
Semantic search
Finding relevant sections

Outcome: Relevant information is returned quickly.

J. Audit & Security Service

Handles:

Activity history
Permissions
Access control
Important actions
Security records

Outcome: Controlled and traceable system.

3. BACKGROUND PROCESSING — User Doesn't See This

This is where a lot of the original "23 services" actually belong.

The user uploads:

contract.pdf

They don't need to see:

OCR service → extraction service → chunking → embedding → classification → indexing...

It happens automatically.

1. Document Processing Pipeline
Upload
  ↓
File Validation
  ↓
Text Extraction
  ↓
OCR if required
  ↓
Document Structure
  ↓
Document Classification
  ↓
Store

Outcome: Document becomes AI-readable.

2. Legal Information Processing

After the document is readable:

Document
   ↓
Sections
   ↓
Clauses
   ↓
Parties
   ↓
Dates
   ↓
Amounts
   ↓
Obligations

Outcome: Important legal information is prepared for the application.

3. AI Analysis Processing

Background processing can generate:

Summary
Risks
Compliance findings
Clause information
Obligations
Key information

Outcome: Results are ready when the user opens the document.

4. RAG / Knowledge Processing

Background:

Document
 ↓
Chunks
 ↓
Embeddings
 ↓
Vector Database
 ↓
Search / Retrieval

Outcome: AI can find the right information when answering questions.

5. Court Document Processing

For scanned court documents:

Scanned PDF
 ↓
OCR
 ↓
Text
 ↓
Page/section understanding
 ↓
Judgment/order structure
 ↓
AI processing

Outcome: Court documents become usable by the Indian Legal services.

6. Translation Processing

When the user requests translation:

Document / Answer
       ↓
Translation
       ↓
Regional Language
       ↓
Formatted Result

Outcome: Translated content is returned to the frontend.

7. Voice Processing
User Voice
 ↓
Speech Recognition
 ↓
AI
 ↓
Answer
 ↓
Text-to-Speech
 ↓
Audio

Outcome: Voice interaction without exposing the processing steps.

4. SHARED AI LAYER

This should sit underneath all backend services.

                  Backend Services
                        │
                 ┌──────┴──────┐
                 │   AI Layer  │
                 └──────┬──────┘
                        │
                  AI Provider
              ┌─────────┼─────────┐
              ↓         ↓         ↓
           Gemini      GPT      Claude

The services don't directly depend on Gemini.

For example:

Risk Detection
      ↓
     AI Layer
      ↓
  Current Model

Later:

Gemini → GPT

without rebuilding Risk Detection.

5. DATABASE / STORAGE LAYER

Everything underneath the backend:

PostgreSQL

Stores:

Users
Workspaces
Documents metadata
Conversations
Analysis results
Risks
Clauses
Obligations
Drafts
Audit records
Object Storage

Stores:

PDFs
DOCX
Images
Generated documents
Audio
Qdrant

Stores:

Document embeddings
Searchable document knowledge
Redis

Used for:

Temporary data
Caching
Queues
Background jobs
6. FINAL TEAM SPLIT

If two teams are working on this, I would split them like this:

TEAM 1 — FRONTEND + USER EXPERIENCE
Build:
AI Legal Workspace
Document Workspace
Document Viewer
AI Chat UI
Document Upload UI
Analysis Results UI
Summary UI
Clause UI
Risk UI
Compliance UI
Obligation UI
Compare UI
Drafting UI
Translation UI
Simple Explanation UI
Voice UI
Judgment/Court Order UI
Search UI
Workspace Management
Collaboration UI
Activity/Audit UI

Main outcome:

User gets one clean Legal AI application where all services can be accessed without knowing the backend processing.

TEAM 2 — BACKEND + AI + BACKGROUND
Main Backend
Workspace Service
Document Service
AI Chat Service
Legal Intelligence Service
Comparison Service
Drafting Service
Language Service
Indian Legal Service
Search Service
Audit/Security Service
Background Processing
Document ingestion
OCR
Text extraction
Document understanding
Clause extraction
Information extraction
Risk analysis
Compliance analysis
Obligation extraction
Summarization
Embeddings
RAG processing
Court-document processing
Judgment processing
Translation processing
Voice processing
Infrastructure
AI Provider Layer
PostgreSQL
Qdrant
Redis
Object Storage
Background Job System

Main outcome:

All legal intelligence and processing works behind the workspace and provides clean results to the frontend.

The key architecture

The user sees:

                LEGAL AI
                   │
          ┌────────┴────────┐
          │                 │
     AI WORKSPACE       DOCUMENTS
          │                 │
          └────────┬────────┘
                   │
        Analyze / Ask / Compare
        Draft / Translate / Explain
        Search / Court / Voice

Behind it:

Frontend
   ↓
Backend APIs
   ↓
Business Services
   ↓
Background Processing
   ↓
AI Layer
   ↓
Gemini / GPT / Claude
   ↓
PostgreSQL + Qdrant + Redis + Storage

This is the clean split I recommend. The frontend team builds what the user interacts with; the backend team builds the services and all the invisible processing required to make those features work.