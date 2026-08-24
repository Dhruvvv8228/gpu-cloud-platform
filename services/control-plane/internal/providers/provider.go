package providers

import (
	"context"
	"time"
)

type GPUType struct {
	ID           string  `json:"id"`
	Code         string  `json:"code"`
	Name         string  `json:"name"`
	Architecture string  `json:"architecture"`
	VRAMGB       int     `json:"vram_gb"`
	CUDACores    int     `json:"cuda_cores"`
	TensorCores  int     `json:"tensor_cores"`
	FP32TFLOPS   float64 `json:"fp32_tflops"`
	Interconnect string  `json:"interconnect"`
	Description  string  `json:"description"`
}

type Region struct {
	ID          string `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	Country     string `json:"country"`
	Datacenter  string `json:"datacenter"`
	Status      string `json:"status"`
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
	Status             string            `json:"status"` // PENDING, PROVISIONING, RUNNING, STOPPING, STOPPED, RESTARTING, TERMINATING, TERMINATED, FAILED
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
	IsAvailable       bool    `json:"is_available"`
	AvailableQuantity int     `json:"available_quantity"`
	HourlyCostINR     float64 `json:"hourly_cost_inr"`
}

type ComputeProvider interface {
	ProviderID() string
	ProviderName() string
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
