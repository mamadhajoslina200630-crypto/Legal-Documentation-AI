# Legal AI Platform (Frontend State Management)

> **Purpose:** Complete implementation blueprint for `Frontend State Management`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Frontend State Management`

## 1.2 Service ID

`sys-frontend-state-core-platform`

## 1.3 Service Category

`Platform Engineering & User Interface`

## 1.4 Service Type

`Client-Side Data Architecture`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Frontend State Management architecture must:

* Strictly separate **Server State** (data fetched from the API, like lists of documents) from **Client State** (UI toggles, like whether a sidebar is open).
* Manage caching, background fetching, and automatic cache invalidation for all API data to ensure the UI is always in sync with the database.
* Prevent "prop-drilling" (passing variables down through 10 layers of components) by providing global, accessible state stores.

The service must **not** perform data transformations that belong on the backend (e.g., sorting 10,000 records).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
As single-page applications grow, state becomes a tangled mess. If a user uploads a document, the "Document List" component on the other side of the screen needs to know to refresh. Without strict state management, the UI becomes buggy, out-of-sync, and incredibly slow due to unnecessary re-renders.

## 1.7 User Value

Explain what the user gains from this service.
A fluid, real-time experience. When they perform an action, the UI updates instantly (optimistic updates) without needing to manually refresh the browser page.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully configured `TanStack Query` (React Query) setup for server state, a `Zustand` store for global client state, and `React Hook Form` for complex form state.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Server State caching (React Query `useQuery`, `useMutation`).
* Cache invalidation rules.
* Global Client State (Zustand).
* Local Component State (React `useState`, `useReducer`).
* Form State and Validation (React Hook Form + Zod).
* Optimistic UI Updates.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* LocalStorage syncing for sensitive data (JWTs must be handled by secure Auth modules, not generic state sync).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `API Integration` | To fetch the actual data | Axios instances |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**All React Components** consume state from this architecture.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
N/A - State is invisible to the user.

## 3.2 User Input
N/A

## 3.3 User Flow
N/A

## 3.4 User States
N/A

## 3.5 User-Visible Result
UI elements reflecting the current reality of the data.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Server State Workflow (React Query)
```text
Component mounts, calls `useQuery(['documents', workspaceId])`
  ↓
React Query checks local cache.
  ↓
If cache is fresh -> Return data instantly to UI.
If cache is stale -> Return stale data to UI, fetch new data in background.
  ↓
API Returns new data -> React Query updates cache -> UI re-renders automatically.
```

### Mutation Workflow
```text
User submits "Upload Document" form
  ↓
`useMutation` fires API call
  ↓
On Success: React Query invalidates `['documents', workspaceId]` cache
  ↓
Document List automatically refetches and shows the new document
```

---

# 5. INPUT CONTRACT

N/A

---

# 6. OUTPUT CONTRACT

N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Server State vs Client State:** Do NOT put API responses into a global Zustand/Redux store. API data belongs *exclusively* in React Query. Zustand is ONLY for UI state (e.g., `isDarkMode`, `selectedDocumentId`, `sidebarOpen`).
* **Avoid Prop Drilling:** If a state variable needs to be accessed by more than 3 layers of child components, it must be moved to React Context or a Zustand store.

## 7.2 Validation Rules

* Forms MUST use `React Hook Form` to prevent re-rendering the entire page on every keystroke.
* Forms MUST use `Zod` schemas for client-side validation that perfectly matches the backend Pydantic schemas.

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules

* API queries that fail must automatically retry 3 times (with exponential backoff) before surfacing a hard error to the UI, handling momentary network blips gracefully.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information

* Complex objects like parsed PDFs must not be stored in global state. Only store references (IDs) in the global state, and let individual components fetch the heavy data via React Query when needed.

## 8.2 Context Rules
N/A

## 8.3 Section-Level Context
N/A

---

# 9. AI RESPONSIBILITY

## 9.1 AI Purpose

* State management must handle real-time streaming data from AI generators (e.g., appending chunks of text to a string as the LLM types).

## 9.4 AI Rules

* **Streaming State:** Use local component state (`useState` or a `useReducer`) to handle the rapid state updates required for Server-Sent Events (SSE) AI streaming. Do not put streaming text into a global store, as it will cause the entire application to re-render 50 times a second.

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

N/A

---

# 16. ERROR HANDLING

## Error Rules

* React Query `useQuery` automatically catches errors. These must be passed to the component so it can render an Error State (or caught by an Error Boundary), preventing the UI from freezing in a perpetual "Loading" state.

---

# 17. AUTHORIZATION & SECURITY

## 17.3 Sensitive Data

* When a user logs out, the State Management architecture MUST completely wipe the React Query cache and reset the Zustand stores. If this is forgotten, the next user who logs in on the same browser might briefly see the previous user's cached legal documents.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Form inputs must not lag. (Achieved via uncontrolled components in React Hook Form).

## 20.2 Large Input Handling

* Memory Management: React Query must be configured with a `cacheTime` and `staleTime` that prevents the browser from holding thousands of old API responses in RAM indefinitely.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Global Client  | `src/store/` | Zustand setup (e.g., `useAppStore.ts`) |
| Server State   | `src/hooks/api/` | React Query custom hooks |
| Query Setup    | `src/lib/queryClient.ts` | React Query global config |

---

# 22. SERVICE CONNECTIONS

```text
[React Components]
       │
   (Subscribes to)
       │
 ┌─────┴─────┐
 │           │
[Zustand]   [React Query] ──► [API Integration Layer]
(UI State)  (Server State)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Use React Query Devtools in local development to inspect cache hits/misses. Disable in production.

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test Zustand stores in isolation by calling the state setter functions and asserting the state updates correctly, without needing to mount React components.

## 26.2 Integration Testing

* Wrap component tests in a `QueryClientProvider` to allow testing of data fetching hooks.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Window Focus` | React Query is configured to `refetchOnWindowFocus` by default. If a user switches tabs and comes back 10 minutes later, the app automatically fetches the latest data. |

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
* [ ] Data fetched from APIs is cached automatically.
* [ ] Modifying data (POST/PUT) automatically invalidates the relevant cache and updates the UI.
* [ ] Form validation happens on the client before the API is hit.
* [ ] Logging out clears all cached data in memory.

---

# 32. DEFINITION OF DONE

The Frontend State Management architecture is **DONE** when a developer can easily call a custom hook (e.g., `const { data: docs } = useDocuments(workspaceId)`) and the system handles the loading states, caching, and background refetching entirely automatically.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Do not sort data in React if the database can do it faster).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the brain of the frontend, keeping track of what the user is doing and what data the backend has provided.

## What the user sees
A flawless, real-time interface that never shows outdated information.

## What happens in the background
React Query silently manages HTTP requests, caching, and retries. Zustand holds UI toggles in memory. React Hook Form manages complex DOM interactions without triggering slow re-renders.

## What it receives
API Responses and User Interactions.

## What it produces
Reactive variables that drive the DOM.

## Success means
The codebase remains clean and bug-free, avoiding the "spaghetti state" that plagues most large Single Page Applications.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
