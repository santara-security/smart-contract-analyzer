# Chutes and MCP Library

A flexible library for interacting with Chutes AI and other AI providers with MCP (Model Context Protocol) support.

## Features

- Support for multiple AI providers
- MCP-style tool usage simulation
- Clean and consistent API
- Easy configuration and customization
- Health check functionality
- TypeScript support
- Tools that can be passed to AI similar to "ai" or "@ai-sdk/openai"

## Installation

The library is part of this project and doesn't require separate installation.

## Usage

### Basic Usage

```javascript
import { ChutesClient } from './chutes';

// Initialize client (uses environment variables by default)
const chutes = new ChutesClient();

// Or with custom configuration
const chutes = new ChutesClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://llm.chutes.ai/v1',
  defaultModel: 'zai-org/GLM-4.5-Air'
});

// Simple chat completion
const response = await chutes.chatCompletion({
  messages: [
    { role: 'user', content: 'Explain what a smart contract is.' }
  ],
  maxTokens: 500,
  temperature: 0.7
});

console.log(response.content);
```

### Using MCP Tools

```javascript
import { ChutesClient } from './chutes';

const chutes = new ChutesClient();

// Chat completion with tool usage
const response = await chutes.chatCompletion({
  messages: [
    { role: 'user', content: 'Analyze this smart contract for security issues.' }
  ],
  useTools: true,
  toolChoice: 'auto'
});

// Direct tool simulation
const toolResult = await chutes.simulateToolExecution('analyzeContract', {
  contractCode: 'example-contract.sol',
  analysisType: 'security'
});

console.log(toolResult);
```

### Using Tools (Similar to "ai" or "@ai-sdk/openai")

```javascript
import { ChutesClient } from './chutes';
import { vectorizeSearch } from './chutes-tools';

const chutes = new ChutesClient();

// Chat completion with tools passed directly to the AI
const response = await chutes.chatCompletion({
  messages: [
    { role: 'user', content: 'Search for information about smart contract vulnerabilities' }
  ],
  useTools: true,
  tools: [vectorizeSearch],  // Tools passed similar to "ai" or "@ai-sdk/openai"
  toolChoice: 'auto'
});

console.log(response.content);
```

### Multi-Provider Usage

```javascript
import { MultiProviderClient } from './chutes';

// Initialize multi-provider client
const multiClient = new MultiProviderClient({
  chutes: {
    apiKey: process.env.CHUTES_API_TOKEN
  }
  // Add more providers as needed
});

// Use a specific provider
const response = await multiClient.chatCompletion('chutes', {
  messages: [
    { role: 'user', content: 'What are the advantages of using multiple AI providers?' }
  ]
});

// Health check
const health = await multiClient.healthCheck('chutes');
```

### Using the Default Client

```javascript
import chutes from './chutes';

// Use the default exported client
const response = await chutes.chatCompletion({
  messages: [
    { role: 'user', content: 'What makes this library flexible?' }
  ]
});
```

## API Reference

### ChutesClient

#### Constructor

```javascript
new ChutesClient(config)
```

**Parameters:**
- `config` (Object, optional): Configuration options
  - `apiKey` (string): API key for Chutes AI
  - `baseUrl` (string): Base URL for the API
  - `defaultModel` (string): Default model to use

#### chatCompletion(options)

Create a chat completion request.

**Parameters:**
- `options` (Object): Request options
  - `messages` (Array): Array of message objects
  - `model` (string): Model to use
  - `stream` (boolean): Whether to stream the response
  - `maxTokens` (number): Maximum tokens to generate
  - `temperature` (number): Temperature for generation
  - `useTools` (boolean): Whether to enable tool usage
  - `toolChoice` (string): Tool choice strategy

**Returns:** Promise<Object> - Response from the API

#### simulateToolExecution(toolName, parameters)

Simulate tool execution (MCP-style).

**Parameters:**
- `toolName` (string): Name of the tool to execute
- `parameters` (Object): Tool parameters

**Returns:** Promise<Object> - Tool execution result

#### healthCheck()

Perform a health check.

**Returns:** Promise<Object> - Health status

### MultiProviderClient

#### Constructor

```javascript
new MultiProviderClient(providers)
```

**Parameters:**
- `providers` (Object): Provider configurations

#### addProvider(name, config)

Add a provider.

**Parameters:**
- `name` (string): Provider name
- `config` (Object): Provider configuration

#### getProvider(name)

Get a provider by name.

**Parameters:**
- `name` (string): Provider name

**Returns:** Object - Provider client

#### chatCompletion(providerName, options)

Execute a chat completion with a specific provider.

**Parameters:**
- `providerName` (string): Provider name
- `options` (Object): Request options

**Returns:** Promise<Object> - Response from the provider

#### healthCheck(providerName)

Execute a health check on a provider.

**Parameters:**
- `providerName` (string): Provider name

**Returns:** Promise<Object> - Health status

## Environment Variables

- `CHUTES_API_TOKEN`: API token for Chutes AI

## Examples

See `chutes.example.js` for more detailed examples of how to use the library.

## Available Tools

### vectorizeSearch

Search for relevant information using vector similarity search.

**Usage:**
```javascript
import { vectorizeSearch } from './chutes-tools';

const result = await vectorizeSearch({
  query: 'smart contract security best practices',
  top_k: 3
});
```

**Parameters:**
- `query` (string): The search query
- `top_k` (number, optional): Number of top results to return (default: 3)

## Testing

See `chutes.test.js` for test examples.

## License

MIT
