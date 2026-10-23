import { describe, expect, it } from '@jest/globals';

import { lessonLines } from '@/features/audio/inventory';
import { foundationLessons, getTrackLessons } from '@/features/foundations/catalog';
import {
  freshFoundationEntry,
  phraseKey,
  type FoundationProgress,
} from '@/features/foundations/progress';
import { spanishA1Units } from '@/features/foundations/spanish-a1-units';
import {
  finalStep,
  gradedCount,
  isGradedStep,
  type LessonStep,
  MAX_LESSON_STEPS,
  stepsForRun,
} from '@/features/foundations/types';
import { coursePosition, courseUnits, findNextLesson } from '@/features/journey/course';
import { reviewSummary, seedCards } from '@/features/review/schedule';

const finished = () => ({
  ...freshFoundationEntry(),
  attempts: [{ at: '2026-10-18T09:00:00Z', correctFirstTry: 3, spoken: false }],
});
const unit1 = spanishA1Units.filter((lesson) => lesson.unit.number === 1);
const predecessors = ['es-first-words', 'es-names', 'es-repair'];

describe('Spanish Unit 1 in the learning journey', () => {
  it('offers four ordered sessions, followed by Unit 2', () => {
    expect(unit1.map((lesson) => lesson.session)).toEqual([
      'Words',
      'Grammar',
      'Real talk',
      'Exam task',
    ]);
    expect(getTrackLessons('ES').slice(0, 4)).toEqual(unit1);
    const progress: FoundationProgress = {};
    for (const [index, lesson] of unit1.entries()) {
      expect(coursePosition(progress, 'ES')).toMatchObject({
        next: { lesson: { id: lesson.id } },
        unit: { id: 'es-a1-u1', done: index },
        lessonNumber: index + 1,
      });
      progress[lesson.id] = { ...finished(), step: finalStep(lesson) };
    }
    expect(findNextLesson(progress, 'ES')?.lesson.id).toBe('es-a1-u2-words');
    expect(courseUnits('ES', progress)[0].done).toBe(4);
  });

  it('keeps earlier IDs accessible and moves saved starting points to available replacements', () => {
    for (const [index, id] of predecessors.entries()) {
      const old = foundationLessons.find((lesson) => lesson.id === id)!;
      expect(old.retired).toBe(true);
      expect(old.replacedBy).toBe(unit1[index].id);
      expect(findNextLesson({}, 'ES', id)?.lesson.id).toBe(old.replacedBy);
      expect(getTrackLessons('ES')).not.toContain(old);
    }
    // History is not evidence that the learner completed newly authored tasks.
    const oldProgress = Object.fromEntries(predecessors.map((id) => [id, finished()]));
    expect(coursePosition(oldProgress, 'ES')).toMatchObject({ started: true, finishedLessons: 0 });
  });

  it('resumes an unfinished earlier lesson, exposes it in Course, then returns to the updated path', () => {
    const progress: FoundationProgress = {
      'es-names': { ...freshFoundationEntry(), step: 2, draft: 'Me llamo' },
    };
    expect(coursePosition(progress, 'ES')).toMatchObject({
      next: { lesson: { id: 'es-names' }, reason: 'resume' },
      unit: { id: 'ES-saved-lessons' },
    });
    expect(progress['es-names'].draft).toBe('Me llamo');
    progress['es-names'] = finished();
    expect(findNextLesson(progress, 'ES')?.lesson.id).toBe('es-a1-u1-words');
    expect(courseUnits('ES', progress).some((unit) => unit.id === 'ES-saved-lessons')).toBe(false);
  });
});

