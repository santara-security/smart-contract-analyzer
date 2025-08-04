'use client';

import { useState, useRef, useCallback } from 'react';
import { FiUpload, FiFile, FiCopy, FiCheck, FiSend, FiLoader } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SmartContractAnalyzer() {
  // State for file upload
  const [file, setFile] = useState(null);
  const [contractCode, setContractCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // State for chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (file) => {
    if (file && file.name.endsWith('.sol')) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setContractCode(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid Solidity (.sol) file');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Copy contract code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for API - include contract code in the first message
      const apiMessages = [...messages, userMessage];
      if (contractCode && messages.length === 0) {
        apiMessages.unshift({
          role: 'user',
          content: `Analyze this smart contract:\n\n${contractCode}`
        });
      }

      // Call the Chutes MCP API
      const response = await fetch('/api/chutes-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          stream: false,
          useTools: true,
          maxTokens: 2048,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.content,
        toolInvocations: data.toolCalls?.length > 0 ? data.toolCalls : undefined
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

  // Clear contract
  const clearContract = () => {
    setFile(null);
    setContractCode('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-transparent z-10 flex flex-col px-4 py-6 gap-6 mt-8 max-w-7xl mx-auto">
      <div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-xl font-bold text-neutral-200 mb-2">Smart Contract Analyzer</h1>
        <p className="text-xs text-neutral-300 mb-6">
          Upload a Solidity (.sol) file or paste your smart contract code below to analyze it for security vulnerabilities and best practices.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Input Section */}
          <div className="bg-neutral-800/30 rounded-lg p-4 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-200">Contract Input</h2>
            
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-neutral-600 hover:border-neutral-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-300 mb-1">
                <span className="text-blue-400 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-400">Solidity (.sol) files only</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".sol"
                onChange={handleFileInputChange}
              />
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-neutral-700/40 rounded p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiFile className="text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-200 font-medium">{file.name}</p>
                    <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={clearContract}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-neutral-700"></div>
              <span className="flex-shrink mx-4 text-xs text-neutral-500">OR</span>
              <div className="flex-grow border-t border-neutral-700"></div>
            </div>

            {/* Text Area for Pasting Code */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-neutral-400">Paste Contract Code</label>
                {contractCode && (
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-1" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                ref={textareaRef}
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="// Paste your Solidity smart contract code here..."
                className="w-full h-48 font-mono text-xs bg-neutral-700/50 text-neutral-200 rounded-lg p-3 border border-neutral-600/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
              />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-neutral-800/30 rounded-lg p-4 space-y-4 flex flex-col h-full">
            <h2 className="text-sm font-semibold text-neutral-200">Contract Analysis Chat</h2>
            
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto max-h-96 space-y-4 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-neutral-400 mb-2">
                    <FiLoader className="mx-auto h-6 w-6 animate-spin" />
                  </div>
                  <p className="text-xs text-neutral-400">
                    {contractCode 
                      ? "Ask a question about your smart contract or click 'Analyze Contract' to get started" 
                      : "Upload a contract or paste code to begin analysis"}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/30 ml-4'
                        : 'bg-neutral-700/40 border border-neutral-600/30 mr-4'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 flex items-center">
                      <span className={message.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                        {message.role === 'user' ? 'You' : 'Contract Analyzer'}
                      </span>
                      {message.toolInvocations && (
                        <span className="ml-2 bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded text-xs border border-purple-500/30">
                          Tool Used
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-200 text-xs leading-relaxed prose prose-invert prose-xs max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="p-3 rounded-lg bg-neutral-700/40 border border-neutral-600/30 mr-4">
                  <div className="text-xs font-medium mb-1 text-green-400">Contract Analyzer</div>
                  <div className="flex items-center text-neutral-400">
                    <FiLoader className="mr-2 animate-spin" />
                    <span className="text-xs">Analyzing contract...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={contractCode ? "Ask about the contract..." : "Please upload a contract first"}
                  className="flex-1 p-2 text-xs bg-neutral-700/50 text-neutral-200 rounded-lg border border-neutral-600/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                  disabled={isLoading || !contractCode}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !contractCode}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiSend />
                  )}
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            {contractCode && messages.length === 0 && (
              <div className="mt-2">
                <p className="text-xs text-neutral-400 mb-2">Try these example prompts:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInput("Analyze this contract for security vulnerabilities")}
                    className="text-xs bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded"
                  >
                    Find vulnerabilities
                  </button>
                  <button
                    onClick={() => setInput("Check for gas optimization opportunities")}
                    className="text-xs bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded"
                  >
                    Gas optimization
                  </button>
                  <button
                    onClick={() => setInput("Explain what this contract does")}
                    className="text-xs bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded"
                  >
                    Explain contract
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Button */}
        {contractCode && messages.length === 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setInput("Analyze this smart contract for security vulnerabilities, gas optimization, and best practices");
                // We'll simulate the submit action
                setTimeout(() => {
                  const event = { preventDefault: () => {} };
                  handleSubmit(event);
                }, 100);
              }}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FiLoader className="mr-2" />
              Analyze Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
