import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const GROQ_CHAT_MODEL = "llama-3.3-70b-versatile";
export const GROQ_EMBED_MODEL = "nomic-embed-text-v1.5"; // via Groq if available

// ── Chat completion ───────────────────────────────────────────────────────────
export async function groqChat(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.3
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: GROQ_CHAT_MODEL,
    temperature,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

// ── Embedding (via @langchain/groq or fallback) ───────────────────────────────
// Groq doesn't expose a native embedding endpoint yet.
// We use a lightweight deterministic hash-based mock for local dev,
// and swap to a real embedding model in production.
export function mockEmbed(text: string, dim = 384): number[] {
  const vec = new Array(dim).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % dim] += text.charCodeAt(i) / 1000;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export { groq };
