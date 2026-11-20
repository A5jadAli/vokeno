import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

import {
  MAX_LESSONS,
  STANDARD,
  addLessons,
  countTests,
  heardByMost,
  outsideContent,
  knownBefore,
  renderUnit,
  sessionMetrics,
  taughtBefore,
  unitIds,
  unitProblems,
  unitSessions,
  upheldBy,
} from '../scripts/content/lib';
import { nextJob, parseQueue, withStatus } from '../scripts/content/queue';

/**
 * Units written before the content standard (15 November 2026). They are live and miss it; the
 * harness removes each one when it is repaired. Nothing may ever be added: a new unit meets the
 * standard.
 */
const LEGACY = new Set(JSON.parse(readFileSync('scripts/content/legacy.json', 'utf8')) as string[]);

describe('the content standard', () => {
  it('holds every unit outside the legacy list to the standard', () => {
    const misses = unitIds()
      .filter((id) => !LEGACY.has(id))
      .flatMap((id) => unitProblems(unitSessions(id)));
    expect(misses).toEqual([]);
  });

  it('keeps the legacy list honest: every entry exists and still misses', () => {
    for (const id of LEGACY)
      expect([id, unitProblems(unitSessions(id)).length > 0]).toEqual([id, true]);
  });

  // These tests build their own bad sessions from a real one, so repairing a live unit never
  // breaks them.
  const [base] = unitSessions('es-a1-u6');
  const teach = (count: number) => ({
    kind: 'teach' as const,
    title: 'Extra',
    items: Array.from({ length: count }, (_, index) => ({
      target: `palabra${index}`,
      meaning: `word ${index}`,
    })),
  });
  const choose = {
    kind: 'choose' as const,
    prompt: 'Pick one.',
    options: ['sí', 'no'],
    answer: 0,
    explanation: 'Because.',
  };

  it('measures a session: new items, the practice mix and what comes back', () => {
    const metrics = sessionMetrics(base);
    const marked = base.steps.filter((step) =>
      ['choose', 'build', 'type', 'match', 'form'].includes(step.kind),
    );
    expect(metrics.marked).toBe(marked.length);
    expect(metrics.chooseShare).toBe(
      marked.filter((step) => step.kind === 'choose').length / marked.length,
    );
    expect(sessionMetrics({ ...base, steps: [...base.steps, teach(3)] }).newItems).toBe(
      metrics.newItems + 3,
    );
    // Unit 6 follows five units, so earlier words come back in it.
    expect(metrics.recycled).toBeGreaterThanOrEqual(STANDARD.minRecycled);
  });

  it('names each miss with its session and the limit', () => {
    const heavy = { ...base, steps: [...base.steps, teach(9), choose, choose, choose, choose] };
    const problems = unitProblems([heavy]);
    expect(problems).toEqual(
      expect.arrayContaining([
        `${base.id}: teaches ${sessionMetrics(heavy).newItems} new items (limit 8)`,
        `${base.id}: 4 choice step(s) with fewer than 3 options`,
        expect.stringMatching(/% of marked steps are multiple choice \(limit 50%\)$/),
      ]),
    );
    expect(unitProblems(unitSessions('no-such-unit'))).toEqual(['No such unit on a course path.']);
  });

  it('asks nothing of the first unit of a course about earlier words', () => {
    const [first] = unitSessions('de-a1-u1');
    expect(taughtBefore(first)).toEqual([]);
    expect(unitProblems(unitSessions('de-a1-u1')).join(' ')).not.toMatch(/earlier-taught/);
  });

  it('lets a checkpoint test without teaching', () => {
    expect(unitProblems(unitSessions('es-a1-cp1'))).toEqual([]);
  });
});

