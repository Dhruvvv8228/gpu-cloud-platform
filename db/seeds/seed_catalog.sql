-- Seed GPU Catalog, Regions, Providers, Products, and Demo Pricing

-- Providers
INSERT INTO providers (id, code, name, is_active) VALUES
('prv_mock', 'mock-provider', 'NVIDIA Cloud Mock Provider', true),
('prv_nebius', 'nebius', 'Nebius Infrastructure Partner', true),
('prv_coreweave', 'coreweave', 'CoreWeave Partner', true)
ON CONFLICT (code) DO NOTHING;

-- Regions
INSERT INTO regions (id, code, name, country, datacenter, status) VALUES
('reg_in_south', 'in-south-1', 'Asia Pacific (India - Mumbai)', 'India', 'Yotta NM1 Datacenter', 'ONLINE'),
('reg_us_east', 'us-east-1', 'US East (N. Virginia)', 'USA', 'Equinix VA2 Datacenter', 'ONLINE'),
('reg_eu_central', 'eu-central-1', 'Europe (Frankfurt)', 'Germany', 'Interxion FRA1 Datacenter', 'ONLINE')
ON CONFLICT (code) DO NOTHING;

-- Provider Regions
INSERT INTO provider_regions (id, provider_id, region_id, provider_region_code, status) VALUES
('prg_mock_in', 'prv_mock', 'reg_in_south', 'mock-in-south-1', 'AVAILABLE'),
('prg_mock_us', 'prv_mock', 'reg_us_east', 'mock-us-east-1', 'AVAILABLE'),
('prg_mock_eu', 'prv_mock', 'reg_eu_central', 'mock-eu-central-1', 'AVAILABLE')
ON CONFLICT (provider_id, region_id) DO NOTHING;

-- GPU Types Catalog
INSERT INTO gpu_types (id, name, code, architecture, vram_gb, cuda_cores, tensor_cores, fp64_tflops, fp32_tflops, fp16_tflops, interconnect, description) VALUES
('gpu_l4', 'NVIDIA L4', 'L4-24GB', 'Ada Lovelace', 24, 7424, 232, 0.47, 30.30, 242.00, 'PCIe Gen4', 'Optimal low-latency GPU for AI inference, video processing, and light graphics workloads.'),
('gpu_l40s', 'NVIDIA L40S', 'L40S-48GB', 'Ada Lovelace', 48, 18176, 568, 1.43, 91.60, 366.00, 'PCIe Gen4', 'Universal data center GPU built for generative AI inference, fine-tuning, and 3D graphics.'),
('gpu_a100', 'NVIDIA A100 80GB', 'A100-80GB', 'Ampere', 80, 6912, 432, 9.70, 19.50, 312.00, 'NVLink 600 GB/s', 'Workhorse tensor core GPU for deep learning training, high-performance computing, and massive data analytics.'),
('gpu_h100', 'NVIDIA H100 80GB', 'H100-80GB', 'Hopper', 80, 14592, 456, 34.00, 67.00, 989.00, 'NVLink 900 GB/s', 'Industry standard flagship GPU powering large language model (LLM) training and high-throughput inference.'),
('gpu_h200', 'NVIDIA H200', 'H200-141GB', 'Hopper', 141, 14592, 456, 34.00, 67.00, 989.00, 'NVLink 900 GB/s', 'Next-gen Hopper architecture equipped with 141GB HBM3e memory for ultra-large AI model inference.'),
('gpu_b200', 'NVIDIA Blackwell B200', 'B200-180GB', 'Blackwell', 180, 20480, 640, 45.00, 90.00, 2250.00, 'NVLink 1.8 TB/s', 'State-of-the-art Blackwell architecture delivering up to 30x performance acceleration for trillion-parameter LLMs.')
ON CONFLICT (code) DO NOTHING;

-- Products (Offering Configurations)
INSERT INTO products (id, gpu_type_id, provider_region_id, gpu_count, vcpu_count, ram_gb, storage_gb, is_available) VALUES
('prd_l4_in', 'gpu_l4', 'prg_mock_in', 1, 8, 32, 200, true),
('prd_l40s_in', 'gpu_l40s', 'prg_mock_in', 1, 16, 64, 500, true),
('prd_a100_in', 'gpu_a100', 'prg_mock_in', 1, 30, 120, 1000, true),
('prd_h100_in', 'gpu_h100', 'prg_mock_in', 1, 52, 240, 2000, true),
('prd_h200_in', 'gpu_h200', 'prg_mock_in', 1, 64, 320, 2000, true),
('prd_b200_in', 'gpu_b200', 'prg_mock_in', 1, 96, 512, 4000, true),

('prd_h100_us', 'gpu_h100', 'prg_mock_us', 1, 52, 240, 2000, true),
('prd_h100_eu', 'gpu_h100', 'prg_mock_eu', 1, 52, 240, 2000, true)
ON CONFLICT (id) DO NOTHING;

-- Pricing (Demo Internal Pricing)
INSERT INTO pricing (id, product_id, provider_hourly_cost_inr, customer_hourly_price_inr, platform_margin_inr, is_active) VALUES
('prc_l4_in', 'prd_l4_in', 35.00, 45.00, 10.00, true),
('prc_l40s_in', 'prd_l40s_in', 90.00, 120.00, 30.00, true),
('prc_a100_in', 'prd_a100_in', 140.00, 180.00, 40.00, true),
('prc_h100_in', 'prd_h100_in', 240.00, 300.00, 60.00, true),
('prc_h200_in', 'prd_h200_in', 320.00, 400.00, 80.00, true),
('prc_b200_in', 'prd_b200_in', 550.00, 700.00, 150.00, true),

('prc_h100_us', 'prd_h100_us', 240.00, 300.00, 60.00, true),
('prc_h100_eu', 'prd_h100_eu', 250.00, 310.00, 60.00, true)
ON CONFLICT (id) DO NOTHING;
