import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class GpuCloudInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. VPC with Public & Private Subnets
    const vpc = new ec2.Vpc(this, 'GpuCloudVpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        { cidrMask: 24, name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
        { cidrMask: 24, name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { cidrMask: 24, name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
    });

    // 2. Encrypted RDS PostgreSQL 18 Instance in Private Isolated Subnets
    const dbSecret = new secretsmanager.Secret(this, 'DbCredentialsSecret', {
      secretName: 'gpu-cloud/rds-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'gpu_admin' }),
        generateStringKey: 'password',
        excludePunctuation: true,
      },
    });

    const postgresDb = new rds.DatabaseInstance(this, 'GpuCloudPostgresRDS', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_1, // RDS standard current major engine
      }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
      allocatedStorage: 50,
      maxAllocatedStorage: 200,
      storageEncrypted: true,
      deletionProtection: false,
    });

    // 3. AWS SQS Event Queue
    const billingEventQueue = new sqs.Queue(this, 'BillingEventQueue', {
      queueName: 'gpu-cloud-billing-events.fifo',
      fifo: true,
      contentBasedDeduplication: true,
    });

    // 4. Amazon S3 Bucket for Export Logs & Artifacts
    const artifactBucket = new s3.Bucket(this, 'GpuCloudArtifactBucket', {
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // 5. ECS Cluster & Fargate Services
    const ecsCluster = new ecs.Cluster(this, 'GpuCloudEcsCluster', { vpc });

    const logGroup = new logs.LogGroup(this, 'ControlPlaneLogGroup', {
      logGroupName: '/ecs/gpu-cloud-control-plane',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    // ECR Repositories
    const apiRepo = new ecr.Repository(this, 'GpuCloudApiRepo', { repositoryName: 'gpu-cloud-api' });
    const webRepo = new ecr.Repository(this, 'GpuCloudWebRepo', { repositoryName: 'gpu-cloud-web' });

    // Output DB Endpoint
    new cdk.CfnOutput(this, 'RdsEndpoint', { value: postgresDb.dbInstanceEndpointAddress });
    new cdk.CfnOutput(this, 'S3BucketName', { value: artifactBucket.bucketName });
  }
}
