# SERVICE 8 --- REGIONAL-LANGUAGE VOICE LEGAL ASSISTANT

## 1. Service Overview

### Service Name

**Regional-Language Voice Legal Assistant**

### Service Number

**Service 8**

### Purpose

Service 8 allows a user to interact with an uploaded legal document
using their voice and a supported Indian/regional language.

The user can speak a question naturally, the system converts the speech
into text, understands the question in the context of the uploaded legal
document, retrieves the relevant information, generates a grounded
legal-document answer, presents the answer in the selected regional
language, and optionally reads the answer aloud.

### Core Idea

> **Talk to your legal document in your own language.**

This service is an accessibility layer over the project's existing
legal-document intelligence capabilities. It is **not** intended to
become an independent general-purpose voice assistant.

------------------------------------------------------------------------

# 2. Position of Service 8 in the Project

The project has exactly eight primary user-facing services:

1.  Legal Document Understanding
2.  Legal Document Summarization
3.  Clause & Key Information Extraction
4.  Legal Risk Detection
5.  Multilingual Legal Simplification
6.  Document Q&A / Legal AI Chat
7.  Court Judgment & Order Understanding
8.  Regional-Language Voice Legal Assistant

Service 8 should reuse the shared capabilities of the other services.

It should especially reuse:

-   Document Understanding
-   Document Context
-   Document Q&A
-   Multilingual Legal Simplification
-   Source/Evidence
-   AI Gateway
-   Shared document processing
-   Language services

Services are backend capabilities and do not need to become completely
separate applications or pages.

------------------------------------------------------------------------

# 3. Main User Experience

After the user uploads a legal document and the document becomes ready,
the Legal AI Workspace exposes the available services.

The user can select:

**Voice Assistant**

The interface should look like a voice-enabled part of the existing
Legal AI Workspace.

Example:

``` text
+-------------------------------------------------------------+
| Legal AI Workspace                              Voice       |
+-------------------------------------------------------------+
|                                                             |
| Document: Supreme_Court_Judgment.pdf                        |
| Status: READY                                               |
|                                                             |
| Services                                                    |
|                                                             |
| [Understand] [Summarize] [Extract] [Detect Risk]            |
| [Simplify]  [Ask Document] [Judgment] [Voice Assistant]    |
|                                                             |
+-------------------------------------------------------------+
|                  REGIONAL-LANGUAGE VOICE                    |
|                                                             |
|             Talk to your legal document                     |
|                                                             |
|              Language: Tamil ▼                              |
|                                                             |
|                       🎙                                     |
|                  TAP TO SPEAK                               |
|                                                             |
|              "Ask your question naturally"                   |
+-------------------------------------------------------------+
```

The user should feel that they are continuing to interact with the same
legal document, not opening a separate voice application.

------------------------------------------------------------------------

# 4. What the User Does

The normal flow is:

``` text
UPLOAD DOCUMENT
       ↓
DOCUMENT PROCESSING
       ↓
DOCUMENT READY
       ↓
SELECT VOICE ASSISTANT
       ↓
SELECT LANGUAGE
       ↓
SPEAK QUESTION
       ↓
SPEECH-TO-TEXT
       ↓
DOCUMENT Q&A
       ↓
LEGAL ANSWER
       ↓
REGIONAL-LANGUAGE RESPONSE
       ↓
OPTIONAL TEXT-TO-SPEECH
       ↓
USER HEARS / READS ANSWER
```

------------------------------------------------------------------------

# 5. How the Service Answer Will Look

The answer should not be presented only as audio.

The UI should show:

1.  The selected language
2.  The user's spoken question
3.  The speech-to-text transcript
4.  The AI's answer
5.  Source/page evidence
6.  Audio playback control
7.  Option to ask another question
8.  Option to change language

Example:

``` text
+-------------------------------------------------------------+
| Regional-Language Voice Assistant                           |
+-------------------------------------------------------------+
| Document: Supreme Court Judgment                            |
| Language: Tamil                                             |
|                                                             |
| 🎙 You said:                                                |
|                                                             |
| "இந்த judgment-ல court என்ன decision எடுத்திருக்கு?"        |
|                                                             |
| ----------------------------------------------------------- |
|                                                             |
| 🤖 AI Answer:                                               |
|                                                             |
| "இந்த வழக்கில் நீதிமன்றம் மேல்முறையீட்டை தள்ளுபடி செய்து,   |
| கீழமை நீதிமன்றத்தின் தீர்ப்பை உறுதி செய்தது."               |
|                                                             |
| ----------------------------------------------------------- |
|                                                             |
| 📄 Source                                                   |
| Page: 18                                                   |
| Section: Final Order                                       |
|                                                             |
| [🔊 Play Answer]  [↻ Ask Again]  [🌐 Change Language]       |
+-------------------------------------------------------------+
```

The exact legal answer must depend on the uploaded document.

The system must not create a generic answer unrelated to the uploaded
document.

------------------------------------------------------------------------

# 6. Example --- Court Judgment

### User speaks

``` text
"இந்த judgment-ல court என்ன decision எடுத்திருக்கு?"
```

### Speech-to-text output

