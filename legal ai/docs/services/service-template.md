# [SERVICE NAME]

> **Purpose:** Complete implementation blueprint for `[SERVICE NAME]`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`[Service name]`

## 1.2 Service ID

`[unique-service-id]`

## 1.3 Service Category

`[Core Legal / Document / Language / Indian Legal / Workspace / AI / Other]`

## 1.4 Service Type

`[User-facing / Backend / Background / Shared capability / Hybrid]`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The service must:

* `[responsibility 1]`
* `[responsibility 2]`
* `[responsibility 3]`

The service must **not** own responsibilities belonging to other services.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.

## 1.7 User Value

Explain what the user gains from this service.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* `[item]`
* `[item]`
* `[item]`

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* `[item]`
* `[item]`
* `[item]`

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `[service]` | `[reason]`   | `[data]`      |

## 2.4 Services Depending on This Service

List services that may consume this service's output.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point

Describe how the user reaches this capability.

Examples:

* AI Workspace
* Document Workspace
* Chat
* Document action
* More actions
* Dedicated workspace

## 3.2 User Input

Define everything the user can provide.

* Text
* Document
* Selected section
* Multiple documents
* Language
* Options
* Other required inputs

## 3.3 User Flow

Define the complete user journey:

```text
User Entry
    ↓
Input
    ↓
Validation
    ↓
Processing
    ↓
Result
    ↓
User Action
```

Replace the generic stages with the actual service flow.

## 3.4 User States

Define UI behavior for:

* Initial state
* Input state
* Processing state
* Success state
* Empty state
* Partial result state
* Error state
* Retry state
* Permission denied state
* Unsupported input state

## 3.5 User-Visible Result

Define exactly what the frontend must display.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
INPUT
  ↓
VALIDATION
  ↓
CONTEXT PREPARATION
  ↓
PROCESSING
  ↓
AI / LOGIC
  ↓
VALIDATION
  ↓
RESULT
  ↓
STORAGE
  ↓
API RESPONSE
```

For each step define:

### Step 1 — `[Name]`

**Purpose:**
`[what happens]`

**Input:**
`[input]`

**Output:**
`[output]`

**Rules:**

* `[rule]`
* `[rule]`

Repeat for every step.

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `[input]` | `[type]` | Yes      | `[rules]` |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `[input]` | `[type]` | `[default]` | `[rules]` |

## 5.3 Input Validation Rules

Define:

* Supported formats
* Size limits
* Required fields
* Allowed values
* Invalid values
* Missing information
* Permission requirements
* Context requirements

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output

`[result description]`

## 6.2 Output Structure

Define the logical structure of the result.

```text
Result
├── Status
├── Main Result
├── Supporting Information
├── Sources
├── Warnings
└── Metadata
```

Adapt this structure according to the service.

## 6.3 Output Rules

* Output must be `[rule]`
* Output must not contain `[rule]`
* Missing information must be represented as `[behavior]`
* Uncertain information must be represented as `[behavior]`

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* `[rule]`
* `[rule]`
* `[rule]`

## 7.2 Validation Rules

* `[rule]`

## 7.3 Decision Rules

Define how the service decides between different outcomes.

## 7.4 Failure Rules

Define what happens when processing cannot be completed.

## 7.5 Boundary Rules

Define limits of the service.

---

# 8. DOCUMENT CONTEXT

If the service works with documents, define how document context is used.

## 8.1 Required Document Information

* Document ID
* Version
* Type
* Extracted text
* Sections
* Pages
* Metadata
* Other required information

## 8.2 Context Rules

* Always use the selected document version.
* Do not mix unrelated workspace documents.
* Preserve document/page/section references.
* Respect document permissions.
* Do not use unavailable document information as fact.

## 8.3 Section-Level Context

Define whether the service can operate on:

* Entire document
* Selected pages
* Selected sections
* Selected clauses
* Multiple documents

---

# 9. AI RESPONSIBILITY

Only include this section when AI is involved.

## 9.1 AI Purpose

Define exactly what AI is responsible for.

## 9.2 AI Input

Define what information is sent to the AI.

AI must receive only the information required for the task.

## 9.3 AI Output

Define what the AI is expected to return.

## 9.4 AI Rules

The AI must:

* Stay within the service's responsibility.
* Use supplied context.
* Avoid inventing unavailable information.
* Clearly indicate uncertainty.
* Preserve important source references.
* Follow the application's legal safety rules.
* Follow the required output structure.

## 9.5 AI Provider Independence

The service must **not depend directly on a specific AI provider**.

The service communicates through the platform's common AI layer.

```text
Service
   ↓
AI Gateway
   ↓
Provider Adapter
   ↓
