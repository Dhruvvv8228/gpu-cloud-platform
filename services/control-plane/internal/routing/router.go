package routing

import (
	"context"
	"fmt"

	"github.com/nvidia-gpu-cloud/control-plane/internal/providers"
)

type Router struct {
	providers map[string]providers.ComputeProvider
}

func NewRouter(provs ...providers.ComputeProvider) *Router {
	pMap := make(map[string]providers.ComputeProvider)
	for _, p := range provs {
		pMap[p.ProviderID()] = p
	}
	return &Router{providers: pMap}
}

func (r *Router) SelectProvider(ctx context.Context, gpuTypeCode, regionCode string) (providers.ComputeProvider, error) {
	// For MVP, route to MockProvider
	if p, exists := r.providers["prv_mock"]; exists {
		return p, nil
	}
	for _, p := range r.providers {
		return p, nil
	}
	return nil, fmt.Errorf("no active GPU compute provider found for %s in %s", gpuTypeCode, regionCode)
}
