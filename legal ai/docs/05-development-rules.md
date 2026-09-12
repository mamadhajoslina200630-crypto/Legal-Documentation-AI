# Legal AI Platform (Development Rules)

> **Purpose:** Complete implementation blueprint for `Development Rules`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Development Rules`

## 1.2 Service ID

`sys-dev-rules-core-platform`

## 1.3 Service Category

`Platform Engineering & Standards`

## 1.4 Service Type

`Shared capability`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The development rules must:

* Establish a unified coding standard across the Frontend, Backend, AI, and Infrastructure teams.
* Dictate exact protocols for code reviews, testing, merging, and deployment.
* Prevent the introduction of technical debt, circular dependencies, and security vulnerabilities.

The service must **not** own responsibilities belonging to HR or general company policy; it is strictly limited to software engineering practices for the Legal AI Platform.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
As the Legal AI platform scales with multiple teams (Team 1 for Core Intelligence, Team 2 for Accessibility), disparate coding styles and architectures will cause the system to break. These rules exist to ensure that all code contributed to the platform is robust, secure, readable, and perfectly aligned with the system's architecture.

## 1.7 User Value

Explain what the user gains from this service.
Users gain an exceptionally stable platform with zero downtime, fast performance, and an absence of regressions, because the engineers building the product are following strict quality control and safety guidelines.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully standardized engineering culture where every Pull Request meets a defined baseline of quality, security, and performance before it is ever merged into production.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Code style and formatting standards (Python & TypeScript).
* Pull Request (PR) and Code Review requirements.
* Branching strategies and version control etiquette.
* Secure coding practices for handling sensitive legal data.
* Guidelines for writing API endpoints and database queries.
* Rules for AI Prompt engineering within the codebase.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Specific UI/UX design choices (these belong in the Design System).
* Specific architectural topology (these belong in System Architecture).
* Project management timelines or sprint planning rules.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `System Architecture` | Rules must align with the physical topology | Topology map |
| `Tech Stack` | Rules must be specific to the chosen languages (Python/React) | Approved tools |
| `Project Structure` | Rules enforce where code is placed | Folder paths |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
Every developer working on any feature (Legal Intelligence, Language, Workspace, AI Gateway) depends on these rules.

---

# 3. USER EXPERIENCE (DEVELOPER EXPERIENCE)

## 3.1 User Entry Point

Describe how the user reaches this capability.
The developer entry point is cloning the monorepo and running the initial `docker-compose up` command, followed by reading this document in the `/docs` directory.

## 3.2 User Input

Define everything the user can provide.
Developers provide code contributions via:
* Feature branches
* Commit messages
* Pull Requests (PRs)
* Automated Test code
* Code documentation (docstrings)

## 3.3 User Flow

Define the complete user journey:

```text
Ticket Assigned
    ↓
Create Branch (`feat/feature-name` or `fix/bug-name`)
    ↓
Write Code & Unit Tests
    ↓
Run Local Linters & Formatters
    ↓
Open Pull Request
    ↓
Peer Code Review & Automated CI Checks
    ↓
Merge to Main
    ↓
Deploy
```

## 3.4 User States

Define UI behavior for:

* Initial state: Developer claims ticket.
* Input state: Developer pushes commits.
* Processing state: GitHub Actions CI pipeline runs tests.
* Success state: CI passes, 1+ approvals received.
* Empty state: N/A.
* Partial result state: Draft PR.
* Error state: CI fails or reviewer requests changes.
* Retry state: Developer pushes new commits to address feedback.
* Permission denied state: Developer tries to push directly to `main` (Blocked).
* Unsupported input state: Code fails linting checks (Blocked).

## 3.5 User-Visible Result

Define exactly what the frontend must display.
The result is a successfully merged PR with a green checkmark in GitHub, and the code successfully running in the staging/production environments.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
CODE WRITTEN
  ↓
LINTING (Pre-commit hooks)
  ↓
TESTING (Pytest / Vitest)
  ↓
COMMIT (Semantic commit messages)
  ↓
PUSH
  ↓
CI / CD (GitHub Actions)
  ↓
REVIEW (Peer approval)
  ↓
MERGE (Squash and Merge)
```

