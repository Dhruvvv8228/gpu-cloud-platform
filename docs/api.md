# Developer API & REST Specification

## 1. Overview & Authentication

Base URL: `/api/v1`

Authentication Method:
* Web Client: Session Cookie / JWT Bearer Token in `Authorization: Bearer <token>` header
* Developer API Key: `X-API-Key: sk_live_...` or `Authorization: Bearer sk_live_...`

---

## 2. Endpoint Specification

### GPU Catalog & Pricing
* `GET /api/v1/gpus`: List all NVIDIA GPU compute offerings (L4, L40S, A100, H100, H200, B200) with specifications.
* `GET /api/v1/gpus/{id}`: Detailed specifications and available regions for a specific GPU model.
* `GET /api/v1/regions`: List supported regions (e.g. `in-south-1` Mumbai, `us-east-1` N. Virginia, `eu-central-1` Frankfurt).
* `GET /api/v1/pricing`: List customer hourly prices, availability, and specs by GPU & region.

### Compute Instances
* `POST /api/v1/instances`: Launch a new GPU compute instance.
  ```json
  {
    "gpu_code": "H100-80GB",
    "region_code": "in-south-1",
    "gpu_count": 1,
    "image": "ubuntu-22.04-cuda-12.2",
    "ssh_key": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...",
    "name": "my-llm-fine-tune"
  }
  ```
* `GET /api/v1/instances`: List organization's instances.
* `GET /api/v1/instances/{id}`: Get instance details, status, IP, SSH credentials, and real-time runtime spend.
* `POST /api/v1/instances/{id}/start`: Start a stopped instance.
* `POST /api/v1/instances/{id}/stop`: Gracefully stop a running instance.
* `POST /api/v1/instances/{id}/restart`: Reboot instance.
* `DELETE /api/v1/instances/{id}`: Terminate instance and release reserved GPU resources.

### Wallet & Billing
* `GET /api/v1/wallet`: Get current wallet balance, recent transactions, and spend rate.
* `POST /api/v1/wallet/topup`: Add demo credits or initiate Razorpay payment order.
* `GET /api/v1/billing`: Get detailed billing summary, usage invoices, and breakdown by GPU instance.
* `GET /api/v1/usage`: Get hourly usage records and spend time-series graphs.

### Developer API Keys
* `GET /api/v1/api-keys`: List active API keys.
* `POST /api/v1/api-keys`: Generate a new API key (secret shown only once).
* `DELETE /api/v1/api-keys/{id}`: Revoke an API key immediately.

### Admin & Market Intelligence (Admin Only)
* `GET /api/v1/admin/overview`: Platform-wide stats (total users, active instances, GPU-hours, gross margin).
* `GET /api/v1/admin/demand`: Market demand analytics (most viewed/configured/deployed GPUs, regional demand).
* `POST /api/v1/admin/pricing`: Update GPU hourly provider cost, customer price, and availability.
* `GET /api/v1/admin/audit-logs`: Audit trail of all configuration and admin state changes.
