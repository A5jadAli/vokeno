// What a checkpoint shows about a learner. Checkpoints never lock anything: they decide what
// Vokeno may claim (a level reached), let a learner test out of the units they check, and are
// offered once when someone jumps past one. See docs/design-system.md, "Course levels".

import type { FoundationLesson } from '@/features/foundations/catalog';
import type { FoundationEntry, FoundationProgress } from '@/features/foundations/progress';
import { isGradedStep, type LessonLevel } from '@/features/foundations/types';
import type { LanguageTrack } from '@/features/language/config';
import { levelStatus } from '@/features/foundations/level-status';

/**
 * The pass mark: 80% of the marked tasks right first time, and the speaking task done aloud
 * when the checkpoint has one, because speaking is what Vokeno promises. Recorded in
 * docs/spanish-a1-curriculum-plan.md, "Checkpoint pass mark".
 */
export const CHECKPOINT_PASS_MARK = 0.8;

export type CheckpointRun = {
  at: string;
  right: number;
  total: number;
  /** The run's version had a speaking task, and whether it was done aloud. */
  speaking: 'done' | 'skipped' | 'none';
  passed: boolean;
};

/** Every finished run of a checkpoint, each judged by the pass mark against its own version. */
export function checkpointRuns(lesson: FoundationLesson, entry: FoundationEntry | undefined) {
  if (lesson.format !== 'steps' || !lesson.unit.checkpoint || !entry) return [];
  return entry.attempts.map((attempt): CheckpointRun => {
    const steps = attempt.retake && lesson.retakeSteps ? lesson.retakeSteps : lesson.steps;
    const total = steps.filter(isGradedStep).length;
    const hasSpeaking = steps.some((step) => step.kind === 'speak');
    const speaking = !hasSpeaking ? 'none' : attempt.spoken ? 'done' : 'skipped';
    return {
      at: attempt.at,
      right: attempt.correctFirstTry,
      total,
      speaking,
      passed:
        total > 0 &&
        attempt.correctFirstTry / total >= CHECKPOINT_PASS_MARK &&
        speaking !== 'skipped',
    };
  });
}

/** The run to show: the first one that passed, or else the latest. */
export function checkpointResult(lesson: FoundationLesson, entry: FoundationEntry | undefined) {
  const runs = checkpointRuns(lesson, entry);
  return runs.find((run) => run.passed) ?? runs.at(-1);
}

export const isCheckpoint = (lesson: FoundationLesson) =>
  lesson.format === 'steps' && Boolean(lesson.unit.checkpoint);

const passed = (lesson: FoundationLesson, progress: FoundationProgress) =>
  Boolean(checkpointResult(lesson, progress[lesson.id])?.passed);

/**
 * Lessons a passed checkpoint has tested the learner out of: every lesson since the previous
 * checkpoint in the same level, the way placement skips ahead from the other direction.
 */
export function coveredLessons(lessons: FoundationLesson[], progress: FoundationProgress) {
  const covered = new Set<string>();
  let since: FoundationLesson[] = [];
  for (const lesson of lessons) {
    if (isCheckpoint(lesson)) {
      if (passed(lesson, progress)) since.forEach((item) => covered.add(item.id));
      since = [];
    } else if (since.length && since[0].level !== lesson.level) {
      since = [lesson];
    } else {
      since.push(lesson);
    }
  }
  return covered;
}

/**
 * The checkpoint a learner would jump past by opening `target`: the nearest earlier checkpoint
 * in the same level that has not been taken yet, unless they chose to start after it. Taken
 * (even not passed) means they know.
 */
export function checkpointBefore(
  lessons: FoundationLesson[],
  progress: FoundationProgress,
  target: FoundationLesson,
  /** Where the learner chose to start (placement or "Change where I start"), if anywhere. */
  startId?: string,
) {
  const index = lessons.findIndex((lesson) => lesson.id === target.id);
  const start = lessons.findIndex((lesson) => lesson.id === startId);
  for (let at = index - 1; at >= 0; at -= 1) {
    const lesson = lessons[at];
    if (lesson.level !== target.level) return undefined;
    if (!isCheckpoint(lesson)) continue;
    // Starting after it was the learner's own choice: that is not jumping ahead.
    if (start > at) return undefined;
    return checkpointRuns(lesson, progress[lesson.id]).length ? undefined : lesson;
  }
  return undefined;
}

/**
 * Whether Vokeno may say "You've reached A1": the level's content has passed every quality
 * gate ('complete') and the learner has passed all its checkpoints. Until then it says
 * "working towards". No level is complete yet, so nothing claims a level today.
 */
export function levelReached(
  track: LanguageTrack,
  level: LessonLevel,
  lessons: FoundationLesson[],
  progress: FoundationProgress,
) {
  const checkpoints = lessons.filter((lesson) => lesson.level === level && isCheckpoint(lesson));
  return (
    levelStatus[track][level] === 'complete' &&
    checkpoints.length > 0 &&
    checkpoints.every((lesson) => passed(lesson, progress))
  );
}
