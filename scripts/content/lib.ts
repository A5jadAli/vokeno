// The content standard and the review script for one unit (docs/content-pipeline.md).
// Everything here is pure, so tests/content-standard.test.ts can hold new units to it.
import { getTrackLessons } from '../../src/features/foundations/catalog';
import { markHeard } from '../../src/features/take/heard';
import type { LanguageTrack } from '../../src/features/language/config';
import {
  isGradedStep,
  unitName,
  type LessonStep,
  type StepLesson,
} from '../../src/features/foundations/types';

/**
 * Editorial limits for a unit session. They come from the November 2026 course review, not from
 * a trial: change one only with a dated reason in docs/content-pipeline.md.
 */
export const STANDARD = {
  /** New words or chunks taught in one session. */
  maxNewItems: 8,
  /** Multiple choice as a share of a session's marked steps. */
  maxChooseShare: 0.5,
  /** Typed, built or form answers as a share of a unit's marked steps. */
  minProducedShare: 0.4,
  /** Options on every multiple-choice step. */
  minOptions: 3,
  /** Lines the learner says aloud in a session. */
  minSpokenLines: 2,
  /** Earlier-taught words or chunks met again in a session (not the course's first unit). */
  minRecycled: 4,
} as const;

const unitsOf = (track: StepLesson['track']) =>
  getTrackLessons(track).filter((lesson): lesson is StepLesson => lesson.format === 'steps');

/** A unit's sessions in path order; empty when the id is unknown. */
export function unitSessions(unitId: string): StepLesson[] {
  return (['DE', 'ES', 'EN'] as const)
    .flatMap(unitsOf)
    .filter((lesson) => lesson.unit.id === unitId);
}

/** Every unit id on the paths, in order. */
export function unitIds(): string[] {
  return [...new Set((['DE', 'ES', 'EN'] as const).flatMap(unitsOf).map((s) => s.unit.id))];
}

