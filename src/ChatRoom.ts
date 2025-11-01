export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ChatRoom {
  state: DurableObjectState;
  sql: SqlStorage;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sql = state.storage.sql;
  }

  async initialize() {
    // Create messages table if it doesn't exist
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )
    `);
  }

  async fetch(request: Request): Promise<Response> {
    await this.initialize();

    const url = new URL(request.url);

    if (url.pathname === '/messages' && request.method === 'GET') {
      const messages = this.sql.exec(`
        SELECT role, content, timestamp FROM messages ORDER BY id ASC
      `).toArray() as Message[];

      return new Response(JSON.stringify(messages), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/messages' && request.method === 'POST') {
      const { role, content } = await request.json() as { role: 'user' | 'assistant', content: string };
      const timestamp = Date.now();

      this.sql.exec(`
        INSERT INTO messages (role, content, timestamp) VALUES (?, ?, ?)
      `, role, content, timestamp);

      const message: Message = { role, content, timestamp };

      return new Response(JSON.stringify(message), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/reset' && request.method === 'POST') {
      this.sql.exec(`DELETE FROM messages`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
