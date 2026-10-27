import { getCurriculumUnits } from '@/features/curriculum/catalog';
import { foundationLessons, getTrackLessons } from '@/features/foundations/catalog';
import type { FoundationProgress } from '@/features/foundations/progress';
import {
  dayNumberOf,
  localDay,
  practiceStage,
  stageSteps,
  type PracticeLog,
  type PracticeStage,
} from '@/features/habits/practice-log';
import { finishedOn, type ActivityKey, type ActivityLog } from '@/features/journey/activity-log';
import {
  coursePosition,
  lessonMinutes,
  lessonsAhead,
  pathStart,
  type CoursePosition,
} from '@/features/journey/course';
import { suggestedConversation, suggestedScenario } from '@/features/journey/practice';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';
import { reviewSummary, REVIEW_SESSION_SIZE } from '@/features/review/schedule';
import { getUnitCall, unitCalls } from '../../../supabase/functions/_shared/unit-calls';

export type PlanStepKind = 'lesson' | 'review' | 'listening' | 'speaking';

/** One item in today's session, tied to one concrete activity. */
export type PlanStep = {
  kind: PlanStepKind;
  /** The activity this item stands for. Finishing exactly this activity ticks it. */
  key: ActivityKey;
  title: string;
  why: string;
  href: string;
  action: string;
  minutes: number;
  done: boolean;
};

/** Today's session as stored: the chosen activities, fixed for the day. */
export type SessionSnapshot = { day: string; keys: ActivityKey[] };

export type TodayPlan = {
  stage: PracticeStage;
  returning: boolean;
  steps: PlanStep[];
  doneCount: number;
  minutes: number;
  /** Shown once every step is done: one optional extra, never required. */
  bonus?: PlanStep;
  footnote: string;
  position: CoursePosition;
  /** Every published lesson in this language is finished. */
  courseFinished: boolean;
  /** The session to store when today's plan was built fresh. */
  snapshot: SessionSnapshot;
};

export type TodayPlanInput = {
  track: LanguageTrack;
  progress: FoundationProgress;
  completedScenarioIds: string[];
  completedUnitIds: string[];
  log: PracticeLog;
  activities?: ActivityLog;
  /** Today's stored session for this language, if one was already built. */
  session?: SessionSnapshot;
  /** The learner's chosen starting lesson for this language. */
  startAt?: string;
  /** New lessons the learner's goal date needs today (from the goal plan); one by default. */
  lessonsToday?: number;
  now: number;
};

/** Days practised in one language. The streak is app-wide; the workload is per language. */
function languageLog(log: PracticeLog, track: LanguageTrack): PracticeLog {
  return Object.fromEntries(
    Object.entries(log)
      .map(([day, entries]) => [day, entries.filter((entry) => entry.endsWith(`:${track}`))])
      .filter(([, entries]) => entries.length > 0),
  );
}