/** Words only: lower case, no punctuation, single spaces, padded so whole words can be matched. */
const plain = (value: string) =>
  ` ${value
    .toLocaleLowerCase()
    .replace(/[.,!?¿¡;:„“”"«»()…/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

const ARTICLE = /^(der|die|das|ein|eine|el|la|los|las|un|una|the|a|an) /;

/** Everything a learner reads or hears in a step, as one string. */
function stepText(step: LessonStep): string {
  const parts: unknown[] = Object.values(step);
  const flat = (value: unknown): string =>
    typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? value.map(flat).join(' ')
        : value && typeof value === 'object'
          ? Object.values(value).map(flat).join(' ')
          : '';
  return parts.map(flat).join(' ');
}

const taughtIn = (session: StepLesson) =>
  session.steps.flatMap((step) =>
    step.kind === 'teach' ? step.items.map((item) => item.target) : [],
  );

/** The sessions before this one on its language's path; none when it is not on the path. */
function earlierOnPath(session: StepLesson) {
  const path = unitsOf(session.track);
  return path.slice(
    0,
    Math.max(
      0,
      path.findIndex((lesson) => lesson.id === session.id),
    ),
  );
}

/** Targets taught before this session on its language's path. */
export function taughtBefore(session: StepLesson): string[] {
  return earlierOnPath(session).flatMap(taughtIn);
}

/** What a reviewer may assume is known: earlier taught targets plus earlier rule tables and
 *  examples (numbers and verb forms are often taught only there). */
export function knownBefore(session: StepLesson): string[] {
  return earlierOnPath(session).flatMap((earlier) =>
    earlier.steps.flatMap((step) =>
      step.kind === 'teach'
        ? step.items.map((item) => item.target)
        : step.kind === 'rule'
          ? [...(step.table ?? []).flat(), ...(step.examples ?? [])]
          : [],
    ),
  );
}

export type SessionMetrics = {
  id: string;
  newItems: number;
  marked: number;
  chooseShare: number;
  produced: number;
  thinChoices: number;
  spokenLines: number;
  recycled: number;
};

export function sessionMetrics(session: StepLesson): SessionMetrics {
  const marked = session.steps.filter(isGradedStep);
  const choose = marked.filter((step) => step.kind === 'choose');
  const text = plain(session.steps.map(stepText).join(' '));
  const earlier = new Set(
    taughtBefore(session)
      // "Montag, Dienstag" and "heute / morgen" are lists, not one item to meet again.
      .filter((target) => !/[,/]/.test(target))
      .map((target) => plain(target.toLocaleLowerCase().replace(ARTICLE, ''))),
  );
  return {
    id: session.id,
    newItems: taughtIn(session).length,
    marked: marked.length,
    chooseShare: marked.length ? choose.length / marked.length : 0,
    produced: marked.filter((s) => s.kind === 'type' || s.kind === 'build' || s.kind === 'form')
      .length,
    thinChoices: choose.filter((s) => s.kind === 'choose' && s.options.length < STANDARD.minOptions)
      .length,
    spokenLines: session.steps.reduce(
      (sum, step) => sum + (step.kind === 'speak' ? step.lines.length : 0),
      0,
    ),
    recycled: [...earlier].filter((target) => target.trim() && text.includes(target)).length,
  };
}

/** Where a unit misses the standard; empty when it meets it. Checkpoints only test, so the
 *  teaching rules do not apply to them. */
export function unitProblems(sessions: StepLesson[]): string[] {
  if (!sessions.length) return ['No such unit on a course path.'];
  const problems: string[] = [];
  const all = sessions.map(sessionMetrics);
  const checkpoint = Boolean(sessions[0].unit.checkpoint);
  const firstOfCourse = taughtBefore(sessions[0]).length === 0;
  for (const m of all) {
    if (m.thinChoices)
      problems.push(
        `${m.id}: ${m.thinChoices} choice step(s) with fewer than ${STANDARD.minOptions} options`,
      );
    if (checkpoint) continue;
    if (m.newItems > STANDARD.maxNewItems)
      problems.push(`${m.id}: teaches ${m.newItems} new items (limit ${STANDARD.maxNewItems})`);
    if (m.chooseShare > STANDARD.maxChooseShare)
      problems.push(
        `${m.id}: ${Math.round(m.chooseShare * 100)}% of marked steps are multiple choice (limit ${STANDARD.maxChooseShare * 100}%)`,
      );
    if (m.spokenLines < STANDARD.minSpokenLines)
      problems.push(
        `${m.id}: ${m.spokenLines} line(s) said aloud (at least ${STANDARD.minSpokenLines})`,
      );
    if (!firstOfCourse && m.recycled < STANDARD.minRecycled)
      problems.push(
        `${m.id}: meets ${m.recycled} earlier-taught item(s) again (at least ${STANDARD.minRecycled})`,
      );
  }
  const marked = all.reduce((sum, m) => sum + m.marked, 0);
  const produced = all.reduce((sum, m) => sum + m.produced, 0);
  if (marked && produced / marked < STANDARD.minProducedShare)
    problems.push(
      `${sessions[0].unit.id}: ${Math.round((produced / marked) * 100)}% of marked steps are typed, built or a form (at least ${STANDARD.minProducedShare * 100}%)`,
    );
  return problems;
}

export type Vote = { n: number; verdict: 'uphold' | 'dismiss'; reason: string };

/**
 * The findings (numbered from 1) that two or more judges uphold. A judge who gives no verdict on
 * a finding has not upheld it.
 */
export function upheldBy(count: number, ballots: readonly Vote[][]): number[] {
  return Array.from({ length: count }, (_, index) => index + 1).filter(
    (n) =>
      ballots.filter((ballot) => ballot.some((vote) => vote.n === n && vote.verdict === 'uphold'))
        .length >= 2,
  );
}

/**
 * Which words of a recorded line most listeners heard. Each transcript is made by a different
 * transcriber that was not told the line; a word counts as heard when most of them heard it, so
 * one transcriber's slip neither fails a good clip nor passes a bad one. Empty transcripts are
 * listeners that did not answer.
 */
export function heardByMost(line: string, transcripts: readonly string[], track: LanguageTrack) {
  const answered = transcripts.filter((text) => text !== '');
  const marks = answered.map((text) => markHeard(line, text, track).words);
  const words = line
    .split(/\s+/)
    .filter(Boolean)
    .map((text, index) => ({
      text,
      heard: marks.filter((words) => words[index]?.heard).length * 2 > answered.length,
    }));
  return { words, listeners: answered.length, heard: words.every((word) => word.heard) };
}

export type Lesson = { rule: string; because?: string };
/** The most rules docs/content-lessons.md holds: past this, a person prunes it first. */
export const MAX_LESSONS = 40;

/**
 * The lessons file with new rules added at the end of its list, each naming the unit it came
 * from. Nothing is added once the file holds MAX_LESSONS rules, and a rule already there in the
 * same words is not added twice.
 */
export function addLessons(text: string, rules: readonly Lesson[], unit: string, date: string) {
  const existing = text.split('\n').filter((line) => line.startsWith('- '));
  const known = new Set(existing.map((line) => plain(line.slice(2).split(' (from ')[0])));
  if (existing.length >= MAX_LESSONS) return { text, added: 0, full: true, count: existing.length };
  const fresh = rules
    .map((item) => ({ rule: item.rule.trim().replace(/\s+/g, ' '), because: item.because?.trim() }))
    .filter((item) => !known.has(plain(item.rule)))
    .slice(0, Math.min(2, MAX_LESSONS - existing.length));
  const lines = fresh.map(
    (item) =>
      `- ${item.rule} (from \`${unit}\`, ${date}${item.because ? `: ${item.because.replace(/\s+/g, ' ')}` : ''})`,
  );
  return {
    // The first rule under the heading needs a blank line before it, as Markdown lists do.
    text: lines.length
      ? `${text.trimEnd()}${existing.length ? '\n' : '\n\n'}${lines.join('\n')}\n`
      : text,
    added: lines.length,
    full: false,
    count: existing.length + lines.length,
  };
}

