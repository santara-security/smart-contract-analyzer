import dotenv from "dotenv";
import { streamText, generateText } from "ai";

dotenv.config();

export async function POST(req) {
  try {
    const { messages, stream = false, maxTokens = 1024, temperature = 0.7 } = await req.json();
    
    if (!process.env.CHUTES_API_TOKEN) {
      throw new Error("CHUTES_API_TOKEN is not configured");
    }

    // Direct API call approach since AI SDK doesn't support custom providers easily
    const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHUTES_API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "zai-org/GLM-4.5-Air",
        messages,
        stream: false,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Chutes AI API error: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();

    // Chutes AI sometimes puts content in reasoning_content instead of content
    const responseContent = data.choices[0].message.content || data.choices[0].message.reasoning_content || "";

    if (stream) {
      // For streaming, we'd need to implement SSE
      return new Response(responseContent, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      return new Response(JSON.stringify({ 
        content: responseContent,
        usage: data.usage,
        model: "zai-org/GLM-4.5-Air",
        finishReason: data.choices[0].finish_reason
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Chutes AI API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
