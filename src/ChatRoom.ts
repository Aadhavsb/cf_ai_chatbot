export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ChatRoom {
  state: DurableObjectState;
  messages: Message[];

  constructor(state: DurableObjectState) {
    this.state = state;
    this.messages = [];
  }

  async initialize() {
    const stored = await this.state.storage.get<Message[]>('messages');
    if (stored) {
      this.messages = stored;
    }
  }

  async fetch(request: Request): Promise<Response> {
    await this.initialize();

    const url = new URL(request.url);

    if (url.pathname === '/messages' && request.method === 'GET') {
      return new Response(JSON.stringify(this.messages), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/messages' && request.method === 'POST') {
      const { role, content } = await request.json() as { role: 'user' | 'assistant', content: string };
      const message: Message = {
        role,
        content,
        timestamp: Date.now()
      };
      this.messages.push(message);
      await this.state.storage.put('messages', this.messages);

      return new Response(JSON.stringify(message), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/reset' && request.method === 'POST') {
      this.messages = [];
      await this.state.storage.delete('messages');
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
