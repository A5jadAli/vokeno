import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  englishReferenceOrDefault,
  type EnglishReference,
} from '../../../supabase/functions/_shared/english-reference';

import type { LanguageTrack } from '@/features/listening/scenarios';
import { scopedLearningStorage } from '@/features/sync/scoped-storage';
import {
  mergeWritingProgress,
  parseWritingProgress,
  type WritingFeedback,
  type WritingProgress,
} from '@/features/writing/progress';
import {
  mergeFoundationProgress,
  parseFoundationProgress,
  type FoundationEntry,
  type FoundationProgress,
} from '@/features/foundations/progress';

import { mergeCoachingSignal } from './signals';
import type { CoachingSignal } from './store-types';
import {
  addPractice,
  localDay,
  mergePracticeLogs,
  parsePracticeLog,
  serializePracticeLog,
  type PracticeKind,
  type PracticeLog,
} from '@/features/habits/practice-log';
import type { SessionSnapshot } from '@/features/coaching/daily-plan';
import type { LessonLevel } from '@/features/foundations/types';
import {
  addActivity,
  parseActivityLog,
  type ActivityKey,
  type ActivityLog,
} from '@/features/journey/activity-log';

export type { CoachingSignal } from './store-types';

export type SpeakingGoal = 'everyday' | 'interviews' | 'work-study';
export type CoachTone = 'adaptive' | 'supportive' | 'tough';
export type StartingAbility = 'new' | 'basics' | 'conversational';
export type StudyGoal =
  | 'everyday'
  | 'work-study'
  | 'interviews'
  | 'meetings'
  | 'presentations'
  | 'ielts-academic'
  | 'ielts-general';
/**
 * `testDate` (YYYY-MM-DD) is this language's exam date, e.g. IELTS or Goethe. `startAt` is the
 * lesson the learner chose to start from (their answer in setup, or an accepted placement).
 * `goalLevel` is the level to reach by the test date, and `goalSince` the day that goal was set.
 */
type LearningChoices = {
  ability?: StartingAbility;
  studyGoal?: StudyGoal;
  testDate?: string;
  goalLevel?: LessonLevel;
  goalSince?: string;
  startAt?: string;
};

export type SpeakingPreferences = {
  DE: { goal: SpeakingGoal; reference: 'de-DE' } & LearningChoices;
  EN: { goal: SpeakingGoal; reference: EnglishReference } & LearningChoices;
  ES: { goal: SpeakingGoal; reference: 'es-MX' } & LearningChoices;
};

const defaultPreferences: SpeakingPreferences = {
  DE: { goal: 'everyday', reference: 'de-DE' },
  EN: { goal: 'everyday', reference: 'en-GB' },
  ES: { goal: 'everyday', reference: 'es-MX' },
};

function withLanguageDefaults(
  value: Partial<SpeakingPreferences> | undefined,
): SpeakingPreferences {
  return {
    DE: { ...defaultPreferences.DE, ...value?.DE },
    EN: {
      ...defaultPreferences.EN,
      ...value?.EN,
      reference: englishReferenceOrDefault(value?.EN?.reference),
    },
    ES: { ...defaultPreferences.ES, ...value?.ES },
  };
}

