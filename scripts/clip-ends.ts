// Finds where the voice actually stops in each recorded clip. The recordings end with up to a
// second of silence; the app stops a clip here instead, so the play button returns at once and
// a scene's next speaker follows naturally. Decoding uses the Chromium that Playwright installs.
import { chromium } from '@playwright/test';

/** Quieter than this counts as silence (full scale is 1). */
const THRESHOLD = 0.01;
/** Kept after the last loud sample, so soft endings like -s or -t are not cut. */
const MARGIN = 0.15;
const PARALLEL = 8;

/** A clip whose voice stops this early has no voice at all: the recording failed. */
export const SILENT = MARGIN + 0.05;

export async function measureEnds(urls: Map<string, string>, onDone?: (count: number) => void) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const ends = new Map<string, number>();
  const queue = [...urls];
  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const [key, url] = item;
      const response = await fetch(url);
      if (!response.ok) continue;
      const audio = Buffer.from(await response.arrayBuffer()).toString('base64');
      const end = await page.evaluate(
        async ({ audio, threshold, margin }) => {
          const bytes = Uint8Array.from(atob(audio), (char) => char.charCodeAt(0));
          const buffer = await new OfflineAudioContext(1, 1, 24_000).decodeAudioData(bytes.buffer);
          const samples = buffer.getChannelData(0);
          let last = samples.length - 1;
          while (last > 0 && Math.abs(samples[last]) < threshold) last--;
          return Math.min(buffer.duration, last / buffer.sampleRate + margin);
        },
        { audio, threshold: THRESHOLD, margin: MARGIN },
      );
      ends.set(key, Math.round(end * 100) / 100);
      onDone?.(ends.size);
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  await browser.close();
  return ends;
}
