# Legal AI Platform (Authentication & Authorization)

> **Purpose:** Complete implementation blueprint for `Authentication & Authorization`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Authentication & Authorization`

## 1.2 Service ID

`sys-auth-core-platform`

## 1.3 Service Category

`Platform Engineering & Security`

## 1.4 Service Type

`Core Security Capability`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Auth service must:

* **Authentication:** Verify a user's identity (Who are you?) via passwords and issue secure JSON Web Tokens (JWTs).
* **Authorization:** Verify a user's permissions (Are you allowed to do this?) strictly based on Workspace boundaries.
* Ensure all API endpoints in the platform are protected from unauthorized access.

The service must **not** manage billing or subscription logic.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Legal platforms deal with extremely sensitive information. If a user can guess an API URL and view another user's contract, the entire platform loses credibility immediately. This service provides the cryptographic guarantee that data is only accessible to authorized individuals.

## 1.7 User Value

Explain what the user gains from this service.
Users gain absolute privacy and control over their legal documents, knowing that even other users on the same platform cannot access their data.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A robust FastAPI dependency injection system that automatically intercepts requests, validates JWTs, verifies workspace permissions against the PostgreSQL database, and blocks unauthorized traffic before it reaches the business logic.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* User Registration and Login endpoints.
* Password hashing (Argon2 / bcrypt).
* JWT generation, signing, and verification.
* Workspace-level Role-Based Access Control (RBAC).
* FastAPI `Depends()` middleware for securing routes.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* SSO (Single Sign-On) via Google/Microsoft (This can be added later as an external adapter).
* UI Login forms (Handled by the Frontend).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Database Architecture` | To query Users and Workspaces | SQL Tables |
| `API Standards` | Defines how the auth header looks | HTTP Headers |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every single backend service** depends on this service. If a service does not use the Auth dependency, it is completely unsecured.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The Login or Registration screen on the frontend SPA.

## 3.2 User Input
Email and Password.

## 3.3 User Flow

```text
User Submits Login Form
    ↓
FastAPI Auth Route validates credentials
    ↓
Password Hash checked against PostgreSQL
    ↓
JWT Generated and signed with Secret Key
    ↓
JWT Returned to Frontend (Saved in memory or HttpOnly Cookie)
    ↓
Frontend attaches JWT to `Authorization: Bearer <token>` on all future API calls
```

## 3.4 User States
N/A

## 3.5 User-Visible Result
Successful login redirects to the main Dashboard.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Step 1 — JWT Validation (Middleware)
**Purpose:** Ensure the request is from a known user.
**Input:** `Authorization: Bearer <token>` header.
**Output:** Pydantic `User` object.
**Rules:**
* Token must not be expired.
* Token signature must be verified using the server's `SECRET_KEY`.

### Step 2 — Workspace Authorization
**Purpose:** Ensure the user belongs to the requested workspace.
**Input:** `User` object + `workspace_id` from the URL path.
**Output:** Allowed or `HTTP 403 Forbidden`.
**Rules:**
* Query the `workspace_members` linking table to confirm the user has access.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `email` | `String` | Yes | Must be valid email format. |
| `password` | `String` | Yes | Minimum 8 characters. |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Reject weak passwords during registration.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
JSON Web Token (JWT).

## 6.2 Output Structure

```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}
```

## 6.3 Output Rules
* The JWT payload (`sub` claim) must contain the User's UUID, not their email or plaintext ID.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Never store plaintext passwords.** Passwords MUST be hashed using a strong algorithm (Argon2 or bcrypt) before reaching the database.
* **Workspace Isolation:** Every API endpoint that handles documents or chats MUST require a `workspace_id` and MUST verify the user has access to that workspace.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a JWT is valid but the user has been soft-deleted in the database, the authentication must fail. (Requires a DB check, or very short-lived JWTs).

## 7.4 Failure Rules
* Any authentication failure MUST return `401 Unauthorized`.
* Any authorization failure MUST return `403 Forbidden`.

## 7.5 Boundary Rules
* The Frontend must never have access to the JWT signing secret.

---

# 8. DOCUMENT CONTEXT

N/A - Auth does not read documents.

