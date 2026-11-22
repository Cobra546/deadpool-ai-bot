# Deadpool AI

A mobile-friendly AI chat app with two interchangeable engines:

- **Cloud API:** calls a server-side OpenAI-compatible endpoint. The API key stays in Vercel environment variables and is never sent to the browser.
- **Local model:** connects directly from your browser to Ollama running on your own computer. The model runs locally; your computer must stay on.

## Cloud setup (Vercel)

1. Import this GitHub repository into Vercel.
2. Add these Environment Variables in Vercel Project Settings:
   - `AI_API_KEY` — your provider API key (for example, a Groq API key).
   - `AI_API_BASE_URL` — optional; defaults to `https://api.groq.com/openai/v1`.
   - `AI_MODEL` — optional; defaults to `llama-3.3-70b-versatile`.
3. Deploy. The Cloud API option uses the `/api/chat` serverless function.

Do not put API keys in `index.html`, `script.js`, or any public GitHub file.

## Local model setup (Ollama)

1. Install Ollama on your computer from https://ollama.com.
2. In a terminal, download a model: `ollama pull qwen2.5:3b`.
3. Start Ollama: `ollama serve` (if it is not already running).
4. Allow the browser origin of your deployed app in Ollama's CORS configuration using the `OLLAMA_ORIGINS` environment variable. For a local development page, allow its local origin; for a deployed page, allow that exact HTTPS origin. Avoid using a wildcard on a public computer.
5. In Deadpool AI, select **Local model (Ollama)**.

The local option connects to `http://localhost:11434` and uses `qwen2.5:3b` by default. This address refers to the computer running the browser, not a remote server. The local model does not run on GitHub Pages or Vercel.

## Development and deployment notes

- The frontend is static HTML/CSS/JavaScript.
- The cloud backend is a Vercel serverless function in `api/chat.js`.
- GitHub Pages can host the static interface, but it cannot run this API function. Use Vercel for the cloud engine.
- Chat history is saved in the browser's local storage on that device.
- This project is an AI application using existing models; it does not train a foundation model from scratch.

Built for Usman.
