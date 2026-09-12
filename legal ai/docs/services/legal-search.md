# Legal AI Platform (Legal Search)

> **Purpose:** Complete implementation blueprint for `Legal Search`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Legal Search`

## 1.2 Service ID

`sys-legal-search-service`

## 1.3 Service Category

`Core Business Logic & AI Processing`

## 1.4 Service Type

`Synchronous Data Retrieval Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Legal Search service must:

* Provide a unified, lightning-fast search experience across a user's entire workspace of legal documents.
* Execute **Hybrid Search**, combining Dense Vector retrieval (semantic meaning) with Sparse Vector / BM25 retrieval (exact keyword matching).
* Apply strict metadata pre-filtering (e.g., "Only search documents tagged 'NDA'").
* Return ranked search results with text snippets and exact `chunk_id` citations.

The service must **not** generate new text or answer questions (that is handled by Legal AI Chat). It only retrieves existing information.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Law firms have tens of thousands of documents. Standard keyword search (like Ctrl+F) fails when a lawyer searches for "force majeure" but the contract says "Act of God". Pure vector search fails when a lawyer searches for a specific Bates number like "DOC-12345". This service solves both by combining semantic understanding with exact keyword precision, drastically reducing research time.

## 1.7 User Value

Explain what the user gains from this service.
Google-like search for their private legal repository. They can instantly find past precedents, specific clauses, or hidden terms across thousands of files in milliseconds.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
An API endpoint that takes a search query and a set of filters, queries Qdrant (and optionally PostgreSQL for exact text), ranks the results using a Cross-Encoder reranker, and returns a structured list of highly relevant text chunks.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Hybrid Search orchestration (Dense + Sparse).
* Query translation (embedding the user's search string into a vector).
* Cross-Encoder Reranking (re-ordering the top 50 results for maximum relevance).
* Metadata filtering (by date, document type, author).
* Generating text highlight snippets around the matched terms.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vectorizing the documents upon upload (Handled by Legal Document Analysis).
* Generating AI answers (Handled by Chat).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Qdrant` | Vector database | Vector Indexes |
| `EmbeddingService` | To vectorize the search query | Query Vectors |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend API** (to render the global search bar results) and **Legal AI Chat** (which uses this service internally to fetch RAG context).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user types into the global search bar at the top of the dashboard.

## 3.2 User Input
A text string and optional filter dropdowns (e.g., Date Range).

## 3.3 User Flow

```text
User types "indemnity for software bugs" and presses Enter.
  ↓
UI shows a quick loading spinner.
  ↓
Service vectorizes the query and searches Qdrant.
  ↓
Service ranks the top 20 hits and formats text snippets.
  ↓
UI instantly displays a Google-style list of results.
User clicks a result and is taken to Page 14 of "Vendor_Agreement.pdf", with the exact paragraph highlighted.
```

## 3.4 User States
* `Searching`
* `Viewing Results`

## 3.5 User-Visible Result
A paginated list of search results with contextual text snippets.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Hybrid Search Workflow

```text
HTTP REQUEST `GET /search?q="software bugs"&doc_type="MSA"`
  ↓
Translate Query: Call Embedding Model to generate a dense vector for "software bugs".
  ↓
Execute Qdrant Query:
  - Filter: `workspace_id == current_workspace` AND `doc_type == "MSA"`
  - Dense Vector: [0.012, 0.984, ...] (Finds "glitches", "defects")
  - Sparse Vector/BM25: "software bugs" (Finds exact matches)
  ↓
Retrieve Top N (e.g., 50) results from Qdrant.
  ↓
Rerank: Pass the query and the 50 results through a specialized Cross-Encoder model to score their true relevance.
  ↓
Format Results: Trim text around the hit to create a short snippet.
  ↓
HTTP RESPONSE 200 OK
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `query`   | `String` | Yes | The search term |
| `workspace_id`| `UUID` | Yes | For security isolation |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `filters` | `Object` | `{}` | e.g., `{"document_type": "NDA"}` |
| `limit`   | `Integer`| `20` | Max results to return |

## 5.3 Input Validation Rules
* If `query` is empty but `filters` are provided, the service should fall back to a standard database `SELECT` rather than attempting a vector search on an empty string.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A ranked array of search hits.

## 6.2 Output Structure
```json
{
  "total_hits": 45,
  "results": [
    {
      "document_id": "uuid",
      "document_name": "Acme_Software_MSA_v2.pdf",
      "chunk_id": "uuid",
      "page_number": 14,
      "relevance_score": 0.98,
      "snippet": "...Party A agrees to indemnify Party B for any <mark>software bugs</mark> or defects resulting in..."
    }
  ]
}
```

## 6.3 Output Rules
* Results MUST be sorted by `relevance_score` descending.
* The `snippet` must contain HTML `<mark>` or `<b>` tags around the exact keyword hits to allow the UI to highlight them easily.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Cross-Tenant Isolation:** The absolute most critical rule is that every Qdrant search payload MUST include a `must` filter for `workspace_id`. Vector databases will happily return the closest semantic match in the entire database if you forget to filter it.
* **Hybrid Approach:** Pure vector search often hallucinates relevance (e.g., finding the word "software" when the user explicitly searched for a specific ID like "SW-992"). The service must use Hybrid Search (Dense + Sparse/Keyword) to ensure exact matches are ranked appropriately.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a query is wrapped in quotes (e.g., `"exact phrase match"`), the service should heavily weight the Sparse/Keyword search algorithm over the Dense Vector algorithm.

## 7.4 Failure Rules
* If the Cross-Encoder reranker times out (as it is computationally heavy), the service should gracefully degrade and return the raw, un-reranked results from Qdrant rather than failing the search entirely.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Search results must include the `page_number` so the UI can construct a deep-link directly to the page in the PDF viewer.

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Vector Generation and Semantic Reranking.

## 9.4 AI Rules
* **Embedding Model:** The model used to embed the search query MUST be the exact same model that was used to embed the document chunks in the Legal Document Analysis service (e.g., `text-embedding-3-small`). If there is a mismatch, the search will fail completely.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - This service uses raw embedding vectors, not generative text prompts.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

## 11.1 Knowledge Base
* Strictly relies on Qdrant.

## 11.2 Chunking Rules
N/A (Consumed).

## 11.3 Vector Search Rules
* Use Qdrant's `Payload` filtering to apply the metadata filters (`document_type`, `date_range`, `workspace_id`) *before* the vector distance calculation, ensuring maximum performance.

---

# 12. BACKGROUND PROCESSING

N/A - Search must be highly synchronous and fast.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* N/A - The Search service reads from PostgreSQL and Qdrant, but it doesn't own any unique state itself.

## 13.5 Database Rules
* To populate the `document_name` in the output, the service should fetch the top chunk UUIDs from Qdrant, and then do a `SELECT IN (...)` query against PostgreSQL to join the relational metadata (like filename) before returning the JSON.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces/{id}/search`

---

# 16. ERROR HANDLING

## Error Rules
* If Qdrant is completely down, fail gracefully with an HTTP 503 and a message: "Search is temporarily unavailable."

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* See 7.1. Workspace isolation is the paramount security concern here.

## 17.4 Security Rules
* Ensure that the search string provided by the user is sanitized before being passed into any SQL `LIKE` clauses (if falling back to DB search) to prevent SQL injection.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* The returned `chunk_id` is the source trace.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Search results MUST return to the client in `< 500ms`.
* This requires highly optimized async calls to the Embedding API and Qdrant.

## 20.2 Large Input Handling
* If the user requests 1,000 results, cap it at 100 via the API limits. Humans do not read past page 5 of search results; it wastes compute to rerank 1,000 items.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/services/search_service.py` | Orchestration |
| Vector Client  | `backend/app/core/qdrant_client.py` | Vector DB connection |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Route] ──► [Search Service]
                          │
                          ├──► [Embedding API] (Vectorize query)
                          │
                          ├──► [Qdrant] (Vector & Payload match)
                          │
                          └──► [PostgreSQL] (Fetch relational metadata)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Log search queries and latency (if privacy policy permits) to help tune the search algorithm later.
  * `INFO: Search query "indemnity limit" returned 12 hits in 340ms.`

