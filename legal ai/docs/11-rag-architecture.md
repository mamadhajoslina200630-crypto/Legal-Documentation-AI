# Legal AI Platform (RAG Architecture)

> **Purpose:** Complete implementation blueprint for `RAG Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - RAG Architecture`

## 1.2 Service ID

`sys-rag-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & Core AI Capabilities`

## 1.4 Service Type

`Backend Data Pipeline & Retrieval Engine`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The RAG (Retrieval-Augmented Generation) Architecture must:

* Define the strategy for breaking down massive legal documents into smaller, meaningful semantic chunks.
* Orchestrate the conversion of these chunks into mathematical vectors (embeddings) and store them in Qdrant.
* Execute highly relevant, low-latency semantic search queries against Qdrant.
* Provide reranking to ensure only the most legally relevant clauses are passed to the AI Provider Layer as context.

The service must **not** manage the raw PDF parsing or OCR extraction. It assumes it receives clean text strings.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
LLMs have strict limits on how much text they can process (Context Windows) and charge per token. A 500-page court transcript cannot be sent directly to an LLM for every chat message. RAG solves this by only retrieving and sending the 3 or 4 pages that actually contain the answer to the user's specific question, drastically reducing costs and preventing LLM hallucinations.

## 1.7 User Value

Explain what the user gains from this service.
Users can ask hyper-specific questions about massive legal documents ("What happens if the contractor is delayed by 3 weeks?") and receive instant, highly accurate answers sourced directly from page 142 of their uploaded contract.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully functional LlamaIndex data ingestion pipeline, a Qdrant semantic search interface, and a BGE Reranker integration that reliably fetches the right context.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Text Chunking strategy (Token limit size, Overlap).
* Embedding Model selection (e.g., `text-embedding-3-small` or open-source BGE).
* Qdrant Collection management and payload indexing.
* Top-K semantic search execution.
* Cross-encoder Reranking (BGE Reranker).
* Injection of retrieved text into LLM prompt contexts.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Initial Document Upload or OCR Text Extraction (This is handled by Document Processing).
* Actual LLM Inference (Handled by the AI Gateway).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Document Processing` | Feeds text to the RAG pipeline | Extracted Text |
| `Qdrant` | Physical vector storage engine | Network Connection |
| `AI Gateway` | To generate embeddings | Embedding API |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
The `Legal AI Chat` and `Legal Search` services depend entirely on this architecture to fetch relevant answers.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

N/A - Users do not interact directly with the RAG pipeline.

## 3.2 User Input

N/A

## 3.3 User Flow

N/A

## 3.4 User States

N/A

## 3.5 User-Visible Result

N/A

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
INDEXING (Background Task)
  ↓
Clean Text Received
  ↓
LlamaIndex Semantic Splitter (Chunking)
  ↓
Generate Embeddings via AI Gateway
  ↓
Store Vectors & Metadata (workspace_id) in Qdrant

RETRIEVAL (Real-time User Request)
  ↓
User Query Received
  ↓
Embed User Query
  ↓
Qdrant Vector Search (Filter by workspace_id) -> Top 20 results
  ↓
BGE Reranker (Scores and filters results) -> Top 5 results
  ↓
Return Context String to Business Service
```

For each step define:

### Step 1 — Chunking & Embedding
**Purpose:** Prepare data for search.
**Input:** Raw Document Text.
**Output:** Embedded Vectors.
**Rules:**
* Chunk size must be optimized for legal text (e.g., 512 tokens with 50 token overlap). Avoid splitting sentences in half.

### Step 2 — Retrieval
**Purpose:** Find relevant text quickly.
**Input:** User Query string.
**Output:** Top-K matching chunks.
**Rules:**
* Hard filter on `workspace_id` is mandatory.

### Step 3 — Reranking
**Purpose:** Improve accuracy of vector search.
**Input:** Top-K chunks + User Query.
**Output:** Filtered, highly relevant chunks.
**Rules:**
* Discard any chunk with a reranker score below a defined confidence threshold (e.g., `< 0.3`) to prevent forcing the LLM to read irrelevant data.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs (For Indexing)

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `text`    | `String` | Yes | The raw document text |
| `document_id`| `UUID`| Yes | For traceability |
| `workspace_id`| `UUID`| Yes | For tenant isolation |

## 5.2 Required Inputs (For Retrieval)

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `query`   | `String` | Yes | User's question |
| `workspace_id`| `UUID`| Yes | MUST be provided to filter Qdrant |
| `document_ids`| `List[UUID]`| No | Optional: Search only specific files |

## 5.3 Input Validation Rules

