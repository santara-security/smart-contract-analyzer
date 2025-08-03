// Test file for Chutes AI integration
// Run this with: node test-chutes-api.js

import dotenv from "dotenv";
dotenv.config();

async function testChutesAPI() {
  const testMessages = [
    {
      role: "user",
      content: "Hello, can you tell me a short joke?"
    }
  ];

  try {
    const response = await fetch("http://localhost:3001/api/chutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: testMessages,
        stream: false,
        maxTokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Chutes AI API Test Successful!");
    console.log("Response:", data.content);
    console.log("Usage:", data.usage);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function testChutesMCP() {
  const testMessages = [
    {
      role: "user",
      content: "Can you analyze this simple smart contract for security issues? pragma solidity ^0.8.0; contract SimpleStorage { uint256 public value; function setValue(uint256 _value) public { value = _value; } }"
    }
  ];

  try {
    const response = await fetch("http://localhost:3001/api/chutes-mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: testMessages,
        stream: false,
        maxTokens: 200,
        temperature: 0.7,
        useTools: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MCP API Error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Chutes AI MCP Test Successful!");
    console.log("Response:", data.content);
    console.log("Tool Calls:", data.toolCalls);
    console.log("Usage:", data.usage);
  } catch (error) {
    console.error("❌ MCP Test failed:", error.message);
  }
}

async function testChutesHealthCheck() {
  try {
    const response = await fetch("http://localhost:3001/api/chutes-mcp", {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Health Check Error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Chutes AI Health Check Successful!");
    console.log("Status:", data);
  } catch (error) {
    console.error("❌ Health Check failed:", error.message);
  }
}

// Also test direct API call
async function testDirectChutesAPI() {
  if (!process.env.CHUTES_API_TOKEN) {
    console.error("❌ CHUTES_API_TOKEN not found in environment variables");
    return;
  }

  try {
    const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHUTES_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "zai-org/GLM-4.5-Air",
        messages: [
          {
            role: "user",
            content: "Say hello in one sentence.",
          },
        ],
        stream: false,
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Direct API Error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Direct Chutes AI API Test Successful!");
    console.log("Response:", data.choices[0].message.content);
    console.log("Usage:", data.usage);
  } catch (error) {
    console.error("❌ Direct test failed:", error.message);
  }
}

console.log("🧪 Testing Chutes AI Integration...\n");

console.log("1. Testing direct API call...");
await testDirectChutesAPI();

console.log("\n2. Testing basic Next.js API route...");
console.log("   Make sure your Next.js dev server is running on localhost:3001");
await testChutesAPI();

console.log("\n3. Testing MCP-enabled API route...");
await testChutesMCP();

console.log("\n4. Testing health check...");
await testChutesHealthCheck();