---

# 25. OBSERVABILITY

## Metrics
* Track `search_latency_ms`.
* Track `zero_result_searches`. If users frequently search for things that yield 0 results, it indicates either a bug in the hybrid search weighting or that users are looking for documents they haven't uploaded.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Mock Qdrant to return a predefined list of ScoredPoints.
* Assert that the Search Service correctly maps these points to the PostgreSQL database, injects the HTML `<mark>` tags into the snippet, and sorts them correctly.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Foreign Languages`| If the user uploads a Spanish contract but searches in English, standard keyword search fails. Dense vector models (like OpenAI's embeddings) are inherently multilingual and will correctly find the Spanish clause matching the English query. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `QDRANT_URL` | Vector DB Location | Yes | `http://localhost:6333` |
| `RERANKER_ENABLED`| Use heavy reranking? | No | `true` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Qdrant must be heavily provisioned with RAM, as vector search relies on keeping the HNSW index in memory for sub-millisecond response times.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Queries execute Dense and Sparse vector searches simultaneously.
* [ ] Results are accurately filtered by `workspace_id`.
* [ ] Snippets are returned with HTML highlighting for the matched terms.
* [ ] Response time is under 500ms.

---

# 32. DEFINITION OF DONE

The Legal Search service is **DONE** when a user can type a vague concept ("what happens if they go bankrupt?") into the global search bar and instantly see the "Insolvency Event" clauses from all 50 of their contracts ranked perfectly by relevance.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Empty queries return 400 or fallback to DB).
3. **Database ownership must be explicit.** (Never query another workspace's vectors).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides a Google-like search engine tailored specifically for a firm's private legal documents.

## What the user sees
A fast, intuitive search bar that returns highly relevant results with context snippets and deep-links directly to the PDF page.

## What happens in the background
The service translates the user's text into mathematical vectors, combines semantic meaning with exact keyword matching, queries an in-memory vector database, reranks the results using AI, and merges the data with the relational PostgreSQL database to return a clean JSON payload.

## What it receives
A text query and metadata filters.

## What it produces
Ranked search results.

## Success means
Lawyers stop manually opening 20 different PDFs to find one specific precedent, completely modernizing how they perform legal research within their own archives.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
