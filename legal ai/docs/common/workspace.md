# Legal AI Platform (Workspace & Multi-Tenancy)

> **Purpose:** Complete implementation blueprint for `Workspace & Multi-Tenancy`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Workspace & Multi-Tenancy`

## 1.2 Service ID

`sys-common-workspace-manager`

## 1.3 Service Category

`Common Infrastructure / Core Security`

## 1.4 Service Type

`Backend Domain Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Workspace service must:

* Enforce absolute multi-tenant data isolation across the entire platform.
* Manage the lifecycle of Workspaces (e.g., creating a new law firm account, provisioning their logical boundaries).
* Manage User roles, permissions, and invitations within a Workspace (Admin vs. Member).
* Ensure that every single database query, S3 lookup, and Qdrant vector search is strictly scoped to a specific `workspace_id`.

The service must **not** handle user authentication/login directly (e.g., storing passwords or managing OAuth tokens). It delegates identity management to an external IdP (Identity Provider like Auth0, AWS Cognito, or Keycloak), and focuses purely on *Authorization* and *Tenancy*.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Law firms possess the most confidential information in the world (M&A deals, litigation strategy, IP). If Law Firm A can accidentally search and retrieve a contract belonging to Law Firm B, the platform faces immediate existential legal liability. This service guarantees that data leakage between tenants is architecturally impossible.

## 1.7 User Value

Explain what the user gains from this service.
Peace of mind. The assurance that their highly sensitive legal data is siloed and strictly controlled, allowing them to safely invite team members and collaborate without fear of external breaches.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A core relational database schema (Workspaces, Users, Memberships) and a set of strict API authorization middlewares that automatically inject `workspace_id` filtering into every single backend request.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Workspace creation, updating, and logical deletion.
* User mapping and role assignments (RBAC - Role Based Access Control).
* API Middleware that intercepts requests and validates JWT claims against the Workspace schema.
* Managing Workspace-level configurations (e.g., Default Jurisdiction, API Rate Limits).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Password hashing or Identity Provider functions (Auth0/Cognito does this).
* Document storage logic (This service just provides the `workspace_id` to the storage service).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Identity Provider (IdP)` | To authenticate users | JWT Tokens |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every microservice in the platform** requires the Authorization Middleware provided by this service.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
User logs in and sees a dropdown to select which Workspace they want to operate in.

## 3.2 User Input
A click to create a Workspace or invite a user.

## 3.3 User Flow

```text
User signs up via Auth0.
  ↓
User creates a new Workspace: "Smith & Associates".
  ↓
Service creates Workspace in Postgres and assigns the User as `ADMIN`.
  ↓
User invites `jane@smith.com` to the Workspace.
  ↓
Service creates an Invitation record and sends an email.
  ↓
Jane signs up and accepts. Service links Jane to "Smith & Associates" as `MEMBER`.
```

## 3.4 User States
* `Unassigned`
* `Workspace Active`

## 3.5 User-Visible Result
A secure dashboard where users only see their team's documents, chats, and configurations.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Authorization Middleware Workflow (Runs on EVERY API Request)

```text
HTTP REQUEST `GET /api/v1/documents`
Header: `Authorization: Bearer <JWT>`
Header: `X-Workspace-Id: <uuid>`
  ↓
Middleware validates the JWT signature via IdP public keys.
Extract `user_id` from JWT.
  ↓
Query DB: `SELECT role FROM workspace_members WHERE user_id = X AND workspace_id = Y AND active = true`
  ↓
If No Record -> Reject HTTP 403 Forbidden.
If Record Exists -> Inject `workspace_id` into the request context (e.g., `request.state.workspace_id`).
  ↓
Route Handler executes: `SELECT * FROM documents WHERE workspace_id = request.state.workspace_id`.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `workspace_name` | `String` | Yes | For creation |
| `user_email` | `String` | Yes | For invitations |
| `role` | `String` | Yes | `ADMIN`, `MEMBER`, `VIEWER` |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* Roles must strictly adhere to the allowed Enums to prevent privilege escalation.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Validated session state for internal routing, and JSON responses for frontend workspace management.

## 6.2 Output Structure
```json
{
  "workspace_id": "uuid",
  "name": "Smith & Associates",
  "role": "ADMIN",
  "features": ["drafting", "risk_detection"],
  "jurisdiction": "IN"
}
```