``` text
இந்த judgment-ல court என்ன decision எடுத்திருக்கு?
```

### Question understanding

The system identifies that the user wants:

``` text
Intent:
COURT_DECISION

Required information:
Final decision / final order

Document:
Uploaded court judgment
```

### Document retrieval

The system retrieves the relevant judgment content, especially the
decision/final-order section.

### AI answer

``` text
இந்த வழக்கில் நீதிமன்றம் மேல்முறையீட்டை
தள்ளுபடி செய்து, கீழமை நீதிமன்றத்தின்
தீர்ப்பை உறுதி செய்தது.
```

### Evidence

``` text
Source:
Supreme Court Judgment
Page 18
Section: Final Order
```

### Optional audio

The Tamil answer is converted into speech and played to the user.

------------------------------------------------------------------------

# 7. Example --- Contract

### User speaks

``` text
"இந்த agreement-ஐ terminate பண்ணினா என்ன ஆகும்?"
```

The system should:

``` text
Voice
 ↓
Speech-to-text
 ↓
Question understanding
 ↓
Retrieve termination clauses
 ↓
Document-grounded answer
 ↓
Tamil response
 ↓
Optional audio
```

Example response:

``` text
இந்த ஒப்பந்தத்தை முடிக்க, சம்பந்தப்பட்ட தரப்பு
30 நாட்களுக்கு முன் எழுத்துப்பூர்வமாக
அறிவிப்பு வழங்க வேண்டும்.
```

Source:

``` text
Page 7
Clause 12.2
```

The exact response must always match the actual uploaded document.

------------------------------------------------------------------------

# 8. How the Answer Is Obtained

Service 8 should use the following pipeline:

``` text
USER VOICE
    ↓
SPEECH-TO-TEXT
    ↓
TRANSCRIBED QUESTION
    ↓
QUESTION / INTENT PROCESSING
    ↓
SHARED DOCUMENT CONTEXT
    ↓
DOCUMENT RETRIEVAL
    ↓
RELEVANT DOCUMENT CHUNKS
    ↓
DOCUMENT Q&A / LEGAL AI
    ↓
GROUNDED LEGAL ANSWER
    ↓
SOURCE VALIDATION
    ↓
REGIONAL-LANGUAGE RESPONSE
    ↓
OPTIONAL TEXT-TO-SPEECH
    ↓
USER
```

------------------------------------------------------------------------

# 9. Step-by-Step Working Logic

## Step 1 --- Document Must Exist

Service 8 operates around an uploaded legal document.

The document may be:

-   Court judgment
-   Court order
-   Contract
-   Agreement
-   Legal notice
-   Employment agreement
-   Lease agreement
-   NDA
-   Service agreement
-   Other supported legal documents

The document must first pass the common document processing pipeline.

------------------------------------------------------------------------

## Step 2 --- Document Processing

The shared processing pipeline is:

``` text
UPLOAD
 ↓
VALIDATION
 ↓
STORAGE
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

OCR should only be used when necessary.

If the PDF already contains usable text, native extraction should be
preferred.

------------------------------------------------------------------------

# 10. Step 3 --- User Selects Voice Assistant

The user selects:

``` text
[ Voice Assistant ]
```

The UI opens the voice interaction area.

The user selects a supported language.

Example:

``` text
English
Tamil
Hindi
Telugu
Malayalam
Kannada
Bengali
Marathi
```

Additional languages can be added later.

------------------------------------------------------------------------

# 11. Step 4 --- Voice Capture

The user presses the microphone button.

Example:

``` text
🎙 Tap to Speak
```

The system captures the user's speech.

UI states may include:

``` text
IDLE
 ↓
LISTENING
 ↓
PROCESSING
 ↓
ANSWERING
 ↓
READY
```

Example:

``` text
🎙 Listening...
```

The user then stops speaking or the system detects the end of speech.

------------------------------------------------------------------------

# 12. Step 5 --- Speech-to-Text

The captured voice is converted into text.

Example:

``` text
Audio:
"இந்த judgment-ல court என்ன decision எடுத்திருக்கு?"

             ↓

Transcript:
"இந்த judgment-ல court என்ன decision எடுத்திருக்கு?"
```

The transcript should be shown to the user so they can see what the
system understood.

------------------------------------------------------------------------

# 13. Step 6 --- Question Understanding

The system analyses the transcript.

It determines:

-   User intent
-   Important entities
-   Requested information
-   Language
-   Document relevance
-   Whether the question requires document retrieval

Example:

``` text
Question:
"What did the court finally decide?"

Intent:
COURT_DECISION

Document type:
COURT_JUDGMENT

Required context:
DECISION / FINAL ORDER
```

For a contract:

``` text
Question:
"What happens if I terminate this agreement?"

Intent:
TERMINATION_CONSEQUENCE

Document type:
CONTRACT

Required context:
TERMINATION CLAUSE
```

------------------------------------------------------------------------

# 14. Step 7 --- Document Retrieval

The question is used to identify relevant content in the uploaded
document.

The intended document Q&A architecture is:

``` text
USER QUESTION
      ↓
QUERY PROCESSING
      ↓
DOCUMENT RETRIEVAL
      ↓
