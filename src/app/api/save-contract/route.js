import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { contractCode, conversationId } = await req.json();

    if (!contractCode || !conversationId) {
      return new Response(
        JSON.stringify({ error: 'Missing contract code or conversation ID' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create filename using conversation ID
    const filename = `${conversationId}.sol`;
    const filepath = path.join(process.cwd(), 'uploads', 'ai', filename);

    // Save the contract code to file
    await fs.writeFile(filepath, contractCode, 'utf8');

    return new Response(
      JSON.stringify({ success: true, filename }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving contract:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
