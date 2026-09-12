# Legal AI Platform (Audit & Activity Logging)

> **Purpose:** Complete implementation blueprint for `Audit & Activity Logging`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Audit & Activity Logging`

## 1.2 Service ID

`sys-common-audit-log`

## 1.3 Service Category

`Common Infrastructure / Compliance & Security`

## 1.4 Service Type

`Asynchronous Event Consumer`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Audit & Activity Logging service must:

* Maintain an immutable, append-only record of every critical action performed within a Workspace.
* Listen to system-wide events on the Message Broker (e.g., `DocumentViewed`, `DocumentDownloaded`, `WorkspaceMemberInvited`, `AIQueryExecuted`).
* Structure these events into a standard schema (Who, What, When, Where, Result).
* Provide querying capabilities for Workspace Admins to review activity (e.g., "Who viewed the Acme merger documents last Tuesday?").

The service must **not** log raw passwords, full AI chat transcripts (handled by the Chat Service), or personally identifiable financial data. It logs *metadata* about actions.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
In the legal industry, "Information Barriers" (or "Ethical Walls") are required to prevent conflicts of interest (e.g., a firm representing both sides of a merger). If a breach occurs, the firm must prove exactly who accessed a document and when. Furthermore, SOC2 and ISO27001 certifications require rigorous, tamper-proof audit trails. This service provides the undeniable proof of activity required for enterprise compliance.

## 1.7 User Value

Explain what the user gains from this service.
Accountability and compliance. A Workspace Admin can easily pull a CSV report showing exactly who uploaded, viewed, or deleted documents over the last 90 days.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A high-throughput background consumer that writes standard Audit Event objects into a specialized, partitioned PostgreSQL table (or time-series database), exposed via an API for Admin reporting.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Defining the standard `AuditEvent` schema.
* Consuming messages from RabbitMQ / Kafka / Redis Streams.
* Appending records to the database.
* Exposing a paginated `/audit-logs` endpoint for admins.
* Data retention management (e.g., automatically archiving logs older than 7 years).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Standard application debugging logs (e.g., Python `logging.info` or HTTP 500 errors). That is handled by Datadog/ELK for developers. This service is for *User-Facing Business Actions*.
* Real-time billing (Handled by AI Gateway).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Message Broker` | To receive system events | JSON Event Payloads |
| `Workspace Service` | To resolve Admin permissions | Auth Headers |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend Admin Dashboard** (to display the logs).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
A Workspace Admin navigates to `Settings -> Audit Logs`.

## 3.2 User Input
Date range filters, User filters, Action type filters.

## 3.3 User Flow

```text
Admin wants to know who deleted a file.
  ↓
Navigates to Audit Logs in UI.
  ↓
Filters by Action: "DOCUMENT_DELETED".
  ↓
UI calls `GET /api/v1/workspaces/{id}/audit-logs?action=DOCUMENT_DELETED`
  ↓
Service queries the partitioned table.
  ↓
UI displays: "Oct 1, 2024 - 10:15 AM - Jane Doe - Deleted document 'NDA.pdf' (IP: 192.168.1.1)".
```

## 3.4 User States
* `Viewing Logs`
* `Exporting CSV`

## 3.5 User-Visible Result
A clean, undeniable list of every action that happened in the Workspace.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### Asynchronous Event Ingestion Workflow