RELEVANT CHUNKS
      ↓
AI
      ↓
ANSWER
      ↓
CITATIONS
```

The uploaded document remains the primary source for document-specific
questions.

------------------------------------------------------------------------

# 15. Step 8 --- Generate Legal Answer

The AI receives:

-   User question
-   Document ID
-   Document type
-   Document language
-   Relevant document content
-   Page information
-   Section information
-   Relevant chunks
-   Previous conversational context where applicable

The AI must:

-   Use the supplied document/context
-   Not invent facts
-   Preserve legal meaning
-   Use simple language
-   Respect the selected regional language
-   Provide evidence where possible
-   State uncertainty when evidence is insufficient

------------------------------------------------------------------------

# 16. Step 9 --- Source Validation

Before showing the answer, the system should validate the supporting
source.

Possible source information:

``` text
Document
Page
Section
Clause
Source chunk
Citation
Relevant source text
```

Example:

``` text
Answer:
The tenant must provide 30 days' written notice.

Source:
Lease Agreement
Page 7
Clause 12.2
```

The source system is shared with:

-   Summarization
-   Q&A
-   Risk Detection
-   Clause Extraction
-   Judgment Understanding
-   Simplification

------------------------------------------------------------------------

# 17. Step 10 --- Regional-Language Response

After generating the grounded answer, the answer is presented in the
selected language.

The intended multilingual pipeline is:

``` text
LEGAL DOCUMENT
      ↓
LEGAL UNDERSTANDING
      ↓
PLAIN-LANGUAGE MEANING
      ↓
REGIONAL LANGUAGE
      ↓
SIMPLE REGIONAL-LANGUAGE EXPLANATION
```

This is not ordinary word-for-word translation.

The goal is:

``` text
LEGAL MEANING
      +
SIMPLIFICATION
      +
REGIONAL LANGUAGE ACCESSIBILITY
```

------------------------------------------------------------------------

# 18. Step 11 --- Optional Text-to-Speech

The regional-language answer can optionally be converted back into
speech.

``` text
REGIONAL-LANGUAGE ANSWER
          ↓
TEXT-TO-SPEECH
          ↓
AUDIO
          ↓
🔊 PLAY
```

The user can listen to the answer instead of reading it.

Controls:

``` text
[▶ Play]
[⏸ Pause]
[↻ Replay]
```

------------------------------------------------------------------------

# 19. Complete Working Logic

``` text
                    USER
                      |
                      v
               🎙 SPEAK QUESTION
                      |
                      v
               SPEECH-TO-TEXT
                      |
                      v
                TRANSCRIPT
                      |
                      v
              QUESTION ANALYSIS
                      |
                      v
             SHARED DOCUMENT
                 CONTEXT
                      |
                      v
              DOCUMENT RETRIEVAL
                      |
                      v
             RELEVANT CHUNKS
                      |
                      v
              DOCUMENT Q&A / AI
                      |
                      v
              LEGAL ANSWER
                      |
                      v
             SOURCE VALIDATION
                      |
                      v
            REGIONAL LANGUAGE
                      |
             +--------+--------+
             |                 |
             v                 v
        TEXT RESPONSE     TEXT-TO-SPEECH
                               |
                               v
                            🔊 AUDIO
```

------------------------------------------------------------------------

# 20. Basic Logic of Service 8

The basic business logic is:

``` text
IF document is not ready
    THEN disable voice document interaction

ELSE
    capture user voice

    convert voice to text

    identify user's question

    retrieve relevant information
    from the uploaded document

    generate grounded answer

    validate source/evidence

    convert answer to selected
    regional language

    display answer

    IF text-to-speech is enabled
        THEN generate audio

    allow follow-up question
```

------------------------------------------------------------------------

# 21. Core Business Logic

The business logic of Service 8 can be represented as:

``` text
VOICE
  ↓
QUESTION
  ↓
DOCUMENT RELEVANCE
  ↓
DOCUMENT CONTEXT
  ↓
LEGAL UNDERSTANDING
  ↓
GROUNDED ANSWER
  ↓
SOURCE
  ↓
LANGUAGE
  ↓
AUDIO
```

The most important rule is:

> **The voice interface must not bypass document grounding.**

If the user asks about the uploaded document, the answer must be derived
from the uploaded document whenever possible.

------------------------------------------------------------------------

# 22. Document-Grounded Rule

Service 8 must follow:

``` text
Question about uploaded document
            ↓
Use uploaded document
            ↓
Retrieve evidence
            ↓
Generate answer
```

It must not behave like:

``` text
Question
  ↓
General AI knowledge
  ↓
Random legal answer
```

If the answer cannot be found:

``` text
"I could not find this information
in the uploaded document."
```

Do not hallucinate.

------------------------------------------------------------------------

# 23. General Knowledge vs Document Information

The system must distinguish between:

### Document-specific question

Example:

``` text
"What penalty is mentioned in this contract?"
```

Use:

``` text
Uploaded document
```

### General legal question

Example:

``` text
"What is a contract?"
```

This may require general legal knowledge depending on the application's
supported behavior.

The system must not confuse:

``` text
WHAT THIS DOCUMENT SAYS
```

with:

``` text
WHAT INDIAN LAW GENERALLY SAYS
```

For document-specific questions, the uploaded document remains the
primary source.

------------------------------------------------------------------------

# 24. Follow-Up Conversation

Service 8 should support conversational follow-up.

Example:

``` text
User:
"இந்த judgment-ல என்ன நடந்தது?"

