# 🕵️ Private EYE Chatbot

*The rain comes down hard in this city. So do the questions. Lucky for you, I'm in the business of answers.*

A film noir detective AI chatbot built entirely on Cloudflare's infrastructure. Solve mysteries, crack codes, and navigate the shadowy underworld with a hard-boiled private eye powered by Llama 3.3.

## 🎬 Features

### Noir Detective Experience
- **Bogart-Style Persona**: AI detective speaks like a 1940s private eye from classic film noir
- **6 Mystery Cases**: Choose from curated noir mysteries or free investigation mode
- **Interactive Storytelling**: Immersive narration and case-specific scenarios
- **Technical Challenges**: Solve ciphers, decode messages, analyze network logs, and crack encryption

### Mystery Cases

1. **The Dame in Distress** - A beautiful dame, a suspicious husband, and encrypted secrets
2. **Murder at Midnight** - A poisoning at the Grandview Hotel with three suspects
3. **The Diamond Heist** - Five million in stolen gems and a master hacker's calling card
4. **The Encrypted Files** - City Hall corruption, dead journalists, and dangerous truths
5. **The Vanishing Act** - A missing computer whiz and a digital trail gone cold
6. **Free Investigation** - Bring your own case to the Private EYE

### Technical Challenges

Each mystery includes technical puzzles:
- **Cryptography**: Base64, ROT13, Caesar ciphers, XOR encryption
- **Network Forensics**: IP address analysis, MAC addresses, packet inspection
- **Digital Evidence**: Browser history, SSH logs, Git commits, metadata analysis
- **Code Breaking**: Binary messages, hex decoding, substitution ciphers
- **Security Analysis**: SQL injection traces, privilege escalation, access logs

### Modern Features
- **Noir-Themed UI**: Sleek metallic gray design with film grain effect
- **Case File Export**: Download your investigation as a formatted Word document
- **Persistent Memory**: Conversation history saved via Durable Objects
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

Built entirely on Cloudflare's edge infrastructure:

- **LLM**: Workers AI with Llama 3.3 70B Instruct model
- **Workflow**: Cloudflare Workers for API orchestration
- **User Input**: Film noir-themed web interface
- **Memory/State**: Durable Objects for case file persistence
- **Hosting**: Cloudflare Pages for frontend delivery
- **Assets**: Static asset serving through Workers

## 📁 Project Structure

