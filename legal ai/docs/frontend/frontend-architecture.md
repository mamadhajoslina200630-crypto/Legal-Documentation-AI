# Legal AI Platform (Frontend Architecture)

> **Purpose:** Complete implementation blueprint for `Frontend Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Frontend Architecture`

## 1.2 Service ID

`sys-frontend-arch-core-platform`

## 1.3 Service Category

`Platform Engineering & User Interface`

## 1.4 Service Type

`Web Application`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Frontend Architecture must:

* Define the core technologies used to build the web application (e.g., React, Next.js, Vite).
* Establish the patterns for how the frontend communicates securely with the backend API (Axios, React Query).
* Provide a seamless, highly responsive Single Page Application (SPA) experience for legal professionals.

The service must **not** perform heavy data processing or execute direct database queries.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Lawyers expect modern, fast, and intuitive tools similar to what they experience in consumer apps. A clunky, slow interface will destroy adoption, regardless of how smart the AI backend is. This architecture ensures the UI is snappy, reliable, and capable of displaying complex legal documents alongside AI chat interfaces.

## 1.7 User Value

Explain what the user gains from this service.
A beautiful, highly interactive dashboard where they can instantly drag-and-drop 500-page contracts, chat with their documents in real-time, and view split-screen analytics without the page ever refreshing.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A structured React repository with defined standards for state management, routing, and component design, compiled into static HTML/JS/CSS bundles for global CDN distribution.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* React Framework configuration (e.g., Next.js App Router or Vite + React Router).
* Styling framework (Tailwind CSS, Radix UI).
* State management (Zustand or Redux Toolkit).
* Data fetching and caching (TanStack Query / React Query).
* WebSocket integration for real-time AI streaming.
* JWT storage and token refresh flows.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Native iOS/Android app development (Handled by a separate mobile architecture if needed).
* Direct database access.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `API Gateway` | To access business logic | JSON HTTP Responses |
| `Auth Service`| To log the user in | JWT Tokens |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
N/A - The frontend is the end of the line (consumed by the human user).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User navigates to `app.legalplatform.com` in their web browser.

## 3.2 User Input
Mouse clicks, keyboard typing (chat prompts), file drag-and-drop.

## 3.3 User Flow

```text
User opens URL
  ↓
Frontend checks local storage for JWT
  ↓
If missing -> Render Login Screen
If present -> Render Dashboard
  ↓
User clicks "Upload Contract"
  ↓
React updates state to show loading spinner, calls Backend API
  ↓
React Query caches response, UI updates to show new document
```

## 3.4 User States
* `Unauthenticated`
* `Loading`
* `Idle / Interactive`
* `Error`

## 3.5 User-Visible Result
A fully rendered, interactive web page.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Step 1 — Routing
**Purpose:** Map URLs to UI screens.
**Input:** Browser URL (e.g., `/workspace/123/document/456`).
**Output:** React Component (`DocumentView`).
**Rules:**
* Protected routes must redirect to `/login` if the user is unauthenticated.

### Step 2 — Data Fetching
**Purpose:** Load data from backend.
**Input:** API Endpoints.
**Output:** Cached JSON state.
**Rules:**
* Use TanStack Query to manage loading states, error states, and cache invalidation automatically. Do not manually `fetch()` inside `useEffect`.

### Step 3 — Rendering
**Purpose:** Display data.
**Input:** State variables.
**Output:** DOM elements (HTML).
**Rules:**
* Components must be highly modular and reusable.

---

# 5. INPUT CONTRACT

N/A - The frontend consumes APIs, it does not expose them.

---

# 6. OUTPUT CONTRACT

N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Client-Side Rendering (CSR) vs Server-Side Rendering (SSR):** If the application requires high SEO (Search Engine Optimization), use Next.js SSR. If it is a private, authenticated SaaS dashboard, standard React SPA (CSR via Vite) is preferred for maximum interactivity.
* **Component Library:** Use a headless UI library (like Radix UI or Headless UI) combined with Tailwind CSS to build the design system. Do not write raw CSS files.

## 7.2 Validation Rules

* Client-side validation MUST be implemented (e.g., using `Zod` and `React Hook Form`) to prevent unnecessary backend API calls for bad data (like malformed email addresses).

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules

* Implement React Error Boundaries to catch unhandled JavaScript crashes. If a single component crashes, the rest of the application must stay alive, displaying a fallback "Something went wrong" UI only in the broken section.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* The frontend must be capable of rendering complex PDFs using libraries like `react-pdf` or Mozilla's `PDF.js`.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose
The frontend must render AI outputs elegantly.