AI:
[Answer]

User:
"அப்போ court என்ன முடிவு எடுத்தது?"

AI:
[Answer]

User:
"அதை இன்னும் simple Tamil-ல சொல்லுங்க."

AI:
[Simplified answer]
```

The system should retain the current document and relevant conversation
context.

The user should not need to upload the same document again for every
question.

------------------------------------------------------------------------

# 25. Language Switching

The user should be able to change language.

Example:

``` text
Current:
Tamil

Change to:
English
```

The same document question can then be answered in English.

Example:

``` text
Tamil:
"இந்த clause என்ன சொல்லுது?"

↓

English:
"What does this clause mean?"
```

The answer should remain faithful to the same document evidence.

------------------------------------------------------------------------

# 26. Supported Language Direction

Potential languages include:

-   English
-   Tamil
-   Hindi
-   Telugu
-   Malayalam
-   Kannada
-   Bengali
-   Marathi
-   Other Indian languages as implementation permits

The architecture should not hard-code a single language.

The language layer should be extensible.

------------------------------------------------------------------------

# 27. Frontend Components

Service 8 can contain:

``` text
VoiceAssistant
 ├── LanguageSelector
 ├── MicrophoneButton
 ├── RecordingIndicator
 ├── TranscriptCard
 ├── AnswerCard
 ├── SourceCard
 ├── AudioPlayer
 ├── AskAgainButton
 └── ErrorMessage
```

------------------------------------------------------------------------

# 28. Voice UI States

## State 1 --- Idle

``` text
🎙
Tap to Speak
```

## State 2 --- Listening

``` text
🔴
Listening...
Speak your question
```

## State 3 --- Processing

``` text
⏳
Understanding your question...
```

## State 4 --- Searching

``` text
🔎
Finding the answer in your document...
```

## State 5 --- Answer Ready

``` text
🤖
Answer Ready

[🔊 Play]
```

## State 6 --- Error

``` text
⚠
We couldn't process your voice.

Please try again.
```

------------------------------------------------------------------------

# 29. Backend Architecture

Service 8 should fit into the project's existing architecture:

``` text
REACT FRONTEND
       ↓
FASTAPI BACKEND
       ↓
BUSINESS / SERVICE LAYER
       ↓
VOICE SERVICE
       ↓
SPEECH-TO-TEXT
       ↓
DOCUMENT Q&A SERVICE
       ↓
DOCUMENT CONTEXT
       ↓
AI GATEWAY
       ↓
AI PROVIDER
       ↓
STRUCTURED OUTPUT
       ↓
SOURCE VALIDATION
       ↓
LANGUAGE SERVICE
       ↓
TEXT-TO-SPEECH
       ↓
FRONTEND
```

The frontend must not directly communicate with the AI provider.

------------------------------------------------------------------------

# 30. Shared Document Context

Service 8 should reuse the common document context.

The context can contain:

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

The document context should be created once and reused across services.

------------------------------------------------------------------------

# 31. AI Gateway

Service 8 must use the provider-independent AI Gateway.

Architecture:

``` text
VOICE SERVICE
      ↓
DOCUMENT Q&A
      ↓
AI GATEWAY
      ↓
+-------------------------+
| Gemini                  |
| OpenAI                  |
| Claude                  |
| Mistral                 |
| Groq                    |
| Local/Open-source Model |
+-------------------------+
```

The frontend should not know which AI provider is being used.

------------------------------------------------------------------------

# 32. Speech-to-Text Layer

The Speech-to-Text component should:

-   Accept captured audio
-   Identify or use the selected language
-   Produce text
-   Return transcript
-   Handle recognition failure
-   Avoid silently changing the user's intended question

Conceptually:

``` text
Audio Input
    ↓
Speech-to-Text Engine
    ↓
Transcript
```

The specific provider is an implementation decision and should remain
replaceable.

------------------------------------------------------------------------

# 33. Text-to-Speech Layer

The Text-to-Speech component should:

``` text
AI Answer
    ↓
Selected Language
    ↓
Text-to-Speech
    ↓
Audio Output
```

The TTS layer should support the languages implemented by the
application.

If TTS is unavailable, the text answer should still be shown.

------------------------------------------------------------------------

# 34. API Concept

A possible API flow consistent with the project architecture is:

``` text
POST /documents/{id}/voice/transcribe
```

Purpose:

Convert uploaded/captured audio into text.

Response concept:

``` json
{
  "transcript": "இந்த judgment-ல court என்ன decision எடுத்திருக்கு?",
  "language": "ta"
}
```

Then:

``` text
POST /documents/{id}/chat
```

can be used for document-grounded question answering.

Then the language/TTS layer can process the answer.

The exact endpoint naming should remain consistent with the project's
existing API standards and should not conflict with existing APIs.

------------------------------------------------------------------------

# 35. Suggested Internal Response Structure

A structured response can look like:

``` json
{
  "service": "regional_voice_legal_assistant",
  "language": "ta",
  "input": {
    "type": "voice",
    "transcript": "இந்த judgment-ல court என்ன decision எடுத்திருக்கு?"
  },
  "answer": {
    "text": "இந்த வழக்கில் நீதிமன்றம் மேல்முறையீட்டை தள்ளுபடி செய்தது."
  },
  "sources": [
    {
      "page": 18,
      "section": "Final Order"
    }
  ],
  "audio": {
    "available": true
  }
}
```

This gives the frontend predictable data.

------------------------------------------------------------------------

# 36. Error Handling

## Microphone Permission Error

``` text
Microphone access is required.

