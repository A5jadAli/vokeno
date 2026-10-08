import { getTrackLessons, type LessonTrack } from './catalog';
import { finalStep } from './types';
import type { FoundationProgress } from './progress';

/** The lesson a learner should open next: an unfinished one first, then the first not yet done. */
export function nextLesson(progress: FoundationProgress, track: LessonTrack) {
  const lessons = getTrackLessons(track);
  const lastCompleted = lessons
    .map((lesson, index) => ({ index, at: progress[lesson.id]?.attempts.at(-1)?.at ?? '' }))
    .filter((entry) => entry.at)
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
  return (
    lessons.find((lesson) => {
      const step = progress[lesson.id]?.step ?? 0;
      return step > 0 && step < finalStep(lesson);
    }) ??
    lessons.find(
      (lesson, index) =>
        index > (lastCompleted?.index ?? -1) && !progress[lesson.id]?.attempts.length,
    ) ??
    lessons.find((lesson) => !progress[lesson.id]?.attempts.length) ??
    lessons[0]
  );
}

export function hasStartedPath(progress: FoundationProgress, track: LessonTrack) {
  return getTrackLessons(track).some((lesson) => {
    const entry = progress[lesson.id];
    return Boolean(entry?.attempts.length || (entry && entry.step > 0));
  });
}
