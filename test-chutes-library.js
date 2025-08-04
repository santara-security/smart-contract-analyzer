/**
 * Simple test script to verify the Chutes library functionality
 */

import { ChutesClient, MultiProviderClient } from './src/lib/chutes.js';

async function testLibrary() {
  console.log('Testing Chutes and MCP Library...\n');
  
  try {
    // Test 1: Basic ChutesClient functionality
    console.log('1. Testing ChutesClient initialization...');
    const chutesClient = new ChutesClient();
    console.log('✓ ChutesClient initialized successfully\n');
    
    // Test 2: Health check
    console.log('2. Testing health check...');
    const health = await chutesClient.healthCheck();
    console.log('Health check result:', health);
    console.log('✓ Health check completed\n');
    
    // Test 3: Tool simulation
    console.log('3. Testing tool simulation...');
    const toolResult = await chutesClient.simulateToolExecution('analyzeContract', {
      contractCode: 'test-contract',
      analysisType: 'security'
    });
    console.log('Tool simulation result:', JSON.stringify(toolResult, null, 2));
    console.log('✓ Tool simulation completed\n');
    
    // Test 4: MultiProviderClient
    console.log('4. Testing MultiProviderClient...');
    const multiClient = new MultiProviderClient();
    console.log('✓ MultiProviderClient initialized successfully\n');
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testLibrary();