describe('Spanish Unit 1 practice and review', () => {
  it('combines listening, recall and optional personal speaking without scoring that speaking', () => {
    for (const lesson of unit1) {
      expect(lesson.steps.some((step) => step.kind === 'choose' && step.audio)).toBe(true);
      expect(lesson.steps.some((step) => step.kind === 'type')).toBe(true);
      expect(lesson.steps.at(-1)).toMatchObject({
        kind: 'speak',
        mission: { checks: expect.any(Array), twist: expect.any(String) },
      });
      expect(gradedCount(lesson)).toBe(
        lesson.steps.filter((step) => ['choose', 'type', 'build', 'match'].includes(step.kind))
          .length,
      );
    }
    // The final session retrieves the existing set instead of inflating the review queue.
    expect(unit1.map((lesson) => lesson.phrases.length)).toEqual([7, 5, 5, 0]);
    expect(
      new Set(unit1.flatMap((lesson) => lesson.phrases.map((phrase) => phraseKey(phrase.target))))
        .size,
    ).toBe(17);
    expect(seedCards(unit1[3], freshFoundationEntry(), 100).cards).toEqual([]);
  });

  it('retains earned intervals by phrase when old phrases appear in a different order', () => {
    const newInUnit1 = ['Buenas tardes.', 'Buenas noches.'];
    const progress: FoundationProgress = {};
    for (const [index, id] of predecessors.entries()) {
      const old = foundationLessons.find((lesson) => lesson.id === id)!;
      const cards = old.phrases.map((_, i): [number, number] => [i, 200 + i]);
      progress[id] = {
        ...finished(),
        cards,
        cardKeys: old.phrases.map((phrase) => phraseKey(phrase.target)),
      };
      const next = unit1[index];
      const seeded = seedCards(next, freshFoundationEntry(), 100, progress);
      for (const [i, phrase] of next.phrases.entries()) {
        const previous = old.phrases.findIndex(
          (item) => phraseKey(item.target) === phraseKey(phrase.target),
        );
        // The afternoon and evening greetings are new in Unit 1; everything else keeps its interval.
        if (previous < 0) expect(newInUnit1).toContain(phrase.target);
        else expect(seeded.cards[i]).toEqual(cards[previous]);
      }
      progress[next.id] = { ...finished(), ...seeded };
    }
    expect(reviewSummary(progress, 'ES', 100).learning).toBe(17);
    expect(reviewSummary(progress, 'ES', 100).due).toBe(0);
    const [lesson] = unit1;
    const recentFailure = { ...progress[lesson.id], cards: [[0, 101] as [number, number]] };
    expect(seedCards(lesson, recentFailure, 100, progress).cards[0]).toEqual([0, 101]);
  });

  it('matches labelled legacy cards even when a saved array has been reordered, and seeds missing phrases', () => {
    const [lesson] = unit1;
    const progress: FoundationProgress = {
      'es-first-words': { ...finished(), cards: [[4, 500]], cardKeys: [phraseKey('Gracias.')] },
    };
    const seeded = seedCards(lesson, freshFoundationEntry(), 100, progress);
    expect(
      seeded.cards[lesson.phrases.findIndex((phrase) => phrase.target === 'Gracias.')],
    ).toEqual([4, 500]);
    expect(seeded.cards[0]).toEqual([0, 101]);
  });

  it('uses paired Spanish punctuation in spoken and typed Spanish', () => {
    const texts = spanishA1Units.flatMap((lesson) => [
      ...lessonLines(lesson).map((line) => line.text),
      ...lesson.steps.flatMap((step) =>
        step.kind === 'type'
          ? step.accepted
          : step.kind === 'match'
            ? step.pairs.map(([left]) => left)
            : [],
      ),
    ]);
    for (const text of texts) {
      expect([text, (text.match(/¿/g) ?? []).length]).toEqual([
        text,
        (text.match(/\?/g) ?? []).length,
      ]);
      expect([text, (text.match(/¡/g) ?? []).length]).toEqual([
        text,
        (text.match(/!/g) ?? []).length,
      ]);
    }
  });
});

