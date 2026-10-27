import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import type { StepLesson } from '../src/features/foundations/types';
import { contentVersion } from '../src/features/foundations/progress';

/** An internal, standalone reviewer tool. It never submits findings to a server. */
export function buildEnglishReviewPage(lessons: StepLesson[], rows: (string | number)[][]) {
  const inventoryHash = createHash('sha256')
    .update(readFileSync('docs/english-a1-pilot-audio.csv'))
    .digest('hex');
  const auditPath = 'docs/english-m3-audio-audit.json';
  const audit = existsSync(auditPath)
    ? (JSON.parse(readFileSync(auditPath, 'utf8')) as {
        inventory_sha256: string;
        clips: { key: string; sha256?: string }[];
      })
    : undefined;
  const hashes = new Map(
    audit?.inventory_sha256 === inventoryHash
      ? audit.clips.map((clip) => [clip.key, clip.sha256])
      : [],
  );
  const seen = new Set<string>();
  const audio = rows.slice(1).flatMap((row) => {
    const key = String(row[7]);
    if (seen.has(key)) return [];
    seen.add(key);
    return [
      {
        key,
        speaker: String(row[3]),
        variety: String(row[4]),
        script: String(row[6]),
        url: String(row[9]),
        sha256: hashes.get(key) ?? null,
      },
    ];
  });
  const callSourceHash = createHash('sha256')
    .update(readFileSync('supabase/functions/_shared/unit-calls.ts'))
    .digest('hex');
  const livePath = 'artifacts/english-m3-live/results.json';
  const liveRun = existsSync(livePath) ? JSON.parse(readFileSync(livePath, 'utf8')) : undefined;
  const liveCalls =
    liveRun?.unitCallSourceSha256 === callSourceHash && liveRun?.finishedAt
      ? liveRun.cases
          .filter(
            (item: { checks: { recordingBytes?: number }; recording?: string }) =>
              item.checks.recordingBytes &&
              item.recording &&
              existsSync(`artifacts/english-m3-live/${item.recording}`),
          )
          .map(
            (item: {
              callId: string;
              reference: string;
              recording: string;
              turns: unknown[];
              review: unknown;
            }) => ({
              ...item,
              sourceHash: callSourceHash,
              url: `../artifacts/english-m3-live/${item.recording}`,
              recordingHash: createHash('sha256')
                .update(readFileSync(`artifacts/english-m3-live/${item.recording}`))
                .digest('hex'),
            }),
          )
      : [];
  const packet = {
    schema: 1,
    lessons: lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      unit: lesson.unit.number,
      version: contentVersion(lesson),
      outcome: lesson.outcome,
      steps: lesson.steps,
    })),
    audio,
    liveCalls,
  };
  const snapshot = createHash('sha256').update(JSON.stringify(packet)).digest('hex');
  const payload = JSON.stringify({ ...packet, snapshot }).replace(/</g, '\\u003c');
  const client = readFileSync('scripts/english-review-client.js', 'utf8');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vokeno English pilot review</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f3efe5;color:#191815;font:17px/1.55 system-ui,sans-serif}
main{max-width:960px;margin:auto;padding:24px}h1{font-size:32px;line-height:1.2}h2{font-size:24px}h3{font-size:20px}
section,details{background:#fff;border:1px solid #ddd8ce;border-radius:16px;padding:20px;margin:18px 0}
summary{font-weight:700;cursor:pointer}label{display:block;margin-top:12px}input,select,textarea,button{font:inherit;max-width:100%;padding:10px;border-radius:8px;border:1px solid #8c877d}
textarea{width:100%;min-height:78px}button{background:#191815;color:white;cursor:pointer;margin:12px 8px 0 0}button:disabled{opacity:.5;cursor:default}
a{color:#8a4100}audio{width:100%;margin:12px 0}small,.meta{color:#5e5a53}.script{white-space:pre-wrap;border-left:3px solid #ef7518;padding-left:14px}
.decision{border-top:1px solid #ddd8ce;margin-top:18px}#status{padding:12px;background:#fff1db}#progress{font-weight:600}select:focus,button:focus,textarea:focus,input:focus{outline:3px solid #aa4c00;outline-offset:2px}
@media(max-width:500px){main{padding:14px}section,details{padding:14px}h1{font-size:28px}}
</style></head><body><main>
<h1>English A1 pilot review</h1>
<p>Internal review of three starter units. These findings do not certify A1 or establish native fluency. Review the language and recordings separately.</p>
<p>Use a reviewer code, not a learner's name. Findings stay in this browser until you export them. Audio loads from Vokeno's public recording store only when played. Export regularly; browser storage can be cleared.</p>
<section><h2>Your review</h2>
<label>Reviewer code <input id="reviewer" maxlength="60" autocomplete="off" placeholder="For example, UK-01"></label>
<label for="role">Review role</label><select id="role"><option value="">Choose a role</option><option>American English reviewer</option><option>British English reviewer</option><option>English teacher</option><option>Technical reviewer</option></select>
<button id="begin">Start or resume this review</button><button id="export" disabled>Export findings</button>
<p id="status" role="status">Choose your code and role. Use a separate code for a separate reviewer.</p>
<p id="progress">No human approval is pre-filled.</p>
<p><a href="english-m3-participant-guide.md">Beginner observation and delayed tasks</a> · <a href="english-a1-pilot-review.md">Review criteria and release gate</a></p>
</section>
<section><h2>Decisions</h2><p><strong>No issue found</strong> means you checked this item. <strong>Change needed</strong> needs an explanation and severity. A blocker prevents use or teaches/marks the wrong meaning. A major issue materially confuses or misleads; a minor issue is an editorial improvement. Unchecked items remain pending. The app may still have issues outside this packet.</p>
<p>For scripts, check prerequisites, context, valid alternatives and the answer rationale. For audio, listen for words, endings, stress, variety, speaker identity and naturalness. Listen on headphones and a phone speaker. Mark an item only after checking it.</p></section>
<div id="lessons"></div>
<section><h2>Recordings</h2><label for="variety">Show variety</label><select id="variety"><option value="all">All recordings</option><option value="en-GB">British models</option><option value="en-US">American models</option></select><p>Named characters keep their own variety. Both reviewers should also check understanding of the other variety. A file hash identifies the audited recording; native quality has not been approved.</p><div id="audio"></div></section>
<section><h2>Live coach samples</h2><p>These calls use synthetic text replies and generated spoken output. They are not human microphone or learning tests. Check the voice, turn length, task scope and feedback. Recordings are included in the review bundle; extract the whole bundle before opening this page.</p><div id="live"></div></section>
<p class="meta">Export includes the packet fingerprint and individual lesson versions. Findings from an older version are retained but do not count as current review.</p>
</main><script id="packet" type="application/json">${payload}</script><script>${client}</script></body></html>\n`;
}
