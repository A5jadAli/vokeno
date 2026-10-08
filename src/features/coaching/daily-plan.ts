import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import { foundationLessons } from '@/features/foundations/catalog';
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
import { coursePosition, lessonMinutes, type CoursePosition } from '@/features/journey/course';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';
import { reviewSummary, REVIEW_SESSION_SIZE } from '@/features/review/schedule';

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
  now: number;
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
const rank = (level: string) => levels.indexOf(level as (typeof levels)[number]);

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
  const level = position.next?.lesson.level ?? foundationLessons.at(-1)?.level ?? 'A1';
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
    const unit = lesson.format === 'steps' ? `Unit ${lesson.unit.number} · ` : '';
    return {
      kind: 'lesson',
      key,
      title: lesson.title,
      why: finished
        ? 'Finished today. Its words are in your review.'
        : resuming
          ? `${unit}Pick up where you left off.`
          : `${unit}${lesson.outcome}`,
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
        ? 'Done for today. Scheduled review helps you remember them.'
        : due > count
          ? `A quick refresh of familiar phrases. The other ${due - count} can wait.`
          : 'A quick refresh of phrases you have learned.',
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
    const key: ActivityKey = `speaking:${id}`;
    const finished = done(key);
    return {
      kind: 'speaking',
      key,
      title: unit ? `Speak: ${unit.title}` : 'Speak with your coach',
      why: finished
        ? 'Done. Speaking is where it all comes together.'
        : unit
          ? `${unit.outcome} Stop whenever you like.`
          : 'A short, friendly conversation. Stop whenever you like.',
      href: unit ? `/conversation?track=${track}&unit=${unit.id}` : `/conversation?track=${track}`,
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
  const fittingScenarios = listeningScenarios.filter(
    (scenario) => scenario.track === track && rank(scenario.level) <= Math.max(0, rank(level)),
  );
  const scenarioPool = fittingScenarios.length
    ? fittingScenarios
    : listeningScenarios.filter((scenario) => scenario.track === track);
  const scenario =
    scenarioPool.find((item) => !input.completedScenarioIds.includes(item.id)) ??
    scenarioPool[day % Math.max(1, scenarioPool.length)];
  const speakingUnits = getCurriculumUnits(track).filter(
    (unit) => !examMockUnitIds.includes(unit.id),
  );
  const fittingUnits = speakingUnits.filter((unit) => rank(unit.level) <= Math.max(0, rank(level)));
  const unitPool = fittingUnits.length ? fittingUnits : speakingUnits;
  const speakingUnit =
    unitPool.find((unit) => !input.completedUnitIds.includes(unit.id)) ??
    unitPool[day % Math.max(1, unitPool.length)];
  const nextLessonKey: ActivityKey | null = position.next
    ? `lesson:${position.next.lesson.id}`
    : null;
  const reviewKey: ActivityKey | null =
    reviewSummary(progress, track, day).due > 0 ? `review:${track}` : null;
  const listeningKey: ActivityKey | null = scenario ? `listening:${scenario.id}` : null;
  const speakingKey: ActivityKey = `speaking:${speakingUnit?.id ?? track}`;
  // Listening and speaking take turns by day, so practice never feels the same twice.
  const practice = day % 2 === 0 ? [listeningKey, speakingKey] : [speakingKey, listeningKey];
  // A learner who has not finished a single lesson always starts with one.
  const firstSteps = position.finishedLessons === 0 && nextLessonKey;

  const fresh = (): ActivityKey[] => {
    const ordered: (ActivityKey | null)[] =
      returning && !firstSteps
        ? [reviewKey ?? nextLessonKey ?? practice[0]]
        : stage === 'warm-up' || firstSteps
          ? [nextLessonKey ?? reviewKey ?? practice[0]]
          : stage === 'building'
            ? [nextLessonKey, reviewKey ?? practice[0], practice[1]]
            : [reviewKey ?? practice[1], nextLessonKey, practice[0], practice[1]];
    const size = stageSteps[returning || firstSteps ? 'warm-up' : stage];
    const keys: ActivityKey[] = [];
    for (const key of ordered) {
      if (key && !keys.some((existing) => existing.split(':')[0] === key.split(':')[0]))
        keys.push(key);
      if (keys.length === size) break;
    }
    return keys.length ? keys : [practice[0] ?? speakingKey];
  };

  const keys =
    input.session?.day === today && input.session.keys.length ? input.session.keys : fresh();
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
    footnote: returning
      ? 'Welcome back. One small step is enough today.'
      : stage === 'warm-up'
        ? 'Start small: one step a day builds the habit.'
        : stage === 'building'
          ? 'Missed a day? Your progress waits for you.'
          : 'You have a real routine now. Keep it light and steady.',
    position,
    courseFinished: position.next === null,
    snapshot: { day: today, keys },
  };
}
