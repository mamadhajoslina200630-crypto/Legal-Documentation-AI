# Legal AI Platform (Legal Voice Assistant)

> **Purpose:** Complete implementation blueprint for `Legal Voice Assistant`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Voice Assistant`

## 1.2 Service ID

`sys-legal-voice-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Synchronous Streaming Service (Audio)`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Voice Assistant service must:

* Receive streaming audio input from the user (Speech-to-Text / STT).
* Transcribe the audio accurately, handling complex legal vocabulary and case names.
* Route the transcribed text to the `Legal AI Chat` or `Legal Search` service.
* Receive the text response and stream it back to the user as natural-sounding audio (Text-to-Speech / TTS).

The service must **not** perform the actual legal reasoning or vector search itself. It acts entirely as a conversational audio bridge to the existing text-based AI services.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers are often commuting, in court, or away from their keyboards. Typing out complex legal queries on a smartphone is tedious. This service allows a lawyer to simply open the app while driving and ask, "What was the liability cap in the Acme contract again?" and hear the answer spoken back to them, enabling true hands-free productivity.

## 1.7 User Value

Explain what the user gains from this service.
Frictionless, hands-free interaction with their entire legal repository. It feels like having a junior associate sitting in the passenger seat ready to answer questions about any case file.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A bidirectional WebSocket (or WebRTC) API that receives audio chunks, transcribes them via an STT provider, passes the text to the Chat service, and streams the resulting TTS audio back to the client in real-time.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining bidirectional WebSocket connections with mobile/web clients.
* Calling the STT (Speech-to-Text) provider (e.g., Whisper).
* Calling the TTS (Text-to-Speech) provider (e.g., ElevenLabs or OpenAI TTS).
* Orchestrating the handoff to the `Legal AI Chat` service.
* Handling conversational interruptions (e.g., user starts speaking while the AI is replying).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector search (Handled by RAG Engine in Chat Service).
* Legal reasoning prompts (Handled by Chat Service).
* Phone call interception (This operates via the app UI, not standard phone lines).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `LegalChatService` | To generate the actual answer | Text stream |
| `AIGateway (STT/TTS)` | To process audio | Audio streams |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend Mobile App / Web App** (to play the audio).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user taps the "Microphone" icon in the mobile app or web interface.

## 3.2 User Input
Spoken audio (Microphone stream).

## 3.3 User Flow

```text
User taps mic and says: "Did the Smith contract have a non-compete?"
  ↓
UI streams audio to Service via WebSocket.
  ↓
Service transcribes audio -> "Did the Smith contract have a non-compete?"
  ↓
Service sends text to Legal Chat Service.
  ↓
Legal Chat Service streams text back: "Yes, there is a 2-year non-compete."
  ↓
Service converts text to audio on the fly.
  ↓
Service streams audio chunks back to UI.
  ↓
UI plays audio: "Yes, there is a two-year non-compete."
```

## 3.4 User States
* `Listening`
* `Thinking`
* `Speaking`

## 3.5 User-Visible Result
A conversational voice interface similar to Siri or Alexa, but strictly grounded in the user's uploaded legal documents.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Voice Conversation Workflow

```text
WEBSOCKET CONNECTION `/ws/voice/{session_id}`
  ↓
Client streams PCM audio chunks.
  ↓
Accumulate audio until Voice Activity Detection (VAD) detects silence (end of speech).
  ↓
Send audio to STT Provider -> Get Text.
  ↓
Call `ChatService.stream_response(text)`.
  ↓
As `ChatService` yields text tokens (e.g., sentence by sentence):
  Send sentence to TTS Provider -> Get Audio Chunk.
  Stream Audio Chunk back to Client via WebSocket.
  ↓
Wait for next user input.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `session_id` | `UUID` | Yes | Maps to the chat history |
| `audio_stream`| `Binary` | Yes | Typically 16kHz PCM or Opus |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Must reject WebSocket connections if the user's `workspace_id` is invalid or authentication fails.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Streaming binary audio chunks.

## 6.2 Output Structure
```text
[WebSocket Binary Frame: Opus/PCM encoded audio]
[WebSocket Text Frame: {"type": "transcript", "text": "Yes, there is a 2-year..."}]
[WebSocket Text Frame: {"type": "citation", "chunk_id": "uuid"}]
```