describe('Spanish Units 1 to 6 as one beginner path', () => {
  it('advances through six units and checkpoint 1, preserves unit boundaries and then offers existing practice', () => {
    expect(spanishA1Units).toHaveLength(25);
    expect(getTrackLessons('ES').slice(0, 25)).toEqual(spanishA1Units);
    const units = spanishA1Units.filter((lesson) => !lesson.unit.checkpoint);
    for (const [index, lesson] of units.entries()) {
      expect(lesson.unit.number).toBe(Math.floor(index / 4) + 1);
      expect(lesson.session).toBe(['Words', 'Grammar', 'Real talk', 'Exam task'][index % 4]);
    }
    // Checkpoint 1 sits between Unit 5 and Unit 6.
    const order = spanishA1Units.map((lesson) => lesson.id);
    expect(order.indexOf('es-a1-cp1')).toBe(order.indexOf('es-a1-u5-task') + 1);
    expect(order.indexOf('es-a1-u6-words')).toBe(order.indexOf('es-a1-cp1') + 1);
    const progress: FoundationProgress = {};
    for (const lesson of spanishA1Units) {
      expect(findNextLesson(progress, 'ES')?.lesson.id).toBe(lesson.id);
      progress[lesson.id] = { ...finished(), step: finalStep(lesson) };
    }
    expect(findNextLesson(progress, 'ES')?.lesson.id).toBe('es-sounds');
    expect(
      courseUnits('ES', progress)
        .slice(0, 7)
        .map((unit) => [unit.label.split(' · ')[0], unit.done]),
    ).toEqual([
      ['Unit 1', 4],
      ['Unit 2', 4],
      ['Unit 3', 4],
      ['Unit 4', 4],
      ['Unit 5', 4],
      ['Checkpoint 1', 1],
      ['Unit 6', 4],
    ]);
  });

  it('keeps synthesis sessions free of new cards and schedules the unique taught set once', () => {
    const progress: FoundationProgress = {};
    const targets = spanishA1Units.flatMap((lesson) =>
      lesson.phrases.map((phrase) => phraseKey(phrase.target)),
    );
    expect(new Set(targets).size).toBe(targets.length);
    for (const lesson of spanishA1Units) {
      if (lesson.session === 'Exam task') expect(lesson.phrases).toHaveLength(0);
      progress[lesson.id] = {
        ...finished(),
        ...seedCards(lesson, freshFoundationEntry(), 100, progress),
      };
    }
    expect(reviewSummary(progress, 'ES', 101).due).toBe(targets.length);
  });

  it('provides bounded varied practice with explicit feedback, changed speaking situations and no em dashes', () => {
    for (const lesson of spanishA1Units) {
      expect(lesson.steps.length).toBeLessThanOrEqual(MAX_LESSON_STEPS);
      expect(gradedCount(lesson)).toBeGreaterThanOrEqual(5);
      expect(JSON.stringify(lesson)).not.toContain('\u2014');
      expect(lesson.steps.at(-1)).toMatchObject({
        kind: 'speak',
        mission: { twist: expect.any(String) },
      });
      for (const step of lesson.steps) {
        if (step.kind === 'choose') {
          expect(new Set(step.options).size).toBe(step.options.length);
          expect(step.options[step.answer]).toBeTruthy();
          expect(step.explanation).toBeTruthy();
        }
        if (step.kind === 'form') {
          expect(step.fields.length).toBeLessThanOrEqual(5);
          expect(new Set(step.fields.map((field) => field.label)).size).toBe(step.fields.length);
          for (const field of step.fields) expect(field.accepted[0]).toBeTruthy();
        }
      }
    }
  });
});

describe('Spanish checkpoint 1', () => {
  const checkpoint = spanishA1Units.find((lesson) => lesson.id === 'es-a1-cp1')!;
  const ids = new Set(spanishA1Units.map((lesson) => lesson.id));

  it('mixes every skill, sends each miss to an existing earlier lesson and adds no cards', () => {
    expect(checkpoint.phrases).toHaveLength(0);
    for (const steps of [checkpoint.steps, checkpoint.retakeSteps!]) {
      const marked = steps.filter(isGradedStep);
      expect(new Set(marked.map((step) => step.skill))).toEqual(
        new Set(['reading', 'listening', 'writing']),
      );
      expect(steps.some((step) => step.kind === 'speak')).toBe(true);
      for (const step of marked) {
        expect(ids.has(step.revisit!)).toBe(true);
        // Revisits point back to Units 1 to 5, never forward.
        expect(Number(step.revisit!.match(/u(\d+)/)![1])).toBeLessThanOrEqual(5);
      }
    }
  });

  it('has a retake version with the same tasks in the same order but different people', () => {
    const kinds = (steps: LessonStep[]) => steps.map((step) => step.kind);
    expect(kinds(checkpoint.retakeSteps!)).toEqual(kinds(checkpoint.steps));
    expect(JSON.stringify(checkpoint.retakeSteps)).not.toContain('Bruno');
    expect(JSON.stringify(checkpoint.steps)).not.toContain('Carmen');
  });

  it('alternates versions from one finished run to the next', () => {
    const run = (retake?: boolean) => ({
      at: '2026-10-23T10:00:00.000Z',
      correctFirstTry: 9,
      spoken: true,
      retake,
    });
    expect(stepsForRun(checkpoint, [])).toBe(checkpoint.steps);
    expect(stepsForRun(checkpoint, [run()])).toBe(checkpoint.retakeSteps);
    expect(stepsForRun(checkpoint, [run(), run(true)])).toBe(checkpoint.steps);
    // Only the last four attempts are kept; the alternation still holds.
    expect(stepsForRun(checkpoint, [run(true), run(), run(true), run()])).toBe(
      checkpoint.retakeSteps,
    );
  });
});