For each step define:

### Step 1 — Local Development
**Purpose:** Ensure code is clean before it ever leaves the developer's machine.
**Input:** Developer code.
**Output:** Formatted code.
**Rules:**
* Python code must be formatted using `Black` and linted with `Ruff` or `Flake8`.
* TypeScript code must be formatted using `Prettier` and linted with `ESLint`.

### Step 2 — Version Control
**Purpose:** Track changes systematically.
**Input:** Git commits.
**Output:** Pushed branch.
**Rules:**
* Commits must use Conventional Commits (e.g., `feat: add document upload API`, `fix: resolve OCR timeout`).

### Step 3 — Continuous Integration (CI)
**Purpose:** Prevent broken code from entering `main`.
**Input:** Pull Request.
**Output:** CI Pass/Fail status.
**Rules:**
* All unit tests must pass.
* Code coverage must not drop below 80%.
* Security scanners (e.g., Bandit, Snyk) must report 0 high-severity vulnerabilities.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `Pull Request` | `Code` | Yes | Must include a description linking to a ticket. |
| `Unit Tests` | `Code` | Yes | Every new feature or bug fix must have a corresponding test. |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `Documentation` | `Markdown` | `None` | Required if introducing a new architectural concept or API. |

## 5.3 Input Validation Rules

Define:

* Supported formats: `.py`, `.ts`, `.tsx`, `.md`.
* Required fields: PR templates must be filled out completely.
* Allowed values: Branch names must follow `feat/`, `fix/`, `chore/`, `docs/`.
* Invalid values: Direct commits to `main` are strictly prohibited.
* Permission requirements: Only assigned developers can merge after approval.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

A production-ready codebase that is stable, performant, and secure.

## 6.2 Output Structure

Define the logical structure of the result.

```text
Codebase
├── Readability (Clean, self-documenting code)
├── Reliability (High test coverage)
├── Security (Sanitized inputs, auth checks)
├── Maintainability (Decoupled modules)
└── Traceability (Clear git history)
```

## 6.3 Output Rules