Selected AI Provider
```

The service must continue working if the underlying provider changes.

## 9.6 Model Requirements

Define:

* Required model capability
* Context requirements
* Maximum expected input
* Output requirements
* Quality requirements
* Fallback behavior

Do not hard-code a provider unless explicitly required.

---

# 10. AI PROMPT RESPONSIBILITY

Define what the service prompt must achieve.

## 10.1 System Instructions

Define the service's permanent AI behavior.

## 10.2 Task Instructions

Define what the AI must perform for each request.

## 10.3 Context Instructions

Define how supplied documents/data should be interpreted.

## 10.4 Output Instructions

Define required output structure and formatting.

## 10.5 Safety Instructions

Define prohibited AI behavior.

## 10.6 Prompt Versioning

Every production prompt must have:

* Prompt ID
* Version
* Purpose
* Change reason
* Effective version

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

Use only when the service requires retrieval.

## 11.1 Knowledge Sources

Define what sources can be used.

## 11.2 Retrieval Requirements

Define:

* What should be searched
* What context should be retrieved
* How relevance is determined
* What happens when nothing relevant is found

## 11.3 Source Rules

Retrieved information must remain traceable to its source.

## 11.4 Context Rules

The service must not treat irrelevant or unsupported retrieved information as authoritative.

---

# 12. BACKGROUND PROCESSING

Use this section for work that should happen asynchronously.

## 12.1 Background Tasks

List tasks such as:

* `[task]`
* `[task]`
* `[task]`

## 12.2 Processing Trigger

Define what starts the background process.

## 12.3 Processing Status

Define statuses such as:

```text
Pending
Processing
Completed
Failed
Cancelled
```

Use only the states required by this service.

## 12.4 Retry Rules

Define:

* Retry conditions
* Maximum retries
* Failure handling
* User notification

## 12.5 Idempotency

Define how repeated requests are handled without creating duplicate results.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data

List the data this service owns.

## 13.2 Read Data

List data owned by other services that this service can read.

## 13.3 Written Data

List data this service can create/update.

## 13.4 Database Entities

| Entity     | Ownership   | Purpose     |
| ---------- | ----------- | ----------- |
| `[entity]` | `[service]` | `[purpose]` |

## 13.5 Database Rules

* This service may only modify data it owns.
* Shared data must have defined ownership.
* Do not duplicate authoritative data unnecessarily.
* Maintain workspace/user isolation.
* Preserve required history/version information.

---

# 14. STORAGE REQUIREMENTS

Define whether the service requires file/object storage.

## 14.1 Stored Objects

* `[object]`

## 14.2 Storage Rules

* Naming convention
* Ownership
* Access permissions
* Retention
* Versioning
* Deletion behavior

---

# 15. API CONTRACT

Define every API required by this service.

## 15.1 API List

| Method     | Endpoint   | Purpose     |
| ---------- | ---------- | ----------- |
| `[METHOD]` | `/api/...` | `[purpose]` |

## 15.2 API Request

For each endpoint define:

* Required parameters
* Optional parameters
* Request body
* Authentication
* Authorization
* Validation

## 15.3 API Response

Define:

* Success response
* Empty response
* Partial response
* Error response

## 15.4 API Rules

* APIs must be versioned.
* Authentication is required where applicable.
* Authorization must be checked server-side.
* Never trust frontend permissions.
* Never expose internal implementation details.
* Never expose secrets or provider credentials.

---

# 16. ERROR HANDLING

Define service-specific errors.

| Error     | Cause     | User Result       | Recovery   |
| --------- | --------- | ----------------- | ---------- |
| `[error]` | `[cause]` | `[message/state]` | `[action]` |

## Error Rules

The service must distinguish between:

* Invalid input
* Unauthorized access
* Unsupported content
* Processing failure
* AI failure
* External provider failure
* Temporary failure
* Permanent failure

Errors must be understandable to the frontend without exposing sensitive internal details.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules

Define who can:

* View
* Create
* Execute
* Modify
* Delete
* Share

## 17.2 Data Isolation

User and workspace data must never cross unauthorized boundaries.

## 17.3 Sensitive Data

Define any sensitive information handled by the service.

## 17.4 Security Rules

* Validate all external input.
* Enforce authorization on backend.
* Protect stored documents.
* Protect AI credentials.
* Never expose secrets to frontend.
* Log security-relevant events.

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

Every important generated finding must have a source when available.

## 18.3 Missing Source Behavior

Define what happens when a result cannot be linked to a source.

---

# 19. LEGAL SAFETY

Define service-specific legal safety requirements.

## 19.1 Accuracy

Define what accuracy means for this service.

## 19.2 Uncertainty

Define how uncertain results are presented.

## 19.3 Unsupported Claims

The service must not present unsupported AI-generated information as verified fact.

## 19.4 Disclaimer Requirements

Define whether the service requires:

* Informational disclaimer
* Verification warning
* Professional legal advice warning
* Other user safeguard

---

# 20. PERFORMANCE REQUIREMENTS

Define expected behavior without specifying implementation unnecessarily.

## 20.1 Response Requirements

* Expected normal response behavior
* Maximum acceptable waiting behavior
* Async requirements

## 20.2 Large Input Handling

Define how large documents/requests are handled.

## 20.3 Concurrent Usage

Define expected concurrent requests if known.

## 20.4 Resource Limits

Define:

* File limits
* Request limits
* AI limits
* Processing limits

---

# 21. FOLDER STRUCTURE

Define where this service belongs in the project.

Example structure:

```text
project/
├── frontend/
│   └── ...
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   └── ...
│
├── workers/
│   └── ...
│
├── ai/
│   └── ...
│
├── database/
│   └── ...
│
└── docs/
    └── services/
        └── [service-name].md
