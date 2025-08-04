import { ChutesClient } from './chutes.js';
import { vectorizeSearch } from './chutes-tools.js';

/**
 * Test file demonstrating usage of the Chutes tools
 */

async function testVectorizeSearch() {
  console.log('Testing vectorizeSearch tool with ChutesClient...\n');
  
  try {
    // Initialize the Chutes client
    const chutesClient = new ChutesClient();
    
    // Test health check
    const health = await chutesClient.healthCheck();
    console.log('Health check result:', health);
    
    // Test chat completion with vectorizeSearch tool
    const response = await chutesClient.chatCompletion({
      messages: [
        { role: 'user', content: 'Search for information about smart contract security best practices' }
      ],
      maxTokens: 500,
      temperature: 0.7,
      useTools: true,
      tools: [vectorizeSearch],
      toolChoice: 'auto'
    });
    
    console.log('Chat completion response:', response);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testVectorizeSearch();
