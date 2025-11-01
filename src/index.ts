import { ChatRoom, Message } from './ChatRoom';

export { ChatRoom };

interface Env {
  AI: any;
  CHAT_ROOM: DurableObjectNamespace;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API endpoint for chat
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const { message, conversationId } = await request.json() as { message: string, conversationId: string };

        // Get or create Durable Object for this conversation
        const id = env.CHAT_ROOM.idFromName(conversationId);
        const stub = env.CHAT_ROOM.get(id);

        // Store user message
        await stub.fetch('http://chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'user', content: message })
        });

        // Get conversation history
        const historyResponse = await stub.fetch('http://chat/messages');
        const history = await historyResponse.json() as Message[];

        // Prepare messages for AI (limit to last 10 messages to manage context)
        const recentHistory = history.slice(-10);
        const aiMessages = recentHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Call Workers AI
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant. Provide concise, friendly, and accurate responses.' },
            ...aiMessages
          ]
        });

        const assistantMessage = aiResponse.response || 'Sorry, I could not generate a response.';

        // Store assistant message
        await stub.fetch('http://chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: assistantMessage })
        });

        return new Response(JSON.stringify({
          response: assistantMessage,
          conversationId
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
          error: 'Failed to process request',
          message: error instanceof Error ? error.message : 'Unknown error'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // API endpoint to reset conversation
    if (url.pathname === '/api/reset' && request.method === 'POST') {
      try {
        const { conversationId } = await request.json() as { conversationId: string };
        const id = env.CHAT_ROOM.idFromName(conversationId);
        const stub = env.CHAT_ROOM.get(id);

        await stub.fetch('http://chat/reset', { method: 'POST' });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to reset conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // API endpoint to get conversation history
    if (url.pathname === '/api/history' && request.method === 'POST') {
      try {
        const { conversationId } = await request.json() as { conversationId: string };
        const id = env.CHAT_ROOM.idFromName(conversationId);
        const stub = env.CHAT_ROOM.get(id);

        const historyResponse = await stub.fetch('http://chat/messages');
        const history = await historyResponse.json();

        return new Response(JSON.stringify(history), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to get history' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve static files
    return env.ASSETS.fetch(request);
  }
};
