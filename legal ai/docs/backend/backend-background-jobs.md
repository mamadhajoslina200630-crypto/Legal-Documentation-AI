# Legal AI Platform (Backend Background Jobs)

> **Purpose:** Complete implementation blueprint for `Backend Background Jobs`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Backend Background Jobs`

## 1.2 Service ID

`sys-backend-jobs-core-platform`

## 1.3 Service Category

`Platform Engineering & Core Logic`

## 1.4 Service Type

`Asynchronous Task Processor`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Backend Background Jobs architecture must:

* Offload long-running, CPU-intensive, or I/O-heavy operations (OCR, PDF chunking, LLM summarization) away from the main FastAPI web server.
* Ensure tasks are executed reliably using a message broker (Redis/Celery).
* Provide mechanisms for retrying failed tasks, managing dead-letter queues, and tracking task progress.

The service must **not** execute business logic directly; it must simply import and call the standardized Service Layer (as defined in Backend Service Standards).

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
If a lawyer uploads a 500-page PDF, processing it for OCR and AI analysis can take 5 minutes. If the FastAPI web server handles this directly, the user's browser will eventually time out, the server connection will drop, and the processing will die halfway through. Background jobs solve this by accepting the file instantly, freeing up the web server to handle other users, and processing the massive file reliably in the background.

## 1.7 User Value

Explain what the user gains from this service.
A fast, responsive web application that never hangs or times out, even when they ask the AI to perform a massive, complex analysis.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A fully configured Celery worker environment connected to a Redis broker, running alongside the FastAPI application, with a standard pattern for queuing and polling tasks.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Celery application configuration (`celery_app.py`).
* Redis message broker integration.
* Task definition decorators (`@celery.task`).
* Retry logic and exponential backoff.
* Task status tracking (Pending, Started, Success, Failure).
* Scheduled/Cron jobs (Celery Beat).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Event streaming for inter-microservice communication (Use Kafka/RabbitMQ for that; Celery is for internal background tasks).
* Core business logic (Tasks just call the Service layer).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Redis` | Message broker and result backend | Task IDs/States |
| `Backend Services` | The actual logic to execute | Pydantic Models |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**API Routers** trigger these tasks and return the Task ID to the Frontend.

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user triggers an action in the UI (e.g., "Analyze Contract").

## 3.2 User Input
A button click or file upload.

## 3.3 User Flow

```text
User uploads document
  ↓
Frontend calls FastAPI POST `/documents`
  ↓
FastAPI saves file to S3, saves DB row with status="PENDING"
  ↓
FastAPI calls `process_document.delay(doc_id)`
  ↓
FastAPI immediately returns `202 Accepted` + `{ "task_id": "uuid" }`
  ↓
Frontend polls `/tasks/{task_id}` (or listens to WebSockets) showing a progress bar
  ↓
Celery Worker picks up task from Redis, runs OCR, updates DB status="COMPLETED"
  ↓
Frontend sees "COMPLETED" and updates the UI
```

## 3.4 User States
* `Processing / Analyzing` (Seeing a spinner or progress bar).

## 3.5 User-Visible Result
A notification or UI update when the background job finishes.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Task Execution Workflow

