# AI Prompts Used

This document contains the prompts used during the development of the Private EYE Chatbot.

## Initial Planning

### Framework Design
**Prompt:**
```
I want to build an AI chatbot for a Cloudflare job application. Need a basic framework that uses:
- Workers AI (Llama 3.3)
- Cloudflare Workers for backend
- Durable Objects for storing conversation history
- Simple chat interface

Can you help me set up the basic structure?
```

**Purpose:** To establish the foundational architecture and understand how to integrate Cloudflare's AI services with Workers and Durable Objects.

---

## Platform Comparison

### Cloudflare vs Alternatives
**Prompt:**
```
What's the difference between deploying on Vercel and Render vs Cloudflare?
Why would I choose Cloudflare Workers over the others for this project?
```

**Purpose:** To understand the benefits of Cloudflare's edge computing platform and justify the technology choice for the application.

**Key Takeaways:**
- Cloudflare Workers run at the edge (lower latency)
- Built-in AI capabilities with Workers AI
- Durable Objects for stateful storage
- Better integration with Cloudflare's ecosystem
- Cost-effective for AI workloads

---

## Implementation Notes

The rest of the implementation involved iterative development, debugging, and feature additions based on the initial framework. The noir detective theme and mystery-solving mechanics were developed organically during the build process.