describe('the review script for a unit', () => {
  const script = renderUnit(unitSessions('es-a1-u6'));

  it('gives every step a reference and shows the answer key', () => {
    expect(script).toMatch(/^ES A1 · Unit 6: /);
    expect(script).toContain('[1.1] Scene: ');
    expect(script).toMatch(/\[\d\.\d+\] Type: .+\n(.+\n)*? {2}Accepted: "/);
    expect(script).toMatch(/\[\d\.\d+\] Choose: .+\n(.+\n)*? {2}Options: ".+\. Key: "/);
  });

  it('includes the retake version of a checkpoint under its own references', () => {
    expect(renderUnit(unitSessions('es-a1-cp1'))).toMatch(/\[1R\.1\] /);
  });

  it('tells reviewers what was taught earlier, rule tables included', () => {
    const [first] = unitSessions('es-a1-u6');
    expect(taughtBefore(first)).toContain('mi hermana');
    expect(taughtBefore(first)).not.toContain('noventa');
    expect(knownBefore(first)).toContain('noventa');
  });
});

describe('the arbiter', () => {
  const vote = (n: number, verdict: 'uphold' | 'dismiss') => ({ n, verdict, reason: '' });

  it('upholds a finding only when two judges do', () => {
    const ballots = [
      [vote(1, 'uphold'), vote(2, 'uphold'), vote(3, 'dismiss')],
      [vote(1, 'uphold'), vote(2, 'dismiss'), vote(3, 'dismiss')],
      [vote(1, 'dismiss'), vote(2, 'dismiss')],
    ];
    expect(upheldBy(3, ballots)).toEqual([1]);
    // One judge alone never carries a finding, and a missing verdict is not an uphold.
    expect(upheldBy(3, ballots.slice(0, 1))).toEqual([]);
    expect(upheldBy(0, ballots)).toEqual([]);
  });
});

describe('the content queue', () => {
  const backlog = readFileSync('docs/content-backlog.md', 'utf8');
  const queue = parseQueue(backlog);

  it('reads every row: unique jobs, numbered in order, a repair only for a unit that exists', () => {
    expect(queue.length).toBeGreaterThan(10);
    expect(queue.map((job) => job.n)).toEqual(queue.map((_, index) => index + 1));
    expect(new Set(queue.map((job) => job.id)).size).toBe(queue.length);
    for (const job of queue.filter((item) => item.kind === 'repair'))
      expect([job.id, unitSessions(job.id).length > 0]).toEqual([job.id, true]);
  });

  it('never calls a job done that is not: a done unit is on its course path, a done repair is off the legacy list', () => {
    const written = new Set(unitIds());
    for (const job of queue.filter((item) => item.status !== 'todo'))
      expect([job.id, job.kind === 'repair' ? !LEGACY.has(job.id) : written.has(job.id)]).toEqual([
        job.id,
        true,
      ]);
  });

  it('refuses a row it cannot read', () => {
    expect(() => parseQueue('## Queue\n| 1 | es-a1-u7 | unit | brief | todo |')).toThrow(
      /Cannot read queue row 1/,
    );
    expect(() => parseQueue('## Queue\n| 1 | `es-a1-u7` | unit | brief | soon |')).toThrow();
    expect(() => parseQueue('no queue here')).toThrow(/no "## Queue"/);
  });

  it('changes one status cell and nothing else', () => {
    const job = queue.find((item) => item.status === 'todo')!;
    const changed = withStatus(backlog, job.id, 'done (2026-12-01)');
    expect(parseQueue(changed).find((item) => item.id === job.id)?.status).toBe(
      'done (2026-12-01)',
    );
    const after = changed.split('\n');
    expect(backlog.split('\n').filter((line, index) => line !== after[index])).toHaveLength(1);
    expect(() => withStatus(backlog, 'no-such-job', 'todo')).toThrow(/No queue row/);
  });

  it('takes the first job that is not done, and never builds on a blocked unit', () => {
    const jobs = [
      { n: 1, id: 'es-a1-u6', kind: 'repair', brief: '', status: 'done (2026-11-15)' },
      { n: 2, id: 'es-a1-u7', kind: 'unit', brief: '', status: 'todo' },
      { n: 3, id: 'de-a1-u1', kind: 'repair', brief: '', status: 'todo' },
      { n: 4, id: 'es-a1-u8', kind: 'unit', brief: '', status: 'todo' },
      { n: 5, id: 'de-a1-u2', kind: 'repair', brief: '', status: 'todo' },
    ] as const;
    expect(nextJob(jobs, new Set())?.id).toBe('es-a1-u7');
    // Unit 8 builds on the blocked Unit 7, so the German repairs go ahead instead.
    expect(nextJob(jobs, new Set(['es-a1-u7']))?.id).toBe('de-a1-u1');
    expect(nextJob(jobs, new Set(['es-a1-u7', 'de-a1-u1']))?.id).toBe('de-a1-u2');
    expect(nextJob(jobs, new Set(['es-a1-u7', 'de-a1-u1', 'de-a1-u2']))).toBeUndefined();
  });
});

describe('lessons for later units', () => {
  const file = readFileSync('docs/content-lessons.md', 'utf8');
  const rules = (text: string) => text.split('\n').filter((line) => line.startsWith('- '));

  it('adds at most two rules, each naming the unit it came from, and nothing else in the file', () => {
    const result = addLessons(
      file,
      [
        { rule: 'Name the form in a typed prompt.', because: 'open order prompts' },
        { rule: 'Accept a number with its unit word.' },
        { rule: 'A third rule.' },
      ],
      'es-a1-u7',
      '2026-11-20',
    );
    expect(result.added).toBe(2);
    expect(rules(result.text).slice(-2)).toEqual([
      '- Name the form in a typed prompt. (from `es-a1-u7`, 2026-11-20: open order prompts)',
      '- Accept a number with its unit word. (from `es-a1-u7`, 2026-11-20)',
    ]);
    expect(result.text.startsWith(file.trimEnd())).toBe(true);
    // The result is formatted as the repository requires: a blank line before the first rule.
    expect(addLessons('## Rules\n', [{ rule: 'One.' }], 'x', 'd').text).toBe(
      '## Rules\n\n- One. (from `x`, d)\n',
    );
  });

  it('never adds a rule that is already there, whatever its case and punctuation', () => {
    const once = addLessons(file, [{ rule: 'Name the form in a typed prompt.' }], 'es-a1-u7', 'd');
    const twice = addLessons(once.text, [{ rule: 'name the form in a typed prompt' }], 'x', 'd');
    expect(twice.added).toBe(0);
    expect(twice.text).toBe(once.text);
  });

  it('stops adding when the file is full', () => {
    const full = `${file.trimEnd()}\n${Array.from({ length: MAX_LESSONS }, (_, n) => `- Rule ${n}.`).join('\n')}\n`;
    expect(addLessons(full, [{ rule: 'One more.' }], 'x', 'd')).toMatchObject({
      added: 0,
      full: true,
    });
  });

  it('keeps the real file within its limit', () => {
    expect(rules(file).length).toBeLessThanOrEqual(MAX_LESSONS);
  });
});

describe('the voice check', () => {
  // Real transcripts of four Spanish Unit 7 clips, 20 November 2026: gpt-4o-transcribe,
  // whisper-1 and Gemini, none told the line.
  it('passes a good clip that one transcriber misheard', () => {
    const result = heardByMost(
      '¿Es por kilo?',
      ['Es porquillo.', 'Es por kilo.', 'es por kilo'],
      'ES',
    );
    expect(result.heard).toBe(true);
  });

  it('fails a clip whose key word most listeners missed, and names the word', () => {
    const result = heardByMost(
      '¿Es por kilo?',
      ['Es por ti, no?', '¿Es portino?', 'Es por ti, ¿no?'],
      'ES',
    );
    expect(result.heard).toBe(false);
    expect(result.words.filter((word) => !word.heard).map((word) => word.text)).toEqual(['kilo?']);
  });

  it('counts only the listeners that answered, and needs most of them', () => {
    expect(heardByMost('Sí, el kilo.', ['Sí, el tilo.', '', 'Sí, el kilo.'], 'ES').heard).toBe(
      false,
    );
    expect(heardByMost('Sí, el kilo.', ['', '', 'Sí, el kilo.'], 'ES')).toMatchObject({
      heard: true,
      listeners: 1,
    });
  });
});

describe('what a content job may change', () => {
  it('allows the unit, its voices, call, record and tests', () => {
    expect(
      outsideContent([
        'src/features/foundations/spanish-a1-unit-7.ts',
        'src/features/foundations/spanish-a1-units.ts',
        'src/features/foundations/catalog.ts',
        'src/features/audio/voices.ts',
        'src/features/audio/clips.json',
        'supabase/functions/_shared/unit-calls.ts',
        'docs/content-review/es-a1-u7.md',
        'docs/unit-calls.md',
        'tests/spanish-units.test.ts',
        'tests/published-ids.json',
        'e2e/foundations.spec.ts',
      ]),
    ).toEqual([]);
  });

  it('refuses app code, level labels and the pipeline itself', () => {
    // German Unit 1, 20 November 2026: the author changed progress.ts to carry review cards.
    expect(
      outsideContent([
        'src/features/foundations/progress.ts',
        'src/features/foundations/types.ts',
        'src/features/foundations/level-status.ts',
        'src/components/step-lesson.tsx',
        'scripts/content/panel.ts',
        'docs/content-pipeline.md',
        'package.json',
        'AGENTS.md',
      ]),
    ).toHaveLength(8);
  });

  it('counts the tests a file declares, so removing one is noticed', () => {
    const source = `describe('x', () => {
  it('one', () => {});
  it.each([1, 2])('two %s', () => {});
  test('three', () => {});
  // it('not a test, a comment line that starts with it later')
});`;
    expect(countTests(source)).toBe(3);
  });
});