```

Then define this service's exact locations.

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| API            | `[path]` | `[purpose]`    |
| Business Logic | `[path]` | `[purpose]`    |
| Database       | `[path]` | `[purpose]`    |
| AI             | `[path]` | `[purpose]`    |
| Background     | `[path]` | `[purpose]`    |
| Tests          | `[path]` | `[purpose]`    |

---

# 22. SERVICE CONNECTIONS

Define how this service communicates with other parts of the platform.

```text
[Service A]
     ↓
[This Service]
     ↓
[Service B]
     ↓
[Database / AI / Storage]
```

For every connection define:

* Source
* Destination
* Purpose
* Data exchanged
* Direction
* Failure behavior

---

# 23. EVENTS

If the service uses events:

## Events Consumed

| Event     | Source      | Purpose     |
| --------- | ----------- | ----------- |
| `[event]` | `[service]` | `[purpose]` |

## Events Produced

| Event     | Consumers   | Purpose     |
| --------- | ----------- | ----------- |
| `[event]` | `[service]` | `[purpose]` |

Define event rules, duplication handling, and failure behavior.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

Define important events that should be logged.

## 24.2 Audit Logging

Define user/business actions that must be recorded.

## 24.3 Sensitive Data Rules

Logs must not contain:

* Passwords
* API keys
* Authentication tokens
* Unnecessary document contents
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

Define how service health is determined.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing

Test:

* Business rules
* Validation
* Data transformation
* Decision logic

## 26.2 Integration Testing

Test:

* API
* Database
* AI layer
* Storage
* Other service connections

## 26.3 End-to-End Testing

Test the complete user workflow.

## 26.4 AI Testing

Test:

* Expected responses
* Incorrect inputs
* Missing context
* Hallucination resistance
* Source correctness
* Output structure
* Edge cases

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
| `[case]` | `[behavior]`      |

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

---

# 28. VERSIONING

Define how service behavior changes are managed.

## Service Version

`[version]`

## API Version

`[version]`

## Prompt Version

`[version]`

## Database Version

`[version]`

## Compatibility Rules

Define what must remain compatible when the service changes.

---

# 29. CONFIGURATION

List configurable values.

| Configuration | Purpose     | Required   | Default   |
| ------------- | ----------- | ---------- | --------- |
| `[config]`    | `[purpose]` | `[yes/no]` | `[value]` |

Never store secrets directly in source code.

---

# 30. DEPLOYMENT REQUIREMENTS

Define what this service requires to run.

## Runtime Requirements

* `[requirement]`

## Environment Requirements

* Development
* Testing
* Production

## External Dependencies

* `[dependency]`

## Startup Requirements

Define what must be available before this service starts.

---

# 31. ACCEPTANCE CRITERIA

The service is considered complete only when:

### Functional

* [ ] `[requirement]`
* [ ] `[requirement]`

### API

* [ ] `[requirement]`

### Database

* [ ] `[requirement]`

### AI

* [ ] `[requirement]`

### Background Processing

* [ ] `[requirement]`

### Security

* [ ] `[requirement]`

### Frontend

* [ ] `[requirement]`

### Error Handling

* [ ] `[requirement]`

### Testing

* [ ] `[requirement]`

### Documentation

* [ ] `[requirement]`

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
          [Service A]  [THIS SERVICE]  [Service B]
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
              [AI]       [DB]      [Storage]
```

Replace this with the actual dependency relationship.

---

# 35. FINAL SERVICE SUMMARY

## What it does

`[one clear paragraph]`

## What the user sees

`[one clear description]`

## What happens in the background

`[one clear description]`

## What it receives

`[inputs]`

## What it produces

`[outputs]`

## What it depends on

`[dependencies]`

## What depends on it

`[consumers]`

## Success means

`[clear measurable/observable outcome]`

---

# 36. CHANGE HISTORY

| Version | Date     | Change                | Author   |
| ------- | -------- | --------------------- | -------- |
| `1.0`   | `[date]` | Initial specification | `[name]` |
