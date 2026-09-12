# Legal AI Platform (Legal AI Chat)

> **Purpose:** Complete implementation blueprint for `Legal AI Chat`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal AI Chat`

## 1.2 Service ID

`sys-legal-chat-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Real-Time Streaming Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal AI Chat service must:

* Allow a user to converse with one or more legal documents in real-time.
* Execute the Retrieval-Augmented Generation (RAG) pipeline to fetch relevant document chunks based on the user's query.
* Construct prompts combining chat history, retrieved legal chunks, and strict grounding instructions.
* Stream the LLM's response back to the client via Server-Sent Events (SSE) while injecting precise citations to the original document pages.

The service must **not** perform background processing (like full document summarization). It is strictly a synchronous, interactive interface.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Finding a specific answer in a 500-page lease can take hours of `Ctrl+F` and manual reading. The Chat service acts as a hyper-intelligent search engine, allowing the lawyer to simply ask, "Who pays for roof repairs?" and instantly receive a cited answer, drastically accelerating legal research and due diligence.

## 1.7 User Value

Explain what the user gains from this service.
An interactive, conversational assistant that perfectly understands their specific documents. It feels like chatting with the person who wrote the contract.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A robust set of API endpoints supporting streaming responses, connected to a sophisticated LangChain/LlamaIndex RAG pipeline that fetches context from Qdrant and manages conversational memory in PostgreSQL.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Maintaining Chat Sessions (Conversational Memory/History).
* Query translation (turning "What about the second one?" into a search-friendly query based on history).
* Executing vector search against Qdrant (via RAG architecture).
* Formatting the final LLM prompt.
* Streaming responses back to the HTTP client (SSE).
* Citation mapping (linking claims back to `chunk_id`).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Initial document parsing and vectorization (Handled by Legal Document Analysis).
* Generating static executive summaries (Handled by Legal Document Summarization).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `RAG Architecture` | Vector search | Relevant text chunks |
| `AIGateway` | Text generation | Streaming tokens |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the chat UI).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User opens a document (or a workspace folder) and types a question into the Chat sidebar.

## 3.2 User Input
A natural language text string (e.g., "What is the governing law?").

## 3.3 User Flow

```text
User submits a prompt.
  ↓
UI displays a loading indicator (Thinking...).
  ↓
Service searches Qdrant for text chunks relevant to the prompt.
  ↓
Service sends context + prompt to AI Gateway.
  ↓
AI Gateway returns text stream.
  ↓
UI renders the text character-by-character as it arrives.
  ↓
Text finishes, UI renders clickable citation badges (e.g., [Page 4]).
```

## 3.4 User States
* `Idle`
* `Retrieving Context`
* `Streaming Response`

## 3.5 User-Visible Result
A conversational chat bubble containing an answer and clickable source citations.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Chat Streaming Workflow

```text
HTTP REQUEST `POST /chat/{session_id}/message`
  ↓
Retrieve previous chat history (last 5 messages) for `session_id`.
  ↓
(Optional) Query Translation: Use a fast LLM to rewrite the user's input into a standalone search query based on history.
  ↓
Vector Search (RAG): Query Qdrant for top 5 most similar chunks.
  ↓
Construct Prompt:
  System: "You are a legal assistant..."
  Context: [Inserted Chunks]
  History: [Previous Messages]
  User: [Latest Input]
  ↓
Call `AIGatewayService.stream_chat(prompt)`.
  ↓
Yield tokens via FastAPI `StreamingResponse`.
  ↓
Save final completed message and AI response to the database asynchronously.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `session_id`  | `UUID` | Yes | Maps to a specific conversation thread |
| `message`     | `String` | Yes | The user's question |
| `document_ids`| `Array`| Yes | Restricts search to these specific files |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* If `document_ids` is empty, the service must either throw a `NoDocumentsSelectedError` or search across the entire Workspace, depending on the UX design.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A continuous stream of Server-Sent Events (SSE).

## 6.2 Output Structure
```text
data: {"token": "The "}
data: {"token": "governing "}
data: {"token": "law "}
data: {"token": "is "}
data: {"token": "New York. "}
data: {"citations": [{"chunk_id": "uuid", "page": 4}]}
data: [DONE]
```

## 6.3 Output Rules
* The service MUST use a streaming protocol. Returning a single massive JSON block after waiting 20 seconds is an unacceptable user experience for chat.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Strict Grounding:** The LLM MUST be instructed to answer *only* using the provided context chunks. If the answer is not in the context, it must reply: "I cannot find the answer to that in the provided documents." It must never guess or use outside knowledge.
* **Mandatory Citations:** Every factual claim made by the AI must be backed by a citation to a specific chunk so the lawyer can verify the claim.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a user asks "What is my name?", and the name isn't in the contract, the AI must refuse to answer based on the grounding rule.

## 7.4 Failure Rules
* If the AI Gateway times out, the stream must yield an error event instructing the frontend to display: "The AI provider is currently unavailable. Please try again."

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* The service relies entirely on the `document_chunks` table and the Qdrant vector store created by the Analysis service.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Conversational interaction and reading comprehension.

## 9.4 AI Rules
* Use a fast, highly capable model for chat (e.g., GPT-4o-mini or Claude 3 Haiku) to ensure latency is extremely low (Time-To-First-Token < 1 second).

---

# 10. AI PROMPT RESPONSIBILITY

## 10.1 System Prompt
```text
You are a highly precise legal assistant.
You must answer the user's question based strictly on the provided Context.
If the Context does not contain the answer, you must state: "The provided documents do not contain this information." Do not use outside knowledge.
When you state a fact from the Context, you MUST append a citation block referencing the Source ID, e.g., [Source: 1].
```

## 10.2 User Prompt
```text
CONTEXT:
[Source 1]: ...text...
[Source 2]: ...text...

