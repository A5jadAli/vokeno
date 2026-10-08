import { describe, expect, it } from '@jest/globals';

import {
  checkFoundationWriting,
  foundationLessons,
  getTrackLessons,
  normaliseFoundationAnswer,
  type StepLesson,
} from '@/features/foundations/catalog';
import { learningRecommendation } from '@/features/coaching/recommendation';
import { germanA1Units } from '@/features/foundations/german-a1-units';
import { nextLesson } from '@/features/foundations/next';
import { freshFoundationEntry, parseFoundationProgress } from '@/features/foundations/progress';
import {
  finalStep,
  gradedCount,
  isGradedStep,
  MAX_LESSON_STEPS,
} from '@/features/foundations/types';
import { buildReviewSession, dueCards, seedCards } from '@/features/review/schedule';

const sessions: StepLesson[] = germanA1Units;
const words = (text: string) => normaliseFoundationAnswer(text).split(' ').sort().join(' ');

describe('German A1 units: structure', () => {
  it('has three units of four sessions, in order, on the path before the starter lessons', () => {
    const units = [...new Set(sessions.map((session) => session.unit.number))];
    expect(units).toEqual([1, 2, 3]);
    for (const number of units)
      expect(sessions.filter((session) => session.unit.number === number)).toHaveLength(4);
    const path = getTrackLessons('DE');
    expect(path.slice(0, sessions.length).map((lesson) => lesson.id)).toEqual(
      sessions.map((session) => session.id),
    );
    expect(new Set(foundationLessons.map((lesson) => lesson.id)).size).toBe(
      foundationLessons.length,
    );
  });

  it('keeps every session short, varied and marked', () => {
    for (const session of sessions) {
      const kinds = new Set(session.steps.map((step) => step.kind));
      expect([session.id, session.steps.length >= 9]).toEqual([session.id, true]);
      expect(session.steps.length).toBeLessThanOrEqual(MAX_LESSON_STEPS);
      expect([session.id, gradedCount(session) >= 5]).toEqual([session.id, true]);
      expect([session.id, kinds.size >= 5]).toEqual([session.id, true]);
      expect(session.minutes).toBeGreaterThanOrEqual(4);
      expect(session.minutes).toBeLessThanOrEqual(8);
      // Never the same exercise three times in a row.
      session.steps.forEach((step, index) => {
        const run = session.steps.slice(index, index + 3).map((item) => item.kind);
        expect([session.id, index, run.length === 3 && new Set(run).size === 1]).toEqual([
          session.id,
          index,
          false,
        ]);
      });
      expect(session.steps.at(-1)?.kind).toMatch(/speak|match/);
    }
  });

  it('teaches each word once, so every review card is unique', () => {
    const targets = sessions.flatMap((session) => session.phrases.map((phrase) => phrase.target));
    expect(targets.filter((target, index) => targets.indexOf(target) !== index)).toEqual([]);
    for (const session of sessions)
      expect([session.id, session.phrases.length >= 2]).toEqual([session.id, true]);
  });
});

describe('German A1 units: every exercise works', () => {
  for (const session of sessions)
    it(`${session.id}`, () => {
      for (const step of session.steps) {
        if (step.kind === 'choose') {
          expect(step.options.length).toBeGreaterThanOrEqual(2);
          expect(step.options.length).toBeLessThanOrEqual(3);
          expect(new Set(step.options).size).toBe(step.options.length);
          expect(step.options[step.answer]).toBeTruthy();
          expect(step.explanation.trim()).toBeTruthy();
        }
        if (step.kind === 'build') {
          expect(step.answer.length).toBeGreaterThanOrEqual(3);
          const answerWords = step.answer.map((word) => normaliseFoundationAnswer(word));
          for (const extra of step.extra ?? [])
            expect([extra, answerWords.includes(normaliseFoundationAnswer(extra))]).toEqual([
              extra,
              false,
            ]);
          // Other accepted orders must use exactly the same tiles.
          for (const other of step.also ?? [])
            expect(words(other)).toBe(words(step.answer.join(' ')));
        }
        if (step.kind === 'type') {
          const target = { track: session.track, writing: { accepted: step.accepted } };
          for (const answer of step.accepted)
            expect(checkFoundationWriting(target, answer)).toBe(true);
          expect(checkFoundationWriting(target, 'etwas ganz anderes')).toBe(false);
          expect(step.hint.trim()).toBeTruthy();
        }
        if (step.kind === 'match') {
          expect(step.pairs.length).toBeGreaterThanOrEqual(3);
          expect(step.pairs.length).toBeLessThanOrEqual(6);
          expect(new Set(step.pairs.map(([left]) => left)).size).toBe(step.pairs.length);
          expect(new Set(step.pairs.map(([, right]) => right)).size).toBe(step.pairs.length);
        }
        if (step.kind === 'scene') {
          expect(step.lines.length).toBeGreaterThanOrEqual(4);
          for (const line of step.lines) {
            expect(line.meaning.trim()).toBeTruthy();
            if (line.real) expect(line.real).not.toBe(line.text);
          }
        }
        if (step.kind === 'teach') {
          expect(step.items.length).toBeGreaterThanOrEqual(2);
          expect(step.items.length).toBeLessThanOrEqual(6);
        }
      }
    });
});

