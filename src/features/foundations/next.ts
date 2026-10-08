import { findNextLesson } from '@/features/journey/course';

import { getTrackLessons, type LessonTrack } from './catalog';
import type { FoundationProgress } from './progress';

/**
 * The lesson to highlight in lists. The decision itself lives in the journey module; when every
 * lesson is finished this falls back to the first one, for screens that always need a lesson.
 */
export function nextLesson(progress: FoundationProgress, track: LessonTrack, startAt?: string) {
  return findNextLesson(progress, track, startAt)?.lesson ?? getTrackLessons(track)[0];
}
