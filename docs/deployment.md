# AWS Deployment Architecture & Infrastructure as Code (CDK)

## 1. Production AWS Topography

```mermaid
flowchart TD
    Internet(("Public Internet"))

    subgraph Cloudflare_Edge["Cloudflare Edge"]
        WAF["Cloudflare WAF / DDoS Protection"]
        DNS["DNS Records (*.domain.com)"]
    end

    subgraph AWS_VPC["AWS VPC (10.0.0.0/16)"]
        subgraph Public_Subnets["Public Subnets (us-east-1a, us-east-1b)"]
            ALB["AWS Application Load Balancer"]
            NAT["NAT Gateways"]
        end

        subgraph Private_App_Subnets["Private App Subnets"]
            FargateAPI["ECS Fargate: Go API Tasks"]
            FargateWorker["ECS Fargate: Go Worker Tasks"]
            FargateWeb["ECS Fargate / Vercel: Next.js Frontend"]
        end

        subgraph Private_Data_Subnets["Private Isolated Database Subnets"]
            RDS[("Amazon RDS PostgreSQL 18\n(Multi-AZ Engine)")]
            ElastiCache[("ElastiCache Valkey Serverless")]
            TemporalCluster["Temporal Cluster / Serverless"]
        end
    end

    subgraph AWS_Services["AWS Managed Services"]
        SecretsManager["AWS Secrets Manager\n(Provider Creds & DB Passwords)"]
        SQS["AWS SQS Queues"]
        S3["AWS S3 Private Buckets"]
        ECR["AWS ECR Container Registry"]
        CloudWatch["CloudWatch Logs & Alarms"]
    end

    Internet --> DNS
    DNS --> WAF
    WAF --> ALB
    ALB --> FargateWeb
    ALB --> FargateAPI

    FargateAPI --> RDS
    FargateAPI --> ElastiCache
    FargateAPI --> SQS
    FargateAPI --> SecretsManager

    FargateWorker --> TemporalCluster
    FargateWorker --> SQS
    FargateWorker --> RDS

    FargateAPI --> CloudWatch
    FargateWorker --> CloudWatch
```

---

## 2. Container Registry & Artifacts
* `gpu-cloud-web`: Next.js 16 Production Docker Container (`Dockerfile.web`)
* `gpu-cloud-api`: Go 1.27 Control Plane API Binary Container (`Dockerfile.api`)
* `gpu-cloud-worker`: Go 1.27 Worker Container (`Dockerfile.worker`)

---

## 3. Infrastructure as Code (AWS CDK TypeScript)

Located under `infra/aws-cdk/`:
* `VpcStack`: Provision VPC with dual Availability Zones, Public/Private/Isolated subnets, NAT Gateways.
* `DatabaseStack`: RDS PostgreSQL 18 Multi-AZ instance with encryption at rest via AWS KMS.
* `EcsClusterStack`: ECS Cluster on AWS Fargate with auto-scaling policies based on CPU/RAM and target response times.
* `SecretsStack`: AWS Secrets Manager integration for secure runtime access to payment secrets, provider keys, and JWT secrets.
