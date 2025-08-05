import dotenv from "dotenv";
import { generateText } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { vectorReadFile, vectorSearch } from "@/lib/chutes-tools";


const chutesProvider = createOpenAI({
  name: "chutes",
  apiKey: process.env.CHUTES_API_TOKEN,
  baseURL: "https://llm.chutes.ai/v1",
});

// const model = chutesProvider("moonshotai/Kimi-K2-Instruct");
const model = chutesProvider("zai-org/GLM-4.5-FP8");

dotenv.config();

// Initialize Chutes client
const conversationHistories = new Map();

export async function POST(req) {
  console.log(model);

  try {
    const { conversationId, prompt, messages } = await req.json();

    // Get or initialize conversation history
    let conversationHistory = [];
    if (conversationId) {
      conversationHistory = conversationHistories.get(conversationId) || [];
    }

    const systemPrompt = `You are a smart contract analysis assistant. Use the tools provided to answer questions about vulnerabilities and smart contract functions.
    Be honest and concise in your responses. If you don't know the answer, say "I don't know".`;

    // Build the messages array properly
    let apiMessages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    // Add the new user message
    let userMessage = "";
    if (messages) {
      if (typeof messages === "string") {
        userMessage = messages;
      } else if (Array.isArray(messages) && messages.length > 0) {
        // If messages is an array, use the last user message
        const lastUserMessage = messages.filter((m) => m.role === "user").pop();
        userMessage = lastUserMessage
          ? lastUserMessage.content
          : messages[messages.length - 1].content;
      } else if (typeof messages === "object" && messages.content) {
        userMessage = messages.content;
      }
    } else if (prompt) {
      userMessage = prompt;
    }

    if (userMessage) {
      apiMessages.push({ role: "user", content: userMessage });
    }

    console.log(
      "Sending messages to API:",
      JSON.stringify(apiMessages, null, 2)
    );

    // OpenAI text generation using Vercel AI SDK
    const aiResult = await generateText({
      model: model,
      messages: apiMessages,
      tools: {
        vectorSearch: vectorSearch,
        vectorReadFile: vectorReadFile
      },
      toolChoice: "auto", // Automatically choose the best tool
      schema: z.object({
        text: z.string().describe("The AI's response text"),
      }),
      mode: 'json',
      maxSteps: 3,
    });

    console.log("AI result:", aiResult);
    const { text, toolCalls, toolResults } = aiResult;

    // Update conversation history
    if (conversationId && userMessage) {
      conversationHistory.push({ role: "user", content: userMessage });
      conversationHistory.push({ role: "assistant", content: text });
      conversationHistories.set(conversationId, conversationHistory);
    }

    return new Response(
      JSON.stringify({
        text,
        toolCalls,
        toolResults,
        conversationHistory: conversationHistory,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chutes AI MCP API error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Simple health check - just verify the model is accessible
    const { text } = await generateText({
      model: model,
      messages: [{ role: "user", content: "Hello" }],
    });

    return new Response(
      JSON.stringify({ status: "healthy", message: "API is working" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
