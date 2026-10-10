// Records lesson lines as speech, once, for the app's voice clips. Admin only: called by
// scripts/generate-lesson-audio.ts with LESSON_AUDIO_TOKEN, never by the app.
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'lesson-audio';
const VOICES = new Set([
  'alloy',
  'ash',
  'ballad',
  'cedar',
  'coral',
  'echo',
  'marin',
  'nova',
  'onyx',
  'sage',
  'shimmer',
  'verse',
]);
const MAX_ITEMS = 8;

type Item = { key: string; text: string; voice: string; instructions: string };

const valid = (item: unknown): item is Item => {
  const value = item as Partial<Item>;
  return (
    typeof value?.key === 'string' &&
    /^[0-9a-z]{14}$/.test(value.key) &&
    typeof value.text === 'string' &&
    value.text.trim().length > 0 &&
    value.text.length <= 600 &&
    typeof value.voice === 'string' &&
    VOICES.has(value.voice) &&
    typeof value.instructions === 'string' &&
    value.instructions.length <= 1200
  );
};

Deno.serve(async (request) => {
  const token = Deno.env.get('LESSON_AUDIO_TOKEN');
  if (request.method !== 'POST' || !token || request.headers.get('x-voka-audio') !== token)
    return new Response('Unauthorized', { status: 401 });
  const openai = Deno.env.get('OPENAI_API_KEY');
  let adminKey: string | undefined;
  try {
    adminKey =
      JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}').default ??
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  } catch {
    return new Response('Invalid backend configuration', { status: 503 });
  }
  if (!openai || !adminKey) return new Response('Not configured', { status: 503 });

  let items: unknown;
  try {
    items = (await request.json())?.items;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  if (!Array.isArray(items) || items.length > MAX_ITEMS || !items.every(valid))
    return new Response('Invalid items', { status: 400 });

  const client = createClient(Deno.env.get('SUPABASE_URL')!, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const bucket = await client.storage.getBucket(BUCKET);
  if (bucket.error) {
    const created = await client.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ['audio/mpeg'],
      fileSizeLimit: '2MB',
    });
    if (created.error && !/already exists/i.test(created.error.message))
      return new Response('Storage unavailable', { status: 503 });
  }

  const results = await Promise.all(
    (items as Item[]).map(async (item) => {
      const speech = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openai}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: item.voice,
          input: item.text,
          instructions: item.instructions,
          response_format: 'mp3',
        }),
      });
      if (!speech.ok) return { key: item.key, ok: false, status: speech.status };
      const audio = new Uint8Array(await speech.arrayBuffer());
      const upload = await client.storage.from(BUCKET).upload(`${item.key}.mp3`, audio, {
        contentType: 'audio/mpeg',
        cacheControl: '31536000',
        upsert: true,
      });
      return { key: item.key, ok: !upload.error, bytes: audio.length };
    }),
  );
  return Response.json({ results });
});
