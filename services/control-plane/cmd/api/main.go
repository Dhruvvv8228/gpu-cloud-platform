package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/nvidia-gpu-cloud/control-plane/internal/providers"
	"github.com/nvidia-gpu-cloud/control-plane/internal/routing"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-API-Key"},
		AllowCredentials: true,
	}))

	mockProv := providers.NewMockProvider()
	routerEngine := routing.NewRouter(mockProv)

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/gpus", func(w http.ResponseWriter, r *http.Request) {
			gpus, err := mockProv.ListGPUTypes(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{"data": gpus})
		})

		r.Get("/regions", func(w http.ResponseWriter, r *http.Request) {
			regs, err := mockProv.ListRegions(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{"data": regs})
		})

		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"status": "UP", "provider_engine": routerEngine.SelectProvider != nil})
		})
	})

	log.Printf("Starting NVIDIA GPU Cloud Control Plane Go API on :%s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