Please allow microphone access
to use Voice Assistant.
```

## No Speech Detected

``` text
No speech was detected.

Please try speaking again.
```

## Speech Recognition Error

``` text
We couldn't understand the audio.

Please try again.
```

## Unsupported Language

``` text
This language is not currently supported.

Please select another language.
```

## Document Not Ready

``` text
Your document is still being processed.

Voice Assistant will be available
when the document is ready.
```

## Document Answer Not Found

``` text
I could not find this information
in the uploaded document.
```

## Insufficient Evidence

``` text
The available document evidence is
not sufficient to answer this reliably.
```

## Text-to-Speech Failure

``` text
The answer is available as text,
but audio playback could not be generated.
```

------------------------------------------------------------------------

# 37. Legal Safety

Service 8 is an explanation and accessibility feature.

It must not:

-   Pretend to be a lawyer
-   Replace a lawyer
-   Guarantee a legal outcome
-   Invent laws
-   Invent court decisions
-   Invent clauses
-   Give unsupported legal conclusions
-   Claim certainty where evidence is absent

It should:

-   Explain
-   Simplify
-   Summarize
-   Extract
-   Highlight
-   Assist understanding

For high-risk legal decisions, the application should recommend
professional/legal review where appropriate.

------------------------------------------------------------------------

# 38. Hallucination Prevention

The prompt/AI layer should explicitly instruct the model:

``` text
Use only the supplied document/context
for document-specific questions.

Do not invent facts.

Do not invent clauses.

Do not invent court decisions.

Preserve legal meaning.

Cite page/section information where possible.

Use simple language.

Respect the selected regional language.

Clearly communicate uncertainty.
```

------------------------------------------------------------------------

# 39. Evidence and Traceability

Every possible answer should contain evidence.

Example:

``` text
Answer
  ↓
Source
  ↓
Page
  ↓
Section / Clause
```

Example:

``` text
Answer:
The employee must provide 30 days' notice.

Source:
Employment Agreement
Page 5
Clause 8.1
```

The user should be able to navigate back to the relevant document
location where the UI supports it.

------------------------------------------------------------------------

# 40. Mock / Demo Mode

For the SIH MVP, Service 8 can work in deterministic demo mode.

Architecture:

``` text
Frontend
   ↓
FastAPI
   ↓
Voice Service
   ↓
Mock Provider
   ↓
JSON Fixture
```

The mock provider should behave like a real AI provider from the
application's perspective.

Do not place document-specific `if/else` logic inside API routers.

Document/action mapping belongs in the mock provider or fixture layer.

------------------------------------------------------------------------

# 41. Mock Fixture Structure

A possible fixture structure is:

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
        ├── chat.json
        └── voice.json
```

The `voice.json` fixture can contain:

``` json
{
  "language": "ta",
  "transcript": "இந்த judgment-ல court என்ன decision எடுத்திருக்கு?",
  "answer": "இந்த வழக்கில் நீதிமன்றம் மேல்முறையீட்டை தள்ளுபடி செய்தது.",
  "sources": [
    {
      "page": 18,
      "section": "Final Order"
    }
  ]
}
```

The fixture must match the actual demo document.

------------------------------------------------------------------------

# 42. Real AI Mode

The same architecture should later support:

``` text
Voice Input
     ↓
Speech-to-Text
     ↓
Document Q&A
     ↓
AI Gateway
     ↓
Gemini / OpenAI / Claude / Local Model
     ↓
Grounded Answer
     ↓
Regional Language
     ↓
Text-to-Speech
```

The frontend does not need to change based on the AI provider.

------------------------------------------------------------------------

# 43. Real RAG Mode

For production document Q&A:

``` text
VOICE QUESTION
      ↓
QUERY PROCESSING
      ↓
EMBEDDING / RETRIEVAL
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

For the MVP, deterministic fixture retrieval may simulate the behavior.

It should not be described as real RAG.

------------------------------------------------------------------------

# 44. Service 8 Does Not Need a Separate Document Pipeline

Do not implement:

``` text
Voice Document Extraction
Voice OCR
Voice Document Understanding
Voice Voice-specific RAG
```

Instead:

``` text
COMMON DOCUMENT PIPELINE
          ↓
SHARED DOCUMENT CONTEXT
          ↓
SERVICE 8
```

This avoids duplicate processing.

------------------------------------------------------------------------

# 45. Performance Considerations

The user should receive clear processing states.

Example:

``` text
Listening...
    ↓
