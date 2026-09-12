# Legal AI Platform (Frontend Routing)

> **Purpose:** Complete implementation blueprint for `Frontend Routing`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Frontend Routing`

## 1.2 Service ID

`sys-frontend-routing-core-platform`

## 1.3 Service Category

`Platform Engineering & User Interface`

## 1.4 Service Type

`Client-Side Navigation`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Frontend Routing system must:

* Map browser URLs to specific React components/screens without triggering a full page reload.
* Guard protected routes, ensuring unauthenticated users are redirected to `/login`.
* Guard workspace-specific routes, ensuring a user cannot navigate to `/workspace/A` if they only belong to `workspace/B`.
* Optimize initial page load times by lazy-loading (code-splitting) routes the user hasn't visited yet.

The service must **not** handle API data fetching directly (that is handled by the API Integration layer).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
A single-page application (SPA) feels fast because it never actually navigates to a new HTML page; JavaScript simply swaps out the UI components instantly when the URL changes. This routing architecture provides that snappy "desktop app" feel while maintaining deep-linkable URLs so a lawyer can securely copy-paste a link to a specific contract and send it to a colleague.

## 1.7 User Value

Explain what the user gains from this service.
Instant navigation between screens. Secure, shareable links to specific documents or chat sessions.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A centralized Router configuration (e.g., `react-router-dom` or Next.js `app/` directory) containing a complete map of all public and private routes, protected by authentication wrapper components.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* URL Path definitions (e.g., `/login`, `/dashboard`, `/workspaces/:id`).
* Route Guards (Auth wrappers, Role wrappers).
* Code-splitting via React `lazy()` and `Suspense`.
* 404 Not Found handling.
* Nested routing (e.g., Tabs within a Settings page).
* Breadcrumb generation logic based on URL params.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* JWT validation logic (The router just checks if the token *exists* in state; the backend validates it cryptographically).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `State Management` | To check `isAuthenticated` | User Session |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
N/A

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The browser's address bar or a hyperlink click.

## 3.2 User Input
URL string.

## 3.3 User Flow

```text
User clicks a link to `/workspaces/123/documents/456`
  ↓
Router intercepts the click, prevents default HTML navigation
  ↓
Router checks `<ProtectedRoute>` wrapper
  ↓
If `isAuthenticated == false`, Redirect to `/login?returnUrl=/workspaces/123...`
  ↓
If `isAuthenticated == true`, match route and render `<DocumentViewer documentId="456" />`
  ↓
Update browser History API (URL bar changes instantly)
```

## 3.4 User States
* `Navigating` (Router shows a top-bar progress indicator or Suspense fallback).

## 3.5 User-Visible Result
A new screen appears instantly.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Step 1 — Registration
**Purpose:** Map URLs to Components.
**Input:** Route array.
**Output:** Router Provider.
**Rules:**
* Organize routes hierarchically (e.g., all workspace routes sit under a `/:workspaceId` parent).

### Step 2 — Interception (Guards)
**Purpose:** Prevent unauthorized viewing of UI shells.
**Input:** Requested path.
**Output:** Allow or Redirect.
**Rules:**
* Use a High-Order Component (HOC) or wrapper (e.g., `<RequireAuth>`) to wrap all private routes.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs
N/A

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Dynamic URL parameters (like `/:workspaceId`) must be strictly extracted and passed down as props or hooks (e.g., `useParams()`).

---

# 6. OUTPUT CONTRACT

N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Deep Linking:** Every distinct state or view in the application MUST be represented in the URL so users can bookmark it. Do not rely heavily on hidden local state to navigate between major screens.
* **Code Splitting:** Do not import all route components at the top of the file. Use `React.lazy(() => import('./pages/Dashboard'))` so the browser only downloads the JavaScript for a page when the user actually navigates to it.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a user tries to access a protected route without being logged in, save their intended destination URL and redirect them to it *after* a successful login (Return URL pattern).

## 7.4 Failure Rules

* If the user enters a URL that doesn't exist, render a clean, branded `404 Not Found` component with a button to return to the Dashboard.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

N/A

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

* Use an Error Boundary wrapper at the top level of the Router. If a specific page component throws a fatal JavaScript error, the router must catch it and display a `500 Something went wrong` UI, allowing the user to navigate back without having to refresh the whole page.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

* Client-side routing is NOT a security boundary. Even if the router prevents a user from seeing the `/admin` UI, a malicious user can still inspect the frontend code. Real security is enforced at the Backend API. The frontend router guards are purely for User Experience.

## 17.4 Security Rules

* When redirecting after login via a `?returnUrl=` parameter, sanitize the URL to prevent Open Redirect attacks (ensure it is a relative path, e.g., `/dashboard`, and not `https://evil-site.com`).

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Changing routes must happen in < 50ms.

## 20.2 Large Input Handling

* Code-splitting (lazy loading) is mandatory to keep the initial JavaScript bundle size small.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Configuration  | `src/routes.tsx` | Main route mapping |
| Guards         | `src/components/auth/RequireAuth.tsx`| Redirect logic |
| Pages          | `src/pages/` | The actual routed components |

---

# 22. SERVICE CONNECTIONS

N/A

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log route changes to an analytics provider (like PostHog) to track user journeys through the application, if privacy policies allow.

---

# 25. OBSERVABILITY

N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test the `<RequireAuth>` wrapper: Render it with a mocked "unauthenticated" state and assert that it calls the `navigate('/login')` function.
* Render it with a mocked "authenticated" state and assert it renders its children.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Token Expires Mid-Session` | The Axios interceptor (API Integration) catches the 401, clears the token, and forces the Router to kick the user to `/login`. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

N/A

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* **CRITICAL:** If hosting the SPA on AWS CloudFront, S3, or Nginx, the server MUST be configured to redirect all 404 requests back to `index.html`. Otherwise, if a user refreshes the page on `/dashboard`, the web server will look for a physical file named `dashboard.html`, fail, and return an actual 404.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] User can click links and transition between pages instantly.
* [ ] Going directly to `/login` when already authenticated redirects to `/dashboard`.
* [ ] Going directly to `/dashboard` when unauthenticated redirects to `/login`.
* [ ] Unknown URLs render a 404 component.

---

# 32. DEFINITION OF DONE

The Frontend Routing is **DONE** when all major sections of the application have deep-linkable URLs, are protected by auth wrappers, and are code-split to ensure lightning-fast initial load times.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (404 pages).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the traffic controller for the React application, managing which screens are displayed based on the URL.

## What the user sees
URLs changing in the address bar and UI screens swapping instantly.

## What happens in the background
React Router intercepts browser navigation events, checks authentication state, dynamically downloads the JavaScript chunk for the new page (if code-split), and renders the new components.

## What it receives
URL paths and navigation events.

## What it produces
Rendered React component trees.

## Success means
The application feels as fast as a native desktop app, but retains the shareability and structure of the open web.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