## 9.4 AI Rules

* **Streaming:** AI Chat responses MUST be streamed via Server-Sent Events (SSE) or WebSockets. The user must see the text typing out in real-time, rather than waiting 15 seconds for a complete block of text.
* **Markdown:** AI responses contain markdown. The frontend must safely parse and render markdown (using `react-markdown`), including bold text, lists, and tables.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A - Browsers handle async tasks via Web Workers if absolutely necessary (e.g., client-side PDF encryption), but generally avoid heavy client-side processing.

---

# 13. DATABASE RESPONSIBILITY

N/A - The frontend has no direct database access.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

*(This section defines how the frontend consumes the backend)*

## 15.4 API Rules
* The frontend must use an Axios interceptor to automatically attach the `Authorization: Bearer <token>` header to every outgoing request.
* The interceptor must catch `401 Unauthorized` responses and automatically log the user out (clearing local storage) and redirecting to the login page.

---

# 16. ERROR HANDLING

## Error Rules

* Translate backend JSON Error Envelopes (e.g., `DOCUMENT_NOT_FOUND`) into user-friendly UI Toast notifications (e.g., "The document you are looking for has been deleted.").

---

# 17. AUTHORIZATION & SECURITY

## 17.3 Sensitive Data

* **CRITICAL:** JWT tokens must be stored securely. If stored in `localStorage`, the app is vulnerable to XSS (Cross-Site Scripting). For highest security, the backend should set JWTs as `HttpOnly` cookies.

## 17.4 Security Rules

* Use DOM sanitization (e.g., `DOMPurify`) before rendering any HTML to prevent XSS attacks.

---

# 18. SOURCE & TRACEABILITY

## 18.2 Source Requirements

* When the RAG engine returns context citations (e.g., `[Page 4]`), the frontend must render these as clickable links that jump the PDF viewer directly to the cited page.

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* **Time to Interactive (TTI):** The dashboard must be fully interactive in under 3 seconds on a standard broadband connection.

## 20.2 Large Input Handling

* Code Splitting: Do not bundle the entire application into one massive `app.js` file. Use React `lazy()` to load routes (like the Settings page) only when the user clicks on them.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Pages / Routes | `src/pages/` or `src/app/` | Main view components |
| Components     | `src/components/` | Reusable UI pieces |
| API Hooks      | `src/hooks/api/` | React Query custom hooks |
| State          | `src/store/` | Zustand stores |

---

# 22. SERVICE CONNECTIONS

```text
[Browser]
    │ (HTTP / WebSocket)
[CloudFront CDN (Static Assets)]
    │
[Backend API Gateway]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Use tools like Sentry for Frontend to catch JavaScript exceptions occurring in the user's browser and send them back to the engineering team.

---

# 25. OBSERVABILITY

## Metrics

* Monitor Core Web Vitals (LCP, FID, CLS) using tools like Vercel Analytics or Google Analytics.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test utility functions and complex React hooks using `Jest` or `Vitest`.

## 26.2 Integration Testing

* Use `React Testing Library` to render components and simulate user clicks, ensuring the UI behaves correctly without relying on backend APIs (using MSW - Mock Service Worker).

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Loss of Internet` | UI must detect offline state (`window.navigator.onLine`) and disable forms/buttons gracefully. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Where to send API requests | Yes | `http://localhost:8000` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* The frontend compiles down to static HTML, CSS, and JS files. These MUST be hosted on a global CDN (like AWS CloudFront, Vercel, or Cloudflare Pages) for maximum speed. Do not serve static files from the FastAPI backend.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Application builds successfully (`npm run build`).
* [ ] Protected routes redirect to login if unauthenticated.
* [ ] UI updates optimistically on data changes.
* [ ] Errors are caught by Error Boundaries and reported to Sentry.

---

# 32. DEFINITION OF DONE

The Frontend Architecture is **DONE** when the foundational React app is configured with routing, authentication interceptors, Tailwind CSS, and React Query, allowing UI developers to immediately start building screens.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Do not put business rules in React components).
2. **Unsupported input must fail safely.**
3. **Secrets must never be committed to source control.** (Never put backend API keys in the React code).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the visual interface for the entire Legal AI Platform.

## What the user sees
A fast, beautiful, intuitive dashboard.

## What happens in the background
React efficiently updates the DOM, manages complex client-side state, intercepts API calls to attach security tokens, and parses streaming markdown from AI models.

## What it receives
User interactions and JSON API responses.

## What it produces
HTML, CSS, and JavaScript.

## Success means
Lawyers actually enjoy using the software because it feels modern and instantaneous.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