```text
PRODUCER (FastAPI)
  Pushes serialized task message to Redis Queue.
  ↓
BROKER (Redis)
  Holds message in memory.
  ↓
CONSUMER (Celery Worker)
  Pops message from Queue.
  Executes Python function.
  If Exception thrown -> Check max_retries. If under limit, push back to queue with delay.
  If Success -> Write result to Celery Result Backend (Redis/Postgres).
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs
* Background tasks (`@celery.task`) MUST ONLY accept primitive, JSON-serializable arguments (Strings, Integers, UUIDs).

## 5.3 Input Validation Rules
* **CRITICAL:** Do NOT pass complex objects (like SQLAlchemy models or large Pydantic objects) directly into `delay()`. Pass the `document_id` (UUID), and have the Celery worker fetch the fresh object from the database when the task actually begins. This prevents Stale Data errors if the DB changes while the task is sitting in the queue.

---

# 6. OUTPUT CONTRACT

N/A - Celery tasks generally update the database rather than returning data directly to the web client.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Idempotency:** Every background task MUST be idempotent. This means if a task crashes 90% of the way through, and the retry mechanism runs the task again from the beginning, it must not corrupt the database or charge the user's credit card twice.
* **Thin Wrappers:** A Celery task function should rarely be more than 10 lines long. It should instantiate a Service and call a method.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules

* **Retries:** Network calls to AI Providers (OpenAI, Claude) will frequently fail due to rate limits or timeouts. Celery tasks interacting with APIs MUST be configured with `autoretry_for=(Exception,)` and an exponential backoff strategy (e.g., retry after 2s, 4s, 8s).

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

## 8.1 Required Document Information
* Processing a massive document (e.g., 2,000 pages) should ideally be split into sub-tasks (chunks) so that multiple Celery workers can process different pages of the same document in parallel.

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

*(This entire document defines Background Processing).*

---

# 13. DATABASE RESPONSIBILITY

## 13.5 Database Rules
* **Connection Pooling:** Celery workers run in separate OS processes from the FastAPI server. They must establish their own database connection pool (via SQLAlchemy) when they boot up.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.4 API Rules
* The API must expose a standardized endpoint to check task status: `GET /api/v1/tasks/{task_id}` returning `{ "status": "PENDING|STARTED|SUCCESS|FAILURE", "result": {...} }`.

---

# 16. ERROR HANDLING

## Error Rules
* If a task exhausts all its retries, it must be routed to a "Dead Letter Queue" or flagged in the database as `FAILED`, and an alert must be sent to Sentry for engineering review. The user must be notified via the UI that their operation failed.

---

# 17. AUTHORIZATION & SECURITY

## 17.4 Security Rules
* Because Celery workers do not have a FastAPI `Request` context, they do not have a JWT. If a Service method requires the `current_user_id` for an audit log, the API Router must pass that UUID as an argument to the `.delay(doc_id, user_id)` function.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Web requests pushing a task to Redis must complete in `< 5ms`.

## 20.2 Large Input Handling
* Do not push large binary files (PDFs) into the Redis message queue. Save the file to S3 first, then pass the `s3_path` string to the Celery worker.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Celery Config  | `backend/app/worker/celery_app.py` | Broker and app setup |
| Tasks          | `backend/app/worker/tasks/` | Task definitions |

---

# 22. SERVICE CONNECTIONS

```text
[FastAPI] ──(Push ID)──► [Redis] ◄──(Pop ID)── [Celery Worker]
                                                     │
                                                     ▼
                                            [PostgreSQL / S3]
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* Celery workers must log the `task_id` in every log statement (using structured logging context) so that a specific background job can be traced through the logs.

---

# 25. OBSERVABILITY

## Metrics
* Monitor **Queue Length**: If the queue grows continuously, the system needs more Celery worker nodes provisioned.
* Monitor **Task Latency**: Time between a task entering the queue and a worker starting it.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* Celery tasks can be executed synchronously in tests by setting `CELERY_TASK_ALWAYS_EAGER = True`. This bypasses Redis and runs the function immediately, making unit testing much simpler.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Worker Crash` | If a Celery worker OS process is OOM-killed (Out Of Memory) mid-task, Celery's `acks_late=True` setting ensures the message remains in Redis and is picked up by another worker. |

---

# 28. VERSIONING

## Compatibility Rules
* Be incredibly careful deploying updates to Task signatures. If the new code expects `process(doc_id, user_id)` but Redis is still holding old messages formatted as `process(doc_id)`, the workers will crash.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `CELERY_BROKER_URL` | Redis connection | Yes | `redis://localhost:6379/0` |
| `CELERY_RESULT_BACKEND` | Where to store task state | Yes | `redis://localhost:6379/1` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Celery workers must be deployed as standalone containers/processes, entirely separate from the web server containers, so they can scale independently based on queue depth.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Long tasks return HTTP 202 immediately.
* [ ] The Frontend can query the `task_id` to get progress updates.
* [ ] Failed tasks automatically retry 3 times with exponential backoff.
* [ ] Task parameters only accept primitives (UUIDs/Strings).

---

# 32. DEFINITION OF DONE

The Backend Background Jobs architecture is **DONE** when the Celery application is running, Redis is accepting messages, and a developer can wrap any heavy Python function with `@celery.task` to instantly offload it from the web server.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (Tasks import from `services/`; they don't contain raw logic).
2. **Unsupported input must fail safely.**
3. **Repeated requests must not create unintended duplicate data.** (Tasks MUST be idempotent).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Acts as the heavy-lifting workforce for the platform, executing the slow and complex tasks in the background.

## What the user sees
A lightning-fast web interface that accepts their requests instantly, accompanied by progress bars for large tasks.

## What happens in the background
FastAPI drops a message into a Redis queue and responds to the user. A fleet of Celery workers reads the queue, executes the AI pipelines, updates the database, and marks the task as complete.

## What it receives
Task IDs and JSON primitives.

## What it produces
Executed business logic.

## Success means
The platform is highly resilient. Even if an AI provider goes down, the background jobs simply pause, retry, and eventually succeed without the user ever seeing a 500 Server Error in their browser.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