CHAT HISTORY:
User: ...
Assistant: ...

USER QUESTION: {user_input}
```

## 10.4 Prompt Rules
* The prompt must map the database `chunk_id` to a simple integer (Source 1, Source 2) during generation to save tokens and prevent the LLM from hallucinating long UUID strings. The backend then maps the integer back to the UUID before sending the final citations to the client.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* Queries Qdrant.

## 11.2 Chunking Rules
N/A (Consumed, not created).

## 11.3 Vector Search Rules
* Perform a "Hybrid Search" if possible (Dense Vector similarity + Sparse Keyword BM25) to ensure names and exact numerical dates are found accurately.
* Filter the Qdrant search explicitly by the `document_ids` provided in the HTTP request.

---

# 12. BACKGROUND PROCESSING

N/A - Chat must be synchronous and real-time. Do not use Celery for chat generation.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `chat_sessions` table (metadata about a conversation thread).
* `chat_messages` table (history of user and AI messages).

## 13.5 Database Rules
* Saving the chat message to PostgreSQL must happen *asynchronously* after the stream finishes, or in a background task, so database latency does not delay the text streaming to the user.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/chat/sessions` (Create a new thread)
* `GET /api/v1/workspaces/{id}/chat/sessions/{session_id}/messages` (Load history)
* `POST /api/v1/workspaces/{id}/chat/sessions/{session_id}/stream` (Send message, returns SSE stream)

---

# 16. ERROR HANDLING

## Error Rules
* If the user sends a message that violates content safety guidelines, return an HTTP 400 Bad Request immediately without calling the AI provider.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Verify `workspace_id` on the Session.
* **CRITICAL:** When generating the Qdrant query, you MUST inject the `workspace_id` as a hard filter. If omitted, a user could ask a question and accidentally retrieve context chunks from another company's documents.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* See 10.4. The mapping of LLM integer citations back to database `chunk_ids` is the most important part of this service. Without accurate citations, the chat is untrustworthy.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* All chat interfaces must include a permanent disclaimer: *"AI can make mistakes. Verify critical claims using the provided citations before taking legal action."*

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Time-To-First-Token (TTFT): The user must see the first word typing out in `< 2 seconds` from the moment they hit enter.

## 20.2 Large Input Handling
* If the chat history grows too large (> 100 messages), the service must truncate the history sent to the LLM to only the last 10 messages to avoid exceeding the context window and burning unnecessary API costs.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Chat Service   | `backend/app/services/chat_service.py` | Orchestration & Streaming |
| RAG Engine     | `backend/app/services/rag_engine.py` | Qdrant vector retrieval |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Route] ──► [Chat Service] ──► [RAG Engine] ──► [Qdrant]
                                          │
                                          └──► [AIGateway (Streaming)]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log the latency of the RAG retrieval step to monitor Qdrant performance.
  * `INFO: Chat RAG retrieval completed in 150ms. Found 5 chunks.`

---

# 25. OBSERVABILITY

## Metrics
* Track `chat_ttft_seconds` (Time To First Token) closely. If this spikes above 3 seconds, the user experience will feel broken.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Mock the Qdrant client to return a specific chunk of text about "Payment Terms: Net 90".
* Mock the AI Gateway to return a streaming response.
* Assert that the `ChatService` correctly consumes the mock stream and formats the SSE output properly.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Broad Questions` | If the user asks "Summarize all 50 documents in this folder", the RAG retrieval (which only fetches top 10 chunks) will fail to provide enough context. The AI must be prompted to reply: "I can only answer specific questions. To summarize entire documents, please use the Summarize button." |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `CHAT_MODEL` | Which LLM to use | Yes | `gpt-4o-mini` |
| `RAG_TOP_K` | How many chunks to retrieve | No | `5` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Because SSE keeps the HTTP connection open for several seconds, the FastAPI deployment (Uvicorn/Gunicorn) must be configured with enough worker connections to handle long-lived connections without exhausting the connection pool.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Text streams smoothly character-by-character to the UI.
* [ ] The AI refuses to answer questions not covered by the document text.
* [ ] Citations correctly link back to the exact source chunk.
* [ ] Chat history is remembered for follow-up questions.

---

# 32. DEFINITION OF DONE

The Legal AI Chat service is **DONE** when a user can open a 200-page lease, ask "Who pays for the roof?", watch the answer stream instantly onto the screen, and click a [Page 45] badge to jump exactly to the paragraph proving the AI's answer.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Save messages asynchronously to prevent blocking).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides a real-time conversational interface allowing users to "talk" to their legal documents.

## What the user sees
A familiar, ChatGPT-style messaging interface docked next to their PDF viewer, offering instant, cited answers.

## What happens in the background
The service intercepts the question, searches the vector database for relevant paragraphs, bundles the history, context, and strict rules into a prompt, and streams the AI's response back to the client while simultaneously mapping citations.

## What it receives
User messages and Session IDs.

## What it produces
Streaming text and database chat history.

## Success means
Lawyers trust the chat because it never hallucinates facts and always points them exactly to the source text proving its claims.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