type CoachingState = {
  writing: WritingProgress;
  saveWriting: (id: string, text: string, submitted?: string) => void;
  saveWritingFeedback: (id: string, feedback: WritingFeedback) => void;
  setLearningChoices: (
    track: LanguageTrack,
    ability: StartingAbility,
    studyGoal: StudyGoal,
  ) => void;
  coachTone: CoachTone;
  completedUnitIds: string[];
  hasHydrated: boolean;
  preferences: SpeakingPreferences;
  signals: CoachingSignal[];
  speakingPracticeDates: string[];
  testDate: string | null;
  writingPracticeDates: string[];
  foundations: FoundationProgress;
  saveFoundation: (id: string, entry: FoundationEntry) => void;
  completeUnit: (unitId: string) => void;
  mergeCloudState: (state: Partial<PersistedCoachingState>) => void;
  /** What was practised today, for the honest streak. Any step counts. */
  practiceLog: PracticeLog;
  recordPractice: (kind: PracticeKind, track: LanguageTrack) => void;
  /** What was finished, by activity. Only this ticks today's session and the course. */
  activityLog: ActivityLog;
  recordActivity: (key: ActivityKey, track: LanguageTrack) => void;
  /** Today's session per language, fixed once built so items never change under the learner. */
  sessions: Partial<Record<LanguageTrack, SessionSnapshot>>;
  saveSession: (track: LanguageTrack, session: SessionSnapshot) => void;
  setStartAt: (track: LanguageTrack, lessonId: string | undefined) => void;
  recordSpeakingPractice: (track: LanguageTrack) => void;
  recordWritingPractice: (track: LanguageTrack) => void;
  recordSignal: (signal: Omit<CoachingSignal, 'count' | 'lastSeenAt'>) => void;
  /**
   * What the coach may recall in later unit calls: facts the learner shared and recurring slips.
   * Stored on this device only (not in cloud sync); the learner can see, edit and clear it.
   */
  coachMemory: Partial<Record<LanguageTrack, CoachMemoryEntry>>;
  /** Unit calls already started, so the free one per unit can be labelled honestly. */
  usedUnitCalls: string[];
  saveCallReview: (
    track: LanguageTrack,
    review: { facts: string[]; corrections: { said: string; better: string }[] },
  ) => void;
  forgetCoachFact: (track: LanguageTrack, fact: string) => void;
  forgetCoachMistake: (track: LanguageTrack, better: string) => void;
  clearCoachMemory: (track: LanguageTrack) => void;
  markUnitCall: (callId: string) => void;
  resetCoaching: () => void;
  setCoachTone: (tone: CoachTone) => void;
  setGoal: (track: LanguageTrack, goal: SpeakingGoal) => void;
  setEnglishReference: (reference: EnglishReference) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setTestDate: (track: LanguageTrack, date: string | null, level?: LessonLevel) => void;
};

export type CoachMemoryEntry = {
  facts: string[];
  /** Corrections from calls, most frequent first; the coach recycles the top few. */
  mistakes: { said: string; better: string; count: number }[];
};

const MAX_FACTS = 8;
const MAX_MISTAKES = 10;

export type PersistedCoachingState = Pick<
  CoachingState,
  | 'coachMemory'
  | 'usedUnitCalls'
  | 'coachTone'
  | 'completedUnitIds'
  | 'preferences'
  | 'signals'
  | 'speakingPracticeDates'
  | 'practiceLog'
  | 'activityLog'
  | 'sessions'
  | 'testDate'
  | 'writingPracticeDates'
  | 'foundations'
  | 'writing'
>;

function mergePersistedSignals(local: CoachingSignal[], remote: CoachingSignal[]) {
  const merged = new Map<string, CoachingSignal>();
  for (const signal of [...local, ...remote]) {
    const key = `${signal.track}:${signal.label}`;
    const current = merged.get(key);
    if (!current) {
      merged.set(key, signal);
      continue;
    }
    const incomingIsNewer = Date.parse(signal.lastSeenAt) > Date.parse(current.lastSeenAt);
    merged.set(key, {
      ...(incomingIsNewer ? signal : current),
      count: Math.max(current.count, signal.count),
      lastSeenAt: incomingIsNewer ? signal.lastSeenAt : current.lastSeenAt,
    });
  }
  return [...merged.values()]
    .sort((a, b) => Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt))
    .slice(0, 12);
}

