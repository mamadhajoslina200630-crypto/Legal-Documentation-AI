# Legal AI Platform (Collaboration)

> **Purpose:** Complete implementation blueprint for `Collaboration`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Collaboration`

## 1.2 Service ID

`sys-common-collaboration`

## 1.3 Service Category

`Common Infrastructure / Real-Time`

## 1.4 Service Type

`WebSocket / Real-Time Service`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Collaboration service must:

* Provide a real-time messaging layer (via WebSockets or Server-Sent Events) to allow multiple users in the same Workspace to interact simultaneously.
* Manage "Presence" (knowing which users are currently viewing a document or chat session).
* Handle real-time notifications (e.g., when User A `@tags` User B in a comment on a contract).
* Synchronize shared state across clients (e.g., if User A shares an AI chat session with User B, both users see the AI's streaming response at the same time).

The service must **not** handle the actual AI generation or the underlying document storage. It is strictly the real-time multiplayer networking layer.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
Legal work is highly collaborative. A senior partner and a junior associate often need to review the same contract simultaneously. If the platform only operates via static HTTP requests, users will constantly overwrite each other's work or have to refresh the page to see updates. This service turns the AI platform into a multiplayer experience, similar to Google Docs or Figma, preventing siloed workflows.

## 1.7 User Value

Explain what the user gains from this service.
Visibility and teamwork. The user can see "Jane Doe is currently viewing this document" and can instantly share a fascinating AI analysis with their team, who can watch the AI finish typing its response live.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A scalable WebSocket server (often backed by Redis Pub/Sub) that broadcasts presence events, chat updates, and notifications to connected frontend clients in real-time.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* WebSocket connection management (Authentication, Heartbeats/Ping-Pong).
* Redis Pub/Sub orchestration for multi-instance scaling.
* Presence tracking (Who is online, who is typing).
* In-app notification delivery (e.g., "@mentions", "Job Completed").
* Shared Chat Session broadcasting.

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Email notifications (Handled by a separate Notification/Mailer service).
* Full CRDT/Operational Transformation for collaborative typing (If the platform requires deep Google-Docs style simultaneous typing, that requires a dedicated CRDT engine like Yjs, which is beyond this basic presence/notification scope).

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Workspace Service` | To authorize connections | User Roles/Access |
| `Redis` | For Pub/Sub broadcasting | Event Streams |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Frontend UI** (relies entirely on this for live updates).

---

# 3. USER EXPERIENCE

## 3.1 User Entry Point
The user opens a document or a shared chat session in their browser.

## 3.2 User Input
Typing a comment, clicking "Share", or just leaving the browser tab open.

## 3.3 User Flow

```text
User A opens "MSA_v2.pdf".
  ↓
Browser opens WebSocket to `wss://api.legalai.com/ws/workspace_123`.
  ↓
Service broadcasts `PresenceUpdate: { user: "User A", doc: "MSA_v2", state: "viewing" }`.
  ↓
User B opens the same document.
  ↓
User B's UI instantly shows a small avatar of User A in the top right corner.
  ↓
User B highlights a clause and types a comment: "@UserA what do you think?"
  ↓
Service broadcasts `Notification` to User A.
  ↓
User A's UI shows a real-time toast pop-up.
```

## 3.4 User States
* `Online`
* `Idle`
* `Typing`

## 3.5 User-Visible Result
A lively, responsive interface where avatars pop in and out, chat messages appear instantly, and the platform feels "alive."

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

### WebSocket Pub/Sub Workflow

```text
CLIENT connects to `wss://api/ws/workspace/{id}`
  ↓
Authenticate JWT token. Verify `workspace_id` access.
  ↓
Subscribe the WebSocket connection to the Redis Channel: `channel:workspace_{id}`
  ↓
On Client Disconnect:
  Publish `UserOfflineEvent` to Redis Channel.
  ↓
