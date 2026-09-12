# Legal AI Platform (Deployment Architecture)

> **Purpose:** Complete implementation blueprint for `Deployment Architecture`.
>
> This document is the authoritative specification for building this service. Developers must be able to understand **what the service does, what it owns, what it receives, what it produces, how it connects to the rest of the platform, and what rules it must follow** without requiring additional architectural decisions.

---

# 1. SERVICE IDENTITY

## 1.1 Service Name

`Legal AI Platform - Deployment Architecture`

## 1.2 Service ID

`sys-deployment-core-platform`

## 1.3 Service Category

`Platform Engineering & Infrastructure`

## 1.4 Service Type

`Infrastructure Specification`

## 1.5 Primary Responsibility

Clearly define the **single primary responsibility** of this service.

The Deployment Architecture must:

* Define the exact physical and virtual infrastructure required to run the Legal AI Platform in production.
* Dictate how Docker containers are built, orchestrated, and scaled (e.g., using Kubernetes or AWS ECS).
* Specify how network traffic flows from the public internet into the private application VPC securely.
* Ensure the system is highly available (Multi-AZ) and can recover from hardware failures.

The service must **not** contain business code; it only dictates where that code runs.

## 1.6 Business Purpose

Explain why this service exists and what problem it solves.
A brilliant AI backend is useless if it goes offline when 100 lawyers upload documents simultaneously. This architecture ensures the platform is elastic (scales up when busy, scales down to save money when idle) and secure from internet threats like DDoS attacks.

## 1.7 User Value

Explain what the user gains from this service.
Uptime and speed. Users experience a snappy, reliable application that never goes down for maintenance.

## 1.8 Final Outcome

Define exactly what successful completion of this service produces.
A set of Infrastructure-as-Code (IaC) files (e.g., Terraform or AWS CDK) that can provision the entire production environment with a single command, alongside a defined CI/CD deployment pipeline.

---

# 2. SCOPE

## 2.1 In Scope

List everything this service is responsible for.

* Container orchestration (AWS ECS Fargate or EKS).
* Managed Databases (AWS RDS PostgreSQL, ElastiCache Redis).
* Vector Database hosting (Qdrant Cloud or Self-hosted EC2).
* Networking (VPC, Subnets, NAT Gateways, Application Load Balancers).
* DNS and SSL Termination (Route53, ACM).
* CI/CD Pipelines (GitHub Actions).

## 2.2 Out of Scope

Explicitly list what this service must NOT implement.

* Application-level logging (Handled by Logging & Monitoring).
* Application business logic.

## 2.3 Dependencies on Other Services

List services/capabilities this service requires.

| Dependency  | Why Required | Required Data |
| ----------- | ------------ | ------------- |
| `Cloud Provider` | AWS, GCP, or Azure | Compute and Storage APIs |

## 2.4 Services Depending on This Service

List services that may consume this service's output.
**Every service** depends on this architecture to exist on the internet.

---

# 3. USER EXPERIENCE

N/A - This is a DevOps / Infrastructure concern.

---

# 4. SERVICE WORKFLOW

Define the complete internal workflow.

```text
DEVELOPER PUSHES CODE TO `main`
  ↓
GITHUB ACTIONS: Runs tests & builds Docker Image
  ↓
GITHUB ACTIONS: Pushes Image to AWS ECR (Container Registry)
  ↓
TERRAFORM / CI: Updates ECS Task Definition with new Image URI
  ↓
AWS ECS: Performs Rolling Update
  ↓ (Starts new containers, routes traffic, drains old containers)
DEPLOYMENT COMPLETE
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

* **Infrastructure as Code (IaC):** No human is allowed to log into the AWS Console and click buttons to create servers. Everything MUST be defined in Terraform.
* **Stateless Containers:** Docker containers must not store data on their local file system. If a container dies, it should be instantly replaceable without data loss.
* **Zero Downtime Deployments:** Updates must use rolling deployments. The Load Balancer must not route traffic to a new container until it passes its Health Check.

## 7.2 Validation Rules
N/A

## 7.3 Decision Rules

* **Separation of Compute:** The FastAPI web server and the Celery background workers MUST run in separate Docker containers, scaled independently.

## 7.4 Failure Rules

* Multi-AZ deployment is mandatory for databases (RDS) to survive a datacenter failure.

## 7.5 Boundary Rules

* **Private VPC:** The PostgreSQL database, Redis broker, and Qdrant database MUST NOT have public IP addresses. They can only be accessed by the backend containers within the private subnet.

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

## 12.1 Background Tasks

* Celery workers require significantly more RAM (for OCR and embeddings) than standard web servers. The deployment architecture must allow provisioning specific resource limits for these containers.

---

# 13. DATABASE RESPONSIBILITY

## 13.1 Owned Data
N/A

## 13.5 Database Rules

* Use AWS RDS for PostgreSQL to handle automated backups, patch management, and Multi-AZ failover. Do not run Postgres manually inside a raw EC2 Docker container.

---

# 14. STORAGE REQUIREMENTS

*(See Storage Architecture)*

---

# 15. API CONTRACT

N/A

---

# 16. ERROR HANDLING

## Error Rules

* The Application Load Balancer (ALB) must return standard 502/503 HTML pages if the entire backend cluster crashes.

---

# 17. AUTHORIZATION & SECURITY

## 17.4 Security Rules

* Implement AWS WAF (Web Application Firewall) on the Load Balancer to block SQL injection and common DDoS attacks.
* Enforce HTTPS/SSL strictly at the Load Balancer layer. Backend containers communicate via HTTP internally over the VPC.

---

# 18. SOURCE & TRACEABILITY

N/A

---

# 19. LEGAL SAFETY

## 19.1 Accuracy

* Data residency is critical for legal platforms. The infrastructure MUST be deployed in a specific, approved region (e.g., `ap-south-1` for India) to comply with national data sovereignty laws.

---

# 20. PERFORMANCE REQUIREMENTS

## 20.1 Response Requirements

* Load Balancers must route traffic in < 5ms.

## 20.3 Concurrent Usage

* Configure Auto-Scaling Groups (ASG) based on CPU utilization (e.g., add more FastAPI containers if average CPU > 70%).

---

# 21. FOLDER STRUCTURE

## 21.1 Service Files

| Area           | Location | Responsibility |
| -------------- | -------- | -------------- |
| IaC            | `infrastructure/terraform/` | AWS Resource Definitions |
| CI/CD          | `.github/workflows/` | Deployment pipelines |
| Container Config| `backend/Dockerfile` | Python build instructions |
| Compose        | `docker-compose.yml` | Local developer environment |

---

# 22. SERVICE CONNECTIONS

```text
[Public Internet]
       │