Transcribing...
    ↓
Finding relevant information...
    ↓
Generating answer...
    ↓
Preparing audio...
    ↓
Ready
```

For a good UX:

-   Avoid unnecessary repeated document processing
-   Reuse existing document context
-   Cache reusable results where appropriate
-   Keep voice requests focused
-   Provide progress/loading states
-   Handle timeout/failure gracefully

------------------------------------------------------------------------

# 46. Security Considerations

Because legal documents can contain sensitive information:

-   Authenticate users
-   Authorize document access
-   Do not expose documents across users/workspaces
-   Secure uploaded audio
-   Secure transcripts
-   Secure generated answers
-   Avoid logging unnecessary sensitive content
-   Protect AI provider credentials
-   Keep provider credentials on the backend
-   Maintain audit logging where appropriate
-   Apply document access controls before retrieval

The frontend must never directly access the database, AI provider,
vector database, or file system.

------------------------------------------------------------------------

# 47. Privacy Considerations

Voice processing may involve temporary audio data.

The implementation should define:

-   How long audio is retained
-   Whether audio is stored
-   Whether only transcripts are retained
-   Who can access transcripts
-   How audio is deleted
-   How provider processing is handled

The exact retention policy should be defined by the project's
security/privacy requirements.

------------------------------------------------------------------------

# 48. Frontend User Journey

``` text
1. Open Legal AI Workspace
        ↓
2. Upload legal document
        ↓
3. Wait for document processing
        ↓
4. Document becomes READY
        ↓
5. Select Voice Assistant
        ↓
6. Select regional language
        ↓
7. Press microphone
        ↓
8. Speak question
        ↓
9. View transcript
        ↓
10. System searches document
        ↓
11. AI generates answer
        ↓
12. Source is shown
        ↓
13. Answer is shown in selected language
        ↓
14. User optionally presses Play
        ↓
15. User asks follow-up
```

------------------------------------------------------------------------

# 49. Example Complete Interaction

### User

``` text
🎙 "இந்த agreement-ல என்னுடைய responsibilities என்ன?"
```

### System transcript

``` text
இந்த agreement-ல என்னுடைய responsibilities என்ன?
```

### Retrieval

``` text
Relevant:
Page 4 — Responsibilities
Page 5 — Employee Duties
Page 6 — Confidentiality
```

### AI

``` text
இந்த agreement படி, உங்களுடைய முக்கிய
பொறுப்புகளில் குறிப்பிடப்பட்ட பணிகளைச் செய்வது,
நிறுவனத்தின் ரகசிய தகவல்களை பாதுகாப்பது மற்றும்
ஒப்பந்தத்தில் குறிப்பிடப்பட்ட விதிமுறைகளைப்
பின்பற்றுவது அடங்கும்.
```

### Source

``` text
Employment Agreement
Pages 4–6
Relevant clauses:
5.1, 5.2, 6.1
```

### Audio

``` text
🔊 Playing Tamil response...
```

------------------------------------------------------------------------

# 50. What Happens When the Answer Is Missing

Example:

``` text
User:
"இந்த agreement-ல என்னுடைய pension amount என்ன?"
```

If the document does not contain pension information:

``` text
AI:

"இந்த தகவல் பதிவேற்றப்பட்ட agreement-ல்
காணப்படவில்லை."
```

The system must not guess a number.

------------------------------------------------------------------------

# 51. What Happens When the User Asks an Ambiguous Question

Example:

``` text
User:
"இதுக்கு என்ன ஆகும்?"
```

The system can use conversation context if sufficient.

If the context is insufficient, it should ask a clarification:

``` text
"நீங்கள் எந்த clause அல்லது விஷயத்தை
குறிப்பிடுகிறீர்கள் என்பதைச் சொல்ல முடியுமா?"
```

This prevents unsupported assumptions.

------------------------------------------------------------------------

# 52. Voice + Existing Services

Service 8 should be able to trigger other services internally.

Example:

``` text
User:
"இந்த judgment-ஐ simple Tamil-ல explain பண்ணுங்க."

Voice
 ↓
Speech-to-text
 ↓
Document Q&A
 ↓
Judgment Understanding
 ↓
Legal Simplification
 ↓
Tamil
 ↓
Voice response
```

Another example:

``` text
User:
"இந்த contract-ல risky clauses என்ன?"

Voice
 ↓
Speech-to-text
 ↓
Risk Detection
 ↓
Relevant risk results
 ↓
Tamil explanation
 ↓
Optional audio
```

Therefore, Service 8 is an accessibility interface that can invoke the
appropriate legal intelligence capability.

------------------------------------------------------------------------

# 53. Internal Service Routing

The voice request can be routed based on intent:

``` text
VOICE QUESTION
      ↓
INTENT CLASSIFICATION
      ↓
+-----------------------------+
| Summary?                    |
| Key information?            |
| Risk?                       |
| Simplification?             |
| Q&A?                        |
| Judgment understanding?     |
+-----------------------------+
      ↓
APPROPRIATE SERVICE
      ↓
ANSWER
      ↓
REGIONAL LANGUAGE
      ↓