const list = (values: readonly string[]) => values.map((value) => `"${value}"`).join(', ');

/** One step as a reviewer reads it, answer key included. */
function renderStep(step: LessonStep): string[] {
  switch (step.kind) {
    case 'scene':
      return [
        `Scene: ${step.title}. ${step.intro}`,
        ...step.lines.flatMap((line) => [
          `  ${line.speaker}: ${line.text} = ${line.meaning}`,
          ...(line.real
            ? [
                `    as people say it: ${line.real}${line.realMeaning ? ` = ${line.realMeaning}` : ''}`,
              ]
            : []),
        ]),
        ...(step.note ? [`  Note: ${step.note}`] : []),
      ];
    case 'teach':
      return [
        `Teach: ${step.title}`,
        ...step.items.map(
          (item) => `  ${item.target} = ${item.meaning}${item.note ? ` (${item.note})` : ''}`,
        ),
      ];
    case 'rule':
      return [
        `Rule: ${step.title}. ${step.body}`,
        ...(step.table ?? []).map(([a, b]) => `  ${a} | ${b}`),
        ...(step.examples ?? []).map((example) => `  e.g. ${example}`),
      ];
    case 'choose':
      return [
        `Choose: ${step.prompt}`,
        ...(step.context ? [`  Text shown: ${step.context}`] : []),
        ...(step.audio ? [`  Heard, not shown: ${step.audio}`] : []),
        `  Options: ${list(step.options)}. Key: "${step.options[step.answer]}"`,
        `  Explanation: ${step.explanation}`,
      ];
    case 'build':
      return [
        `Build from tiles: ${step.prompt}`,
        `  Key: "${step.answer.join(' ')}"${step.also?.length ? `. Also accepted: ${list(step.also)}` : ''}${step.extra?.length ? `. Extra tiles: ${list(step.extra)}` : ''}`,
        `  Explanation: ${step.explanation}`,
      ];
    case 'type':
      return [
        `Type: ${step.prompt}`,
        ...(step.context ? [`  Text shown: ${step.context}`] : []),
        ...(step.audio ? [`  Heard, not shown: ${step.audio}`] : []),
        `  Accepted: ${list(step.accepted)}. Hint: ${step.hint}`,
        `  Explanation: ${step.explanation}`,
      ];
    case 'form':
      return [
        `Form: ${step.prompt}`,
        `  Text shown: ${step.context}`,
        ...(step.audio ? [`  Heard, not shown: ${step.audio}`] : []),
        ...step.fields.map((field) => `  ${field.label}: accepted ${list(field.accepted)}`),
        `  Explanation: ${step.explanation}`,
      ];
    case 'match':
      return [`Match: ${step.prompt}`, ...step.pairs.map(([a, b]) => `  ${a} <-> ${b}`)];
    case 'speak':
      return [
        `Say aloud: ${step.prompt}`,
        ...step.lines.map((line) => `  ${line}`),
        ...(step.tip ? [`  Tip: ${step.tip}`] : []),
        ...(step.mission
          ? [`  Checks: ${list(step.mission.checks)}. Twist: ${step.mission.twist}`]
          : []),
      ];
  }
}

/**
 * The whole unit as plain text for a reviewer. Each step has a reference ("2.7" is session 2,
 * step 7) that findings quote, so a fix can be found in the source.
 */
export function renderUnit(sessions: StepLesson[]): string {
  const first = sessions[0];
  const out = [
    `${first.track} ${first.level} · ${unitName(first.unit)}: ${first.unit.title}`,
    `Can do: ${first.unit.canDo}`,
  ];
  sessions.forEach((session, s) => {
    out.push(
      '',
      `## Session ${s + 1} (${session.session}, ${session.minutes} min): ${session.title}`,
      `Outcome: ${session.outcome}`,
    );
    const versions: [string, LessonStep[]][] = [['', session.steps]];
    if (session.retakeSteps) versions.push(['R', session.retakeSteps]);
    for (const [tag, steps] of versions)
      steps.forEach((step, index) => {
        const [head, ...rest] = renderStep(step);
        out.push(`[${s + 1}${tag}.${index + 1}] ${head}`, ...rest);
      });
  });
  return out.join('\n');
}
