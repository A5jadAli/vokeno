import { learningRecommendation } from '@/features/coaching/recommendation';
import type { StartingAbility, StudyGoal } from '@/features/coaching/store';
import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import { getTrackLessons } from '@/features/foundations/catalog';
import { hasStartedPath, nextLesson } from '@/features/foundations/next';
import type { FoundationProgress } from '@/features/foundations/progress';
import {
  dayNumberOf,
  localDay,
  practiceStage,
  practisedKinds,
  stageSteps,
  type PracticeKind,
  type PracticeLog,
  type PracticeStage,
} from '@/features/habits/practice-log';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios } from '@/features/listening/scenarios';
import { reviewSummary, REVIEW_SESSION_SIZE } from '@/features/review/schedule';

export type PlanStepKind = Extract<PracticeKind, 'lesson' | 'review' | 'listening' | 'speaking'>;

export type PlanStep = {
  kind: PlanStepKind;
  title: string;
  why: string;
  href: string;
  action: string;
  minutes: number;
  done: boolean;
};

export type TodayPlan = {
  stage: PracticeStage;
  returning: boolean;
  steps: PlanStep[];
  doneCount: number;
  minutes: number;
  /** Shown once every step is done: one optional extra, never required. */
  bonus?: PlanStep;
  footnote: string;
  completedLessons: number;
  totalLessons: number;
};