export const useCoachingStore = create<CoachingState>()(
  persist<CoachingState, [], [], PersistedCoachingState>(
    (set) => ({
      writing: {},
      saveWriting: (id, text, submitted) =>
        set((state) => ({
          writing: {
            ...state.writing,
            ...parseWritingProgress({
              [id]: {
                text,
                submitted: submitted ?? state.writing[id]?.submitted ?? '',
                updatedAt: new Date().toISOString(),
                feedback: state.writing[id]?.feedback,
              },
            }),
          },
        })),
      saveWritingFeedback: (id, feedback) =>
        set((state) => {
          const current = state.writing[id];
          if (!current) return {};
          return {
            writing: {
              ...state.writing,
              ...parseWritingProgress({
                [id]: { ...current, feedback, updatedAt: new Date().toISOString() },
              }),
            },
          };
        }),
      setLearningChoices: (track, ability, studyGoal) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [track]: {
              ...state.preferences[track],
              ability,
              studyGoal,
              goal:
                studyGoal === 'work-study' ||
                studyGoal === 'meetings' ||
                studyGoal === 'presentations'
                  ? 'work-study'
                  : studyGoal === 'interviews' || studyGoal.startsWith('ielts')
                    ? 'interviews'
                    : 'everyday',
            },
          },
        })),
      coachTone: 'supportive',
      completedUnitIds: [],
      hasHydrated: false,
      preferences: defaultPreferences,
      signals: [],
      speakingPracticeDates: [],
      practiceLog: {},
      activityLog: {},
      sessions: {},
      coachMemory: {},
      usedUnitCalls: [],
      testDate: null,
      writingPracticeDates: [],
      foundations: {},
      saveFoundation: (id, entry) =>
        set((state) => ({
          foundations: {
            ...state.foundations,
            ...parseFoundationProgress({ [id]: { ...entry, updatedAt: new Date().toISOString() } }),
          },
        })),
      completeUnit: (unitId) =>
        set((state) =>
          state.completedUnitIds.includes(unitId)
            ? state
            : { completedUnitIds: [...state.completedUnitIds, unitId] },
        ),
      mergeCloudState: (cloud) =>
        set((state) => ({
          writing: mergeWritingProgress(state.writing, cloud.writing ?? {}),
          foundations: mergeFoundationProgress(state.foundations, cloud.foundations ?? {}),
          coachTone: cloud.coachTone ?? state.coachTone,
          completedUnitIds: [
            ...new Set([...state.completedUnitIds, ...(cloud.completedUnitIds ?? [])]),
          ],
          preferences: cloud.preferences
            ? withLanguageDefaults(cloud.preferences)
            : state.preferences,
          signals: mergePersistedSignals(state.signals, cloud.signals ?? []),
          practiceLog: mergePracticeLogs(
            state.practiceLog,
            cloud.practiceLog ?? {},
            localDay(Date.now()),
          ),
          speakingPracticeDates: [
            ...new Set([...state.speakingPracticeDates, ...(cloud.speakingPracticeDates ?? [])]),
          ]
            .sort()
            .slice(-30),
          testDate: cloud.testDate === undefined ? state.testDate : cloud.testDate,
          writingPracticeDates: [
            ...new Set([...state.writingPracticeDates, ...(cloud.writingPracticeDates ?? [])]),
          ]
            .sort()
            .slice(-30),
        })),
      recordSignal: (signal) =>
        set((state) => ({ signals: mergeCoachingSignal(state.signals, signal) })),
      recordPractice: (kind, track) =>
        set((state) => {
          const practiceLog = addPractice(state.practiceLog, kind, Date.now(), track);
          return practiceLog === state.practiceLog ? state : { practiceLog };
        }),
      recordActivity: (key, track) =>
        set((state) => {
          const kind = key.slice(0, key.indexOf(':')) as PracticeKind;
          const now = Date.now();
          return {
            activityLog: addActivity(state.activityLog, key, localDay(now)),
            practiceLog: addPractice(state.practiceLog, kind, now, track),
          };
        }),
      saveSession: (track, session) =>
        set((state) =>
          state.sessions[track]?.day === session.day &&
          state.sessions[track]?.keys.join() === session.keys.join()
            ? state
            : { sessions: { ...state.sessions, [track]: session } },
        ),
      setStartAt: (track, lessonId) =>
        set((state) => {
          const { [track]: _dropped, ...sessions } = state.sessions;
          return {
            // Fix the chosen first activity before opening it. Otherwise entering from setup
            // (without visiting Today) can build a new session only after the lesson is done,
            // showing 0 completed and turning the next lesson into another requirement.
            sessions: lessonId
              ? {
                  ...sessions,
                  [track]: {
                    day: localDay(Date.now()),
                    keys: [`lesson:${lessonId}` as ActivityKey],
                  },
                }
              : sessions,
            preferences: {
              ...state.preferences,
              [track]: { ...state.preferences[track], startAt: lessonId },
            },
          };
        }),
      recordSpeakingPractice: (track) =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const practiceLog = addPractice(state.practiceLog, 'speaking', Date.now(), track);
          return {
            practiceLog,
            speakingPracticeDates: state.speakingPracticeDates.includes(today)
              ? state.speakingPracticeDates
              : [...state.speakingPracticeDates, today].slice(-30),
          };
        }),
      recordWritingPractice: (track) =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const practiceLog = addPractice(state.practiceLog, 'writing', Date.now(), track);
          return {
            practiceLog,
            writingPracticeDates: state.writingPracticeDates.includes(today)
              ? state.writingPracticeDates
              : [...state.writingPracticeDates, today].slice(-30),
          };
        }),
      saveCallReview: (track, review) =>
        set((state) => {
          const current = state.coachMemory[track] ?? { facts: [], mistakes: [] };
          const facts = [...review.facts, ...current.facts]
            .map((fact) => fact.trim())
            .filter(
              (fact, index, all) =>
                fact &&
                all.findIndex((other) => other.toLowerCase() === fact.toLowerCase()) === index,
            )
            .slice(0, MAX_FACTS);
          const mistakes = [...current.mistakes];
          for (const correction of review.corrections) {
            const found = mistakes.find(
              (item) => item.better.toLowerCase() === correction.better.toLowerCase(),
            );
            if (found) found.count += 1;
            else mistakes.push({ said: correction.said, better: correction.better, count: 1 });
          }
          mistakes.sort((a, b) => b.count - a.count);
          return {
            coachMemory: {
              ...state.coachMemory,
              [track]: { facts, mistakes: mistakes.slice(0, MAX_MISTAKES) },
            },
          };
        }),
      forgetCoachFact: (track, fact) =>
        set((state) => {
          const current = state.coachMemory[track];
          if (!current) return {};
          return {
            coachMemory: {
              ...state.coachMemory,
              [track]: { ...current, facts: current.facts.filter((item) => item !== fact) },
            },
          };
        }),
      forgetCoachMistake: (track, better) =>
        set((state) => {
          const current = state.coachMemory[track];
          if (!current) return {};
          return {
            coachMemory: {
              ...state.coachMemory,
              [track]: {
                ...current,
                mistakes: current.mistakes.filter((item) => item.better !== better),
              },
            },
          };
        }),
      clearCoachMemory: (track) =>
        set((state) => ({
          coachMemory: { ...state.coachMemory, [track]: { facts: [], mistakes: [] } },
        })),
      markUnitCall: (callId) =>
        set((state) =>
          state.usedUnitCalls.includes(callId)
            ? {}
            : { usedUnitCalls: [...state.usedUnitCalls, callId] },
        ),
      resetCoaching: () =>
        set({
          writing: {},
          foundations: {},
          coachTone: 'supportive',
          completedUnitIds: [],
          preferences: defaultPreferences,
          signals: [],
          speakingPracticeDates: [],
          practiceLog: {},
          activityLog: {},
          sessions: {},
          coachMemory: {},
          usedUnitCalls: [],
          testDate: null,
          writingPracticeDates: [],
        }),
      setCoachTone: (coachTone) => set({ coachTone }),
      setEnglishReference: (reference) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            EN: { ...state.preferences.EN, reference: englishReferenceOrDefault(reference) },
          },
        })),
      setGoal: (track, goal) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [track]: { ...state.preferences[track], goal },
          },
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setTestDate: (track, date, level) =>
        set((state) => {
          const current = state.preferences[track];
          // A new date or level is a new goal: its weeks count from today.
          const changed = date !== (current.testDate ?? null) || level !== current.goalLevel;
          return {
            preferences: {
              ...state.preferences,
              [track]: {
                ...current,
                testDate: date ?? undefined,
                goalLevel: date ? level : undefined,
                goalSince: date
                  ? changed || !current.goalSince
                    ? localDay(Date.now())
                    : current.goalSince
                  : undefined,
              },
            },
            // Older app versions read the single date, which has always meant English (IELTS).
            ...(track === 'EN' ? { testDate: date } : {}),
          };
        }),
    }),
    {
      migrate: (persistedState) => {
        const state = persistedState as Partial<PersistedCoachingState>;
        return {
          writing: parseWritingProgress(state.writing),
          foundations: parseFoundationProgress(state.foundations),
          coachTone: state.coachTone ?? 'supportive',
          completedUnitIds: state.completedUnitIds ?? [],
          preferences: withLanguageDefaults(state.preferences),
          signals: state.signals ?? [],
          speakingPracticeDates: state.speakingPracticeDates ?? [],
          practiceLog: parsePracticeLog(serializePracticeLog(state.practiceLog ?? {})),
          activityLog: parseActivityLog(state.activityLog),
          // Sessions are rebuilt each day; an older stored one is never needed.
          sessions: {},
          coachMemory: {},
          usedUnitCalls: [],
          testDate: state.testDate ?? null,
          writingPracticeDates: state.writingPracticeDates ?? [],
        };
      },
      // Re-check saved lesson progress on every load, so content updates delivered over the
      // air re-match review cards and restart lessons whose steps changed.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PersistedCoachingState>;
        return {
          ...current,
          ...saved,
          preferences: withLanguageDefaults(saved.preferences ?? current.preferences),
          foundations: parseFoundationProgress(saved.foundations ?? current.foundations),
        };
      },
      name: 'voka-coaching',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      partialize: (state) => ({
        coachMemory: state.coachMemory,
        usedUnitCalls: state.usedUnitCalls,
        writing: state.writing,
        foundations: state.foundations,
        coachTone: state.coachTone,
        completedUnitIds: state.completedUnitIds,
        preferences: state.preferences,
        signals: state.signals,
        speakingPracticeDates: state.speakingPracticeDates,
        practiceLog: state.practiceLog,
        activityLog: state.activityLog,
        sessions: state.sessions,
        testDate: state.testDate,
        writingPracticeDates: state.writingPracticeDates,
      }),
      skipHydration: true,
      storage: createJSONStorage(() => scopedLearningStorage.storage),
      version: 8,
    },
  ),
);

export const speakingGoalCopy: Record<SpeakingGoal, { description: string; label: string }> = {
  everyday: {
    description: 'Fast, practical exchanges with less translation in your head.',
    label: 'Everyday life',
  },
  interviews: {
    description: 'Natural answers, modern phrasing and confident follow-up questions.',
    label: 'Interviews',
  },
  'work-study': {
    description: 'Clear explanations, discussion and professional register.',
    label: 'Work & study',
  },
};

/** A language's test date. The original single date belongs to English. */
export function testDateFor(
  state: Pick<CoachingState, 'preferences' | 'testDate'>,
  track: LanguageTrack,
): string | null {
  return state.preferences[track]?.testDate ?? (track === 'EN' ? state.testDate : null);
}
