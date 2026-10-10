const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const LLM_MODEL = process.env.OLLAMA_LLM_MODEL || "qwen2.5:7b";
const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || "llava:7b";

export function ollamaConfigured() {
  return Boolean(OLLAMA_HOST);
}

async function chat(model: string, prompt: string, images?: string[]) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "user",
            content: prompt,
            ...(images?.length ? { images } : {}),
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = (await res.json()) as { message?: { content?: string } };
    return data.message?.content?.trim() || "";
  } finally {
    clearTimeout(t);
  }
}

export async function ollamaText(prompt: string): Promise<string | null> {
  try {
    return await chat(LLM_MODEL, prompt);
  } catch {
    return null;
  }
}

export async function ollamaVision(
  prompt: string,
  imageBase64OrUrls: string[],
): Promise<string | null> {
  try {
    return await chat(VISION_MODEL, prompt, imageBase64OrUrls);
  } catch {
    return null;
  }
}

export function extractJson<T>(raw: string): T | null {
  const start = raw.indexOf("{");
  const arr = raw.indexOf("[");
  const i = start === -1 ? arr : arr === -1 ? start : Math.min(start, arr);
  if (i < 0) return null;
  const endObj = raw.lastIndexOf("}");
  const endArr = raw.lastIndexOf("]");
  const end = Math.max(endObj, endArr);
  if (end <= i) return null;
  try {
    return JSON.parse(raw.slice(i, end + 1)) as T;
  } catch {
    return null;
  }
}