---

# 9. AI RESPONSIBILITY

N/A - Do not use AI for authentication.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

N/A - Auth is strictly synchronous.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

* `users` table.
* `workspaces` table.
* `workspace_members` table (Many-to-Many).

## 13.5 Database Rules
* The `users.hashed_password` column must never be returned in API responses.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 API List

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `POST` | `/api/v1/auth/register` | Create user |
| `POST` | `/api/v1/auth/login` | Get JWT |
| `GET`  | `/api/v1/users/me` | Get current user profile |

## 15.4 API Rules
* Standard OAuth2 Password Bearer flow should be used in FastAPI for easy Swagger UI integration.

---

# 16. ERROR HANDLING

## Error Rules

* Do not leak whether an email exists during login. Return a generic "Invalid email or password" error.

---

# 17. AUTHORIZATION & SECURITY

*(This entire document defines this section)*

## 17.4 Security Rules

* JWTs should expire relatively quickly (e.g., 30-60 minutes).
* If long sessions are required, implement Refresh Tokens.
* Use HTTPS exclusively to prevent Man-in-the-Middle token theft.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Password hashing is intentionally slow to prevent brute force attacks. Login requests will take ~300-500ms.
* JWT Validation (via cryptography) is extremely fast (< 1ms).

## 20.2 Large Input Handling
N/A

## 20.3 Concurrent Usage
N/A

## 20.4 Resource Limits
* Rate limit the `/login` endpoint strictly to prevent brute-force credential stuffing.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Security Utils | `backend/app/core/security.py` | Hashing & JWT logic |
| Auth Routes    | `backend/app/api/v1/auth.py` | Login endpoints |
| Dependencies   | `backend/app/api/deps.py` | `get_current_user` logic |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI Router]
       │
[Depends(get_current_user)] ──► [Decodes JWT]
       │
[Depends(verify_workspace)] ──► [Queries PostgreSQL]
       │
[Business Service Executes]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Log all successful logins and failed login attempts.

## 24.2 Audit Logging

* Adding a new member to a workspace must be recorded in the audit log.

## 24.3 Sensitive Data Rules

* DO NOT log the plaintext password.
* DO NOT log the JWT token.

---

# 25. OBSERVABILITY

## Metrics

* Monitor failed login attempts to detect attacks.

## Health
N/A

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

* Test that password hashing yields different results for the same password (due to salting).
* Test that expired JWTs raise `401 Unauthorized`.

## 26.2 Integration Testing

* Create two workspaces (A and B). Create a user in A. Attempt to access a document in B using that user's token. Assert it returns `403 Forbidden`.

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
| `Missing Auth Header` | Automatically rejected by FastAPI with HTTP 401. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `SECRET_KEY` | Signs the JWT | Yes | - |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | Yes | `30` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements

* The `SECRET_KEY` must be a strong, randomly generated string injected securely into the production environment. If it is leaked, attackers can forge JWTs.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] User can register and password is hashed in DB.
* [ ] User can log in and receive a JWT.
* [ ] Passing the JWT allows access to secured routes.
* [ ] Invalid or expired JWTs are rejected.
* [ ] Users cannot access workspaces they don't belong to.

---

# 32. DEFINITION OF DONE

The Authentication & Authorization service is **DONE** when the `deps.py` file exposes robust, tested dependency injection functions that reliably protect every other API endpoint in the platform.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Database ownership must be explicit.**
3. **Documents must remain associated with the correct workspace and permissions.** (This service enforces that rule).
4. **Secrets must never be committed to source control.** (Crucial for `SECRET_KEY`).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the bouncer for the entire platform, verifying who is calling the API and whether they are allowed to do what they are asking.

## What the user sees
A standard login screen.

## What happens in the background
Passwords are cryptographically hashed. Fast, stateless JWTs are issued to the frontend, which are then verified on every subsequent HTTP request to ensure secure access to workspaces.

## What it receives
Emails, passwords, and HTTP Authorization headers.

## What it produces
Cryptographically signed JWTs and allowed/denied routing decisions.

## Success means
Data is perfectly isolated between tenants, and the platform is impervious to unauthorized data scraping.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
