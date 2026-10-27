// Bounded live integration checks with synthetic text turns, not learner or accent validation.
// node --env-file=.env.local --import tsx scripts/english-pilot-live.mjs
// Uses the deployed app backend; no provider secret is read or printed.
import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { getUnitCall, unitCallOpening } from '../supabase/functions/_shared/unit-calls.ts';

const base = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const apikey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
if (!base || !apikey) throw new Error('Public Supabase configuration is required.');
const endpoint = `${base}/functions/v1/realtime-session`;
const onlyCase = process.argv.find((arg) => arg.startsWith('--case='))?.slice(7);
if (onlyCase && !/^en-a1-u[123],en-(GB|US)$/.test(onlyCase))
  throw new Error('Invalid case filter.');
const directory = `artifacts/english-m3-live${onlyCase ? `/${onlyCase.replace(',', '-')}` : ''}`;
mkdirSync(directory, { recursive: true });
const report = {
  startedAt: new Date().toISOString(),
  method:
    'Live WebRTC output with synthetic text input. No human microphone, accent or learning-outcome validation.',
  unitCallSourceSha256: createHash('sha256')
    .update(readFileSync('supabase/functions/_shared/unit-calls.ts'))
    .digest('hex'),
  cases: [],
};
const save = () =>
  writeFileSync(`${directory}/results.json`, `${JSON.stringify(report, null, 2)}\n`);
const browser = await chromium.launch({
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required'],
  ...(process.env.CI ? {} : { channel: 'chrome' }),
});
const phrases = {
  1: [
    "Hi, I'm Sam. What's your name?",
    'Sorry, can you say that again?',
    'Sam. Nice to meet you. Bye.',
  ],
  2: [
    "I'm Sam. I'm from London.",
    'I live in Boston.',
    'No, I live in Boston. I work in a store. Where do you live?',
  ],
  3: ['Could I have a tea, please?', 'No, tea, please.'],
};