```text
Any internal service publishes an event to the Message Broker:
`EventBus.publish("audit", { action: "DOCUMENT_VIEWED", user_id: "...", target_id: "..." })`
  ↓
Audit Consumer (running as a background worker) picks up the message.
  ↓
Normalize payload into `AuditEvent` schema.
  ↓
Enrich payload if necessary (e.g., look up user's IP address from header context).
  ↓
Insert row into `workspace_audit_logs` table.
  ↓
Acknowledge message to Broker.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `workspace_id`| `UUID` | Yes | Defines the tenant |
| `user_id` | `UUID` | Yes | The actor (Who) |
| `action_type` | `String` | Yes | Enum (e.g., `DOC_VIEW`, `USER_INVITE`) |
| `target_id` | `UUID` | Yes | The thing being acted upon (What) |
| `target_type` | `String` | Yes | e.g., `DOCUMENT`, `WORKSPACE`, `CHAT` |

## 5.2 Optional Inputs

| Input     | Type     | Default     | Rules     |
| --------- | -------- | ----------- | --------- |
| `metadata` | `JSON` | `{}` | Extra context (e.g., `{ "file_name": "acme.pdf" }`) |
| `ip_address` | `String` | `null` | IP of the actor |

## 5.3 Input Validation Rules
* Must reject unknown `action_type` values to prevent junk data from polluting the logs.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Paginated JSON response of audit logs.

## 6.2 Output Structure
```json
{
  "logs": [
    {
      "id": "uuid",
      "timestamp": "2024-10-01T10:15:00Z",
      "user": {
        "id": "uuid",
        "email": "jane@smith.com"
      },
      "action": "DOCUMENT_VIEWED",
      "target": {
        "type": "DOCUMENT",
        "id": "uuid",
        "name": "NDA.pdf"
      },
      "ip_address": "192.168.1.1"
    }
  ],
  "pagination": { "next_cursor": "..." }
}
```

## 6.3 Output Rules
* Responses MUST be sorted descending by `timestamp`.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Immutability:** Once an audit log is written to the database, it MUST NOT be modified. Updates are not allowed. Only insertions and time-based archival deletions are allowed.
* **Fail-Safe Fire & Forget:** Emitting an audit log from an upstream service (like the Document Viewer) must never crash the upstream service. It must be a non-blocking asynchronous publish to the message broker.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
N/A

## 7.4 Failure Rules
* If the database is down, the Audit Consumer must stop processing and leave the messages in the RabbitMQ/Kafka queue to prevent data loss.

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

N/A - This is a strict relational data logging service.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Event consumption is a continuous background loop.
* **Archival Cron Job:** A monthly cron job should move logs older than 12 months out of the hot PostgreSQL table and into cold storage (e.g., S3 Parquet files) to keep database queries fast.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `workspace_audit_logs` table.

## 13.5 Database Rules
* **Partitioning:** Because this table will grow at an extreme rate (every click is a log), it MUST be partitioned by date (e.g., by month) to prevent query degradation and allow easy dropping of old partitions.
* **Indexing:** Must be heavily indexed on `workspace_id`, `timestamp`, `user_id`, and `target_id`.

---

# 14. STORAGE REQUIREMENTS

## 14.1 Cold Storage
* Older audit logs must be exported to Parquet/CSV and stored in S3/Glacier for 7 years to meet standard legal compliance retention rules.

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `GET /api/v1/workspaces/{id}/audit-logs`
* `GET /api/v1/workspaces/{id}/audit-logs/export` (Returns a CSV file)

---

# 16. ERROR HANDLING

## Error Rules
* See 7.4. Never drop messages on database failure.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* Only users with the `ADMIN` role in the Workspace can query this endpoint. `MEMBER` and `VIEWER` roles must receive `HTTP 403 Forbidden`.

---

# 18. SOURCE & TRACEABILITY

N/A - This service *is* the traceability.

---

# 19. LEGAL SAFETY

## 19.1 Legal Disclaimers
* The system should inform users (e.g., in a Privacy Policy) that their actions within the Workspace are logged and visible to Workspace Administrators.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* The background consumer must be capable of inserting `> 1000 logs/second`. Batch inserts should be used to minimize database IOPS.

## 20.2 Large Input Handling
* When an Admin requests a CSV export of 100,000 logs, the API should return a `HTTP 202 Accepted` and generate the CSV asynchronously, emailing the Admin a download link to avoid HTTP timeouts.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| Consumer       | `backend/app/workers/audit_logger.py` | Event listener |
| API Logic      | `backend/app/api/routes/audit.py` | Admin queries and exports |

---

# 22. SERVICE CONNECTIONS

```text
[All Microservices] ──► [Message Broker (RabbitMQ)] 
                                  │
                                  └──► [Audit Logger Consumer] ──► [PostgreSQL (Partitioned)]
                                                                        │
[Workspace Admin] ◄──────────────(GET /audit-logs)──────────────────────┘
```

---

# 23. EVENTS

## 23.1 Emitted Events
N/A - This service is primarily a consumer, not a publisher.

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `INFO: Audit Consumer batch-inserted 500 records.`

---

# 25. OBSERVABILITY

## Metrics
* Track `audit_events_processed_per_minute`.
* Track `audit_queue_depth` (If depth is growing, the consumer is too slow and needs to scale up).

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test Permissions:** Authenticate as a `MEMBER`. Try to GET `/audit-logs`. Assert 403 Forbidden.
* **Test Immutability:** Attempt to run an `UPDATE` statement on the `workspace_audit_logs` table using the application's ORM. Assert the ORM or Database triggers an exception.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `System Actions` | Sometimes the system acts autonomously (e.g., an automated daily scan). The `user_id` should accept a special `SYSTEM_UUID` to denote actions not taken by a human. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `AUDIT_RETENTION_DAYS` | When to move logs to cold storage | Yes | `365` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Dedicated database connection pool for the Audit Consumer. Since it writes constantly, it should not starve read-connections for the rest of the application.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Asynchronously consumes events without blocking user actions.
* [ ] Database table enforces immutability and is partitioned by date.
* [ ] Admins can query and filter logs via the API.
* [ ] Only Admins can access the logs.
* [ ] Asynchronous CSV export works for large date ranges.

---

# 32. DEFINITION OF DONE

The Audit & Activity Logging service is **DONE** when a law firm can pass a SOC2 compliance audit by effortlessly exporting an unalterable CSV proving exactly who accessed a specific confidential contract on a specific day.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Only the Audit service writes to `workspace_audit_logs`).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the undeniable, tamper-proof historical record of every action taken in the platform.

## What the user sees
A clean, searchable table of activity ("Jane downloaded this file", "John invited Bob") available only to Workspace Administrators.

## What happens in the background
Every time a user clicks something important, the API fires a tiny JSON message into a queue. A background worker silently picks it up and writes it to a heavily optimized, date-partitioned database table that cannot be edited or deleted.

## What it receives
System events via a Message Broker.

## What it produces
A compliance-ready audit trail and CSV exports.

## Success means
The platform is trusted by enterprise IT and security teams because it provides total transparency and non-repudiation for all user actions.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