export type TodayPlanInput = {
  track: LanguageTrack;
  progress: FoundationProgress;
  completedScenarioIds: string[];
  completedUnitIds: string[];
  ability: StartingAbility;
  goal: StudyGoal;
  log: PracticeLog;
  now: number;
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
const rank = (level: string) => levels.indexOf(level as (typeof levels)[number]);

/** The plan for today: one to three small steps that grow as the habit forms. */
export function buildTodayPlan(input: TodayPlanInput): TodayPlan {
  const { track, progress, log, now } = input;
  const today = localDay(now);
  const practisedToday = practisedKinds(log, today, track);
  const { stage, returning } = practiceStage(log, today);
  const lessons = getTrackLessons(track);
  const completedLessons = lessons.filter((lesson) => progress[lesson.id]?.attempts.length).length;
  const pathDone = completedLessons === lessons.length;
  const upcoming = nextLesson(progress, track);
  const level = pathDone ? (lessons.at(-1)?.level ?? 'A1') : upcoming.level;
  const day = dayNumberOf(today);

  const lessonStep = (): PlanStep | null =>
    practisedToday.includes('lesson') ? doneLessonStep() : freshLessonStep();

  const doneLessonStep = (): PlanStep => ({
    kind: 'lesson',
    title: 'Today’s lesson',
    why: 'Done. Its phrases join your review.',
    href: `/foundation/${upcoming.id}`,
    action: 'Open lesson',
    minutes: 5,
    done: true,
  });

  const freshLessonStep = (): PlanStep | null => {
    if (pathDone) return null;
    const started = hasStartedPath(progress, track);
    const resuming = (progress[upcoming.id]?.step ?? 0) > 0;
    const fromNext = {
      title: upcoming.title,
      why: upcoming.outcome,
      href: `/foundation/${upcoming.id}`,
    };
    // The onboarding suggestion can point at writing or speaking; this step is always a lesson.
    const suggested = started ? null : learningRecommendation(track, input.ability, input.goal);
    const recommendation = suggested?.href.startsWith('/foundation/') ? suggested : fromNext;
    return {
      kind: 'lesson',
      title: resuming ? `Finish ${upcoming.title}` : recommendation.title,
      why: resuming ? `Pick up where you left off. ${upcoming.outcome}` : recommendation.why,
      href: recommendation.href,
      action: resuming ? 'Continue lesson' : 'Start lesson',
      minutes: 5,
      done: false,
    };
  };

  const reviewStep = (): PlanStep | null => {
    if (practisedToday.includes('review'))
      return {
        kind: 'review',
        title: 'Phrase review',
        why: 'Done. Each phrase comes back just before you would forget it.',
        href: `/review?track=${track}`,
        action: 'Review again',
        minutes: 3,
        done: true,
      };
    const due = reviewSummary(progress, track, day).due;
    if (!due) return null;
    const count = Math.min(due, REVIEW_SESSION_SIZE);
    return {
      kind: 'review',
      title: `Review ${count} ${count === 1 ? 'phrase' : 'phrases'}`,
      why:
        due > count
          ? `A quick refresh of familiar phrases. The other ${due - count} can wait.`
          : 'A quick refresh, timed just before you would forget them.',
      href: `/review?track=${track}`,
      action: 'Start review',
      minutes: 3,
      done: false,
    };
  };

  const listeningStep = (): PlanStep | null => {
    const scenarios = listeningScenarios.filter(
      (scenario) => scenario.track === track && rank(scenario.level) <= Math.max(0, rank(level)),
    );
    const pool = scenarios.length
      ? scenarios
      : listeningScenarios.filter((scenario) => scenario.track === track);
    if (!pool.length) return null;
    const fresh = pool.find((scenario) => !input.completedScenarioIds.includes(scenario.id));
    const scenario = fresh ?? pool[day % pool.length];
    return {
      kind: 'listening',
      title: `Listen: ${scenario.title}`,
      why: practisedToday.includes('listening')
        ? 'Done. Real speech, at real speed.'
        : fresh
          ? `${scenario.context}. Replay it as often as you like.`
          : 'Listen again: it gets easier, and that is the point.',
      href: `/lesson/${scenario.id}`,
      action: 'Start listening',
      minutes: 3,
      done: practisedToday.includes('listening'),
    };
  };

  const speakingStep = (): PlanStep | null => {
    const units = getCurriculumUnits(track).filter((unit) => !examMockUnitIds.includes(unit.id));
    const fitting = units.filter((unit) => rank(unit.level) <= Math.max(0, rank(level)));
    const pool = fitting.length ? fitting : units;
    const fresh = pool.find((unit) => !input.completedUnitIds.includes(unit.id));
    const unit = fresh ?? (pool.length ? pool[day % pool.length] : undefined);
    return {
      kind: 'speaking',
      title: unit ? `Speak: ${unit.title}` : 'Speak with your coach',
      why: practisedToday.includes('speaking')
        ? 'Done. Speaking is where it all comes together.'
        : unit
          ? `${unit.outcome} Stop whenever you like.`
          : 'A short, friendly conversation. Stop whenever you like.',
      href: unit ? `/conversation?track=${track}&unit=${unit.id}` : `/conversation?track=${track}`,
      action: 'Start speaking',
      minutes: 5,
      done: practisedToday.includes('speaking'),
    };
  };

  // Alternate listening and speaking day by day, so practice never feels the same twice.
  const practiceOrder =
    day % 2 === 0 ? [listeningStep, speakingStep] : [speakingStep, listeningStep];
  const practice = (index: number) => practiceOrder[index % 2]();

  const candidates: (PlanStep | null)[] = returning
    ? [reviewStep() ?? lessonStep() ?? practice(0)]
    : stage === 'warm-up'
      ? [lessonStep() ?? reviewStep() ?? practice(0)]
      : stage === 'building'
        ? [lessonStep(), reviewStep() ?? practice(0), practice(1)]
        : [reviewStep() ?? practice(1), lessonStep(), practice(0), practice(1)];

  const steps: PlanStep[] = [];
  for (const step of candidates) {
    if (step && !steps.some((existing) => existing.kind === step.kind)) steps.push(step);
    if (steps.length === stageSteps[returning ? 'warm-up' : stage]) break;
  }
  if (!steps.length) steps.push(practice(0) ?? practice(1)!);

  const doneCount = steps.filter((step) => step.done).length;
  const bonus =
    doneCount === steps.length
      ? ([freshLessonStep(), practice(0), practice(1)].find((step) => step && !step.done) ??
        undefined)
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
    completedLessons,
    totalLessons: lessons.length,
  };
}
