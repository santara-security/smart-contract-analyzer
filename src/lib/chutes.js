import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Chutes AI Client Library
 * Supports multiple models and MCP-style tool usage
 */
class ChutesClient {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.CHUTES_API_TOKEN,
      baseUrl: config.baseUrl || 'https://llm.chutes.ai/v1',
      defaultModel: config.defaultModel || 'zai-org/GLM-4.5-Air',
      ...config
    };

    if (!this.config.apiKey) {
      throw new Error('API key is required. Please provide CHUTES_API_TOKEN in environment variables or config.');
    }
  }

  /**
   * Create a chat completion request
   * @param {Object} options - Request options
   * @param {Array} options.messages - Array of message objects
   * @param {string} options.model - Model to use
   * @param {boolean} options.stream - Whether to stream the response
   * @param {number} options.maxTokens - Maximum tokens to generate
   * @param {number} options.temperature - Temperature for generation
   * @param {boolean} options.useTools - Whether to enable tool usage
   * @param {string} options.toolChoice - Tool choice strategy
   * @returns {Promise<Object>} Response from the API
   */
  async chatCompletion(options = {}) {
    const {
      messages = [],
      model = this.config.defaultModel,
      stream = false,
      maxTokens = 1024,
      temperature = 0.7,
      useTools = false,
      toolChoice = 'auto'
    } = options;

    // Prepare system message for tool usage
    let systemMessage = '';
    if (useTools) {
      systemMessage = 
        'You are a smart contract analysis assistant. You can analyze smart contracts and fetch blockchain data. ' +
        'When asked to analyze contracts or get blockchain data, indicate that you would use the appropriate tools.';
    }

    const apiMessages = systemMessage 
      ? [{ role: 'system', content: systemMessage }, ...messages]
      : messages;

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          stream,
          max_tokens: maxTokens,
          temperature,
          ...(useTools && { tool_choice: toolChoice })
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      
      // Handle content from different possible fields
      const content = 
        data.choices?.[0]?.message?.content || 
        data.choices?.[0]?.message?.reasoning_content || 
        '';

      return {
        content,
        usage: data.usage,
        model,
        finishReason: data.choices?.[0]?.finish_reason,
        rawResponse: data
      };
    } catch (error) {
      console.error('Chutes AI API error:', error);
      throw new Error(`Chutes AI API error: ${error.message}`);
    }
  }

  /**
   * Simulate tool execution (MCP-style)
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} parameters - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async simulateToolExecution(toolName, parameters) {
    switch (toolName) {
      case 'analyzeContract':
        return {
          analysis: `Performed ${parameters.analysisType} analysis on contract`,
          vulnerabilities: ['No immediate security issues found'],
          gasOptimizations: ['Consider using ++i instead of i++'],
          recommendations: [
            'Add input validation',
            'Use latest Solidity version'
          ]
        };
      case 'getBlockchainData':
        return {
          address: parameters.address,
          network: parameters.network,
          balance: '0.0 ETH',
          transactions: [],
          contracts: []
        };
      default:
        return { error: 'Unknown tool' };
    }
  }

  /**
   * Execute a tool call (MCP-style)
   * @param {Object} toolCall - Tool call object
   * @returns {Promise<Object>} Tool result
   */
  async executeToolCall(toolCall) {
    try {
      const toolName = toolCall.function?.name;
      const parameters = JSON.parse(toolCall.function?.arguments || '{}');
      
      const result = await this.simulateToolExecution(toolName, parameters);
      
      return {
        toolCallId: toolCall.id,
        result
      };
    } catch (error) {
      console.error('Tool execution error:', error);
      return {
        toolCallId: toolCall.id,
        result: { error: error.message }
      };
    }
  }

  /**
   * Health check
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      return {
        status: 'ok',
        provider: 'Chutes AI',
        model: this.config.defaultModel,
        tokenConfigured: !!this.config.apiKey,
        features: ['streaming', 'tools', 'mcp-compatible']
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

/**
 * Multi-Provider AI Client
 * Supports multiple AI providers with a unified interface
 */
class MultiProviderClient {
  constructor(providers = {}) {
    this.providers = {};
    
    // Initialize providers if provided
    Object.keys(providers).forEach(providerName => {
      this.addProvider(providerName, providers[providerName]);
    });
  }

  /**
   * Add a provider
   * @param {string} name - Provider name
   * @param {Object} config - Provider configuration
   */
  addProvider(name, config) {
    switch (name.toLowerCase()) {
      case 'chutes':
        this.providers[name] = new ChutesClient(config);
        break;
      // Add other providers as needed
      default:
        throw new Error(`Unsupported provider: ${name}`);
    }
  }

  /**
   * Get a provider by name
   * @param {string} name - Provider name
   * @returns {Object} Provider client
   */
  getProvider(name) {
    if (!this.providers[name]) {
      throw new Error(`Provider not found: ${name}`);
    }
    return this.providers[name];
  }

  /**
   * Execute a chat completion with a specific provider
   * @param {string} providerName - Provider name
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response from the provider
   */
  async chatCompletion(providerName, options) {
    const provider = this.getProvider(providerName);
    return await provider.chatCompletion(options);
  }

  /**
   * Execute a health check on a provider
   * @param {string} providerName - Provider name
   * @returns {Promise<Object>} Health status
   */
  async healthCheck(providerName) {
    const provider = this.getProvider(providerName);
    return await provider.healthCheck();
  }
}

// Export both classes and a default instance
export { ChutesClient, MultiProviderClient };

// Export a default Chutes client instance for convenience
const defaultChutesClient = new ChutesClient();
export default defaultChutesClient;
