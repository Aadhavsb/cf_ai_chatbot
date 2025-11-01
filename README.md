# cf_ai_chatbot

AI-powered chat assistant built entirely on Cloudflare's infrastructure, featuring real-time conversations with persistent memory.

## Features

- Real-time AI chat powered by Llama 3.3 (70B)
- Persistent conversation history using Durable Objects
- Clean, responsive UI
- Support for multiple concurrent conversations
- Context-aware responses

## Architecture

This application demonstrates Cloudflare's full-stack capabilities:

- **LLM**: Workers AI with Llama 3.3 70B Instruct model
- **Workflow/Coordination**: Cloudflare Workers for API orchestration
- **User Input**: Interactive web-based chat interface
- **Memory/State**: Durable Objects for conversation persistence
- **Hosting**: Cloudflare Pages for frontend delivery

## Project Structure

```
cf_ai_chatbot/
├── src/
│   ├── index.ts          # Worker entry point and API routes
│   └── ChatRoom.ts       # Durable Object for conversation state
├── public/
│   ├── index.html        # Chat interface
│   ├── styles.css        # UI styling
│   └── app.js            # Frontend logic
├── wrangler.toml         # Cloudflare configuration
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### POST /api/chat
Send a message and receive an AI response.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "conversationId": "conv_123456"
}
```

**Response:**
```json
{
  "response": "I'm doing well, thanks for asking! How can I help you today?",
  "conversationId": "conv_123456"
}
```

### POST /api/reset
Clear conversation history.

**Request:**
```json
{
  "conversationId": "conv_123456"
}
```

**Response:**
```json
{
  "success": true
}
```

### POST /api/history
Retrieve conversation history.

**Request:**
```json
{
  "conversationId": "conv_123456"
}
```

**Response:**
```json
[
  {
    "role": "user",
    "content": "Hello",
    "timestamp": 1699564800000
  },
  {
    "role": "assistant",
    "content": "Hi! How can I help you?",
    "timestamp": 1699564801000
  }
]
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (free tier works)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cf_ai_chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Authenticate with Cloudflare:
```bash
npx wrangler login
```

4. Run locally:
```bash
npm run dev
```

The application will be available at `http://localhost:8787`

## Deployment

### Deploy to Cloudflare

1. Deploy the Worker:
```bash
npm run deploy
```

2. (Optional) Set up custom domain in Cloudflare dashboard

The Worker will be deployed and accessible via your `workers.dev` subdomain.

### Hosting Frontend on Cloudflare Pages

If you want to host the frontend separately on Pages:

1. Create a new Pages project in Cloudflare dashboard
2. Connect your Git repository
3. Set build settings:
   - Build command: (none)
   - Build output directory: `public`
4. Deploy

Update the `API_BASE` in `public/app.js` to point to your Worker URL.

## Configuration

### wrangler.toml

Key configurations:

- `name`: Your Worker name
- `main`: Entry point (src/index.ts)
- `compatibility_date`: Workers runtime version
- `[ai]`: Workers AI binding
- `[[durable_objects.bindings]]`: Durable Object configuration

### Environment Variables

No environment variables required - everything runs on Cloudflare's platform!

## How It Works

1. **User sends message**: Frontend sends POST request to `/api/chat`
2. **Worker receives request**: Routes to appropriate handler
3. **Durable Object**: Stores user message and retrieves conversation history
4. **Workers AI**: Processes message with context from history
5. **Response stored**: AI response saved to Durable Object
6. **Frontend updated**: User sees AI response in chat interface

## Conversation State

Each conversation is stored in a Durable Object identified by a unique conversation ID. The Durable Object:

- Persists all messages (user and assistant)
- Maintains chronological order
- Provides instant access to conversation history
- Survives Worker restarts

## Performance

- **Response time**: ~1-3 seconds (model inference)
- **Context limit**: Last 10 messages (configurable)
- **Concurrent users**: Scales automatically with Cloudflare's infrastructure

## Limitations

- Context window limited to last 10 messages (can be adjusted)
- No authentication (can be added)
- Single model (Llama 3.3) - model can be swapped

## Future Enhancements

- [ ] User authentication
- [ ] Conversation management (list, delete, rename)
- [ ] Multiple AI models to choose from
- [ ] Export conversation history
- [ ] Streaming responses
- [ ] Code syntax highlighting
- [ ] File/image upload support

## License

MIT

## Author

Built as a demonstration of Cloudflare's AI and edge computing capabilities.
