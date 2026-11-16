// The three outside models the content pipeline consults, and how to reach them. Keys come from
// the environment, from an ignored .env.content.local, or from the file named by
// CONTENT_KEYS_FILE (docs/content-pipeline.md). Keys are never printed.
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

export type Provider = 'openai' | 'gemini' | 'xai';

/** One model per company, so no reviewer shares the author's blind spots or another's. */
export const MODELS: Record<Provider, string> = {
  gemini: process.env.CONTENT_MODEL_GEMINI ?? 'gemini-pro-latest',
  openai: process.env.CONTENT_MODEL_OPENAI ?? 'gpt-6.1-sol',
  xai: process.env.CONTENT_MODEL_XAI ?? 'grok-4.7',
};

const fileKeys = [process.env.CONTENT_KEYS_FILE, '.env.content.local']
  .filter((path): path is string => Boolean(path && existsSync(path)))
  .map((path) => parseEnv(readFileSync(path, 'utf8')));
/** The first name that has a value, the environment before the key files. */
const key = (...names: string[]) =>
  names
    .map((name) => process.env[name] ?? fileKeys.find((file) => file[name])?.[name])
    .find(Boolean);

export function apiKey(provider: Provider) {
  const found =
    provider === 'gemini'
      ? key('GEMINI_API_KEY', 'GOOGLE_API_KEY', 'NANO_BANANA_API_KEY')
      : provider === 'openai'
        ? key('OPENAI_SECRET_KEY', 'OPENAI_API_KEY')
        : key('XAI_API_KEY');
  if (!found) throw new Error(`No ${provider} key. See "Set up once" in docs/content-pipeline.md.`);
  return found;
}

/** Sends one request and returns the streamed reply's text. A stream keeps a slow connection
 *  alive while a model thinks for minutes; a plain request is dropped after five. */
async function stream(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  pick: (event: any) => string | undefined,
) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(1_200_000),
    });
    // One retry for a busy or failing provider; anything else is a real error.
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) continue;
    if (!response.ok || !response.body)
      throw new Error(`${response.status} ${(await response.text()).slice(0, 300)}`);
    let text = '';
    let pending = '';
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
      const lines = (pending + chunk).split('\n');
      pending = lines.pop() ?? '';
      for (const line of lines) {
        const data = line.startsWith('data:') ? line.slice(5).trim() : '';
        if (data && data !== '[DONE]') text += pick(JSON.parse(data)) ?? '';
      }
    }
    return text;
  }
}

/** Asks one provider's model for a JSON reply and parses it. */
export async function askJson<T>(provider: Provider, system: string, user: string): Promise<T> {
  const model = MODELS[provider];
  const text =
    provider === 'gemini'
      ? await stream(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
          { 'x-goog-api-key': apiKey(provider) },
          {
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: user }] }],
            generationConfig: { responseMimeType: 'application/json' },
          },
          (event) =>
            event.candidates?.[0]?.content?.parts
              ?.map((part: { text?: string }) => part.text)
              .join(''),
        )
      : await stream(
          `${provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.x.ai/v1'}/chat/completions`,
          { Authorization: `Bearer ${apiKey(provider)}` },
          {
            model,
            stream: true,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
            response_format: { type: 'json_object' },
          },
          (event) => event.choices?.[0]?.delta?.content,
        );
  return JSON.parse(text) as T;
}