* Output must be readable by any other developer on the team without requiring a verbal explanation.
* Output must not contain hardcoded secrets, API keys, or database credentials.
* Missing information must be represented as `TODO:` comments with ticket links.
* Uncertain information must be represented as clearly documented tech debt tickets.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **DRY (Don't Repeat Yourself):** Do not duplicate common platform capabilities like OCR, Database connection pooling, or AI Provider integrations.
* **Separation of Concerns:** Frontend must handle UI/UX; Backend must handle business logic; Celery must handle heavy background tasks.
* **Stateless APIs:** Backend APIs must remain completely stateless to ensure horizontal scalability.

## 7.2 Validation Rules

* All external input from users, uploaded files, or third-party APIs must be strictly validated using Pydantic (Backend) and Zod (Frontend).

## 7.3 Decision Rules

* Define how the service decides between different outcomes: If a task takes longer than 2 seconds to execute (e.g., generating an AI summary), it MUST be offloaded to a background Celery task. It cannot run synchronously in the FastAPI request-response cycle.

## 7.4 Failure Rules

* Define what happens when processing cannot be completed: Code must fail gracefully. Exceptions must be caught at the router level and returned as standardized JSON error messages to the frontend.

## 7.5 Boundary Rules

* Define limits of the service: Backend code must never generate HTML. Frontend code must never write direct SQL queries.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* When writing code that parses legal documents, developers must handle `workspace_id` and `document_id`.

## 8.2 Context Rules

* Always use the selected document version.
* Do not mix unrelated workspace documents. Developers must ALWAYS include a `WHERE workspace_id = user.workspace_id` clause in every database query.
* Preserve document/page/section references. Code that extracts clauses must persist the bounding box or page number for traceability.
* Respect document permissions.
* Do not use unavailable document information as fact.

## 8.3 Section-Level Context

Define whether the service can operate on:

* Code must be capable of processing the entire document iteratively if chunks are too large for the LLM context window.

---

# 9. AI RESPONSIBILITY

Only include this section when AI is involved.

## 9.1 AI Purpose

Define exactly what AI is responsible for.
Developers must treat AI as a volatile external service, not a deterministic function.

## 9.2 AI Input

Define what information is sent to the AI.
AI must receive only the information required for the task. Code must strip all PII or unrelated text before sending it to the AI Gateway to reduce token costs and improve accuracy.

## 9.3 AI Output

Define what the AI is expected to return.
Code must strictly enforce JSON-schema outputs from the AI Gateway.

## 9.4 AI Rules

The AI implementation code must:

* Stay within the service's responsibility.
* Use supplied context.
* Avoid inventing unavailable information (enforced by code prompts).
* Clearly indicate uncertainty.
* Preserve important source references.
* Follow the application's legal safety rules.
* Follow the required output structure.

## 9.5 AI Provider Independence

The service must **not depend directly on a specific AI provider**.

The service communicates through the platform's common AI layer.

```text
Service (e.g., Risk Extractor code)
   ↓
AI Gateway (Internal Abstraction)
   ↓
Provider Adapter
   ↓
Selected AI Provider (Gemini / GPT)
```

Developers must NEVER `import openai` or `import google.generativeai` inside business logic services. These imports belong exclusively in the AI Gateway layer.

## 9.6 Model Requirements

Define:

* Required model capability: Code must specify if a fast model (Gemini Flash) or reasoning model (Gemini Pro) is required.
* Fallback behavior: Code must handle provider API timeouts gracefully.

---

# 10. AI PROMPT RESPONSIBILITY

Define what the service prompt must achieve.

## 10.1 System Instructions

Define the service's permanent AI behavior. Prompts must strictly instruct the model to act as an objective legal analyzer.

## 10.2 Task Instructions

Define what the AI must perform for each request. Must be clear, modular, and separated from Python business logic.

## 10.3 Context Instructions

Define how supplied documents/data should be interpreted. Code must inject chunked text clearly wrapped in XML or Markdown delimiters.

## 10.4 Output Instructions

Define required output structure and formatting. Must mandate JSON format for backend consumption.

## 10.5 Safety Instructions

Define prohibited AI behavior. Must include instructions to not provide binding legal advice.

## 10.6 Prompt Versioning

Every production prompt must have:

* Prompt ID
* Version
* Purpose
* Change reason
* Effective version
All prompts must be stored as files in `backend/app/ai/prompts/` and tracked in Git.

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

Use only when the service requires retrieval.

## 11.1 Knowledge Sources

Define what sources can be used. Developers writing RAG code must only query Qdrant vectors associated with the user's active `workspace_id`.

## 11.2 Retrieval Requirements

Define:

* What should be searched: Only embedded document chunks.
* What context should be retrieved: Top-K results with a threshold similarity score.
* How relevance is determined: Cosine similarity via Qdrant.
* What happens when nothing relevant is found: Code must handle empty result sets without crashing.

## 11.3 Source Rules

Retrieved information must remain traceable to its source. Code must retrieve the `page_number` metadata from Qdrant and pass it to the frontend.

## 11.4 Context Rules

The service must not treat irrelevant or unsupported retrieved information as authoritative.

---

# 12. BACKGROUND PROCESSING

Use this section for work that should happen asynchronously.

## 12.1 Background Tasks

List tasks such as:

* `extract_document_text_task`
* `embed_document_chunks_task`
* `translate_document_task`

## 12.2 Processing Trigger

Define what starts the background process. FastAPI endpoints dispatch tasks via `celery_app.send_task()`.

## 12.3 Processing Status

Define statuses such as:

```text
Pending
Processing
Completed
Failed
Cancelled
```

Use only the states required by this service. Developers must update task statuses in Redis or Postgres so the UI can poll them.

## 12.4 Retry Rules

Define:

* Retry conditions: Network timeouts to S3 or AI providers.
* Maximum retries: Developers must set `max_retries=3` with exponential backoff on all Celery tasks.
* Failure handling: Move failed tasks to a Dead Letter Queue (DLQ).
* User notification: Update DB status to `Failed` so UI can alert user.

## 12.5 Idempotency

Define how repeated requests are handled without creating duplicate results. All Celery tasks must be idempotent. Re-running `extract_document_text_task` on the same document must not duplicate text in the database.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

List the data this service owns. Developers own the schema migrations.

## 13.2 Read Data

List data owned by other services that this service can read.

## 13.3 Written Data

List data this service can create/update.

## 13.4 Database Entities

| Entity     | Ownership   | Purpose     |
| ---------- | ----------- | ----------- |
| `All Entities` | `Backend Team` | `Application State` |

## 13.5 Database Rules

* This service may only modify data it owns.
* Shared data must have defined ownership.
* Do not duplicate authoritative data unnecessarily.
* Maintain workspace/user isolation. Developers must avoid N+1 query problems by using SQLAlchemy `joinedload()`.
* Preserve required history/version information. **Never use `DELETE` on critical legal documents.** Use soft-deletes (`is_deleted=True`).

---

# 14. STORAGE REQUIREMENTS

Define whether the service requires file/object storage.

## 14.1 Stored Objects

* `PDF Files`
* `Docx Files`
* `Generated Audios`

## 14.2 Storage Rules

* Naming convention: Use UUIDs for filenames in S3 to prevent collisions, not original filenames (e.g., `s3://bucket/workspace_id/uuid.pdf`).
* Ownership: Strictly tied to Workspace.
* Access permissions: Generate short-lived presigned URLs for frontend access. Never make buckets public.
* Retention: Follow legal compliance retention policies.
* Versioning: Enable S3 object versioning.
* Deletion behavior: Soft-delete in DB, lifecycle rule in S3.

---

# 15. API CONTRACT

Define every API required by this service.

## 15.1 API List

| Method     | Endpoint   | Purpose     |
| ---------- | ---------- | ----------- |
| `GET/POST` | `/api/v1/...` | `Standardized REST rules` |

## 15.2 API Request

For each endpoint define:

* Required parameters: Path variables.
* Optional parameters: Query strings.
* Request body: Pydantic schemas.
* Authentication: `Depends(get_current_user)` must be on every secured route.
* Authorization: Verify user belongs to workspace.
* Validation: Automatic via FastAPI.

## 15.3 API Response

Define:

* Success response: Standard JSON wrapped in a consistent structure.
* Empty response: HTTP 204 or empty list `[]`.
* Partial response: Not applicable.
* Error response: HTTP 400 for bad input, HTTP 403 for unauthorized, HTTP 500 for server issues.

## 15.4 API Rules

* APIs must be versioned. (e.g., `/api/v1/documents`).
* Authentication is required where applicable.
* Authorization must be checked server-side.
* Never trust frontend permissions.
* Never expose internal implementation details (e.g., stack traces).
* Never expose secrets or provider credentials.

---

# 16. ERROR HANDLING

Define service-specific errors.

| Error     | Cause     | User Result       | Recovery   |
| --------- | --------- | ----------------- | ---------- |
| `HTTPException` | `Validation/Auth` | `Clean JSON message` | `User corrects input` |

## Error Rules

The service must distinguish between:

* Invalid input (HTTP 422)
* Unauthorized access (HTTP 401/403)
* Unsupported content (HTTP 415)
* Processing failure (HTTP 500)
* AI failure (HTTP 502/504)
* External provider failure (HTTP 502/504)
* Temporary failure (HTTP 503)
* Permanent failure (HTTP 500)

Errors must be understandable to the frontend without exposing sensitive internal details. Developers must use custom exception classes in Python.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

Define who can:

* View: Workspace Members.
* Create: Workspace Members.
* Execute: Workspace Members.
* Modify: Workspace Managers/Admins.
* Delete: Workspace Admins.
* Share: Workspace Admins.

## 17.2 Data Isolation

User and workspace data must never cross unauthorized boundaries. Every backend service function must require `workspace_id` as an argument.

## 17.3 Sensitive Data

Define any sensitive information handled by the service. All legal documents and user chats are strictly sensitive.

## 17.4 Security Rules

* Validate all external input.
* Enforce authorization on backend.
* Protect stored documents (Presigned URLs only).
* Protect AI credentials (Environment variables only).
* Never expose secrets to frontend.
* Log security-relevant events (Failed logins).

---

# 18. SOURCE & TRACEABILITY

If the service produces AI-generated or extracted information, define traceability.

## 18.1 Source Types

* Document
* Page
* Section
* Clause
* External legal source
* Knowledge source

## 18.2 Source Requirements

Every important generated finding must have a source when available. Developers writing extraction code must map the AI output back to the PDF bounding box or page number.

## 18.3 Missing Source Behavior

Define what happens when a result cannot be linked to a source. Code must default the source field to `null` and the UI must display "Source not found in document".

---

# 19. LEGAL SAFETY

Define service-specific legal safety requirements.

## 19.1 Accuracy

Define what accuracy means for this service. Code must prefer failing (returning no answer) over hallucinating a legal fact.

## 19.2 Uncertainty

Define how uncertain results are presented. Prompts must output confidence scores. Code must pass low confidence scores to the UI.

## 19.3 Unsupported Claims

The service must not present unsupported AI-generated information as verified fact.

## 19.4 Disclaimer Requirements

Define whether the service requires:

* Informational disclaimer
* Verification warning
* Professional legal advice warning
* Other user safeguard
Frontend developers must hardcode legal disclaimers at the bottom of the AI Chat and Document Summary views.

---

# 20. PERFORMANCE REQUIREMENTS

Define expected behavior without specifying implementation unnecessarily.

## 20.1 Response Requirements

* Expected normal response behavior: API routes < 500ms.
* Maximum acceptable waiting behavior: AI Chat streams within 2 seconds.
* Async requirements: Document processing handled entirely async.

## 20.2 Large Input Handling

Define how large documents/requests are handled. Uploads must be streamed to S3, not loaded entirely into RAM.

## 20.3 Concurrent Usage

Define expected concurrent requests if known. Code must use async/await (`async def` in FastAPI) for all I/O bound operations.

## 20.4 Resource Limits

Define:

* File limits: Fastapi `UploadFile` max sizes enforced.
* Request limits: Redis Rate limiting middleware applied to API.
* AI limits: Max tokens handled dynamically.
* Processing limits: Celery worker concurrency limits.

---

# 21. FOLDER STRUCTURE

Define where this service belongs in the project.

This section enforces the rules defined in `04-project-structure.md`. Developers must place their code in the exact designated directories.

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| API            | `backend/app/api/` | `REST HTTP routes` |
| Business Logic | `backend/app/services/` | `Core business intelligence` |
| Database       | `backend/app/db/` | `SQLAlchemy models` |
| AI             | `backend/app/ai/` | `Gateway and Prompts` |
| Background     | `backend/app/worker/` | `Celery tasks` |
| Tests          | `backend/tests/` | `Pytest files` |

---

# 22. SERVICE CONNECTIONS

Define how this service communicates with other parts of the platform.

```text
[Frontend UI]
     ↓ (HTTP / Axios)
[FastAPI Route]
     ↓ (Python Call)
[Business Service]
     ↓ (Network Call)
[Database / AI / Storage]
```

For every connection define:

* Source: Dependent code.
* Destination: Core service.
* Purpose: Execute logic.
* Data exchanged: Pydantic schemas.
* Direction: Bidirectional.
* Failure behavior: Propagate exceptions.

---

# 23. EVENTS

If the service uses events:

## Events Consumed

| Event     | Source      | Purpose     |
| --------- | ----------- | ----------- |
| `Message` | `Redis/Celery` | `Trigger background task execution` |

## Events Produced

| Event     | Consumers   | Purpose     |
| --------- | ----------- | ----------- |
| `Task` | `Redis/Celery` | `Offload heavy processing` |

Define event rules, duplication handling, and failure behavior. Developers must not build custom pub/sub mechanics; use the existing Celery/Redis infrastructure.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

Define important events that should be logged. Developers must log external API calls, DB connection failures, and AI provider timeouts.

## 24.2 Audit Logging

Define user/business actions that must be recorded. Workspace creations, document uploads, and user invitations.

## 24.3 Sensitive Data Rules

Logs must not contain:

* Passwords
* API keys
* Authentication tokens
* Unnecessary document contents (Do not log full extracted PDF texts).
* Other sensitive information

---

# 25. OBSERVABILITY

Define what must be measurable.

## Metrics

* Request count
* Success rate
* Failure rate
* Processing duration
* AI usage
* Background job status
* Other service-specific metrics

## Health

Define how service health is determined. All backend services must expose a `/health` endpoint checking DB, Redis, and Qdrant connectivity.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

Test:

* Business rules
* Validation
* Data transformation
* Decision logic
**Rule:** Developers cannot merge code without writing unit tests.

## 26.2 Integration Testing

Test:

* API
* Database
* AI layer
* Storage
* Other service connections

## 26.3 End-to-End Testing

Test the complete user workflow using Playwright on the Frontend.

## 26.4 AI Testing

Test:

* Expected responses
* Incorrect inputs
* Missing context
* Hallucination resistance
* Source correctness
* Output structure
* Edge cases
Developers must use a mocked AI provider or specific deterministic test prompts for CI pipelines.

## 26.5 Security Testing

Test:

* Authorization
* Workspace isolation
* Invalid input
* File restrictions
* Access control

---

# 27. EDGE CASES

List known edge cases.

| Case     | Expected Behavior |
| -------- | ----------------- |
| `AI Timeout` | `Fail gracefully, alert user to try again.` |

Include where applicable:

* Empty input
* Very large input
* Corrupted document
* Unsupported document
* Missing text
* Poor OCR
* Missing context
* Conflicting information
* AI failure
* Provider failure
* Duplicate request
* Permission change
* Deleted document
* Version mismatch
Developers must explicitly code logic to handle these cases.

---

# 28. VERSIONING

Define how service behavior changes are managed.

## Service Version

`Follow Semantic Versioning (SemVer) (Major.Minor.Patch)`

## API Version

`Hardcoded in URL (e.g., /api/v1/)`

## Prompt Version

`Stored in prompt metadata (v1, v2)`

## Database Version

`Alembic revision hashes`

## Compatibility Rules

Define what must remain compatible when the service changes. API changes must not break the existing Frontend until the Frontend is simultaneously deployed with the new integration.

---

# 29. CONFIGURATION

List configurable values.

| Configuration | Purpose     | Required   | Default   |
| ------------- | ----------- | ---------- | --------- |
| `ENV_VARS`    | `Configure system behavior without code changes` | `yes` | `development defaults` |

Never store secrets directly in source code. All secrets MUST use environment variables loaded via `.env` in local development and via secure secret managers in production.

---

# 30. DEPLOYMENT REQUIREMENTS

Define what this service requires to run.

## Runtime Requirements

* `Docker daemon`

## Environment Requirements

* Development (Local Docker Compose)
* Testing (CI/CD GitHub Actions)
* Production (Cloud K8s/ECS)

## External Dependencies

* `PostgreSQL, Redis, Qdrant, S3, OpenAI/Gemini/Claude APIs`

## Startup Requirements

Define what must be available before this service starts. DB Migrations must complete before the FastAPI web server starts accepting requests.

---

# 31. ACCEPTANCE CRITERIA

The service is considered complete only when:

### Functional

* [ ] `Code runs without errors locally.`
* [ ] `Feature implements exactly what the product ticket requested.`

### API

* [ ] `API endpoints adhere to REST standards.`

### Database

* [ ] `SQLAlchemy models are optimal and Alembic migrations are generated.`

### AI

* [ ] `AI Gateway is used; no direct provider calls.`

### Background Processing

* [ ] `Heavy tasks are pushed to Celery.`

### Security

* [ ] `Workspace authorization is verified.`

### Frontend

* [ ] `UI matches design and handles loading/error states.`

### Error Handling

* [ ] `All known exceptions are handled gracefully.`

### Testing

* [ ] `Unit tests added and passing.`

### Documentation

* [ ] `Docstrings added and OpenAPI schema updated.`

---

# 32. DEFINITION OF DONE

This service is **DONE** only when:

* The defined user workflow works.
* Required APIs are implemented.
* Required business logic is implemented.
* Required database/storage changes are complete.
* AI integration follows the common AI layer.
* Background processing works where required.
* Authorization is enforced.
* Errors are handled correctly.
* Results are traceable where required.
* Frontend integration is complete.
* Tests pass.
* No responsibility has been duplicated from another service.
* No undocumented dependency has been introduced.
* Production configuration is defined.
* Acceptance criteria are satisfied.
* **AND two peer developers have approved the Pull Request.**

---

# 33. IMPLEMENTATION RULES

These rules apply to the entire service.

1. **Do not duplicate common platform capabilities.**
2. **Do not create a second implementation of an existing shared capability.**
3. **Keep business logic inside the service responsible for it.**
4. **Frontend must not contain authoritative business logic.**
5. **Frontend must not directly access databases.**
6. **Frontend must not directly depend on AI-provider credentials.**
7. **Services must communicate through defined contracts.**
8. **Database ownership must be explicit.**
9. **AI providers must remain replaceable.**
10. **Documents must remain associated with the correct workspace and permissions.**
11. **Important AI results must remain traceable where possible.**
12. **Background processing must be safe to retry.**
13. **Repeated requests must not create unintended duplicate data.**
14. **Secrets must never be committed to source control.**
15. **Errors must be handled explicitly.**
16. **Unsupported input must fail safely.**
17. **Do not silently invent missing information.**
18. **Do not expand the service beyond its defined responsibility.**
19. **Any new dependency must be documented.**
20. **Any architectural change must update this service specification.**

---

# 34. SERVICE DEPENDENCY MAP

```text
                    [COMMON PLATFORM]
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
       [Developer]  [GitHub Actions]  [Code Reviewer]
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
         [Passed Tests] [Approved] [Merged to Main]
```

Replace this with the actual dependency relationship.

---

# 35. FINAL SERVICE SUMMARY

## What it does

Defines the unbreakable rules of engineering for the Legal AI Platform, ensuring a high-quality, secure, and cohesive codebase.

## What the user sees

A stable, fast, and bug-free application as a direct result of these engineering standards.

## What happens in the background

Continuous Integration pipelines (GitHub Actions), linters, and strict code review processes silently enforce these rules on every single line of code submitted by developers.

## What it receives

Code contributions (Pull Requests) from developers.

## What it produces

A production-ready, highly maintainable monorepo.

## What it depends on

The chosen technology stack (Python, React) and architectural boundaries.

## What depends on it

Every software engineer, QA tester, and DevOps engineer working on the platform.

## Success means

Zero critical security vulnerabilities reaching production, minimal technical debt, and a codebase that allows new developers to onboard quickly and safely.

---

# 36. CHANGE HISTORY

| Version | Date     | Change                | Author   |
| ------- | -------- | --------------------- | -------- |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