```
cf_ai_chatbot/
├── src/
│   ├── index.ts          # Worker with mystery-specific AI prompts
│   └── ChatRoom.ts       # Durable Object for case persistence
├── public/
│   ├── index.html        # Noir-themed detective interface
│   ├── styles.css        # Film noir styling with metallic grays
│   └── app.js            # Mystery selection and case export logic
├── wrangler.toml         # Cloudflare configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Local Development

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

## 🎯 How to Use

1. **Select a Mystery**: Click on one of the mystery cards to begin your investigation
2. **Read the Narration**: Each case starts with a noir-style introduction
3. **Investigate**: Chat with the detective AI to gather clues and solve puzzles
4. **Solve Challenges**: Decode encrypted messages, analyze evidence, crack codes
5. **Export Case File**: Download your complete investigation as a Word document

## 🔧 API Endpoints

### POST /api/chat
Send a message and receive detective response.

**Request:**
```json
{
  "message": "What's the first clue?",
  "conversationId": "case_123456",
  "mystery": "murder"
}
```

**Response:**
```json
{
  "response": "Listen up, ace. Found this encrypted message on the victim's phone: 'Zrrg zr ng gur ubgry.' Looks like ROT13 to me. What's it say?",
  "conversationId": "case_123456"
}
```

### POST /api/reset
Start a new case.

### POST /api/history
Retrieve case history.

## 🎨 Visual Design

The interface features:
- **Film Noir Aesthetic**: Dark grays, metallic accents, art deco influences
- **Scanline Effect**: Subtle horizontal lines for vintage CRT feel
- **Film Grain**: Animated texture overlay for authenticity
- **Metallic Gradients**: Sleek chrome-like buttons and panels
- **Typewriter Font**: Courier Prime for that detective report feel
- **Vintage Typography**: Bebas Neue for headers

## 🧩 Technical Challenges Examples

### The Dame in Distress
- Decode Base64: `VGhlIG1vbmV5IGlzIGF0IHRoZSBkb2Nrcw==` → "The money is at the docks"
- Crack Caesar cipher (shift of 3)
- Analyze suspicious IP addresses
- Decode binary messages: `01001000 01000101 01001100 01010000` → HELP

### Murder at Midnight
- Spot timestamp discrepancies in security footage
- Analyze hotel WiFi logs for device connections
- Decrypt ROT13 messages
- Decode hex-encoded deleted text messages
- Match phone records to suspects

### The Diamond Heist
- Identify SQL injection attempts in security logs
- Analyze suspicious network packet sizes
- Trace IP through VPN chain
- Find backdoors in Git commit history
- Detect privilege escalation in access logs

### The Encrypted Files
- Extract hidden messages from image steganography
- Analyze blockchain transaction patterns
- Crack XOR ciphers with context clues
- Verify MD5 hash integrity
- Parse EXIF metadata for coordinates

### The Vanishing Act
- Analyze browser history for clues
- Decode keyboard cipher messages
- Extract GPS coordinates from photo metadata
- Recover deleted ZIP files from hex dumps
- Trace TOR exit nodes

## 📤 Case File Export

Export your investigation to a professionally formatted Word document including:
- Case title and timestamp
- Full conversation history
- Your moves and detective notes
- Narration and evidence
- Professional noir styling

## 🚢 Deployment

### Deploy to Cloudflare

1. Deploy the Worker:
```bash
npm run deploy
```

2. Access via your `workers.dev` subdomain

3. (Optional) Set up custom domain in Cloudflare dashboard

## ⚙️ Configuration

### Mystery System Prompts

Each mystery has a dedicated system prompt in `src/index.ts` that includes:
- Character personality guidelines
- Case-specific details and suspects
- Technical challenges to present
- Clues and red herrings
- Solution guidelines

### Context Window

Default: Last 15 messages (adjustable in `src/index.ts`)

### Max Tokens

Default: 512 tokens per response (balances detail with speed)

## 🎭 Character Voice

The detective AI maintains authentic 1940s noir style:
- Period-appropriate slang ("sweetheart", "pal", "gumshoe")
- Cynical but justice-driven worldview
- Metaphors involving rain, shadows, cigarettes
- Short, punchy sentences
- Hard-boiled observations
- Never breaks character

## 🔒 Security Note

This is a demonstration project. For production use, consider adding:
- User authentication
- Rate limiting
- Input sanitization
- CSRF protection
- Content Security Policy

## 📊 Performance

- **Response time**: 1-3 seconds (LLM inference)
- **Context window**: 15 messages
- **Concurrent users**: Scales with Cloudflare's edge network
- **Case persistence**: Unlimited via Durable Objects

## 🎓 Educational Value

Great for learning:
- Cryptography basics (Caesar, ROT13, Base64, XOR)
- Network security fundamentals
- Digital forensics concepts
- Log file analysis
- Metadata interpretation
- Interactive storytelling with AI

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Model | Llama 3.3 70B (Workers AI) |
| Backend | Cloudflare Workers (TypeScript) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Storage | Durable Objects |
| Hosting | Cloudflare Pages/Workers |
| Fonts | Bebas Neue, Courier Prime |

## 📝 License

MIT

## 👤 Author

Built to demonstrate Cloudflare's AI capabilities with a noir twist. The city never sleeps, and neither does this chatbot.

---

*Remember, kid - in this city, the truth is always hiding in the shadows. You just gotta know where to look.*

🕵️ **CASE CLOSED**
