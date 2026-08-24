# Infrastructure Provider Integration Abstraction

## 1. Concept & Architectural Goal

The platform acts as a unified cloud control plane that abstracts multiple underlying GPU capacity sources:
1. **MockProvider**: Simulation engine for local dev and automated end-to-end integration testing.
2. **External Capacity Partners**: Nebius, CoreWeave, GMI Cloud, Yotta, etc., via secured B2B channel APIs.
3. **Own Infrastructure**: Direct bare-metal/Kubernetes control plane running the NVIDIA GPU Operator.

Customer applications and API clients interact strictly with our platform abstractions (`Instance`, `GPUType`, `Region`). They are completely decoupled from external provider API details.

---

## 2. Go Provider Interface (`ComputeProvider`)

```go
package providers

import (
	"context"
	"time"
)

type GPUType struct {
	ID           string `json:"id"`
	Code         string `json:"code"`
	Name         string `json:"name"`
	VRAMGB       int    `json:"vram_gb"`
	FP32TFLOPS   float64 `json:"fp32_tflops"`
	Interconnect string `json:"interconnect"`
}

type Region struct {
	ID          string `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	CountryCode string `json:"country_code"`
}

type CreateInstanceRequest struct {
	PlatformInstanceID string            `json:"platform_instance_id"`
	GPUTypeCode        string            `json:"gpu_type_code"`
	RegionCode         string            `json:"region_code"`
	GPUCount           int               `json:"gpu_count"`
	Image              string            `json:"image"`
	SSHPublicKey       string            `json:"ssh_public_key"`
	Metadata           map[string]string `json:"metadata"`
}

type ProviderInstance struct {
	ProviderInstanceID string            `json:"provider_instance_id"`
	Status             string            `json:"status"`
	PublicIP           string            `json:"public_ip"`
	SSHPort            int               `json:"ssh_port"`
	SSHUser            string            `json:"ssh_user"`
	RawMetadata        map[string]string `json:"raw_metadata"`
	CreatedAt          time.Time         `json:"created_at"`
}

type AvailabilityRequest struct {
	GPUTypeCode string `json:"gpu_type_code"`
	RegionCode  string `json:"region_code"`
	GPUCount    int    `json:"gpu_count"`
}

type AvailabilityResponse struct {
	IsAvailable      bool    `json:"is_available"`
	AvailableQuantity int    `json:"available_quantity"`
	HourlyCostINR    float64 `json:"hourly_cost_inr"`
}

type ComputeProvider interface {
	ProviderID() string
	ListGPUTypes(ctx context.Context) ([]GPUType, error)
	ListRegions(ctx context.Context) ([]Region, error)
	GetAvailability(ctx context.Context, req AvailabilityRequest) (AvailabilityResponse, error)

	CreateInstance(ctx context.Context, req CreateInstanceRequest) (ProviderInstance, error)
	GetInstance(ctx context.Context, providerInstanceID string) (ProviderInstance, error)

	StartInstance(ctx context.Context, providerInstanceID string) error
	StopInstance(ctx context.Context, providerInstanceID string) error
	RestartInstance(ctx context.Context, providerInstanceID string) error
	DeleteInstance(ctx context.Context, providerInstanceID string) error
}
```

---

## 3. Provider Routing & Selection Engine

When a customer submits a deployment request, the Provider Router:
1. Evaluates registered active providers supporting the requested GPU type and region.
2. Checks capacity availability via `GetAvailability()`.
3. Selects the optimal provider based on cost, availability, latency, and platform margin targets.
4. Returns the selected provider handle to the Temporal `CreateInstanceWorkflow`.

---

## 4. Transition Strategy to Own GPU Infrastructure

```text
Phase 1 (MVP):
Control Plane --> Provider Router --> MockProvider

Phase 2 (Partner Integration):
Control Plane --> Provider Router --> Approved External APIs (Nebius, CoreWeave, etc.)

Phase 3 (Hybrid / Own Infrastructure):
Control Plane --> Provider Router --> [ External APIs  |  OwnInfrastructureProvider (K8s/NVIDIA GPU Operator) ]
```

When own GPU clusters are racked and configured, `OwnInfrastructureProvider` is registered as a new provider adapter implementation. The frontend and customer-facing APIs require zero code modifications.
