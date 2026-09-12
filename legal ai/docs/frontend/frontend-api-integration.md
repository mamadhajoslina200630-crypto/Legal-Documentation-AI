# Legal AI Platform (Frontend API Integration)

> **Purpose:** Complete implementation blueprint for `Frontend API Integration`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Frontend API Integration`

## 1.2 Service ID

`sys-frontend-api-core-platform`

## 1.3 Service Category

`Platform Engineering & User Interface`

## 1.4 Service Type

`Client-Side Networking`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Frontend API Integration architecture must:

* Define the standardized methods the React application uses to communicate with the FastAPI backend over HTTP/HTTPS.
* Handle authentication automatically by intercepting requests and attaching JWT Bearer tokens.
* Manage Server-Sent Events (SSE) or WebSockets for real-time AI chat streaming.
* Translate backend JSON Error Envelopes into JavaScript errors that React can handle.

The service must **not** perform business logic or state caching (Caching belongs to Frontend State Management).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
If every frontend developer writes manual `fetch()` calls, the codebase will quickly become a nightmare of inconsistent error handling, missing security tokens, and memory leaks. A centralized API client ensures that all network traffic is secure, standardized, and strictly typed.

## 1.7 User Value

Explain what the user gains from this service.
Seamless security. If their login session expires while they are using the app, this layer detects the `401 Unauthorized` error and safely redirects them to the login screen without crashing their browser or losing their unsaved work.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A configured `axios` instance with request and response interceptors, alongside a library of TypeScript interfaces that perfectly mirror the backend's Pydantic schemas.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Axios instance configuration (Base URLs, Timeouts).
* Axios Interceptors (Request headers, Response error handling).
* SSE (Server-Sent Events) consumer for AI streaming.
* File Upload handling (FormData encoding).
* TypeScript interfaces for API requests/responses.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Caching API responses (This is handled by React Query wrapping this Axios client).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `FastAPI Backend` | The target server | JSON |
| `Auth Service` | Where to get the JWT | Tokens |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**React Query hooks** use these API functions to fetch data.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A - This is a networking layer invisible to the user.

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

### Standard Request Workflow

```text
React Component calls `fetchDocuments()`
  ↓
`fetchDocuments` calls `apiClient.get('/workspaces/123/documents')`
  ↓
AXIOS REQUEST INTERCEPTOR:
  Retrieves JWT from storage, adds `Authorization: Bearer <token>`
  ↓
HTTP GET sent to Backend
  ↓
Backend Returns JSON
  ↓
AXIOS RESPONSE INTERCEPTOR:
  If 200 OK -> Return data
  If 401    -> Trigger Logout flow
  If 400/500-> Format error, throw `ApiException`
  ↓
React Query caches result
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `endpoint`| `String` | Yes | e.g., `/documents` |
| `method`  | `Enum`   | Yes | `GET`, `POST`, `PUT`, `DELETE` |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `data`    | `Object` | `null` | JSON payload for POST/PUT |

## 5.3 Input Validation Rules
N/A

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
JavaScript Promises containing strictly typed data objects.

## 6.2 Output Structure
```typescript
interface DocumentResponse {
  id: string;
  filename: string;
  status: 'READY' | 'FAILED';
}
```

## 6.3 Output Rules
N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Type Safety:** The frontend MUST maintain TypeScript interfaces that exactly match the backend OpenAPI (Swagger) schema. If the backend changes a field from `userId` to `user_id`, the frontend types must be updated to catch errors at compile time.
* **Centralized Client:** Components must NEVER import `axios` directly or use the native `fetch` API. They must import the centralized `apiClient` instance to ensure security headers are attached.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules

* The response interceptor MUST translate the backend's JSON Error Envelope into a standard JavaScript `Error` object that includes the specific `error_code` (e.g., `DOCUMENT_NOT_FOUND`) so the UI can display custom messages.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
Consuming AI outputs smoothly.

## 9.4 AI Rules

* **Streaming:** Standard Axios GET/POST calls wait for the entire response to finish before returning. For AI Chat, the integration layer MUST use the browser's `EventSource` API (or `fetch` with streaming readers) to process Server-Sent Events, allowing the React UI to update character-by-character as the AI "types".

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A

---

# 13. DATABASE RESPONSIBILITY

N/A

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

*(This document dictates how the API contract is enforced on the client).*

---

# 16. ERROR HANDLING

## Error Rules

* Network timeouts (e.g., waiting 30 seconds for a response) must be caught and return a specific "Connection Timeout" error rather than a generic failure.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* The `apiClient` is solely responsible for ensuring the user's identity travels with every request.

## 17.3 Sensitive Data
* **No JWT Logging:** The Axios request interceptor must never log the `Authorization` header to the browser console.

## 17.4 Security Rules
* Ensure `withCredentials: true` is configured if the backend is using HttpOnly cookies for sessions (instead of local storage JWTs) to handle CORS correctly.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* The API Client itself adds `< 1ms` of overhead to the HTTP request.

## 20.2 Large Input Handling

* **File Uploads:** When uploading large PDFs, the `apiClient` must configure the `Content-Type` to `multipart/form-data` and attach an `onUploadProgress` callback to update the UI progress bar.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Base Client    | `src/lib/apiClient.ts` | Axios instance & Interceptors |
| API Services   | `src/api/` | Domain-specific functions (e.g., `documentApi.ts`) |
| Types          | `src/types/api/` | TypeScript interfaces |

---

# 22. SERVICE CONNECTIONS

```text
[React Query] ──► [src/lib/apiClient.ts] ──► [FastAPI Backend]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* In development mode (`NODE_ENV === 'development'`), the interceptor can log API requests/responses to the browser console for easier debugging. This MUST be disabled in production.

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Use `axios-mock-adapter` or `msw` (Mock Service Worker) to unit test the API services. Ensure that an API function correctly parses a mocked JSON response into the expected TypeScript object.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `502 Bad Gateway` | Typically means the backend deployment is restarting. The API Client should throw a generic "Server is temporarily unavailable" error. |

---

# 28. VERSIONING

## Compatibility Rules

* The `apiClient` baseURL should include the API version (e.g., `https://api.legalplatform.com/v1/`).

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Target server | Yes | `http://localhost:8000/api/v1` |
| `TIMEOUT_MS` | Max wait time | No | `30000` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] All outgoing requests automatically contain the JWT Bearer token.
* [ ] 401 errors automatically trigger a logout/redirect sequence.
* [ ] File uploads correctly stream multipart data.
* [ ] AI Streaming correctly processes Server-Sent Events without waiting for the connection to close.

---

# 32. DEFINITION OF DONE

The Frontend API Integration is **DONE** when UI developers can import strongly-typed API functions (`import { uploadDocument } from '@/api/documents'`) and use them without needing to manually configure headers, JSON parsing, or error catching.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (No UI logic in the API client).
2. **Unsupported input must fail safely.**
3. **Secrets must never be committed to source control.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the communication bridge between the user's browser and the backend cloud infrastructure.

## What the user sees
N/A (Internal).

## What happens in the background
A centralized Axios client intercepts all network requests, attaches necessary security tokens, handles file uploads, parses streaming AI text, and gracefully translates backend server crashes into safe frontend UI states.

## What it receives
Function calls from React.

## What it produces
Network HTTP Requests.

## Success means
The frontend is secure, strictly typed, and completely immune to backend API failures crashing the browser tab.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