## 6.3 Output Rules
* The service must return BOTH the binary audio and the text transcript. The UI needs the text transcript to display on the screen (like closed captions) and to render the clickable citations that the Chat service generated.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Interruption Handling:** If the user starts speaking while the AI is currently playing audio back, the server MUST instantly abort the current TTS generation and switch back to `Listening` mode.
* **Pronunciation Filtering:** The service must strip complex Markdown (like URLs, markdown tables, or `[Source: 1]` citation blocks) from the text *before* sending it to the TTS provider. The TTS should not literally say "Bracket Source Colon One Bracket".

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* If the STT provider returns gibberish due to background noise, gracefully ask the user to repeat themselves via a pre-recorded/cached error audio file to save TTS latency.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Handled by the underlying Chat Service.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Speech-to-Text and Text-to-Speech conversion.

## 9.4 AI Rules
* **Latency is King.** Use the fastest possible STT (e.g., Whisper-v3 or Groq/Whisper) and the fastest TTS (e.g., ElevenLabs Turbo or OpenAI TTS). A voice conversation breaks down if there is a 5-second pause between the user finishing a sentence and the AI starting to reply.

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt (STT)
* The STT provider should be prompted with a custom vocabulary (if supported by the API) containing common legal terms (e.g., "force majeure", "mutatis mutandis", "indemnification", "certiorari") to improve transcription accuracy.

## 10.4 Prompt Rules
N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A - Delegated to Chat Service.

---

# 12. BACKGROUND PROCESSING

N/A - Must be highly synchronous and real-time.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. Relies on the `chat_messages` table maintained by the Chat Service.

## 13.5 Database Rules
N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `WS /api/v1/workspaces/{id}/voice/stream`

---

# 16. ERROR HANDLING

## Error Rules
* WebSocket disconnections must be handled gracefully. Clean up any lingering TTS streams in memory.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Standard JWT token passed during the initial WebSocket handshake.

---

# 18. SOURCE & TRACEABILITY

N/A - Delegated to Chat Service.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The UI must display the standard AI disclaimer. Since audio cannot display a disclaimer easily, the UI screen active during the voice chat must show it.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* **Voice-to-Voice Latency:** The total time from the user stopping speaking to the AI starting speaking should be `< 1.5 seconds`.
  * STT Translation: ~300ms
  * RAG + Chat Generation (First Sentence): ~600ms
  * TTS Generation (First Sentence): ~400ms

## 20.2 Large Input Handling
* The TTS engine should process text sentence-by-sentence as it streams in from the Chat Service, rather than waiting for the entire paragraph to be generated.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/voice_service.py` | Audio WebSocket orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[Mobile App] ◄──(WebSocket)──► [Voice Service]
                                    │
                                    ├──► [STT Provider] (Audio -> Text)
                                    │
                                    ├──► [Legal Chat Service] (Text -> Text)
                                    │
                                    └──► [TTS Provider] (Text -> Audio)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Voice session 123. STT: 300ms. Chat TTFT: 500ms. TTS TTFA: 400ms. Total Latency: 1200ms.`

---

# 25. OBSERVABILITY

## Metrics
* Track `voice_total_latency`. If latency exceeds 2 seconds, the conversation feels unnatural and users will abandon the feature.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Assert that the text filtering logic correctly removes `[Source: 1]` before passing the string to the mocked TTS provider.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Interrupting` | The user says "Stop" while the AI is reading a 3-minute summary. The server detects the Voice Activity, instantly kills the TTS stream, and listens to the new command. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `STT_PROVIDER` | Which API to use for STT | Yes | `whisper-v3` |
| `TTS_PROVIDER` | Which API to use for TTS | Yes | `elevenlabs` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* WebSockets require long-lived connections. Ensure the load balancer (e.g., Nginx, AWS ALB) does not aggressively timeout WebSocket connections.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Accepts audio streams and successfully transcribes legal terms.
* [ ] Filters markdown and citations out of spoken audio.
* [ ] Returns both binary audio and text transcripts to the client.
* [ ] Voice-to-Voice latency is under 2 seconds.

---

# 32. DEFINITION OF DONE

The Legal Voice Assistant service is **DONE** when a user can talk to their phone like a walkie-talkie, ask complex questions about an uploaded contract, and have a highly responsive, natural-sounding voice read the exact answer back to them instantly.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Do not put RAG logic here; call the Chat service).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides a hands-free, Siri-like voice interface for querying legal documents.

## What the user sees
A microphone button that, when pressed, enables a real-time spoken conversation with their document repository.

## What happens in the background
The service manages a WebSocket connection, transcribes user audio to text, hands the text off to the Legal Chat service to perform vector search and AI reasoning, and then converts the resulting text answer back into a natural voice stream, filtering out markdown and citations so it sounds human.

## What it receives
Audio streams (PCM/Opus).

## What it produces
Audio streams and text transcripts.

## Success means
Lawyers can interact with their case files while commuting or walking into court, drastically improving accessibility and user engagement.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