[AWS WAF & CloudFront]
       │
[AWS Application Load Balancer] (Public Subnet)
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[FastAPI Container] (Private Subnet)  [Celery Worker] (Private Subnet)
       │                                 │
       ├───────────────┐                 │
       ▼               ▼                 ▼
[RDS PostgreSQL]   [ElastiCache]     [Qdrant]
(Private Subnet)   (Private Subnet)  (Private Subnet)
```

---

# 23. EVENTS

N/A

---

# 24. LOGGING & AUDIT

## 24.1 Application Logging

* Configure AWS FireLens or fluent-bit sidecars to ship container stdout logs directly to CloudWatch or Datadog without blocking the container's main thread.

---

# 25. OBSERVABILITY

## Metrics

* Track CPU and Memory utilization per container to fine-tune cost vs. performance.

---

# 26. TESTING REQUIREMENTS

## 26.5 Security Testing

* Run `tfsec` or `checkov` against the Terraform code in the CI pipeline to ensure no S3 buckets are accidentally made public before deployment.

---

# 27. EDGE CASES

| Case     | Expected Behavior |
| -------- | ----------------- |
| `Traffic Spike` | Auto-scaling rules trigger, provisioning new containers within 2 minutes. |
| `Container Crash` | ECS detects failure via health check and automatically spins up a replacement container. |

---

# 28. VERSIONING

## Compatibility Rules

* Infrastructure changes (e.g., renaming a database) must be carefully sequenced to avoid breaking the currently running version of the application.

---

# 29. CONFIGURATION

| Configuration | Purpose | Required | Default |
| --- | --- | --- | --- |
| `ENVIRONMENT` | Target (dev, staging, prod) | Yes | `dev` |
| `AWS_REGION` | Deployment zone | Yes | `ap-south-1` |

---

# 30. DEPLOYMENT REQUIREMENTS

*(This entire document defines this section)*

---

# 31. ACCEPTANCE CRITERIA

### Functional
* [ ] Code pushed to `main` automatically deploys to production.
* [ ] Deployments occur with zero downtime.
* [ ] Databases are inaccessible from the public internet.
* [ ] Containers scale automatically based on load.

---

# 32. DEFINITION OF DONE

The Deployment Architecture is **DONE** when the entire production environment can be destroyed and perfectly recreated in under 30 minutes simply by running `terraform apply`.

---

# 33. IMPLEMENTATION RULES

1. **Keep business logic inside the service responsible for it.**
2. **Database ownership must be explicit (Use managed services).**
3. **Documents must remain associated with the correct workspace and permissions (Isolate the network).**
4. **Secrets must never be committed to source control (Use AWS Secrets Manager).**

---

# 34. SERVICE DEPENDENCY MAP

N/A

---

# 35. FINAL SERVICE SUMMARY

## What it does
Provides the physical and virtual environment where the code actually runs.

## What the user sees
Nothing, except the URLs they type into their browser.

## What happens in the background
Load balancers route traffic securely into a private network where auto-scaling Docker containers execute code against managed databases, all deployed automatically via GitHub Actions and Terraform.

## What it receives
Docker Images.

## What it produces
Running Servers.

## Success means
Maximum uptime, tight security, and effortless deployment for the engineering team.

---

# 36. CHANGE HISTORY

| Version | Date       | Change                | Author       |
| ------- | ---------- | --------------------- | ------------ |
| `1.0`   | `2026-09-05` | Initial specification | `Antigravity` |
