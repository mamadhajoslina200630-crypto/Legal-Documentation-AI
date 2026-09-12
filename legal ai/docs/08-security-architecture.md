# Security Architecture

This document defines the security principles, architecture, and enforcement mechanisms for the Legal AI Platform. Given the highly sensitive nature of legal documents, security is the absolute highest priority of the system.

## 1. Multi-Tenant Data Isolation

The foundational rule of the platform is strict multi-tenancy. A single platform deployment hosts multiple law firms (Workspaces).

*   **Database Isolation:** Row-Level Security (RLS) is heavily recommended in PostgreSQL. At the application layer, the `Workspace Service` acts as an interception middleware that injects the `workspace_id` into the routing context. EVERY database query MUST include `WHERE workspace_id = ?`.
*   **Vector Database Isolation:** Qdrant collections must be partitioned or strictly filtered by `workspace_id`. A search query from Workspace A must never be able to retrieve vector chunks from Workspace B.
*   **Storage Isolation:** Amazon S3 (or equivalent) bucket paths must be partitioned by workspace: `s3://legal-ai-bucket/workspaces/{workspace_id}/...`. IAM policies should enforce that the application only accesses objects within the authorized path for the current request.

## 2. Authentication & Authorization

*   **Identity Provider (IdP):** The platform outsources authentication (passwords, MFA, social login) to an enterprise Identity Provider (e.g., Auth0, AWS Cognito). The platform never stores passwords.
*   **Token Verification:** The backend verifies JWT (JSON Web Tokens) on every request using the IdP's public JWKS keys.
*   **Role-Based Access Control (RBAC):** Within a Workspace, users have specific roles:
    *   `ADMIN`: Can invite users, configure settings, delete workspace data.
    *   `MEMBER`: Can upload documents, run AI analysis, edit text.
    *   `VIEWER`: Can only read documents and chat with the AI. Cannot upload or delete.

## 3. Data Protection (In Transit and At Rest)

*   **In Transit:** All traffic (HTTP and WebSockets) must be encrypted using TLS 1.3. No unencrypted `http://` endpoints are permitted in production.
*   **At Rest (Database & Storage):** PostgreSQL instances must use encrypted storage volumes (e.g., AWS EBS Encryption). Amazon S3 buckets must enforce Server-Side Encryption (SSE-KMS) using AES-256.
*   **At Rest (Vector Database):** The Qdrant instance must also reside on encrypted volumes.

## 4. AI & Data Privacy

*   **Zero Retention Policies:** When utilizing external LLM providers (e.g., OpenAI API, Anthropic API), the platform MUST use Enterprise API tiers that legally guarantee zero data retention and zero model training on user data.
*   **PII/PHI Redaction:** The `Legal Safety` middleware provides an option to detect and redact sensitive information (Social Security Numbers, Bank Accounts) *before* the prompt leaves the system boundary.
*   **Local Models (Air-Gapped Option):** For highly sensitive clients (e.g., defense contractors), the `AI Gateway` is designed to route requests to locally hosted, open-weight models (e.g., Llama 3) running on private infrastructure, entirely bypassing public cloud LLMs.

## 5. File Upload Security

*   **Direct-to-Cloud Uploads:** The application servers do not buffer binary file uploads. The backend issues short-lived (5-minute) Pre-Signed S3 URLs, and the client uploads directly to the cloud.
*   **Anti-Virus Scanning:** Every uploaded file triggers an asynchronous virus scan via an S3 Webhook (e.g., ClamAV). Infected files are immediately quarantined and deleted.
*   **MIME/Magic Byte Validation:** The backend does not trust the file extension provided by the user. It inspects the "magic bytes" of the file to verify its true format, preventing executable code (`.exe`, `.sh`) from being disguised as a `.pdf`.

## 6. Audit & Non-Repudiation

*   **Immutable Audit Logs:** The `Audit & Activity Logging` service maintains an append-only, tamper-proof record of every critical action (upload, view, chat, delete) performed in a workspace.
*   **Retention:** Logs are kept for a minimum of 7 years to comply with standard legal data retention policies, with older logs archived to cold storage (S3 Glacier).

## 7. Infrastructure Security

*   **Private Networking:** The PostgreSQL database, Qdrant cluster, and Redis cache MUST NOT have public IP addresses. They are only accessible from within the private VPC of the application servers.
*   **Secret Management:** API keys (like the OpenAI API key) and Database credentials must be injected at runtime via a secure secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault). They must never be hardcoded in the repository or stored in plaintext environment variables.
*   **Rate Limiting:** The `AI Gateway` and API routers enforce strict rate limiting (backed by Redis) to prevent DDoS attacks and API quota exhaustion.
