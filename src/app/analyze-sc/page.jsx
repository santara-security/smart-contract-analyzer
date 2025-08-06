'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FiUpload, FiFile, FiCopy, FiCheck, FiSend, FiLoader, FiZap, FiShield, FiCode, FiSearch } from 'react-icons/fi';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function SmartContractAnalyzer() {
  // State for file upload
  const [file, setFile] = useState(null);
  const [contractCode, setContractCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // State for chat
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Generate a random conversation ID
  const generateConversationId = () => {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Save contract to server
  const saveContractToServer = async (code, convId) => {
    try {
      const response = await fetch('/api/save-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractCode: code, conversationId: convId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save contract');
      }

      const result = await response.json();
      console.log('Contract saved:', result.filename);
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    if (file && file.name.endsWith('.sol')) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const code = e.target.result;
        setContractCode(code);
        // Generate new conversation ID when new contract is uploaded
        const newConversationId = generateConversationId();
        setConversationId(newConversationId);
        // Clear previous messages
        setMessages([]);
        // Save contract to server
        saveContractToServer(code, newConversationId);
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

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate conversation ID when contract code changes
  useEffect(() => {
    if (contractCode && !conversationId) {
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      // Clear previous messages when new contract is added
      setMessages([]);
      // Save contract to server
      saveContractToServer(contractCode, newConversationId);
    }
  }, [contractCode, conversationId]);

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
    const userMessage = { role: 'user', content: input };
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
          conversationId: conversationId,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.text,
        toolInvocations: data.toolCalls?.length > 0 ? data.toolCalls : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
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

  // Quick action prompts
  const quickPrompts = [
    { text: "Find vulnerabilities", icon: <FiShield className="w-3 h-3" /> },
    { text: "Gas optimization", icon: <FiZap className="w-3 h-3" /> },
    { text: "Explain contract", icon: <FiCode className="w-3 h-3" /> },
    { text: "Best practices", icon: <FiSearch className="w-3 h-3" /> }
  ];

  return (
    <div className="bg-transparent z-10 flex flex-col px-4 py-6 gap-6 mt-16 max-w-7xl mx-auto">
      <div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg mt-4 shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-200">Smart Contract Analyzer</h1>
            <p className="text-xs text-neutral-300 mt-1">
              Analyze smart contracts for security vulnerabilities and best practices
            </p>
          </div>
          <div className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30 flex items-center">
            <FiShield className="w-3 h-3 mr-1" />
            AI-Powered
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Input Section */}
          <div className="bg-neutral-800/30 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center">
                <FiCode className="w-4 h-4 mr-2 text-blue-400" />
                Contract Input
              </h2>
              <button 
                onClick={copyToClipboard}
                className={`text-xs text-blue-400 hover:text-blue-300 flex items-center bg-blue-600/20 hover:bg-blue-600/30 px-2 py-1 rounded border border-blue-500/30 transition-colors ${contractCode ? '' : 'invisible'}`}
                aria-hidden={!contractCode}
                tabIndex={contractCode ? 0 : -1}
                title={contractCode ? 'Copy contract code' : 'Copy disabled (no contract)'}
              >
                {copied ? (
                  <>
                    <FiCheck className="mr-1 w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1 w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700/20'
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
              <div className="bg-neutral-700/40 rounded p-3 flex items-center justify-between border border-neutral-600/30">
                <div className="flex items-center space-x-2">
                  <FiFile className="text-neutral-400 w-4 h-4" />
                  <div>
                    <p className="text-xs text-neutral-200 font-medium truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={clearContract}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="flex-grow border-t border-neutral-700"></div>
              <span className="flex-shrink mx-4 text-xs text-neutral-500 bg-neutral-800/30 px-2 rounded">OR</span>
              <div className="flex-grow border-t border-neutral-700"></div>
            </div>

            {/* Text Area for Pasting Code */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-neutral-400 flex items-center">
                  <FiCode className="w-3 h-3 mr-1" />
                  Paste Contract Code
                </label>
              </div>
              <textarea
                ref={textareaRef}
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="// Paste your Solidity smart contract code here..."
                className="w-full h-40 font-mono text-xs bg-neutral-700/50 text-neutral-200 rounded-lg p-3 border border-neutral-600/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-neutral-800/30 rounded-lg p-4 space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center">
                <FiSend className="w-4 h-4 mr-2 text-green-400" />
                Analysis Chat
              </h2>
              {messages.length > 0 && (
                <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs border border-green-500/30">
                  {messages.length} messages
                </div>
              )}
            </div>
            
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto max-h-96 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent scrollbar-thumb-rounded">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-neutral-700/40 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-neutral-600/30">
                    <FiLoader className="w-5 h-5 text-neutral-400 animate-spin" />
                  </div>
                  <p className="text-xs text-neutral-400 mb-4">
                    {contractCode 
                      ? "Ask a question about your smart contract or click 'Analyze Contract' to get started" 
                      : "Upload a contract or paste code to begin analysis"}
                  </p>
                  
                  {/* Quick Actions */}
                  {contractCode && (
                    <div className="mt-4">
                      <p className="text-xs text-neutral-400 mb-2">Try these example prompts:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => setInput(prompt.text)}
                            className="text-xs bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 px-2 py-2 rounded border border-neutral-600/30 hover:border-neutral-500 transition-all flex items-center justify-center"
                          >
                            <span className="mr-1">{prompt.icon}</span>
                            {prompt.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      message.role === 'user'
                        ? 'bg-blue-600/20 border-blue-500/30 ml-4'
                        : 'bg-neutral-700/40 border-neutral-600/30 mr-4'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 flex items-center">
                      <span className={message.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                        {message.role === 'user' ? 'You' : 'Santara AI'}
                      </span>
                      {message.toolInvocations && (
                        <span className="ml-2 bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded text-xs border border-purple-500/30">
                          Tool Used
                        </span>
                      )}
                    </div>
                    <MarkdownRenderer content={message.content} className="text-xs" />
                  </div>
                ))
              )}
              {isLoading && (
                <div className="p-3 rounded-lg bg-neutral-700/40 border border-neutral-600/30 mr-4 animate-pulse">
                  <div className="text-xs font-medium mb-1 text-green-400">Santara AI</div>
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
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors border border-blue-500/30"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin w-3 h-3" />
                  ) : (
                    <FiSend className="w-3 h-3" />
                  )}
                </button>
              </div>
            </form>
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-green-500/30 bg-neutral-900/40 px-4 py-2.5 text-xs font-semibold text-neutral-200 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.015] hover:border-green-400/40 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] active:scale-[0.99]"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/30 via-emerald-600/30 to-green-600/30 opacity-70 transition-opacity group-hover:opacity-90" />
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-green-500/0 via-emerald-500/20 to-green-500/0 blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5"></span>
              <span className="relative flex items-center gap-2">
                <span className="grid place-items-center h-6 w-6 rounded-lg bg-green-600/20 text-green-400 ring-1 ring-inset ring-green-500/30">
                  <FiZap className="h-3.5 w-3.5" />
                </span>
                <span className="uppercase tracking-wide">Analyze Contract</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