On Internal Service Event (e.g., AI Chat finishes generating a token):
  Chat Service publishes `ChatTokenEvent` to Redis Channel `channel:chat_session_{id}`
  ↓
Collaboration Service consumes the Redis Event.
Broadcasts the token over the WebSocket to all clients subscribed to that chat session.
```

---

# 5. INPUT CONTRACT

Define exactly what the service accepts.

## 5.1 Required Inputs

| Input     | Type     | Required | Rules     |
| --------- | -------- | -------- | --------- |
| `token`   | `String` | Yes | JWT passed in headers or query string for WebSocket init |
| `workspace_id`| `UUID` | Yes | Must match the JWT's authorized workspaces |

## 5.2 Optional Inputs
N/A

## 5.3 Input Validation Rules
* WebSockets are vulnerable to connection exhaustion (DDoS). The service must limit the number of concurrent connections per `user_id`.

---

# 6. OUTPUT CONTRACT

Define exactly what this service returns.

## 6.1 Primary Output
Real-time JSON frames sent over the WebSocket connection.

## 6.2 Output Structure
```json
// Example of a Presence Frame
{
  "type": "PRESENCE_UPDATE",
  "payload": {
    "user_id": "uuid",
    "name": "Jane Smith",
    "avatar_url": "https://...",
    "action": "joined_document",
    "document_id": "uuid"
  }
}
```

## 6.3 Output Rules
* All outgoing frames must be strictly typed so the Frontend React/Vue state managers can route them to the correct reducers.

---

# 7. BUSINESS RULES

This section contains the **non-negotiable rules** of the service.

## 7.1 Core Rules

* **Strict Topic Isolation:** A user authenticated in `Workspace_A` MUST NEVER be able to subscribe to a Redis channel or WebSocket topic belonging to `Workspace_B`. The backend server must enforce subscriptions; the client cannot arbitrarily say "Subscribe me to Workspace B".
* **Ephemeral State:** Presence data (who is online) is highly ephemeral. It must not be stored permanently in PostgreSQL. It lives exclusively in Redis with a short TTL, updated via WebSocket heartbeats.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules
* If a user loses connection (e.g., driving through a tunnel), their presence state should transition to `Idle/Offline` after 30 seconds of missed heartbeats.

## 7.4 Failure Rules
* If the WebSocket server crashes, the clients must automatically attempt to reconnect with exponential backoff (handled by the frontend, but the backend must be prepared for connection spikes).

## 7.5 Boundary Rules
N/A

---

# 8. DOCUMENT CONTEXT

N/A

---

# 9. AI RESPONSIBILITY

N/A - This is purely networking infrastructure.

---

# 10. AI PROMPT RESPONSIBILITY

N/A

---

# 11. RAG / KNOWLEDGE REQUIREMENTS

N/A

---

# 12. BACKGROUND PROCESSING

## 12.1 Background Tasks
* Redis Pub/Sub listener loops running asynchronously to instantly catch and broadcast events.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
* `notifications` table (To persist `@mentions` so they aren't lost if the user is offline).

## 13.5 Database Rules
* The `notifications` table must be partitioned or aggressively pruned (e.g., delete notifications older than 90 days) to prevent massive database bloat.

---

# 14. STORAGE REQUIREMENTS

N/A

---

# 15. API CONTRACT

## 15.1 Endpoints Exposed
* `WS /api/v1/ws/workspace/{id}` (Main multiplexed connection)
* `GET /api/v1/notifications` (Fetch missed notifications on login)
* `POST /api/v1/notifications/{id}/read` (Mark as read)

---

# 16. ERROR HANDLING

## Error Rules
* Do not leak stack traces over WebSockets. Send a standardized JSON error frame: `{"type": "ERROR", "code": 4001, "message": "Connection closed due to timeout."}`.

---

# 17. AUTHORIZATION & SECURITY

## 17.1 Access Rules
* See 7.1. Workspace isolation is critical.

## 17.4 Security Rules
* Implement strict `Origin` header checking during the WebSocket handshake to prevent Cross-Site WebSocket Hijacking (CSWSH) attacks.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

N/A

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements
* Broadcast latency (from one user's action to another user's screen) must be `< 100ms` for it to feel like real-time collaboration.

## 20.2 Large Input Handling
* **Connection Scaling:** If the platform scales to thousands of concurrent users, a single Node/Python server cannot hold all WebSocket connections. The architecture MUST use Redis Pub/Sub (or an equivalent message broker) so that Server A can broadcast an event to a user connected to Server B.

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| WS Server      | `backend/app/api/websockets.py` | Connection handling |
| Event Broker   | `backend/app/core/pubsub.py` | Redis orchestration |

---

# 22. SERVICE CONNECTIONS

```text
[User A Browser] ◄──(WS)──► [Node 1] ◄────┐
                                          │
                                       [Redis] (Pub/Sub Channel: workspace_123)
                                          │
