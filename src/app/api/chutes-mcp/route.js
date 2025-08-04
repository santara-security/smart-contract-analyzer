import dotenv from "dotenv";
import { ChutesClient } from "@/lib/chutes";
import { vectorizeSearch as vectorizeSearchTool } from "@/lib/chutes-tools";

dotenv.config();

// Initialize Chutes client
const chutesClient = new ChutesClient();

export async function POST(req) {
  try {
    const {
      messages,
      stream = true,
      maxTokens = 1024,
      temperature = 0.7,
      useTools = true,
      toolChoice = "auto",
    } = await req.json();

    if (!process.env.CHUTES_API_TOKEN) {
      throw new Error("CHUTES_API_TOKEN is not configured");
    }

    // Prepare the request to Chutes AI
    let systemMessage = "";
    if (useTools) {
      systemMessage =
        "You are a smart contract analysis assistant. You can analyze smart contracts and fetch blockchain data. When asked to analyze contracts or get blockchain data, indicate that you would use the appropriate tools.";
    }

    const apiMessages = [...messages];

    // Define tools that can be passed to the AI
    const tools = useTools ? [vectorizeSearchTool] : [];

    const model = "zai-org/GLM-4.5-FP8";

    // Use the ChutesClient library for the API call
    const result = await chutesClient.chatCompletion({
      messages: apiMessages,
      model,
      stream: stream,
      maxTokens,
      temperature,
      useTools,
      toolChoice,
      tools,
    });

    console.log('ChutesClient result with tools:', JSON.stringify(result, null, 2));

    let content = result.content;
    let toolCalls = [];
    let toolResults = [];

    // Check for tool calls in the response and execute them
    // First, check in streaming chunks for tool calls
    if (Array.isArray(result.rawResponse)) {
      for (const chunk of result.rawResponse) {
        if (chunk.choices?.[0]?.delta?.tool_calls) {
          toolCalls = chunk.choices[0].delta.tool_calls;
          console.log('Tool calls detected in streaming chunk:', toolCalls);
          break;
        }
      }
    }
    // Also check in the non-streaming format
    if (result.rawResponse?.choices?.[0]?.message?.tool_calls) {
      toolCalls = result.rawResponse.choices[0].message.tool_calls;
      console.log('Tool calls detected in message:', toolCalls);
    }

    // Execute each tool call if we found any
    if (toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        try {
          if (toolCall.function.name === 'vectorizeSearch') {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('Executing vectorizeSearch with args:', args);
            
            // Execute the tool
            const toolResult = await vectorizeSearchTool.execute(args);
            console.log('Tool result:', toolResult);
            
            toolResults.push({
              toolCallId: toolCall.id,
              result: toolResult
            });

            // Add tool result to messages and make another API call
            const updatedMessages = [
              ...apiMessages,
              {
                role: 'assistant',
                content: null,
                tool_calls: toolCalls
              },
              {
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: JSON.stringify(toolResult)
              }
            ];

            // Make another API call with the tool results
            const followUpResult = await chutesClient.chatCompletion({
              messages: updatedMessages,
              model,
              stream: false, // Use non-streaming for tool follow-up
              maxTokens,
              temperature,
              useTools: false, // Disable tools for follow-up to avoid recursion
              toolChoice: 'none',
              tools: [],
            });

            console.log('Follow-up result:', followUpResult);
            
            // Use the follow-up content as the final response
            if (followUpResult.content) {
              content = followUpResult.content;
            }
          }
        } catch (toolError) {
          console.error('Tool execution error:', toolError);
          toolResults.push({
            toolCallId: toolCall.id,
            error: toolError.message
          });
        }
      }
    }

    // If content is empty, try to extract it from rawResponse
    if (!content && result.rawResponse) {
      if (result.rawResponse.choices?.[0]?.message?.content) {
        content = result.rawResponse.choices[0].message.content;
      } else if (Array.isArray(result.rawResponse) && result.rawResponse.length > 0) {
        // Handle streaming chunks that might contain content
        content = result.rawResponse
          .map(chunk => chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '')
          .filter(Boolean)
          .join('');
      }
    }

    console.log('Final content to return:', content);

    return new Response(
      JSON.stringify({
        content,
        usage: result.usage,
        model: model,
        finishReason: result.finishReason,
        toolCalls,
        toolResults,
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
    const healthStatus = await chutesClient.healthCheck();
    return new Response(JSON.stringify(healthStatus), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
