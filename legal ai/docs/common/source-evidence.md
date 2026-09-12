# Legal AI Platform (Source Evidence)

> **Purpose:** Complete implementation blueprint for `Source Evidence`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Source Evidence & Citations`

## 1.2 Service ID

`sys-common-source-evidence`

## 1.3 Service Category

`Common Infrastructure / Trust & Verification`

## 1.4 Service Type

`Internal API / UI Middleware`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Source Evidence service must:

* Enforce rigorous citation rules across all AI-generated content (Chat, Summaries, Risk Reports).
* Parse AI outputs to detect citation markers (e.g., `[Source: 3]`).
* Map those citation markers back to the exact `chunk_id` and `document_id` that the `Document Context` service injected into the prompt.
* Provide the frontend UI with the geometric bounding boxes (X/Y coordinates) and page numbers for those chunks, enabling the UI to render clickable links that highlight the exact text on the original PDF scan.

The service must **not** generate the answers itself. It strictly acts as the verification and linking layer to prove the AI isn't hallucinating.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers will absolutely not trust an AI that says "Your client owes $50,000" unless the AI can point directly to the line in the contract that proves it. Hallucinations are the biggest barrier to AI adoption in legal tech. This service provides the undeniable "Evidence" layer, ensuring every AI claim is instantly verifiable against the source document.

## 1.7 User Value

Explain what the user gains from this service.
Absolute trust. When reading an AI summary, the user can click a small blue `[1]` and instantly watch the document viewer jump to Page 14 and highlight the exact paragraph the AI used to generate that summary.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A standardized JSON citation payload attached to every AI response, containing the chunk UUIDs, page numbers, and UI bounding boxes necessary for interactive verification.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Injecting strict Citation Rules into System Prompts via the `AI Gateway`.
* Parsing markdown streams for citation tags.
* Looking up bounding box metadata from the `document_chunks` table.
* Formatting the final payload for the frontend.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Vector searching (Handled by Legal Search).
* UI Rendering (Handled by the Frontend PDF Viewer).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Document Context` | To know which chunks were sent | `used_chunk_ids` |
| `DocumentRepository` | To get page/location data | `document_chunks` table |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Legal AI Chat**, **Legal Risk Detection**, **Legal Document Summarization**, **Frontend API**.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user reads an AI-generated response in the Chat or Risk Dashboard.

## 3.2 User Input
User clicks a citation marker (e.g., `[1]`).

## 3.3 User Flow

```text
User asks: "What is the governing law?"
  ↓
Chat Service returns: "The governing law is Delaware [1]."
  ↓
User clicks "[1]".
  ↓
Frontend reads the `citations` array in the JSON response payload.
  ↓
Frontend uses the provided bounding box coordinates to scroll the PDF viewer to Page 12 and highlight a specific paragraph in yellow.
```

## 3.4 User States
* `Reading`
* `Verifying Source`

## 3.5 User-Visible Result
A highly interactive, deeply linked text response that behaves like Wikipedia citations but links directly to visual highlights on the uploaded PDF.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Citation Verification Workflow

