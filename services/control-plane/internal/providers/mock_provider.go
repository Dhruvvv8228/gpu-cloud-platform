package providers

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type MockProvider struct {
	mu        sync.RWMutex
	instances map[string]*ProviderInstance
}

func NewMockProvider() *MockProvider {
	return &MockProvider{
		instances: make(map[string]*ProviderInstance),
	}
}

func (m *MockProvider) ProviderID() string {
	return "prv_mock"
}

func (m *MockProvider) ProviderName() string {
	return "NVIDIA Cloud Mock Provider"
}

func (m *MockProvider) ListGPUTypes(ctx context.Context) ([]GPUType, error) {
	return []GPUType{
		{ID: "gpu_l4", Code: "L4-24GB", Name: "NVIDIA L4", Architecture: "Ada Lovelace", VRAMGB: 24, FP32TFLOPS: 30.3, Interconnect: "PCIe Gen4"},
		{ID: "gpu_l40s", Code: "L40S-48GB", Name: "NVIDIA L40S", Architecture: "Ada Lovelace", VRAMGB: 48, FP32TFLOPS: 91.6, Interconnect: "PCIe Gen4"},
		{ID: "gpu_a100", Code: "A100-80GB", Name: "NVIDIA A100 80GB", Architecture: "Ampere", VRAMGB: 80, FP32TFLOPS: 19.5, Interconnect: "NVLink 600 GB/s"},
		{ID: "gpu_h100", Code: "H100-80GB", Name: "NVIDIA H100 80GB", Architecture: "Hopper", VRAMGB: 80, FP32TFLOPS: 67.0, Interconnect: "NVLink 900 GB/s"},
		{ID: "gpu_h200", Code: "H200-141GB", Name: "NVIDIA H200", Architecture: "Hopper", VRAMGB: 141, FP32TFLOPS: 67.0, Interconnect: "NVLink 900 GB/s"},
		{ID: "gpu_b200", Code: "B200-180GB", Name: "NVIDIA Blackwell B200", Architecture: "Blackwell", VRAMGB: 180, FP32TFLOPS: 90.0, Interconnect: "NVLink 1.8 TB/s"},
	}, nil
}

func (m *MockProvider) ListRegions(ctx context.Context) ([]Region, error) {
	return []Region{
		{ID: "reg_in_south", Code: "in-south-1", Name: "Asia Pacific (India - Mumbai)", Country: "India", Datacenter: "Yotta NM1", Status: "ONLINE"},
		{ID: "reg_us_east", Code: "us-east-1", Name: "US East (N. Virginia)", Country: "USA", Datacenter: "Equinix VA2", Status: "ONLINE"},
		{ID: "reg_eu_central", Code: "eu-central-1", Name: "Europe (Frankfurt)", Country: "Germany", Datacenter: "Interxion FRA1", Status: "ONLINE"},
	}, nil
}

func (m *MockProvider) GetAvailability(ctx context.Context, req AvailabilityRequest) (AvailabilityResponse, error) {
	return AvailabilityResponse{
		IsAvailable:       true,
		AvailableQuantity: 16,
		HourlyCostINR:     240.00,
	}, nil
}

func (m *MockProvider) CreateInstance(ctx context.Context, req CreateInstanceRequest) (ProviderInstance, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	providerID := fmt.Sprintf("vm-mock-%d", time.Now().UnixNano()%100000)
	ip := fmt.Sprintf("154.28.%d.%d", 10+(time.Now().Unix()%200), 100+(time.Now().Unix()%150))

	inst := ProviderInstance{
		ProviderInstanceID: providerID,
		Status:             "RUNNING",
		PublicIP:           ip,
		SSHPort:            22,
		SSHUser:            "root",
		RawMetadata: map[string]string{
			"platform_instance_id": req.PlatformInstanceID,
			"gpu_type_code":        req.GPUTypeCode,
			"region_code":           req.RegionCode,
		},
		CreatedAt: time.Now(),
	}

	m.instances[providerID] = &inst
	return inst, nil
}

func (m *MockProvider) GetInstance(ctx context.Context, providerInstanceID string) (ProviderInstance, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	inst, exists := m.instances[providerInstanceID]
	if !exists {
		return ProviderInstance{}, fmt.Errorf("instance %s not found", providerInstanceID)
	}
	return *inst, nil
}

func (m *MockProvider) StartInstance(ctx context.Context, providerInstanceID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	inst, exists := m.instances[providerInstanceID]
	if !exists {
		return fmt.Errorf("instance %s not found", providerInstanceID)
	}
	inst.Status = "RUNNING"
	return nil
}

func (m *MockProvider) StopInstance(ctx context.Context, providerInstanceID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	inst, exists := m.instances[providerInstanceID]
	if !exists {
		return fmt.Errorf("instance %s not found", providerInstanceID)
	}
	inst.Status = "STOPPED"
	return nil
}

func (m *MockProvider) RestartInstance(ctx context.Context, providerInstanceID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	inst, exists := m.instances[providerInstanceID]
	if !exists {
		return fmt.Errorf("instance %s not found", providerInstanceID)
	}
	inst.Status = "RUNNING"
	return nil
}

func (m *MockProvider) DeleteInstance(ctx context.Context, providerInstanceID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	inst, exists := m.instances[providerInstanceID]
	if !exists {
		return fmt.Errorf("instance %s not found", providerInstanceID)
	}
	inst.Status = "TERMINATED"
	delete(m.instances, providerInstanceID)
	return nil
}