VOICE
```

Examples:

``` text
"What is this document about?"
→ Document Understanding / Q&A

"What are the risky clauses?"
→ Risk Detection

"Explain clause 7 in Tamil."
→ Clause Understanding + Simplification

"What did the court decide?"
→ Judgment Understanding + Q&A
```

------------------------------------------------------------------------

# 54. Business Rules

The following business rules must always be followed:

### Rule 1

A document must be available before document-specific voice Q&A.

### Rule 2

The document must be ready before answering.

### Rule 3

Voice input must be converted to text before document reasoning.

### Rule 4

Document-specific questions must use document context.

### Rule 5

Answers must preserve legal meaning.

### Rule 6

The selected language must be respected.

### Rule 7

Evidence should be shown whenever available.

### Rule 8

Missing information must not be invented.

### Rule 9

Uncertainty must be clearly communicated.

### Rule 10

Text-to-speech is optional.

### Rule 11

The voice service must reuse common platform capabilities.

### Rule 12

The service must not become a general-purpose voice assistant.

------------------------------------------------------------------------

# 55. Output Contract

A complete Service 8 result should conceptually contain:

``` text
Service
Language
Input Type
Transcript
Answer
Sources
Audio Availability
Processing Status
Error Information if applicable
```

Example:

``` json
{
  "service": "regional_voice_legal_assistant",
  "status": "completed",
  "language": "ta",
  "input_type": "voice",
  "transcript": "...",
  "answer": {
    "text": "..."
  },
  "sources": [
    {
      "page": 18,
      "section": "Final Order"
    }
  ],
  "audio": {
    "available": true
  }
}
```

------------------------------------------------------------------------

# 56. Loading States

The UI should expose meaningful progress.

``` text
🎙 Listening...
```

Then:

``` text
📝 Transcribing...
```

Then:

``` text
🔎 Finding information in the document...
```

Then:

``` text
🤖 Preparing answer...
```

Then:

``` text
🌐 Preparing Tamil response...
```

Then:

``` text
🔊 Preparing audio...
```

Finally:

``` text
✓ Answer Ready
```

------------------------------------------------------------------------

# 57. Empty States

If the user opens Service 8 before uploading a document:

``` text
No legal document is available.

Upload a document to start
talking with your legal document.
```

If the document is still processing:

``` text
Your document is being prepared.

Voice Assistant will be available
when processing is complete.
```

------------------------------------------------------------------------

# 58. Acceptance Criteria

Service 8 is complete only if:

-   [ ] User can access Voice Assistant from the Legal AI Workspace.
-   [ ] User can select a supported language.
-   [ ] User can provide voice input.
-   [ ] Voice can be converted to text.
-   [ ] Transcript is displayed.
-   [ ] Question is processed in document context.
-   [ ] Relevant document information can be retrieved.
-   [ ] Legal answer is generated.
-   [ ] Answer is grounded in the uploaded document.
-   [ ] Source/page evidence is displayed when available.
-   [ ] Answer can be shown in the selected regional language.
-   [ ] Optional text-to-speech can produce an audio response.
-   [ ] User can ask follow-up questions.
-   [ ] User can change language.
-   [ ] Missing information is handled safely.
-   [ ] Voice errors are handled.
-   [ ] Document-not-ready state is handled.
-   [ ] Microphone permission errors are handled.
-   [ ] Legal safety rules are respected.
-   [ ] Service reuses shared document context.
-   [ ] Service uses the AI Gateway.
-   [ ] Mock/demo mode is available.
-   [ ] Real AI mode can later replace the mock provider.
-   [ ] Frontend and backend responsibilities are separated.
-   [ ] Sensitive data is handled securely.

------------------------------------------------------------------------

# 59. Testing Scenarios

## Test 1 --- Tamil Judgment Question

Input:

``` text
இந்த judgment-ல court என்ன decision எடுத்திருக்கு?
```

Expected:

-   Correct transcript
-   Correct judgment-related retrieval
-   Correct answer
-   Tamil response
-   Source/page

------------------------------------------------------------------------

## Test 2 --- English Contract Question

Input:

``` text
What happens if I terminate this agreement?
```

Expected:

-   Contract termination information
-   Relevant clause
-   English answer
-   Source

------------------------------------------------------------------------

## Test 3 --- Tamil Contract Question

Input:

``` text
இந்த contract-ல என்ன penalty இருக்கு?
```

Expected:

-   Penalty clause retrieval
-   Tamil answer
-   Source

------------------------------------------------------------------------

## Test 4 --- Missing Information

Input:

``` text
What is the pension amount?
```

When pension information is absent:

Expected:

``` text
I could not find this information
in the uploaded document.
```

or the equivalent selected-language response.

------------------------------------------------------------------------

## Test 5 --- Unsupported Audio

Input:

``` text
Unclear/noisy audio
```

Expected:

``` text
We couldn't understand the audio.
Please try again.
```

------------------------------------------------------------------------

## Test 6 --- Follow-Up Question

Conversation:

``` text
User:
What did the court decide?

AI:
[Answer]

User:
Why?