```text
CALL `SourceEvidence.process_response(ai_text, used_chunk_ids)`
  ↓
Parse `ai_text` with regex to find all markers (e.g., `\[Source: (\d+)\]`).
  ↓
For each marker found:
  Map the integer `1` to the 1st UUID in the `used_chunk_ids` array.
  Fetch `page_number` and `bounding_box` for that chunk from Postgres.
  ↓
Construct the Citations Array:
  [
    {
      "marker_id": 1,
      "chunk_id": "uuid",
      "document_id": "uuid",
      "page_number": 12,
      "highlight_cords": [100, 250, 400, 300]
    }
  ]
  ↓
RETURN `{ "clean_text": "...", "citations": [...] }`
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `raw_ai_text` | `String` | Yes | The text containing raw citation markers |
| `used_chunk_ids` | `List[UUID]` | Yes | The exact chunks that were fed to the LLM |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* If the AI hallucinated a source marker (e.g., generated `[Source: 9]` when only 3 chunks were provided), the service must strip the hallucinated marker from the text and log a hallucination warning.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
A structured payload separating the text from its citation metadata.

## 6.2 Output Structure
```json
{
  "text": "The governing law is Delaware [1].",
  "citations": [
    {
      "id": 1,
      "document_id": "123e4567-e89b-12d3-a456-426614174000",
      "page": 12,
      "bounding_boxes": [{"x": 100, "y": 200, "width": 500, "height": 50}],
      "snippet": "This Agreement shall be governed by the laws of Delaware."
    }
  ]
}
```

## 6.3 Output Rules
* The output format MUST match the exact JSON schema expected by the Frontend PDF Viewer component to instantly render the highlights.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Strict Citation Prompting:** The `AI Gateway` system prompt MUST include a strict rule: *"You must cite your sources. After stating a fact, append the citation marker corresponding to the provided text block, formatted exactly as [Source: N]. Do not combine markers."*
* **Zero-Hallucination Fallback:** If the `raw_ai_text` does not contain any citation markers, but the service was configured to require them (e.g., in a high-risk Legal Review), the backend should append a disclaimer to the user: *"Warning: The AI could not cite a specific source for this claim."*

## 7.2 Validation Rules
* See 5.3. Invalid citations must be stripped to protect user trust.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
N/A

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Requires the bounding box / layout geometry stored during the `OCR & Text Extraction` phase.

---

# 9. AI RESPONSIBILITY

N/A - This is a validation layer for AI output.

---

# 10. AI PROMPT RESPONSIBILITY

N/A - The prompt injection happens via the Context Manager.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A - Runs synchronously during streaming/response generation.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* None. Read-only access to `document_chunks`.

## 13.5 Database Rules
* Requires fast lookup by `chunk_id`.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* Internal Library method: `resolve_citations(text, chunk_ids)`

---

# 16. ERROR HANDLING

## Error Rules
* If the database cannot find the `chunk_id` (e.g., it was deleted mid-query), silently omit the highlight coordinates but keep the page number if known.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Internal service-to-service validation.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements
* This entire service is the definition of Source Traceability. It is the core mechanism that allows the platform to be trusted by legal professionals.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Must parse regex and fetch DB rows in `< 20ms`.
* **Streaming Support:** If the Chat service is streaming tokens via WebSockets, this service must have a streaming mode that intercepts the stream, detects when a `[Source: 1]` token is completed, and emits a JSON payload over the WebSocket concurrently with the text.

## 20.2 Large Input Handling
N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Service Logic  | `backend/app/core/citations.py` | Regex parsing and UI mapping |

---

# 22. SERVICE CONNECTIONS

```text
[AI Gateway] ──(Raw Text)──► [Source Evidence Service] ──► [PostgreSQL]
                                    │
                                    └──(JSON Payload)──► [Frontend UI]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `WARN: AI Hallucinated Citation [Source: 9]. Only 4 chunks were provided. Stripped from output.`

---

# 25. OBSERVABILITY

## Metrics
* Track `hallucinated_citation_rate`. If this spikes, the System Prompt needs to be adjusted because the LLM is disobeying the citation rules.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Regex Parsing:** Pass the string `"Hello [Source: 1]. World [Source: 2]."` and assert it correctly extracts integers 1 and 2.
* **Test Hallucination Stripping:** Pass the string `"Total is $500 [Source: 5]."` with an array of only 3 `chunk_ids`. Assert the output string is `"Total is $500."` and the citation array is empty.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Combined Citations` | Sometimes an LLM will output `[Source: 1, 2]`. The regex parser must be robust enough to handle comma-separated lists and split them into two distinct UI citations. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

N/A

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Extracts citation markers via Regex from text streams.
* [ ] Strips hallucinated markers (out of bounds).
* [ ] Retrieves exact X/Y geometry for the frontend PDF viewer.
* [ ] Supports comma-separated multiple citations (`[1, 2]`).

---

# 32. DEFINITION OF DONE

The Source Evidence service is **DONE** when a user can click any footnote generated by the AI and watch the PDF viewer flawlessly jump to the exact highlighted sentence that the AI used to form its conclusion.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Strip bad citations).
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the "Proof" layer, linking AI-generated answers back to the physical source documents.

## What the user sees
Wikipedia-style clickable footnotes at the end of AI sentences that seamlessly navigate the document viewer to the highlighted source text.

## What happens in the background
The service intercepts AI text, uses regex to hunt for citation markers, cross-references those markers with the database to find the exact geometric bounding box of the text on the scanned PDF, and packages that data for the UI.

## What it receives
Raw AI text and a list of authorized chunk UUIDs.

## What it produces
Cleaned text and geometric citation metadata.

## Success means
Lawyers trust the system because they never have to blindly believe the AI; they can always verify the source with a single click.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