* Empty queries must be rejected.
* Texts larger than 50MB must be streamed into the chunker to prevent memory spikes.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A compiled, formatted context string containing the most relevant excerpts from the user's documents.

## 6.2 Output Structure

```python
@dataclass
class RetrievedContext:
    formatted_text: str # E.g., "[Page 12]: The contractor shall..."
    source_nodes: List[Dict] # Metadata about where it was found
    total_tokens: int
```

## 6.3 Output Rules

* The returned `formatted_text` must explicitly label the source of the chunk (e.g., `--- SOURCE: Document A, Page 4 ---`) so the downstream LLM can cite its answers correctly.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Tenant Isolation:** Qdrant MUST be configured with a payload index on `workspace_id`. Every single `client.search()` call to Qdrant MUST include a `FieldCondition(key="workspace_id", match=MatchValue(value=current_workspace_id))`.
* **Framework:** Use **LlamaIndex** as the primary orchestration framework for connecting to Qdrant and managing chunking logic.

## 7.2 Validation Rules

N/A

## 7.3 Decision Rules

* If the semantic search returns 0 results above the reranker threshold, the RAG engine must return an empty context. It must not return low-quality chunks just to fill space.

## 7.4 Failure Rules

* If Qdrant is unreachable, the system must throw a `RAGDatabaseError` so the API can return a graceful 503 rather than crashing the chat.

## 7.5 Boundary Rules

* The RAG engine does NOT call the final LLM to generate the answer. It ONLY retrieves the context.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* **Payload Metadata:** Every vector stored in Qdrant must contain a payload resembling:
```json
{
  "workspace_id": "uuid",
  "document_id": "uuid",
  "page_number": 14,
  "chunk_index": 42
}
```

## 8.2 Context Rules

* See Section 7.1. Cross-tenant leakage via semantic search is a critical security violation.

## 8.3 Section-Level Context

* Chunks must map back to their original section or page number so the frontend UI can highlight the text when a user clicks the citation.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

* Used exclusively for generating dense embeddings (e.g., converting "breach of contract" into a 1536-dimensional array of floats).

## 9.2 AI Input

* Short text chunks (e.g., ~500 words max).

## 9.3 AI Output

* Float arrays (Vectors).

## 9.4 AI Rules

* The embedding model must remain consistent. If the platform switches embedding models (e.g., from OpenAI to open-source BGE-m3), the entire Qdrant database must be re-indexed.

## 9.5 AI Provider Independence

* Use the `AI Gateway` to request embeddings, allowing easy swapping of embedding providers.

## 9.6 Model Requirements

* Must support at least 512 token input size. Legal texts require models trained to understand dense professional language.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - RAG retrieval does not use generative prompts. (Though LlamaIndex uses prompts under the hood for some routing tasks, standard semantic search does not).

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

*(This entire document defines this section)*

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks

* **Document Indexing:** Converting a 500-page PDF into embeddings takes time and API calls. This MUST run asynchronously in a Celery worker.

## 12.2 Processing Trigger

* Fired immediately after the `Document Processing` service finishes OCR/Extraction.

## 12.3 Processing Status

* The database `document.status` changes from `Extracting` -> `Indexing` -> `Ready`.

## 12.4 Retry Rules

* Embedding API calls must retry on HTTP 429 Rate Limits using standard backoff rules.

## 12.5 Idempotency

* If an indexing task fails halfway through, the retry mechanism must either delete the partial Qdrant chunks before restarting OR use deterministic UUIDs for vectors so they simply overwrite themselves safely.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

* The Qdrant Vector database.

## 13.4 Database Entities

* Qdrant Collection (e.g., `legal_chunks`).

## 13.5 Database Rules

* Configure Qdrant for fast HNSW indexing. Ensure payload indexes are built on `workspace_id` to speed up query filtering.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

N/A - RAG is accessed via internal Python function calls.

---

# 16. ERROR HANDLING

## Error Rules

Must catch Qdrant gRPC connection errors and API Rate limits.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* The RAG retrieval function requires `workspace_id` as a mandatory parameter to enforce security.

## 17.2 Data Isolation

* RAG filtering is the primary barrier preventing User A from chatting with User B's documents.

## 17.3 Sensitive Data

* The text chunks stored in Qdrant's payload are highly sensitive confidential legal data.

## 17.4 Security Rules

* Qdrant must require API key authentication, even internally on the VPC.

---

# 18. SOURCE & TRACEABILITY

## 18.1 Source Types

* **Document Page.**

## 18.2 Source Requirements

* Every retrieved chunk MUST return its `document_id` and `page_number`. The RAG pipeline is directly responsible for ensuring the final AI can cite its sources.

