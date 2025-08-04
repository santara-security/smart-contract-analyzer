/**
 * Example file demonstrating usage of the Chutes and MCP library
 * with multiple AI providers
 */

import { ChutesClient, MultiProviderClient } from './chutes';

// Example 1: Basic usage with ChutesClient
async function basicChutesExample() {
  console.log('=== Basic ChutesClient Example ===');
  
  // Initialize the Chutes client
  const chutes = new ChutesClient({
    apiKey: process.env.CHUTES_API_TOKEN, // Uses environment variable by default
    defaultModel: 'zai-org/GLM-4.5-Air'
  });
  
  try {
    // Simple chat completion
    const response = await chutes.chatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Explain what a smart contract is in one sentence.' }
      ],
      maxTokens: 150,
      temperature: 0.7
    });
    
    console.log('Response:', response.content);
    console.log('Tokens used:', response.usage?.total_tokens);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Using MCP-style tools
async function mcpToolsExample() {
  console.log('\n=== MCP Tools Example ===');
  
  const chutes = new ChutesClient();
  
  try {
    // Chat completion with tool usage enabled
    const response = await chutes.chatCompletion({
      messages: [
        { role: 'user', content: 'Analyze this smart contract for security issues.' }
      ],
      useTools: true,
      toolChoice: 'auto'
    });
    
    console.log('Response:', response.content);
    
    // Simulate tool execution directly
    const toolResult = await chutes.simulateToolExecution('analyzeContract', {
      contractCode: 'example-contract.sol',
      analysisType: 'security'
    });
    
    console.log('Tool Result:', JSON.stringify(toolResult, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Multi-provider usage
async function multiProviderExample() {
  console.log('\n=== Multi-Provider Example ===');
  
  // Initialize multi-provider client
  const multiClient = new MultiProviderClient({
    chutes: {
      apiKey: process.env.CHUTES_API_TOKEN
    }
    // Add more providers here as needed
    // openai: {
    //   apiKey: process.env.OPENAI_API_KEY
    // },
    // openrouter: {
    //   apiKey: process.env.OPENROUTER_API_KEY
    // }
  });
  
  try {
    // Use Chutes provider
    const chutesResponse = await multiClient.chatCompletion('chutes', {
      messages: [
        { role: 'user', content: 'What is the advantage of using multiple AI providers?' }
      ],
      maxTokens: 200
    });
    
    console.log('Chutes Response:', chutesResponse.content);
    
    // Health check for Chutes
    const chutesHealth = await multiClient.healthCheck('chutes');
    console.log('Chutes Health:', chutesHealth);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: Custom configuration
async function customConfigExample() {
  console.log('\n=== Custom Configuration Example ===');
  
  try {
    // Client with custom settings
    const customChutes = new ChutesClient({
      apiKey: process.env.CHUTES_API_TOKEN,
      baseUrl: 'https://llm.chutes.ai/v1',
      defaultModel: 'zai-org/GLM-4.5-Air'
    });
    
    const response = await customChutes.chatCompletion({
      messages: [
        { role: 'user', content: 'What makes this library flexible for multiple models?' }
      ],
      maxTokens: 300,
      temperature: 0.5
    });
    
    console.log('Custom Config Response:', response.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  await basicChutesExample();
  await mcpToolsExample();
  await multiProviderExample();
  await customConfigExample();
}

// Export examples
export {
  basicChutesExample,
  mcpToolsExample,
  multiProviderExample,
  customConfigExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export default runAllExamples;
