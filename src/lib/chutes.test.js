/**
 * Test file demonstrating usage of the Chutes and MCP library
 */

import { ChutesClient, MultiProviderClient } from './chutes';

// Example 1: Using the ChutesClient directly
async function testChutesClient() {
  console.log('Testing ChutesClient...');
  
  try {
    // Initialize client with default configuration (uses environment variables)
    const chutesClient = new ChutesClient();
    
    // Or initialize with custom configuration
    // const chutesClient = new ChutesClient({
    //   apiKey: 'your-api-key',
    //   baseUrl: 'https://llm.chutes.ai/v1',
    //   defaultModel: 'zai-org/GLM-4.5-Air'
    // });
    
    // Perform a chat completion
    const result = await chutesClient.chatCompletion({
      messages: [
        { role: 'user', content: 'What is a smart contract?' }
      ],
      maxTokens: 500,
      temperature: 0.7
    });
    
    console.log('ChutesClient response:', result);
    
    // Test health check
    const health = await chutesClient.healthCheck();
    console.log('Health check:', health);
    
  } catch (error) {
    console.error('ChutesClient test failed:', error);
  }
}

// Example 2: Using the MultiProviderClient
async function testMultiProviderClient() {
  console.log('Testing MultiProviderClient...');
  
  try {
    // Initialize multi-provider client
    const multiClient = new MultiProviderClient({
      chutes: {
        apiKey: process.env.CHUTES_API_TOKEN,
        // Add other config options as needed
      }
    });
    
    // Add another provider (if supported)
    // multiClient.addProvider('openai', {
    //   apiKey: process.env.OPENAI_API_KEY
    // });
    
    // Perform a chat completion with a specific provider
    const result = await multiClient.chatCompletion('chutes', {
      messages: [
        { role: 'user', content: 'Explain blockchain technology in simple terms' }
      ],
      maxTokens: 500,
      temperature: 0.7
    });
    
    console.log('MultiProviderClient response:', result);
    
    // Test health check
    const health = await multiClient.healthCheck('chutes');
    console.log('Health check:', health);
    
  } catch (error) {
    console.error('MultiProviderClient test failed:', error);
  }
}

// Example 3: Using the default exported client
import defaultChutesClient from './chutes';

async function testDefaultClient() {
  console.log('Testing default client...');
  
  try {
    const result = await defaultChutesClient.chatCompletion({
      messages: [
        { role: 'user', content: 'What are the benefits of using MCP?' }
      ],
      maxTokens: 500,
      temperature: 0.7
    });
    
    console.log('Default client response:', result);
  } catch (error) {
    console.error('Default client test failed:', error);
  }
}

// Example 4: Testing tool simulation
async function testToolSimulation() {
  console.log('Testing tool simulation...');
  
  try {
    const chutesClient = new ChutesClient();
    
    // Simulate contract analysis
    const analysisResult = await chutesClient.simulateToolExecution('analyzeContract', {
      contractCode: 'sample-contract-code',
      analysisType: 'security'
    });
    
    console.log('Contract analysis result:', analysisResult);
    
    // Simulate blockchain data retrieval
    const blockchainResult = await chutesClient.simulateToolExecution('getBlockchainData', {
      address: '0x1234567890123456789012345678901234567890',
      network: 'ethereum'
    });
    
    console.log('Blockchain data result:', blockchainResult);
  } catch (error) {
    console.error('Tool simulation test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testChutesClient();
  await testMultiProviderClient();
  await testDefaultClient();
  await testToolSimulation();
}

// Export for use in other modules
export {
  testChutesClient,
  testMultiProviderClient,
  testDefaultClient,
  testToolSimulation,
  runAllTests
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export default runAllTests;