async function run(reference, unit) {
  const result = { reference, callId: `en-a1-u${unit}`, turns: [], checks: {}, status: 'running' };
  report.cases.push(result);
  // Each independent scenario owns and deletes its synthetic guest. Never use a real account.
  const client = createClient(base, apikey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, init) =>
        fetch(url, { ...init, signal: init?.signal ?? AbortSignal.timeout(20_000) }),
    },
  });
  let token;
  let leaseId;
  let page;
  const request = async (body) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { apikey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(`Backend ${response.status}: ${data.error ?? 'request failed'}`);
    return data;
  };
  try {
    const { data, error } = await client.auth.signInAnonymously();
    if (error || !data.session?.user.is_anonymous)
      throw new Error('Synthetic guest creation failed.');
    token = data.session.access_token;
    page = await browser.newPage();
    page.setDefaultTimeout(25_000);
    await page.goto('about:blank');
    const sdp = await page.evaluate(async () => {
      const peer = new RTCPeerConnection();
      const channel = peer.createDataChannel('oai-events');
      const state = { peer, channel, events: [], chunks: [], recorder: null };
      globalThis.pilot = state;
      channel.onmessage = ({ data }) => state.events.push(JSON.parse(data));
      peer.ontrack = async ({ streams, track }) => {
        const stream = streams[0] ?? new MediaStream([track]);
        const audio = new Audio();
        audio.srcObject = stream;
        audio.autoplay = true;
        state.audio = audio;
        await audio.play();
        // Pull the received track through a running graph. Headless Chrome can receive RTP
        // without decoding a track that has no audio sink, leaving MediaRecorder empty.
        const context = new AudioContext();
        await context.resume();
        const source = context.createMediaStreamSource(stream);
        const destination = context.createMediaStreamDestination();
        source.connect(destination);
        state.audioContext = context;
        state.audioSource = source;
        const recorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' });
        recorder.ondataavailable = ({ data }) => {
          if (data.size) state.chunks.push(data);
        };
        recorder.start(250);
        state.recorder = recorder;
      };
      // Match the app's sending audio track without opening anybody's microphone.
      const inputContext = new AudioContext();
      await inputContext.resume();
      const silent = inputContext.createMediaStreamDestination();
      const source = inputContext.createOscillator();
      const gain = inputContext.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(silent);
      source.start();
      state.inputContext = inputContext;
      state.silentSource = source;
      peer.addTrack(silent.stream.getAudioTracks()[0], silent.stream);
      await peer.setLocalDescription(await peer.createOffer());
      if (peer.iceGatheringState !== 'complete')
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('ICE timeout')), 10_000);
          peer.addEventListener('icegatheringstatechange', () => {
            if (peer.iceGatheringState === 'complete') {
              clearTimeout(timeout);
              resolve();
            }
          });
        });
      return peer.localDescription.sdp;
    });
    const connection = await request({
      track: 'EN',
      goal: 'everyday',
      englishGoal: 'meetings',
      englishReference: reference,
      practice: 'conversation',
      callId: result.callId,
      sdp,
    });
    leaseId = connection.session?.id;
    if (!leaseId || !connection.transport?.sdp)
      throw new Error('Missing session lease or transport.');
    await page.evaluate(async (answer) => {
      await globalThis.pilot.peer.setRemoteDescription({ type: 'answer', sdp: answer });
    }, connection.transport.sdp);
    await page.waitForFunction(() => globalThis.pilot.channel.readyState === 'open', {
      timeout: 20_000,
    });
    await page.waitForFunction(
      () => globalThis.pilot.events.some((event) => event.type === 'session.created'),
      { timeout: 20_000 },
    );
    const expectedModel =
      reference === 'en-US'
        ? 'American English as your speaking model'
        : 'British English as your speaking model';
    await page
      .waitForFunction(
        ({ expectedModel, goal }) => {
          const session = globalThis.pilot.events
            .filter((event) => ['session.created', 'session.updated'].includes(event.type))
            .at(-1)?.session;
          return (
            session?.instructions?.includes(expectedModel) && session.instructions.includes(goal)
          );
        },
        { expectedModel, goal: getUnitCall(result.callId).learnerGoal },
        { timeout: 10_000 },
      )
      .catch(() => undefined);
    const sessionEvents = await page.evaluate(() =>
      globalThis.pilot.events
        .filter((event) => ['session.created', 'session.updated'].includes(event.type))
        .map((event) => ({ type: event.type, instructions: event.session.instructions })),
    );
    const instructions = sessionEvents.at(-1)?.instructions ?? '';
    result.checks.selectedModel = instructions.includes(
      reference === 'en-US'
        ? 'American English as your speaking model'
        : 'British English as your speaking model',
    );
    result.checks.unitScope = instructions.includes(getUnitCall(result.callId).learnerGoal);
    if (!result.checks.selectedModel || !result.checks.unitScope) {
      result.sessionEvents = sessionEvents;
      throw new Error('Deployed session instructions do not match the selected pilot.');
    }

    const respond = async (text, opening) => {
      const offset = await page.evaluate(
        ({ text, opening }) => {
          const { channel, events } = globalThis.pilot;
          const offset = events.length;
          if (text)
            channel.send(
              JSON.stringify({
                type: 'conversation.item.create',
                item: {
                  type: 'message',
                  role: 'user',
                  content: [{ type: 'input_text', text }],
                },
              }),
            );
          channel.send(
            JSON.stringify({
              type: 'response.create',
              ...(opening
                ? { response: { instructions: opening, output_modalities: ['audio'] } }
                : {}),
            }),
          );
          return offset;
        },
        { text, opening },
      );
      await page.waitForFunction(
        (offset) =>
          globalThis.pilot.events
            .slice(offset)
            .some((event) => event.type === 'response.done' || event.type === 'error'),
        offset,
        { timeout: 35_000 },
      );
      const response = await page.evaluate((offset) => {
        const events = globalThis.pilot.events.slice(offset);
        const error = events.find((event) => event.type === 'error');
        if (error) throw new Error(`Realtime error: ${error.error?.code ?? 'unknown'}`);
        const done = events.find((event) => event.type === 'response.done');
        if (done.response.status !== 'completed') throw new Error('Incomplete model response');
        return done.response.output
          .flatMap((item) => item.content ?? [])
          .map((item) => item.transcript ?? item.text ?? '')
          .join(' ');
      }, offset);
      if (!response.trim()) throw new Error('No assistant transcript.');
      if (text) result.turns.push({ role: 'user', text });
      result.turns.push({ role: 'assistant', text: response });
      // Wait for received audio to drain before the next synthetic turn.
      await page.waitForFunction(
        (offset) =>
          globalThis.pilot.events
            .slice(offset)
            .some((event) => event.type === 'output_audio_buffer.stopped'),
        offset,
        { timeout: 35_000 },
      );
    };
    await respond(undefined, unitCallOpening(getUnitCall(result.callId), reference));
    const inputs = [
      ...phrases[unit],
      ...(unit === 3
        ? [reference === 'en-US' ? 'To take away, please.' : 'To go, please.', 'Thanks. Bye.']
        : []),
    ];
    for (const text of inputs) await respond(text);
    const recording = await page.evaluate(async () => {
      const { recorder, chunks, peer } = globalThis.pilot;
      if (!recorder) throw new Error('No remote audio stream');
      await new Promise((resolve) => {
        recorder.onstop = resolve;
        recorder.stop();
      });
      const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
      const decoded = await new OfflineAudioContext(1, 1, 24_000).decodeAudioData(
        bytes.buffer.slice(0),
      );
      const samples = decoded.getChannelData(0);
      let peak = 0;
      for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
      const stats = [...(await peer.getStats()).values()].find(
        (entry) => entry.type === 'inbound-rtp' && entry.kind === 'audio',
      );
      let binary = '';
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return {
        base64: btoa(binary),
        bytesReceived: stats?.bytesReceived ?? 0,
        duration: decoded.duration,
        peak,
        totalAudioEnergy: stats?.totalAudioEnergy ?? 0,
        totalSamplesReceived: stats?.totalSamplesReceived ?? 0,
      };
    });
    result.checks.audioBytesReceived = recording.bytesReceived;
    result.checks.recordingDuration = recording.duration;
    result.checks.recordingPeak = recording.peak;
    result.checks.totalAudioEnergy = recording.totalAudioEnergy;
    result.checks.totalSamplesReceived = recording.totalSamplesReceived;
    if (recording.bytesReceived <= 0) throw new Error('No incoming audio bytes');
    if (recording.peak < 0.01 || recording.duration < 1)
      throw new Error('Captured output has no usable audio signal.');
    result.recording = `${result.callId}-${reference}.webm`;
    const recordedBytes = Buffer.from(recording.base64, 'base64');
    if (recordedBytes.length < 1000) throw new Error('Remote recording is empty or incomplete.');
    result.checks.recordingBytes = recordedBytes.length;
    writeFileSync(`${directory}/${result.recording}`, recordedBytes);
    await page.evaluate(() => globalThis.pilot.peer.close());
    await request({ action: 'end', leaseId });
    leaseId = undefined;
    result.checks.serverHangup = true;
    const reviewed = await request({
      action: 'review',
      track: 'EN',
      callId: result.callId,
      turns: result.turns,
    });
    result.review = reviewed.review;
    if (!result.review || !Array.isArray(result.review.corrections))
      throw new Error('Invalid after-call review');
    result.checks.falseCorrectionCount = result.review.corrections.length;
    result.status = result.review.corrections.length
      ? 'needs editorial inspection'
      : 'integration passed; human listening pending';
  } catch (error) {
    result.status = 'failed';
    result.error = error.message;
    process.exitCode = 1;
  } finally {
    if (leaseId) {
      try {
        await request({ action: 'end', leaseId });
        result.checks.serverHangup = true;
      } catch {
        result.checks.serverHangup = false;
        process.exitCode = 1;
      }
    }
    if (page) await page.close();
    if (token) {
      const deleted = await fetch(`${base}/functions/v1/delete-account`, {
        method: 'POST',
        headers: { apikey, Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(20_000),
      }).catch(() => null);
      result.checks.syntheticGuestDeleted = Boolean(deleted?.ok);
      if (!deleted?.ok) {
        result.status = 'cleanup failed';
        process.exitCode = 1;
      }
    }
    await client.auth.signOut({ scope: 'local' });
    save();
    console.log(`${result.callId} ${reference}: ${result.status}`);
  }
  return result.status !== 'failed' && result.status !== 'cleanup failed';
}

try {
  for (const reference of ['en-GB', 'en-US']) {
    for (const unit of [1, 2, 3]) {
      if (onlyCase && onlyCase !== `en-a1-u${unit},${reference}`) continue;
      if (!(await run(reference, unit)))
        throw new Error('Stopped after a failed case; inspect the report before retrying.');
    }
  }
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  save();
}
