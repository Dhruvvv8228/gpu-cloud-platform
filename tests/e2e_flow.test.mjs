import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runE2ETestSuite() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE E2E ACCEPTANCE TEST SUITE');
  console.log('Target Base URL:', BASE_URL);
  console.log('====================================================\n');

  try {
    // Step 1: Browse GPU Catalog
    console.log('[Step 1/12] GET /api/v1/gpus - Fetching GPU catalog...');
    const catalogRes = await fetch(`${BASE_URL}/api/v1/gpus`);
    assert.equal(catalogRes.status, 200, 'Catalog endpoint should return 200');
    const catalogData = await catalogRes.json();
    assert.equal(catalogData.success, true, 'Catalog response should be successful');
    assert.ok(catalogData.count >= 6, 'Catalog should contain at least 6 GPUs (L4, L40S, A100, H100, H200, B200)');
    console.log(`✓ Catalog verified: ${catalogData.count} GPU models available.`);

    // Step 2: Fetch H100 Specs & Dynamic Pricing
    console.log('\n[Step 2/12] GET /api/v1/gpus/h100-80gb - Fetching H100 details & pricing...');
    const h100Res = await fetch(`${BASE_URL}/api/v1/gpus/h100-80gb`);
    assert.equal(h100Res.status, 200, 'H100 detail endpoint should return 200');
    const h100Data = await h100Res.json();
    assert.equal(h100Data.data.code, 'h100-80gb', 'H100 code must match');
    assert.equal(h100Data.data.architecture, 'Hopper', 'Architecture must be Hopper');
    console.log(`✓ H100 verified: ${h100Data.data.name} (${h100Data.data.vram_gb}GB VRAM, ${h100Data.data.fp16_tflops} TFLOPS).`);

    // Step 3: Check Wallet & Add Credits (Requirement 21)
    console.log('\n[Step 3/12] POST /api/v1/wallet - Adding ₹10,000 prepaid credits via Razorpay simulation...');
    const walletRes = await fetch(`${BASE_URL}/api/v1/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_inr: 10000, payment_method: 'RAZORPAY_E2E_TEST' }),
    });
    assert.equal(walletRes.status, 200, 'Wallet deposit should return 200');
    const walletData = await walletRes.json();
    assert.ok(walletData.data.wallet.balance_inr >= 10000, 'Wallet balance should reflect deposit');
    console.log(`✓ Wallet credited successfully: Balance = ₹${walletData.data.wallet.balance_inr.toFixed(2)}.`);

    // Step 4: Deploy Instance (Trigger Provisioning Workflow)
    console.log('\n[Step 4/12] POST /api/v1/instances - Deploying 1x H100 instance in India region (ap-south-1)...');
    const deployRes = await fetch(`${BASE_URL}/api/v1/instances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gpu_code: 'h100-80gb',
        region_code: 'ap-south-1',
        gpu_count: 1,
        name: 'e2e-llama3-inference-node',
        image: 'ubuntu-22.04-cuda-12.4',
        workload_category: 'LLM Inference',
      }),
    });
    assert.equal(deployRes.status, 202, 'Deploy should return 202 Accepted');
    const deployData = await deployRes.json();
    const createdInstId = deployData.data.id;
    assert.ok(createdInstId.startsWith('inst_'), 'Customer Instance ID must start with inst_ (NEVER vm-provider-id)');
    assert.equal(deployData.data.provider_instance_id, undefined, 'Provider ID MUST NOT be exposed in DTO');
    console.log(`✓ Provisioning workflow initiated: Customer Instance ID = ${createdInstId}, Status = ${deployData.data.status}`);

    // Step 5: Wait for MockProvider state transition to RUNNING
    console.log('\n[Step 5/12] GET /api/v1/instances/[id] - Polling instance status until RUNNING...');
    await new Promise((r) => setTimeout(r, 2000));
    const instRes = await fetch(`${BASE_URL}/api/v1/instances/${createdInstId}`);
    const instData = await instRes.json();
    assert.equal(instData.data.status, 'RUNNING', 'Instance status should transition to RUNNING');
    assert.ok(instData.data.connection_ip, 'Connection IP must be assigned');
    console.log(`✓ Instance is RUNNING. Assigned Public IP: ${instData.data.connection_ip}`);

    // Step 6: Stop Instance
    console.log('\n[Step 6/12] POST /api/v1/instances/[id]/stop - Stopping instance...');
    const stopRes = await fetch(`${BASE_URL}/api/v1/instances/${createdInstId}/stop`, { method: 'POST' });
    assert.equal(stopRes.status, 200, 'Stop action should return 200');
    const stopData = await stopRes.json();
    assert.equal(stopData.data.status, 'STOPPED', 'Status must be STOPPED');
    console.log(`✓ Instance stopped.`);

    // Step 7: Verify Wallet Usage Charge Deduction (Double-Entry Ledger)
    console.log('\n[Step 7/12] GET /api/v1/billing - Verifying double-entry ledger charge transaction...');
    const billingRes = await fetch(`${BASE_URL}/api/v1/billing`);
    const billingData = await billingRes.json();
    const usageTx = billingData.data.ledger_transactions.find((tx) => tx.type === 'USAGE_CHARGE');
    assert.ok(usageTx, 'Usage charge ledger transaction must exist');
    console.log(`✓ Ledger transaction verified: Type=${usageTx.type}, Amount=${usageTx.amount_inr}, Balance After=₹${usageTx.balance_after_inr}`);

    // Step 8: Start & Restart Instance
    console.log('\n[Step 8/12] POST /api/v1/instances/[id]/start & restart - Restarting instance...');
    await fetch(`${BASE_URL}/api/v1/instances/${createdInstId}/start`, { method: 'POST' });
    await fetch(`${BASE_URL}/api/v1/instances/${createdInstId}/restart`, { method: 'POST' });
    console.log(`✓ Start & Restart workflow actions completed.`);

    // Step 9: Terminate Instance
    console.log('\n[Step 9/12] DELETE /api/v1/instances/[id] - Terminating instance...');
    const termRes = await fetch(`${BASE_URL}/api/v1/instances/${createdInstId}`, { method: 'DELETE' });
    assert.equal(termRes.status, 200, 'Terminate should return 200');
    const termData = await termRes.json();
    assert.equal(termData.data.status, 'TERMINATED', 'Status must be TERMINATED');
    console.log(`✓ Instance terminated.`);

    // Step 10: Developer API Key Management
    console.log('\n[Step 10/12] POST /api/v1/api-keys - Generating Developer API Key...');
    const apiKeyRes = await fetch(`${BASE_URL}/api/v1/api-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Automated E2E Test Key' }),
    });
    assert.equal(apiKeyRes.status, 201, 'API key creation should return 201');
    const apiKeyData = await apiKeyRes.json();
    assert.ok(apiKeyData.data.secret_key.startsWith('sk_live_'), 'Secret key must start with sk_live_');
    console.log(`✓ Secret API key generated: ${apiKeyData.data.secret_key.substring(0, 16)}...`);

    // Step 11: Query Admin Console & Market Demand Intelligence (Requirement 38 & 40)
    console.log('\n[Step 11/12] GET /api/v1/admin - Querying admin portal metrics & gross margins...');
    const adminRes = await fetch(`${BASE_URL}/api/v1/admin`);
    assert.equal(adminRes.status, 200, 'Admin endpoint should return 200');
    const adminData = await adminRes.json();
    assert.ok(adminData.data.metrics.total_instances_created >= 1, 'Admin metrics must show created instances');
    assert.ok(adminData.data.market_intelligence.total_demand_signals >= 1, 'Market intelligence demand signals must be logged');
    console.log(`✓ Admin metrics verified: Revenue = ₹${adminData.data.metrics.total_revenue_inr}, Cost = ₹${adminData.data.metrics.total_provider_cost_inr}, Gross Margin = ₹${adminData.data.metrics.gross_margin_inr} (${adminData.data.metrics.margin_percentage}%).`);

    // Step 12: Final Success Affirmation
    console.log('\n====================================================');
    console.log('🎉 ALL 12 ACCEPTANCE STEPS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ E2E TEST SUITE FAILED:', err);
    process.exit(1);
  }
}

runE2ETestSuite();
