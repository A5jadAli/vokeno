import { describe, expect, it } from '@jest/globals';

import { getTrackLessons, type FoundationLesson } from '@/features/foundations/catalog';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { isGradedStep } from '@/features/foundations/types';
import {
  CHECKPOINT_PASS_MARK,
  checkpointBefore,
  checkpointResult,
  coveredLessons,
  isCheckpoint,
  levelReached,
} from '@/features/journey/checkpoints';
import { courseUnits, findNextLesson } from '@/features/journey/course';

const lessons = getTrackLessons('ES');
const checkpoint = lessons.find(isCheckpoint) as FoundationLesson & { format: 'steps' };
const graded = checkpoint.steps.filter(isGradedStep).length;
const hasSpeaking = checkpoint.steps.some((step) => step.kind === 'speak');
const run = (correctFirstTry: number, spoken = true) => ({
  ...freshFoundationEntry(),
  step: checkpoint.steps.length,
  attempts: [{ at: '2026-10-24T10:00:00.000Z', correctFirstTry, spoken }],
});
const atMark = Math.ceil(graded * CHECKPOINT_PASS_MARK);

describe('checkpoints', () => {
  it('passes at 80% right first time with the speaking task done', () => {
    expect(checkpointResult(checkpoint, run(atMark))?.passed).toBe(true);
    expect(checkpointResult(checkpoint, run(atMark - 1))?.passed).toBe(false);
    if (hasSpeaking) expect(checkpointResult(checkpoint, run(graded, false))?.passed).toBe(false);
    expect(checkpointResult(checkpoint, undefined)).toBeUndefined();
  });

  it('shows the first pass, not a later weaker retake', () => {
    const entry = run(atMark);
    entry.attempts.push({ at: '2026-10-25T10:00:00.000Z', correctFirstTry: 1, spoken: true });
    expect(checkpointResult(checkpoint, entry)?.at).toBe('2026-10-24T10:00:00.000Z');
  });

  it('tests a learner out of the units before it, and "what next" moves past them', () => {
    const progress: FoundationProgress = { [checkpoint.id]: run(graded) };
    const covered = coveredLessons(lessons, progress);
    const before = lessons.slice(0, lessons.indexOf(checkpoint));
    expect(before.length).toBeGreaterThan(0);
    expect(before.every((lesson) => covered.has(lesson.id))).toBe(true);
    expect(covered.has(checkpoint.id)).toBe(false);
    const next = findNextLesson(progress, 'ES');
    expect(lessons.indexOf(next!.lesson)).toBeGreaterThan(lessons.indexOf(checkpoint));
    const unit1 = courseUnits('ES', progress)[0];
    expect(unit1.done).toBe(unit1.lessons.length);
    expect(unit1.covered).toBe(unit1.lessons.length);
    // A checkpoint taken but not passed covers nothing.
    expect(coveredLessons(lessons, { [checkpoint.id]: run(0) }).size).toBe(0);
  });

  it('notes a jump past a checkpoint only until it has been taken', () => {
    const after = lessons[lessons.indexOf(checkpoint) + 1];
    expect(after.level).toBe(checkpoint.level);
    expect(checkpointBefore(lessons, {}, after)?.id).toBe(checkpoint.id);
    expect(checkpointBefore(lessons, { [checkpoint.id]: run(0) }, after)).toBeUndefined();
    expect(checkpointBefore(lessons, {}, lessons[0])).toBeUndefined();
    // Placed or started after the checkpoint: their own start is not a jump.
    expect(checkpointBefore(lessons, {}, after, after.id)).toBeUndefined();
  });

  it('claims no level until the level is complete and every checkpoint is passed', () => {
    expect(levelReached('ES', 'A1', lessons, { [checkpoint.id]: run(graded) })).toBe(false);
  });
});

describe('checkpoint wording', () => {
  it('states the same pass mark as the code', () => {
    // The intro says "at least 4 in 5"; if CHECKPOINT_PASS_MARK changes, so must the text.
    expect(CHECKPOINT_PASS_MARK).toBe(4 / 5);
    const intros = lessons
      .filter(isCheckpoint)
      .flatMap((lesson) =>
        lesson.format === 'steps' ? [lesson.steps, lesson.retakeSteps ?? []] : [],
      )
      .map((steps) => steps.find((step) => step.kind === 'rule'))
      .filter((step) => step?.kind === 'rule');
    expect(intros.length).toBeGreaterThan(0);
    for (const intro of intros)
      if (intro?.kind === 'rule') expect(intro.body).toMatch(/at least 4 in 5 right first time/);
  });
});