[User B Browser] ◄──(WS)──► [Node 2] ◄────┘
```

---

# 23. EVENTS

## 23.1 Emitted Events
* `UserPresenceChanged`
* `NewNotification`
* `ChatStreamChunk`

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging
* `DEBUG: Client connection established for user 123 in Workspace 456.`
* `DEBUG: Broadcasted Notification to 4 active clients.`

---

# 25. OBSERVABILITY

## Metrics
* Track `active_websocket_connections`.
* Track `redis_pubsub_latency`.

---

# 26. TESTING REQUIREMENTS

## 26.1 Unit Testing
* **Test PubSub Routing:** Mock two WebSocket connections connected to different mocked workspaces. Publish an event to Workspace A's Redis channel. Assert only Client A receives the frame, and Client B receives nothing.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Stale State` | User closes their laptop without cleanly closing the browser tab. The server stops receiving Ping heartbeats. After 30 seconds, the server MUST forcefully kill the socket and broadcast an `Offline` event to prevent "ghost" avatars from lingering in the UI indefinitely. |

---

# 28. VERSIONING

N/A

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `WS_PING_INTERVAL_SEC` | How often to check connection | Yes | `15` |
| `REDIS_URL` | Pub/Sub backend | Yes | `redis://localhost:6379` |

---

# 30. DEPLOYMENT REQUIREMENTS

## Runtime Requirements
* Load balancers (e.g., AWS ALB, Nginx) must be explicitly configured to support WebSocket upgrades (`Upgrade: websocket`, `Connection: Upgrade`) and must have extended idle timeouts to prevent dropping active connections.

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Maintains stable WebSocket connections with Ping/Pong heartbeats.
* [ ] Synchronizes presence (avatars) across multiple clients in real-time.
* [ ] Scales horizontally using Redis Pub/Sub.
* [ ] Prevents Cross-Site WebSocket Hijacking via Origin checks.

---

# 32. DEFINITION OF DONE

The Collaboration service is **DONE** when a senior partner in London and an associate in New York can open the same contract, see each other's mouse cursors/avatars, and have a live chat about the AI's risk analysis without ever hitting the "Refresh" button.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.** (No AI logic here).
2. **Unsupported input must fail safely.**
3. **Database ownership must be explicit.** (Notifications table).

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the real-time networking engine that turns a static AI tool into a live, multiplayer workspace.

## What the user sees
Avatars popping up when colleagues view the same document, instant chat message delivery, and real-time streaming of AI responses across shared sessions.

## What happens in the background
A fleet of API servers maintains persistent WebSocket connections with user browsers. When any event happens (a user clicks a document, the AI generates a sentence, a comment is typed), the servers use Redis Pub/Sub to instantly broadcast that event to every other interested and authorized browser in milliseconds.

## What it receives
WebSocket connections and PubSub internal events.

## What it produces
Real-time JSON frames broadcasted to frontend state managers.

## Success means
The platform feels instantly responsive, highly collaborative, and modern, preventing the frustration of overwriting work or missing critical updates.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
