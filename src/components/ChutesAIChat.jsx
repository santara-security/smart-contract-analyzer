import { useState } from 'react';

export default function ChutesAIChat() {
  const [useTools, setUseTools] = useState(false);
  
  // Basic Chutes AI state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // MCP Chutes AI state  
  const [mcpMessages, setMcpMessages] = useState([]);
  const [mcpInput, setMcpInput] = useState('');
  const [mcpIsLoading, setMcpIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          stream: false,
          maxTokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMcpSubmit = async (e) => {
    e.preventDefault();
    if (!mcpInput.trim() || mcpIsLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: mcpInput };
    setMcpMessages(prev => [...prev, userMessage]);
    setMcpInput('');
    setMcpIsLoading(true);

    try {
      const response = await fetch('/api/chutes-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...mcpMessages, userMessage],
          stream: false,
          useTools: useTools,
          maxTokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('MCP API request failed');
      
      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.content,
        toolInvocations: data.toolCalls?.length > 0 ? data.toolCalls : undefined
      };
      
      setMcpMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message}`
      };
      setMcpMessages(prev => [...prev, errorMessage]);
    } finally {
      setMcpIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Chutes AI Chat Interface</h1>
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useTools}
              onChange={(e) => setUseTools(e.target.checked)}
              className="rounded"
            />
            <span>Enable Tools (MCP)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Chutes AI Chat */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Basic Chutes AI</h2>
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {message.role === 'user' ? 'You' : 'Chutes AI'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Chutes AI something..."
                className="flex-1 p-2 border rounded-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>

          {/* MCP-Enabled Chutes AI Chat */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Chutes AI with MCP Tools</h2>
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {mcpMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {message.role === 'user' ? 'You' : 'Chutes AI (MCP)'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Show tool calls if any */}
                  {message.toolInvocations && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                      <strong>Tool Used:</strong> {message.toolInvocations[0]?.toolName}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleMcpSubmit} className="flex gap-2">
              <input
                value={mcpInput}
                onChange={(e) => setMcpInput(e.target.value)}
                placeholder="Ask for smart contract analysis..."
                className="flex-1 p-2 border rounded-lg"
                disabled={mcpIsLoading}
              />
              <button
                type="submit"
                disabled={mcpIsLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {mcpIsLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
          </div>
        </div>

        {/* Example prompts */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Try these example prompts:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Basic Chat:</strong>
              <ul className="list-disc list-inside text-gray-600">
                <li>Tell me a joke about blockchain</li>
                <li>Explain what is DeFi</li>
                <li>What are smart contracts?</li>
              </ul>
            </div>
            <div>
              <strong>With Tools (enable MCP):</strong>
              <ul className="list-disc list-inside text-gray-600">
                <li>Analyze this contract: [paste solidity code]</li>
                <li>Check security issues in my smart contract</li>
                <li>Get blockchain data for address 0x...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