describe('German A1 units: language and audio', () => {
  const spoken = sessions.flatMap((session) =>
    session.steps.flatMap((step) => {
      if (step.kind === 'choose') return step.audio ? [step.audio] : [];
      if (step.kind === 'speak') return step.lines;
      if (step.kind === 'scene') return step.lines.flatMap((line) => [line.text, line.real ?? '']);
      if (step.kind === 'teach') return step.items.map((item) => item.target);
      return [];
    }),
  );

  it('never asks the voice to read digits or symbols in a listening task', () => {
    for (const session of sessions)
      for (const step of session.steps)
        if (step.kind === 'choose' && step.audio)
          expect([step.audio, /[\d@€$]/.test(step.audio)]).toEqual([step.audio, false]);
  });

  it('writes German with ß and umlauts, not keyboard substitutes', () => {
    const substitutes =
      /\b(heisse|heisst|gruesse|grues|schoen|oesterreich|aegypten|tuerkei|strasse|fuenf|zwoelf|tschuess)\b/i;
    expect(spoken.filter((text) => substitutes.test(text))).toEqual([]);
  });

  it('keeps model lines free of placeholders the voice would read badly', () => {
    expect(spoken.filter((text) => /…|\.\.\.|___/.test(text) && !text.endsWith('…'))).toEqual([]);
    for (const session of sessions)
      for (const step of session.steps)
        if (step.kind === 'speak')
          expect(step.lines.some((line) => line.includes('…'))).toBe(false);
  });
});

describe('German A1 units: progress and review', () => {
  const session = sessions[0];

  it('accepts a finished session and rejects a step past the end', () => {
    const at = '2026-10-08T10:00:00.000Z';
    const done = {
      ...freshFoundationEntry(),
      step: finalStep(session),
      answers: [1],
      firstTry: Array.from({ length: gradedCount(session) }, () => true),
      attempts: [{ at, correctFirstTry: gradedCount(session), spoken: true }],
    };
    const parsed = parseFoundationProgress({
      [session.id]: done,
      [sessions[1].id]: { ...done, step: finalStep(sessions[1]) + 1 },
    });
    expect(Object.keys(parsed)).toEqual([session.id]);
    expect(parsed[session.id].attempts).toHaveLength(1);
  });

  it('sends a learner to the session in progress, then to the next unstarted one', () => {
    const progress = { [session.id]: { ...freshFoundationEntry(), step: 3 } };
    expect(nextLesson(progress, 'DE').id).toBe(session.id);
    const finished = {
      [session.id]: {
        ...freshFoundationEntry(),
        step: finalStep(session),
        attempts: [{ at: new Date().toISOString(), correctFirstTry: 5, spoken: true }],
      },
    };
    expect(nextLesson(finished, 'DE').id).toBe(sessions[1].id);
  });

  it('turns every taught word into a review card due the next day', () => {
    const today = 20_000;
    const cards = seedCards(session, freshFoundationEntry(), today);
    expect(cards).toHaveLength(session.phrases.length);
    const progress = { [session.id]: { ...freshFoundationEntry(), cards } };
    expect(dueCards(progress, 'DE', today)).toHaveLength(0);
    const review = buildReviewSession(progress, 'DE', today + 1);
    expect(review.length).toBeGreaterThan(0);
    expect(review.every((item) => item.lessonId === session.id)).toBe(true);
  });

  it('keeps review cards from retired starter lessons', () => {
    const retired = foundationLessons.find((lesson) => lesson.id === 'greetings')!;
    expect(retired.retired).toBe(true);
    const progress = {
      greetings: {
        ...freshFoundationEntry(),
        cards: seedCards(retired, freshFoundationEntry(), 1),
      },
    };
    expect(dueCards(progress, 'DE', 5).length).toBe(retired.phrases.length);
  });

  it('never recommends a lesson that is missing or retired', () => {
    const path = new Set(foundationLessons.filter((lesson) => !lesson.retired).map((l) => l.id));
    for (const track of ['DE', 'EN', 'ES'] as const)
      for (const ability of ['new', 'basics', 'conversational'] as const)
        for (const goal of ['everyday', 'work-study', 'ielts-academic', 'ielts-general'] as const) {
          const { href } = learningRecommendation(track, ability, goal);
          const id = href.startsWith('/foundation/') ? href.slice('/foundation/'.length) : null;
          if (id) expect([href, path.has(id)]).toEqual([href, true]);
        }
    expect(learningRecommendation('DE', 'new').href).toBe('/foundation/de-a1-u1-hallo');
  });

  it('counts only marked steps towards the score', () => {
    expect(gradedCount(session)).toBe(session.steps.filter(isGradedStep).length);
  });
});