## 18.3 Missing Source Behavior

N/A - Vectors don't exist without a source document.

---

# 19. LEGAL SAFETY

## 19.1 Accuracy

* Reranking is critical for legal safety. Standard cosine similarity often returns false positives in legal texts (e.g., confusing "Tenant must pay" with "Landlord must pay"). A Cross-Encoder Reranker reads the context deeply to ensure relevance.

## 19.2 Uncertainty
N/A

## 19.3 Unsupported Claims
N/A

## 19.4 Disclaimer Requirements
N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* RAG Retrieval (Embedding query -> Qdrant Search -> Reranking) MUST complete in `< 500ms` so the Chat interface feels snappy.

## 20.2 Large Input Handling

* Celery workers must batch embedding calls (e.g., 100 chunks at a time) rather than sending 5,000 HTTP requests to the AI Gateway sequentially.

## 20.3 Concurrent Usage

* Qdrant scales well horizontally if read-heavy concurrency is required.

## 20.4 Resource Limits

N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Orchestration  | `backend/app/services/rag/engine.py` | Main LlamaIndex setup |
| Indexing       | `backend/app/worker/tasks/index_document.py` | Celery chunking logic |
| Qdrant Setup   | `backend/app/db/qdrant.py` | Collection initialization |

---

# 22. SERVICE CONNECTIONS

```text
[Celery Worker] ──► [AI Gateway (Embeddings)]
      │
      ▼
   [Qdrant]
      ▲
      │
[Business Service (Chat)] ──► [AI Gateway (Embeddings)]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log the number of chunks generated per document.
* Log RAG retrieval latencies and the number of chunks returned.

## 24.2 Audit Logging
N/A

## 24.3 Sensitive Data Rules

* DO NOT log the text of the chunks retrieved from Qdrant.

---

# 25. OBSERVABILITY

## Metrics

* Qdrant collection size.
* Average reranker score of returned results.

## Health

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test the chunking logic. Ensure a 1000-token string correctly splits into two 512-token strings with the correct overlap.

## 26.2 Integration Testing

* Spin up a local Qdrant container, insert mock vectors with `workspace_id="A"` and `workspace_id="B"`.
* Assert that a query for `workspace="A"` absolutely never returns vectors belonging to `B`.

## 26.3 End-to-End Testing
N/A
## 26.4 AI Testing
N/A
## 26.5 Security Testing
* MANDATORY testing of the tenant isolation logic described in 26.2.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Garbage OCR Text` | Chunking logic proceeds, but embeddings will be low quality. Search may degrade gracefully. |
| `Extremely short doc` | Generates 1 chunk. Vector search returns that 1 chunk easily. |

---

# 28. VERSIONING

## Compatibility Rules

* If the embedding model changes, a migration script must be written to re-embed all documents in the database, as vector spaces are incompatible across different models.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `QDRANT_URL` | DB Connection | Yes | - |
| `EMBEDDING_MODEL` | Embedding config | Yes | `text-embedding-3-small` |
| `RAG_TOP_K` | How many chunks to fetch | Yes | `20` |
| `RAG_RERANK_K` | How many chunks to keep | Yes | `5` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* Qdrant requires persistent NVMe storage for high IOPS.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Background worker successfully chunks and inserts a PDF into Qdrant.
* [ ] Query function successfully retrieves text from that PDF based on semantic meaning.
* [ ] Query function absolutely fails to retrieve text from that PDF if queried with a different `workspace_id`.
* [ ] BGE Reranker correctly filters out irrelevant chunks.

---

# 32. DEFINITION OF DONE

The RAG Architecture is **DONE** when the `query_rag()` function can be seamlessly called by the Legal AI Chat service to provide accurate, cited context within 500ms.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (RAG does not analyze risks; it just finds relevant text).
2. **Database ownership must be explicit.** (Qdrant belongs to this pipeline).
3. **Documents must remain associated with the correct workspace and permissions.** (CRITICAL for Qdrant).
4. **Important AI results must remain traceable where possible.** (Must return page numbers).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the "memory" and search capabilities for the AI, allowing it to find specific answers hidden inside massive document vaults.

## What the user sees
N/A (Internal).

## What happens in the background
Cuts documents into small pieces, translates them into math (vectors), stores them in Qdrant, and executes high-speed semantic queries using LlamaIndex.

## What it receives
Raw text for indexing, and user questions for retrieval.

## What it produces
Highly relevant text snippets mapped to specific document page numbers.

## Success means
The AI Chat gives fast, factually accurate answers sourced directly from the user's contract, rather than hallucinating based on its training data.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
