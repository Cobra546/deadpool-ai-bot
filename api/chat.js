export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = (process.env.AI_API_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "llama-3.3-70b-versatile";
  if (!apiKey) return res.status(503).json({ error: "Cloud engine is not configured. Add AI_API_KEY in your Vercel environment variables." });
  try {
    const body = req.body || {};
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 22) {
      return res.status(400).json({ error: "Please send a valid conversation (up to 22 messages)." });
    }
    const messages = body.messages.map(m => {
      if (!m || !["system", "user", "assistant"].includes(m.role) || typeof m.content !== "string") throw new Error("Invalid message format.");
      return { role: m.role, content: m.content.slice(0, 12000) };
    });
    const upstream = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1200 })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || "AI provider rejected the request." });
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string") return res.status(502).json({ error: "The AI provider returned an empty response." });
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Unable to process request." });
  }
}