## 6.3 Output Rules
N/A

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Universal Tenancy Injection:** Under no circumstances should a database query, S3 bucket path, or Qdrant vector search be executed without the `workspace_id` being explicitly passed and verified.
* **Logical Deletion:** If a Workspace is deleted, the data is soft-deleted (`deleted_at = NOW()`) rather than hard-deleted. Legal data has retention requirements. A background sweep must clean up orphaned S3/Qdrant data only after a compliance holding period (e.g., 30 days).

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* An `ADMIN` can invite other users and delete documents. A `MEMBER` can create and edit documents. A `VIEWER` can only read documents and run chats.

## 7.4 Failure Rules
* If the IdP is unreachable to verify keys, the API must fail closed (HTTP 401 Unauthorized), not open.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A - This service manages the boundaries around documents, not the documents themselves.

---

# 9. AI RESPONSIBILITY

N/A - This is purely standard SaaS CRUD and Security.

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

## 13.1 Owned Data
* `workspaces` table.
* `users` table (A mirrored shadow-copy of the IdP user to maintain relational integrity).
* `workspace_members` table (The join table).

## 13.5 Database Rules
* The `workspace_id` column MUST exist on almost every other table in the entire platform database (Documents, Chats, Summaries, Folders, etc.).
* Row-Level Security (RLS) in PostgreSQL is highly recommended to enforce `workspace_id` at the database engine level as a failsafe against application-layer bugs.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `POST /api/v1/workspaces` (Create)
* `GET /api/v1/workspaces` (List User's workspaces)
* `POST /api/v1/workspaces/{id}/invitations` (Invite user)

---

# 16. ERROR HANDLING

## Error Rules
* All authorization failures must return `HTTP 403 Forbidden` with a generic message. Do not expose internal details about why the auth failed to prevent reconnaissance attacks.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* This service *is* the access rule engine.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* The Authorization Middleware runs on *every single API request*. Therefore, the database lookup (`SELECT role...`) MUST be cached in Redis with a short TTL (e.g., 60 seconds) to ensure the middleware takes `< 2ms` to execute.

## 20.2 Large Input Handling
N/A

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Middleware     | `backend/app/core/middleware.py` | JWT and Workspace Validation |
| Service Logic  | `backend/app/services/workspace.py` | CRUD operations |

---

# 22. SERVICE CONNECTIONS

```text
[Frontend API Request] ──► [Workspace Auth Middleware] ──► [Redis] (Cache Check)
                                  │
                                  ├──► [PostgreSQL] (DB Check if Cache Miss)
                                  │
                                  └──► [Target Route Handler] (If Authorized)
```

---

# 23. EVENTS

## 23.1 Emitted Events
* `WorkspaceDeletedEvent`: Must trigger cascading soft-deletes in all other services (S3 cleanup, Qdrant deletion, Postgres soft-deletes).

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `WARN: User {user_id} attempted to access Workspace {workspace_id} without membership. Blocked.`

---

# 25. OBSERVABILITY

## Metrics
* Track `auth_rejection_rate`. Spikes indicate either a bug in the frontend token refresh logic or an active intrusion attempt.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Isolation:** Create `workspace_A` and `workspace_B`. Authenticate a mock user belonging only to A. Attempt to `GET /api/v1/documents` passing the `X-Workspace-Id` of B. Assert `HTTP 403 Forbidden` is returned instantly.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Revoked Access` | If an Admin removes a Member, the system must immediately invalidate the Redis cache for that user's permissions so their access is revoked instantly, not 60 seconds later. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `IDP_JWKS_URL` | Public key URL to verify JWTs | Yes | `https://tenant.auth0.com/.well-known/jwks.json` |

---

# 30. DEPLOYMENT REQUIREMENTS

N/A

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Middleware correctly intercepts and validates JWT tokens.
* [ ] Users can only access data belonging to their assigned Workspaces.
* [ ] Database lookup for authorization is cached via Redis to ensure `<2ms` overhead.
* [ ] Admins can successfully invite and revoke team members.

---

# 32. DEFINITION OF DONE

The Workspace & Multi-Tenancy service is **DONE** when the platform can securely host 100 competing law firms simultaneously, with absolute mathematical certainty that no firm can access another firm's data, even if they explicitly try to guess URLs or API payloads.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.** (Fail closed on Auth).
3. **Database ownership must be explicit.**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the invisible iron walls that separate users and law firms from each other.

## What the user sees
A standard B2B SaaS interface where they can manage their team, invite colleagues, and switch between different client workspaces.

## What happens in the background
A high-performance middleware intercepts every single API request, mathematically verifies the user's identity, checks their role in a Redis cache, and forces their `workspace_id` into the routing context so that they can only ever see their own data.

## What it receives
JWT Tokens and Workspace IDs.

## What it produces
Secure routing context for the rest of the application.

## Success means
Zero data breaches, complete multi-tenant isolation, and high-performance authorization that doesn't slow down the AI experience.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