AI:
[Reasoning based on the judgment]
```

Expected:

The second question uses the same document and conversation context.

------------------------------------------------------------------------

# 60. Demo Strategy for SIH

For the SIH demonstration:

### Step 1

Upload a real/public or authorized Indian court judgment.

### Step 2

Open:

``` text
Voice Assistant
```

### Step 3

Select:

``` text
Tamil
```

### Step 4

Speak:

``` text
"இந்த judgment-ல என்ன decision எடுத்திருக்கு?"
```

### Step 5

Show:

``` text
Speech-to-text
```

### Step 6

Show:

``` text
Tamil legal answer
```

### Step 7

Show:

``` text
Page / Section evidence
```

### Step 8

Press:

``` text
🔊 Play
```

### Step 9

Ask a follow-up question.

This demonstrates:

``` text
VOICE
+
LEGAL UNDERSTANDING
+
DOCUMENT Q&A
+
MULTILINGUAL ACCESSIBILITY
+
SOURCE TRACEABILITY
```

------------------------------------------------------------------------

# 61. Relationship With the Main Project

Service 8 directly supports the project's main objectives:

``` text
Understand legal documents
        +
Simplify legal language
        +
Generate useful answers
        +
Support regional languages
        +
Help non-lawyers
        +
Allow conversational interaction
        +
Preserve legal meaning
        +
Provide source evidence
```

It particularly strengthens the project's accessibility objective.

------------------------------------------------------------------------

# 62. What Makes Service 8 Unique

Service 8 is not simply:

``` text
Speech-to-text
```

It is not simply:

``` text
Text-to-speech
```

It is not simply:

``` text
Voice chatbot
```

It combines:

``` text
VOICE INPUT
      +
LEGAL DOCUMENT UNDERSTANDING
      +
DOCUMENT-GROUNDED Q&A
      +
PLAIN-LANGUAGE EXPLANATION
      +
REGIONAL LANGUAGE
      +
SOURCE EVIDENCE
      +
OPTIONAL VOICE OUTPUT
```

This makes the feature part of the project's legal-document
simplification system.

------------------------------------------------------------------------

# 63. Final Service 8 Logic

The complete business flow is:

``` text
USER UPLOADS DOCUMENT
        ↓
DOCUMENT IS PROCESSED
        ↓
DOCUMENT CONTEXT IS CREATED
        ↓
USER OPENS VOICE ASSISTANT
        ↓
USER SELECTS REGIONAL LANGUAGE
        ↓
USER SPEAKS QUESTION
        ↓
SPEECH-TO-TEXT
        ↓
QUESTION UNDERSTANDING
        ↓
IDENTIFY REQUIRED LEGAL SERVICE
        ↓
RETRIEVE RELEVANT DOCUMENT CONTENT
        ↓
GENERATE DOCUMENT-GROUNDED ANSWER
        ↓
VALIDATE SOURCE / EVIDENCE
        ↓
SIMPLIFY IF REQUIRED
        ↓
GENERATE REGIONAL-LANGUAGE RESPONSE
        ↓
DISPLAY TEXT ANSWER
        ↓
OPTIONALLY GENERATE AUDIO
        ↓
USER HEARS ANSWER
        ↓
USER CAN ASK FOLLOW-UP
```

------------------------------------------------------------------------

# 64. One-Line Definition

> **Service 8 is a regional-language voice interface that allows users
> to speak naturally with their uploaded legal documents, receive
> document-grounded legal explanations in their chosen Indian language,
> verify the supporting source, and optionally listen to the answer
> through text-to-speech.**

------------------------------------------------------------------------

# 65. Final Architecture

``` text
                         USER
                           |
                           v
              CHATGPT-LIKE LEGAL WORKSPACE
                           |
                           v
                   VOICE ASSISTANT
                           |
                           v
                   SPEECH-TO-TEXT
                           |
                           v
                    USER QUESTION
                           |
                           v
                  QUESTION ANALYSIS
                           |
                           v
                  SHARED DOCUMENT
                      CONTEXT
                           |
                           v
                  DOCUMENT RETRIEVAL
                           |
                           v
               APPROPRIATE AI SERVICE
                           |
                           v
                     AI GATEWAY
                           |
                           v
                  MOCK / REAL PROVIDER
                           |
                           v
                  STRUCTURED ANSWER
                           |
                           v
                  SOURCE VALIDATION
                           |
                           v
                 REGIONAL LANGUAGE
                           |
                 +---------+---------+
                 |                   |
                 v                   v
           TEXT RESPONSE       TEXT-TO-SPEECH
                                     |
                                     v
                                  🔊 AUDIO
```

------------------------------------------------------------------------

# 66. Golden Rule

**Service 8 must always remain a voice-based accessibility layer for the
AI-Driven Multilingual Legal Document Simplifier.**

It must preserve:

``` text
LEGAL DOCUMENT FOCUS
        +
PLAIN-LANGUAGE SIMPLIFICATION
        +
INDIAN/REGIONAL LANGUAGE SUPPORT
        +
DOCUMENT-GROUNDED AI
        +
SOURCE TRACEABILITY
        +
LEGAL SAFETY
        +
CHATGPT-LIKE WORKSPACE
```

It must **not** become a separate generic voice assistant.
