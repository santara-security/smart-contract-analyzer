import { ChutesClient } from './chutes.js';
import { vectorizeSearch } from './chutes-tools.js';

/**
 * Example file demonstrating usage of the Chutes tools
 * Similar to how tools are used with "ai" or "@ai-sdk/openai"
 */

async function example() {
  console.log('=== Chutes AI Tools Example ===\n');
  
  try {
    // Initialize the Chutes client
    const chutesClient = new ChutesClient();
    
    // Example 1: Basic usage with vectorizeSearch tool
    console.log('1. Testing vectorizeSearch tool...');
    
    const vectorSearchResult = await vectorizeSearch({
      query: 'smart contract security best practices',
      top_k: 3
    });
    
    console.log('Vector search result:', JSON.stringify(vectorSearchResult, null, 2));
    
    // Example 2: Using tools with chat completion (similar to ai or @ai-sdk/openai)
    console.log('\n2. Testing chat completion with tools...');
    
    const chatResult = await chutesClient.chatCompletion({
      messages: [
        { role: 'user', content: 'Search for information about smart contract vulnerabilities' }
      ],
      maxTokens: 500,
      temperature: 0.7,
      useTools: true,
      tools: [vectorizeSearch],
      toolChoice: 'auto'
    });
    
    console.log('Chat completion result:', chatResult.content);
    
    // Example 3: Health check
    console.log('\n3. Testing health check...');
    const health = await chutesClient.healthCheck();
    console.log('Health check result:', health);
    
  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Run the example
example();