/** The plan for today: one to three small steps that grow as the habit forms. */
export function buildTodayPlan(input: TodayPlanInput): TodayPlan {
  const { track, progress, now } = input;
  const activities = input.activities ?? {};
  const today = localDay(now);
  const day = dayNumberOf(today);
  const { stage, returning } = practiceStage(languageLog(input.log, track), today);
  const position = coursePosition(progress, track, input.startAt);
  const level =
    position.next?.lesson.level ??
    (position.waitingForContent ? 'A1' : getTrackLessons(track).at(-1)?.level) ??
    'A1';
  const done = (key: ActivityKey) =>
    finishedOn(activities, today, key) ||
    // A lesson finished today on another device arrives through its attempt history.
    (key.startsWith('lesson:') &&
      Boolean(
        progress[key.slice('lesson:'.length)]?.attempts.some(
          (attempt) => localDay(Date.parse(attempt.at)) === today,
        ),
      ));

  const lessonStep = (id: string): PlanStep | null => {
    const lesson = foundationLessons.find((item) => item.id === id && item.track === track);
    if (!lesson) return null;
    const key: ActivityKey = `lesson:${id}`;
    const finished = done(key);
    const resuming = !finished && (progress[id]?.step ?? 0) > 0;
    return {
      kind: 'lesson',
      key,
      title: lesson.title,
      why: finished
        ? lesson.phrases.length
          ? 'Done. Its words are in your review.'
          : 'Done. Your phrase review continues.'
        : resuming
          ? 'Pick up where you left off.'
          : lesson.outcome,
      href: `/foundation/${id}`,
      action: finished ? 'Open lesson' : resuming ? 'Continue lesson' : 'Start lesson',
      minutes: lessonMinutes(lesson),
      done: finished,
    };
  };

  const reviewStep = (): PlanStep | null => {
    const key: ActivityKey = `review:${track}`;
    const due = reviewSummary(progress, track, day).due;
    const finished = done(key) || due === 0;
    const count = Math.min(due, REVIEW_SESSION_SIZE);
    return {
      kind: 'review',
      key,
      title: finished ? 'Phrase review' : `Review ${count} ${count === 1 ? 'phrase' : 'phrases'}`,
      why: finished
        ? 'Done for today.'
        : due > count
          ? `A quick refresh. ${due - count} more another day.`
          : 'A quick refresh of words you know.',
      href: `/review?track=${track}`,
      action: finished ? 'Review again' : 'Start review',
      minutes: 3,
      done: finished,
    };
  };

  const listeningStep = (id: string): PlanStep | null => {
    const scenario = listeningScenarios.find((item) => item.id === id && item.track === track);
    if (!scenario) return null;
    const key: ActivityKey = `listening:${id}`;
    const finished = done(key);
    return {
      kind: 'listening',
      key,
      title: `Listen: ${scenario.title}`,
      why: finished ? 'Done. Real speech, at real speed.' : `${scenario.context}.`,
      href: `/lesson/${scenario.id}`,
      action: finished ? 'Listen again' : 'Start listening',
      minutes: 3,
      done: finished,
    };
  };

  const speakingStep = (id: string): PlanStep | null => {
    const unit = getCurriculumUnits(track).find((item) => item.id === id);
    const call = getUnitCall(id);
    const key: ActivityKey = `speaking:${id}`;
    const finished = done(key);
    return {
      kind: 'speaking',
      key,
      title: call
        ? `Speak: ${call.title}`
        : unit
          ? `Speak: ${unit.title}`
          : 'Speak with your coach',
      why: finished
        ? 'Done. Nice speaking!'
        : call
          ? call.learnerGoal
          : unit
            ? unit.outcome
            : 'A short, friendly chat with your coach.',
      href: call
        ? `/conversation?track=${track}&call=${call.id}`
        : unit
          ? `/conversation?track=${track}&unit=${unit.id}`
          : `/conversation?track=${track}`,
      action: finished ? 'Speak again' : 'Start speaking',
      minutes: 5,
      done: finished,
    };
  };

  const stepFor = (key: ActivityKey): PlanStep | null => {
    const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
    if (kind === 'lesson') return lessonStep(id);
    if (kind === 'review') return reviewStep();
    if (kind === 'listening') return listeningStep(id);
    return speakingStep(id);
  };

  // Candidates for a fresh session, chosen once and then kept for the rest of the day.
  const scenario = suggestedScenario(track, level, input.completedScenarioIds, day);
  const speakingUnit = suggestedConversation(track, level, input.completedUnitIds, day);
  const englishCalls =
    track === 'EN' && level === 'A1'
      ? unitCalls.filter((call) => {
          const unitLessons = getTrackLessons(track).filter(
            (lesson) => lesson.format === 'steps' && lesson.unit.id === call.unitId,
          );
          return (
            call.track === 'EN' &&
            unitLessons.length > 0 &&
            unitLessons.every((lesson) => progress[lesson.id]?.attempts.length)
          );
        })
      : [];
  const linkedCall = englishCalls.length ? englishCalls[day % englishCalls.length] : undefined;
  const nextLessonKey: ActivityKey | null = position.next
    ? `lesson:${position.next.lesson.id}`
    : null;
  const reviewKey: ActivityKey | null =
    reviewSummary(progress, track, day).due > 0 ? `review:${track}` : null;
  const listeningKey: ActivityKey | null = scenario ? `listening:${scenario.id}` : null;
  const speakingKey: ActivityKey = `speaking:${linkedCall?.id ?? speakingUnit?.id ?? track}`;
  // Listening and speaking take turns by day, so practice never feels the same twice.
  const eligibleSpeaking = track === 'EN' && level === 'A1' && !linkedCall ? null : speakingKey;
  const practice =
    day % 2 === 0 ? [listeningKey, eligibleSpeaking] : [eligibleSpeaking, listeningKey];
  // A learner who has not finished a single lesson always starts with one.
  const firstSteps = position.finishedLessons === 0 && nextLessonKey;
  // A goal date can need more than one new lesson a day: the lessons after the next one join the
  // session, never on a first day or a gentle restart.
  const extraLessons: ActivityKey[] =
    nextLessonKey && !firstSteps && !returning
      ? lessonsAhead(progress, track, input.startAt)
          .map((lesson): ActivityKey => `lesson:${lesson.id}`)
          .filter((key) => key !== nextLessonKey)
          .slice(0, Math.max(0, Math.min(2, (input.lessonsToday ?? 1) - 1)))
      : [];

  // Due phrases always come first: a short review before new words is what turns a lesson into
  // long-term memory (spaced retrieval), and the first review, the day after, matters most. So
  // even a one-step day in the warm-up stage grows to review plus the next lesson.
  const fresh = (): ActivityKey[] => {
    const ordered: (ActivityKey | null)[] =
      returning && !firstSteps
        ? [reviewKey ?? nextLessonKey ?? practice[0]]
        : firstSteps
          ? [nextLessonKey]
          : stage === 'warm-up'
            ? [reviewKey, nextLessonKey ?? practice[0], ...extraLessons]
            : [reviewKey, nextLessonKey, ...extraLessons, practice[0], practice[1]];
    const size =
      stageSteps[returning || firstSteps ? 'warm-up' : stage] +
      (reviewKey && stage === 'warm-up' && !returning && !firstSteps ? 1 : 0) +
      extraLessons.length;
    const keys: ActivityKey[] = [];
    const extras = new Set<ActivityKey>(extraLessons);
    for (const key of ordered) {
      if (
        key &&
        (extras.has(key) || !keys.some((existing) => existing.split(':')[0] === key.split(':')[0]))
      )
        keys.push(key);
      if (keys.length === size) break;
    }
    return keys.length ? keys : [practice[0] ?? speakingKey];
  };

  // Today's saved session keeps its items, except a lesson retired since it was saved (a content
  // update arrived during the day): that becomes the lesson that replaced it, unless it is done.
  const saved = (input.session?.day === today ? input.session.keys : []).map((key): ActivityKey =>
    key.startsWith('lesson:') && !done(key)
      ? `lesson:${pathStart(track, key.slice('lesson:'.length))}`
      : key,
  );
  const keys = saved.length ? [...new Set(saved)] : fresh();
  const steps = keys.map(stepFor).filter((step): step is PlanStep => Boolean(step));
  const doneCount = steps.filter((step) => step.done).length;
  const bonus =
    doneCount === steps.length
      ? (([nextLessonKey, ...practice] as (ActivityKey | null)[])
          .filter((key): key is ActivityKey => key !== null && !keys.includes(key))
          .map(stepFor)
          .find((step) => step && !step.done) ?? undefined)
      : undefined;

  return {
    stage,
    returning,
    steps,
    doneCount,
    minutes: steps.reduce((total, step) => total + step.minutes, 0),
    bonus: bonus ?? undefined,
    footnote: position.waitingForContent
      ? 'Your first three A1 units are done. Keep practising while more beginner units are being built.'
      : returning
        ? 'Welcome back. One small step is enough today.'
        : stage === 'warm-up'
          ? 'Start small: one step a day builds the habit.'
          : stage === 'building'
            ? 'Missed a day? Your progress waits for you.'
            : 'You have a real routine now. Keep it light and steady.',
    position,
    courseFinished: position.next === null && !position.waitingForContent,
    snapshot: { day: today, keys },
  };
}
