import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { haptic } from '@/features/feedback/haptics';
import { BottomSheet } from '@/components/bottom-sheet';
import { ReportContent } from '@/components/report-content';
import { VoiceLine, VoiceLineMark } from '@/components/voice-line';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import {
  Dark,
  Feedback,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useAssessmentStore } from '@/features/assessment/store';
import { useCoachingStore } from '@/features/coaching/store';
import {
  type CallReview,
  createAssessmentRequest,
  createCallReview,
  FreeCallUsedError,
  isConversationBackendConfigured,
} from '@/features/conversation/backend';
import { CallReviewCard } from '@/components/call-review-card';
import { useLessonAudio } from '@/features/audio/use-lesson-audio';
import { bringBackSooner, cardsForPhrases } from '@/features/coaching/unit-call-review';
import {
  getUnitCall,
  learnerWords,
  normaliseSpeech,
  phrasesUsed,
  REVIEW_MIN_WORDS,
  UNIT_CALL_SECONDS,
  unitCallOpening,
  type UnitCallPhrase,
} from '../../supabase/functions/_shared/unit-calls';
import {
  detectStruggleSignals,
  parseRealtimeEvent,
  type RealtimeEvent,
  type StruggleSignal,
  type TranscriptTurn,
  upsertTranscriptTurn,
  UNCLEAR_CAPTION,
} from '@/features/conversation/events';
import {
  createDeadMicrophoneCheck,
  createSpeechGate,
  lineLevel,
} from '@/features/conversation/audio-levels';
import { getConversationMode } from '@/features/conversation/modes';
import { startRealtimeSession } from '@/features/conversation/realtime-session';
import { prepareMicrophoneAccess } from '@/features/conversation/microphone-access';
import type {
  RealtimeSessionHandle,
  RealtimeSessionStatus,
} from '@/features/conversation/realtime-types';
import { useSelectedLanguage } from '@/features/language/selection';
import { recordUsage } from '@/features/usage/usage';
import { trackColors, type LanguageTrack } from '@/features/language/config';
import { getCurriculumUnit } from '@/features/curriculum/catalog';
import { formatClock, useMockNotes } from '@/features/speaking-mock/store';
import {
  getSpeakingCard,
  type SpeakingCard,
} from '../../supabase/functions/_shared/speaking-cards';
import { LanguageSwitch } from '@/components/language-switch';
import { contentLevel } from '@/features/foundations/level-status';

const BRIEF_OPENING =
  'Keep this opening very short: one brief greeting and one simple question, under eight seconds of speech. Then stop and wait for the learner.';
const JOINING_SILENT_MS = 8000;
const JOINING_MAX_MS = 25000;

const statusCopy: Record<RealtimeSessionStatus | 'idle', string> = {
  connecting: 'Connecting to your coach…',
  ended: 'Conversation ended',
  error: 'Connection needs attention',
  idle: 'Ready when you are',
  joining: 'Your coach is saying hello…',
  listening: 'Your turn. Speak anytime',
  speaking: 'Coach is speaking. You can interrupt',
  thinking: 'Thinking…',
};

const statusHint: Partial<Record<RealtimeSessionStatus | 'idle', string>> = {
  idle: 'Tap start. Your AI coach says hello first, then it’s your turn.',
  connecting: 'This takes a few seconds. Your coach will speak first.',
  joining: 'Listen first. Your microphone opens when your coach finishes.',
};

export default function ConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    diagnostic?: string;
    practice?: string;
    track?: string;
    unit?: string;
    card?: string;
    call?: string;
  }>();
  const diagnostic = params.practice === 'diagnostic' || params.diagnostic === '1';
  const [track, setTrack] = useSelectedLanguage();
  const [status, setStatus] = useState<RealtimeSessionStatus | 'idle'>('idle');
  // The voice line's height: the real level of whoever is speaking, smoothed on the UI thread.
  const voiceLevel = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  // An open microphone reporting exact silence for 5 seconds is blocked or dead, not a quiet room.
  const [microphoneDead, setMicrophoneDead] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const [signals, setSignals] = useState<StruggleSignal[]>([]);
  const [error, setError] = useState('');
  const [microphoneHint, setMicrophoneHint] = useState('');
  const [permissionPending, setPermissionPending] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  const permissionPendingRef = useRef(false);
  const focusedRef = useRef(false);
  const [assessmentPending, setAssessmentPending] = useState(false);
  const sessionRef = useRef<RealtimeSessionHandle | undefined>(undefined);
  const startAbortRef = useRef<AbortController | undefined>(undefined);
  const userTurnIdsRef = useRef(new Set<string>());
  // The coach opens every call. The microphone stays closed until that greeting ends, so room
  // noise cannot cut it off and "your turn" is only shown when it is true.
  const greetingDoneRef = useRef(false);
  const coachAudioRef = useRef(false);
  const mutedRef = useRef(false);
  const finishGreeting = useCallback(() => {
    if (greetingDoneRef.current) return;
    greetingDoneRef.current = true;
    sessionRef.current?.setMuted(mutedRef.current);
    haptic.select();
  }, []);
  // If the greeting never plays (dropped response, muted output) or never reports its end,
  // don't leave the learner waiting on "saying hello": hand the turn over.
  useEffect(() => {
    if (status !== 'joining') return;
    const handOver = () => {
      finishGreeting();
      setStatus((current) => (current === 'joining' ? 'listening' : current));
    };
    const silent = setTimeout(() => {
      if (!coachAudioRef.current) handOver();
    }, JOINING_SILENT_MS);
    const cap = setTimeout(handOver, JOINING_MAX_MS);
    return () => {
      clearTimeout(silent);
      clearTimeout(cap);
    };
  }, [finishGreeting, status]);
  const generationRef = useRef(0);
  const assessmentAbortRef = useRef<AbortController | undefined>(undefined);
  const completeUnit = useCoachingStore((state) => state.completeUnit);
  const coachTonePreference = useCoachingStore((state) => state.coachTone);
  const goal = useCoachingStore((state) => state.preferences[track].goal);
  const practiceDates = useCoachingStore((state) => state.speakingPracticeDates);
  const recordSpeakingPractice = useCoachingStore((state) => state.recordSpeakingPractice);
  const recordActivity = useCoachingStore((state) => state.recordActivity);
  const recordSignal = useCoachingStore((state) => state.recordSignal);
  const mergeAssessment = useAssessmentStore((state) => state.mergeAssessment);
  const storedSignals = useCoachingStore((state) => state.signals);
  const useAdaptiveToughCoach =
    coachTonePreference === 'adaptive' &&
    practiceDates.length >= 3 &&
    storedSignals.some((signal) => signal.track === track && signal.count >= 3);
  const activeCoachTone =
    coachTonePreference === 'tough' || useAdaptiveToughCoach ? 'tough' : 'supportive';
  const requestedUnit = getCurriculumUnit(params.unit);
  const unit = requestedUnit?.track === track ? requestedUnit : undefined;
  const requestedCall = getUnitCall(params.call);
  const unitCall = requestedCall?.track === track ? requestedCall : undefined;
  const coachMemory = useCoachingStore((state) => state.coachMemory[track]);
  const speech = useLessonAudio(track);
  const [callReview, setCallReview] = useState<CallReview | null>(null);
  const [callReviewPending, setCallReviewPending] = useState(false);
  const [callReviewError, setCallReviewError] = useState('');
  const [callPhrases, setCallPhrases] = useState<(UnitCallPhrase & { used: boolean })[]>([]);
  const [callTooShort, setCallTooShort] = useState(false);
  const [freeCallUsed, setFreeCallUsed] = useState(false);
  const [callStartedAt, setCallStartedAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(UNIT_CALL_SECONDS);
  const callReviewedRef = useRef(false);
  const requestedCard = getSpeakingCard(params.card);
  const examCard = requestedCard?.track === track ? requestedCard : undefined;
  const baseMode = getConversationMode(track);
  const mode = unitCall
    ? {
        ...baseMode,
        description: unitCall.learnerGoal,
        level: unitCall.level,
        title: unitCall.title,
      }
    : unit
      ? {
          ...baseMode,
          description: unit.outcome,
          level: unit.level,
          starter: unit.coachBrief,
          title: unit.title,
        }
      : diagnostic
        ? {
            ...baseMode,
            description: 'Read the sentence, then answer a few short questions.',
            level: 'Adaptive',
            starter:
              track === 'EN'
                ? 'Run a brief spoken English check. First ask the learner to read: “The bus to the city leaves every twenty minutes.” Then ask two progressively harder everyday questions. Give a broad CEFR range only when there is enough evidence, and explain that it is an estimate rather than a certified result.'
                : track === 'DE'
                  ? 'Run a brief spoken German check. First ask the learner to read: “Der Bus in die Stadt fährt alle zwanzig Minuten.” Then ask two progressively harder everyday questions. Give a broad CEFR range only when there is enough evidence, and explain that it is an estimate rather than a certified result.'
                  : 'Run a brief spoken Spanish check in everyday Mexican Spanish. First ask the learner to read: “El autobús al centro sale a las nueve.” Then ask two short practical questions. Explain that the result is only a broad, non-certified estimate.',
            title: 'Spoken level check',
          }
        : baseMode;
  const darkAccent = trackColors[track].onDark;
  const active = !['ended', 'error', 'idle'].includes(status);

  const releaseSession = useCallback(() => {
    generationRef.current += 1;
    const starting = startAbortRef.current;
    const session = sessionRef.current;
    startAbortRef.current = undefined;
    sessionRef.current = undefined;
    starting?.abort();
    session?.stop();
    mutedRef.current = false;
    setMuted(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      setPermissionPending(permissionPendingRef.current);
      const leave = () => {
        releaseSession();
        assessmentAbortRef.current?.abort();
        assessmentAbortRef.current = undefined;
        setAssessmentPending(false);
        setStatus((current) => (current === 'idle' ? current : 'ended'));
      };
      const subscription = AppState.addEventListener('change', (next) => {
        if (next !== 'active') leave();
      });
      return () => {
        focusedRef.current = false;
        subscription.remove();
        leave();
      };
    }, [releaseSession]),
  );

  const turnsRef = useRef<TranscriptTurn[]>([]);
  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  // After a unit call: mark which of the unit's phrases came up, bring the others back in
  // tomorrow's review, then fetch corrections, a tip and things worth remembering.
  const reviewUnitCall = useCallback(async () => {
    if (!unitCall || callReviewedRef.current) return;
    callReviewedRef.current = true;
    setCallStartedAt(null);
    const learner = turnsRef.current
      .filter((turn) => turn.role === 'user' && turn.text.trim() && turn.text !== UNCLEAR_CAPTION)
      .map((turn) => turn.text);
    const used = phrasesUsed(unitCall, learner);
    setCallPhrases(used);
    const bringBack = (phrases: UnitCallPhrase[]) => {
      const state = useCoachingStore.getState();
      const updated = bringBackSooner(state.foundations, cardsForPhrases(track, unitCall, phrases));
      for (const [id, entry] of Object.entries(updated))
        if (entry && entry !== state.foundations[id]) state.saveFoundation(id, entry);
    };
    // A call with almost nothing from the learner (or only background noise) proves nothing.
    const tooShort = learnerWords(learner) < REVIEW_MIN_WORDS;
    setCallTooShort(tooShort);
    if (tooShort) {
      setCallReviewError('Say a little more next time so there is something to review.');
      return;
    }
    bringBack(used.filter((item) => !item.used));
    setCallReviewPending(true);
    setCallReviewError('');
    try {
      const review = await createCallReview(track, unitCall.id, turnsRef.current);
      setCallReview(review);
      useCoachingStore.getState().saveCallReview(track, review);
      // A unit phrase the coach had to correct comes back sooner as well.
      bringBack(
        unitCall.phrases.filter((item) =>
          review.corrections.some((correction) =>
            item.match.some((fragment) =>
              normaliseSpeech(correction.better).includes(` ${fragment}`),
            ),
          ),
        ),
      );
    } catch (reason) {
      setCallReviewError(
        reason instanceof Error ? reason.message : 'The call review is not available right now.',
      );
    } finally {
      setCallReviewPending(false);
    }
  }, [track, unitCall]);

  const handleEvent = useCallback(
    (event: RealtimeEvent) => {
      const parsed = parseRealtimeEvent(event);
      if (!parsed) return;

      if (parsed.kind === 'error') {
        releaseSession();
        setError(parsed.message);
        setStatus('error');
        return;
      }
      if (parsed.kind === 'coach-audio-start' || parsed.kind === 'speaking') {
        coachAudioRef.current = true;
        // The greeting keeps its own "saying hello" state; later replies can be interrupted.
        if (greetingDoneRef.current) setStatus('speaking');
      }
      if (parsed.kind === 'coach-audio-stop') {
        coachAudioRef.current = false;
        finishGreeting();
        setStatus('listening');
      }
      // Replies without audio (including a greeting that produced none) still hand the turn
      // back once generation finishes.
      if (parsed.kind === 'response-done' && !coachAudioRef.current) {
        finishGreeting();
        setStatus('listening');
      }
      if (parsed.kind === 'listening' && greetingDoneRef.current) setStatus('listening');
      if (parsed.kind === 'waiting' && greetingDoneRef.current) setStatus('thinking');
      if (parsed.kind === 'assistant-delta' || parsed.kind === 'assistant-final') {
        setTurns((current) =>
          upsertTranscriptTurn(current, {
            final: parsed.kind === 'assistant-final',
            id: parsed.id,
            role: 'assistant',
            text: parsed.text,
          }),
        );
      }
      if (parsed.kind === 'user-delta' || parsed.kind === 'user-final') {
        setTurns((current) =>
          upsertTranscriptTurn(current, {
            final: parsed.kind === 'user-final',
            id: parsed.id,
            role: 'user',
            text: parsed.text,
          }),
        );
        if (parsed.kind === 'user-final') {
          if (
            userTurnIdsRef.current.has(parsed.id) ||
            !parsed.text.trim() ||
            parsed.text === UNCLEAR_CAPTION
          )
            return;
          userTurnIdsRef.current.add(parsed.id);
          const detected = detectStruggleSignals(parsed.text);
          if (detected.length) {
            setSignals((current) => [...detected, ...current].slice(0, 3));
            detected.forEach((signal) =>
              recordSignal({
                ...signal,
                focus: unit?.pronunciationFocus ?? 'Spontaneous speech',
                track,
              }),
            );
          }
        }
      }
    },
    [finishGreeting, recordSignal, releaseSession, track, unit?.pronunciationFocus],
  );

  const start = async () => {
    if (startAbortRef.current || sessionRef.current || permissionPendingRef.current) return;
    if (!isConversationBackendConfigured) {
      setError(
        'Live voice is temporarily unavailable because the secure voice service is not connected.',
      );
      setStatus('error');
      return;
    }

    const permissionGeneration = generationRef.current;
    permissionPendingRef.current = true;
    setPermissionPending(true);
    setPermissionBlocked(false);
    setMicrophoneHint('');
    setError('');
    try {
      const access = await prepareMicrophoneAccess();
      if (!focusedRef.current) return;
      if (access !== 'ready') {
        // Never open a microphone as a delayed side effect of dismissing the
        // Android permission dialog or returning from another application.
        setStatus(access === 'enabled' ? 'idle' : 'error');
        if (access === 'enabled') {
          setMicrophoneHint('Microphone enabled. Tap Start conversation when you are ready.');
        } else {
          setPermissionBlocked(access === 'blocked');
          setError(
            access === 'blocked'
              ? 'Microphone is off. Turn it on in your phone settings to talk live.'
              : 'Microphone access was not allowed. Tap Try again to allow it, or continue with text lessons.',
          );
        }
        return;
      }
    } catch {
      if (focusedRef.current) {
        setError('Could not check microphone access. Please try again.');
        setStatus('error');
      }
      return;
    } finally {
      permissionPendingRef.current = false;
      if (focusedRef.current) setPermissionPending(false);
    }
    if (
      !focusedRef.current ||
      AppState.currentState !== 'active' ||
      permissionGeneration !== generationRef.current
    )
      return;

    setError('');
    setMicrophoneDead(false);
    setSignals([]);
    setTurns([]);
    setCallReview(null);
    setCallReviewError('');
    setCallPhrases([]);
    setCallTooShort(false);
    setFreeCallUsed(false);
    callReviewedRef.current = false;
    userTurnIdsRef.current.clear();
    const generation = ++generationRef.current;
    const speaking = createSpeechGate();
    // The level last sent to the line; a change smaller than this is not worth a frame.
    let shownLevel = -1;
    const deadMicrophone = createDeadMicrophoneCheck();
    const startAbort = new AbortController();
    startAbortRef.current = startAbort;
    greetingDoneRef.current = false;
    coachAudioRef.current = false;
    try {
      const session = await startRealtimeSession({
        coachTone: activeCoachTone,
        goal,
        onEvent: (event) => {
          if (generationRef.current === generation) handleEvent(event);
        },
        onLevels: (levels) => {
          if (generationRef.current !== generation) return;
          const level = lineLevel(levels);
          setMicrophoneDead(deadMicrophone(levels, Date.now()));
          // Reduce motion: the line stands still, raised while someone speaks and flat otherwise.
          const target = reduceMotion ? (speaking(level, Date.now()) ? 0.6 : 0) : level;
          // Silence and steady speech send nothing, so the UI thread rests.
          if (Math.abs(target - shownLevel) < 0.03) return;
          shownLevel = target;
          voiceLevel.set(reduceMotion ? target : withTiming(target, { duration: 120 }));
        },
        onStatus: (next) => {
          if (generationRef.current !== generation) return;
          if (next === 'error') {
            releaseSession();
            setError('The voice connection was interrupted. Please try again.');
          }
          if (next === 'ended' && sessionRef.current) {
            releaseSession();
            void reviewUnitCall();
            if (userTurnIdsRef.current.size >= 2) {
              recordUsage('call_completed', track);
              recordSpeakingPractice(track);
              recordActivity(`speaking:${unit?.id ?? track}`, track);
              if (unit) completeUnit(unit.id);
            }
          }
          // Connected is not the learner's turn yet: the coach is about to greet them.
          setStatus(next === 'listening' && !greetingDoneRef.current ? 'joining' : next);
        },
        practice: diagnostic ? 'diagnostic' : 'conversation',
        signal: startAbort.signal,
        // The learner waits with a closed microphone during the greeting, so keep it short.
        starter: unitCall
          ? `${unitCallOpening(unitCall)} ${BRIEF_OPENING}`
          : examCard
            ? mode.starter
            : `${mode.starter} ${BRIEF_OPENING}`,
        startMuted: true,
        track,
        unitId: unitCall ? undefined : unit?.id,
        cardId: examCard?.id,
        callId: unitCall?.id,
        memory:
          unitCall && coachMemory
            ? {
                facts: coachMemory.facts,
                mistakes: coachMemory.mistakes.slice(0, 3).map((item) => item.better),
              }
            : undefined,
      });
      if (startAbort.signal.aborted || generationRef.current !== generation) {
        session.stop();
        return;
      }
      sessionRef.current = session;
      recordUsage('call_started', track);
      session.setMuted(!greetingDoneRef.current || mutedRef.current);
      if (unitCall) {
        useCoachingStore.getState().markUnitCall(unitCall.id);
        setSecondsLeft(UNIT_CALL_SECONDS);
        setCallStartedAt(Date.now());
      }
    } catch (reason) {
      if (startAbort.signal.aborted || generationRef.current !== generation) return;
      releaseSession();
      if (reason instanceof FreeCallUsedError) setFreeCallUsed(true);
      setError(reason instanceof Error ? reason.message : 'The live coach could not connect.');
      setStatus('error');
    } finally {
      if (startAbortRef.current === startAbort) startAbortRef.current = undefined;
    }
  };

  const calculateAssessment = async () => {
    if (assessmentAbortRef.current) return;
    const controller = new AbortController();
    assessmentAbortRef.current = controller;
    setAssessmentPending(true);
    setError('');
    try {
      const assessment = await createAssessmentRequest(
        track,
        turns,
        activeCoachTone,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      mergeAssessment(assessment);
      router.replace(`/assessment-result?track=${track}` as Href);
    } catch (reason) {
      if (controller.signal.aborted) return;
      setError(
        reason instanceof Error ? reason.message : 'The assessment could not be calculated.',
      );
    } finally {
      if (assessmentAbortRef.current === controller) {
        assessmentAbortRef.current = undefined;
        setAssessmentPending(false);
      }
    }
  };

  const stop = async () => {
    releaseSession();
    setStatus('ended');
    void reviewUnitCall();
    if (unit && userTurnIdsRef.current.size >= 2) completeUnit(unit.id);
    if (userTurnIdsRef.current.size >= 2) {
      recordUsage('call_completed', track);
      recordSpeakingPractice(track);
      recordActivity(`speaking:${unit?.id ?? track}`, track);
    }
    if (diagnostic) await calculateAssessment();
  };

  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  });
  useEffect(() => {
    if (!unitCall || callStartedAt === null) return;
    const tick = setInterval(() => {
      const left = Math.max(0, UNIT_CALL_SECONDS - Math.round((Date.now() - callStartedAt) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(tick);
        void stopRef.current();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [callStartedAt, unitCall]);

  const toggleMute = () => {
    const next = !muted;
    mutedRef.current = next;
    sessionRef.current?.setMuted(next || !greetingDoneRef.current);
    setMuted(next);
  };

  // Lime for the whole call, from the greeting's first word, so it never flickers between turns.
  const lineLive = active && status !== 'connecting';
  useEffect(() => {
    if (!lineLive) voiceLevel.set(0);
  }, [lineLive, voiceLevel]);
  return (
    <AppScreen activeNav="practice" backgroundColor={Palette.ink} dark>
      <View style={styles.header}>
        <HeaderBack dark />
        {/* Named for what it is; nothing here claims to be live before a call starts. */}
        <Text numberOfLines={1} style={styles.logo}>
          {unitCall
            ? `Call with ${unitCall.addressedAs ?? unitCall.character}`
            : examCard
              ? 'Speaking mock'
              : diagnostic
                ? 'Level check'
                : 'Live practice'}
        </Text>
        <Pressable
          accessibilityLabel="About this call"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setAboutOpen(true)}
          style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.cream} name="information-outline" size={24} />
        </Pressable>
      </View>

      {/* The small print lives here, so the line and Start are most of what the screen shows. */}
      <BottomSheet
        visible={aboutOpen}
        onClose={() => setAboutOpen(false)}
        closeLabel="Close about this call"
      >
        <View style={styles.about}>
          <Text accessibilityRole="header" style={styles.aboutTitle}>
            About this call
          </Text>
          {[
            unitCall
              ? `Three minutes with ${unitCall.addressedAs ?? unitCall.character}. Corrections are on.`
              : 'Up to five minutes.',
            'Stop any time; the microphone stops when you leave.',
            'Replies use your phone’s current audio output, including Bluetooth.',
            'Pauses and requests for help become gentle tips. No made-up scores.',
            'Microphone audio is processed only for this live session. Captions are generated live and may contain mistakes.',
          ].map((line) => (
            <View key={line} style={styles.aboutRow}>
              <View style={styles.aboutDot} />
              <Text style={styles.aboutText}>{line}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>

      <View style={styles.body}>
        <Eyebrow color={darkAccent}>
          {examCard
            ? 'Exam mock'
            : unitCall
              ? `Unit ${unitCall.unitNumber} call`
              : 'Natural conversation'}{' '}
          · <LevelText track={track} level={mode.level} />
        </Eyebrow>
        <Text style={styles.title}>{mode.title}</Text>
        <Text style={styles.description}>{mode.description}</Text>

        {unitCall && !callPhrases.length ? (
          <View style={styles.practiceCard}>
            <View style={styles.practiceHeading}>
              <MaterialCommunityIcons color={darkAccent} name="target" size={18} />
              <Text style={styles.practiceFocus}>Try to use these from the unit</Text>
            </View>
            <View style={styles.phraseRow}>
              {unitCall.phrases.map((item) => (
                <Text key={item.say} style={styles.phraseChip}>
                  {item.say}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {!diagnostic && !unit && !unitCall ? (
          <View style={styles.languageRow}>
            <LanguageSwitch
              disabled={active || permissionPending}
              groupLabel="Conversation language"
              itemLabel={(name) => `${name} conversation`}
              onChange={(item) => {
                setTrack(item);
                setError('');
                setStatus('idle');
              }}
              tone="dark"
              track={track}
            />
          </View>
        ) : null}

        {examCard ? <ExamCardPanel card={examCard} active={active} /> : null}
        {unit && !examCard ? (
          <View style={styles.practiceCard}>
            <View style={styles.practiceHeading}>
              <VoiceLineMark color={Palette.lime} />
              <Text style={styles.practiceFocus}>{unit.pronunciationFocus}</Text>
            </View>
            <View style={styles.phraseRow}>
              {unit.phrases.map((phrase) => (
                <Text key={phrase.phrase} style={styles.phraseChip}>
                  {phrase.phrase}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.stage, { borderColor: OnDark.border }]}>
          {/* The voice line: lime while the call is live, moving only with a real voice. */}
          <View style={styles.lineStage}>
            {status === 'connecting' || permissionPending ? (
              <ActivityIndicator color={Palette.cream} size="large" />
            ) : lineLive ? (
              <VoiceLine color={Palette.lime} level={voiceLevel} />
            ) : (
              // At rest: the mark itself, still, until a call connects.
              <VoiceLineMark color={Dark.lineRest} height={88} thickness={7} width={220} />
            )}
          </View>
          <Text accessibilityLiveRegion="polite" style={styles.status}>
            {permissionPending ? 'Getting your microphone ready…' : statusCopy[status]}
          </Text>
          <Text style={styles.statusHint}>
            {microphoneHint ||
              statusHint[status] ||
              (active
                ? 'Speak normally. Pauses, corrections and interruptions are welcome.'
                : 'A short, adaptive conversation with live help when you get stuck.')}
          </Text>
          {lineLive && microphoneDead ? (
            <View
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              style={styles.micAlert}
            >
              <View style={styles.micAlertHeading}>
                <MaterialCommunityIcons color={Dark.errorText} name="microphone-off" size={20} />
                <Text style={styles.micAlertTitle}>We can’t hear your microphone</Text>
              </View>
              <Text style={styles.micAlertText}>
                Another app may be using it, or a Bluetooth headset may have taken over. Close other
                apps that record and check Vokeno can use the microphone, then end this call and
                start a new one.
              </Text>
              <View style={styles.micAlertActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void stop()}
                  style={({ pressed }) => [
                    styles.micAlertButton,
                    styles.micAlertPrimary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.micAlertButtonText, { color: Palette.ink }]}>End call</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    void Linking.openSettings().catch(() =>
                      setError(
                        'Open your phone settings, then Vokeno, Permissions and Microphone.',
                      ),
                    )
                  }
                  style={({ pressed }) => [styles.micAlertButton, pressed && styles.pressed]}
                >
                  <Text style={styles.micAlertButtonText}>Microphone settings</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {active ? (
            <View style={styles.controls}>
              <Pressable
                accessibilityLabel={muted ? 'Unmute microphone' : 'Mute microphone'}
                accessibilityRole="button"
                onPress={toggleMute}
                style={styles.controlButton}
              >
                <MaterialCommunityIcons
                  color={Palette.cream}
                  name={muted ? 'microphone-off' : 'microphone'}
                  size={23}
                />
              </Pressable>
              <Pressable
                accessibilityLabel="End conversation"
                accessibilityRole="button"
                disabled={assessmentPending}
                onPress={() => void stop()}
                style={[
                  styles.controlButton,
                  styles.endButton,
                  assessmentPending && styles.disabled,
                ]}
              >
                <MaterialCommunityIcons color={Palette.white} name="phone-hangup" size={23} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityLabel="Start live conversation"
              accessibilityRole="button"
              accessibilityState={{ disabled: assessmentPending || permissionPending }}
              disabled={assessmentPending || permissionPending}
              onPress={start}
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: Palette.lime },
                (assessmentPending || permissionPending) && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <VoiceLineMark color={Palette.ink} />
              <Text style={[styles.startText, { color: Palette.ink }]}>
                {permissionPending
                  ? 'Checking microphone…'
                  : assessmentPending
                    ? 'Calculating result…'
                    : status === 'error'
                      ? 'Try again'
                      : status === 'ended'
                        ? 'Start a new conversation'
                        : 'Start conversation'}
              </Text>
            </Pressable>
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {status === 'ended' && turns.filter((turn) => turn.role === 'user').length >= 2 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to today's session"
              onPress={() => router.replace(`/?track=${track}` as Href)}
              style={({ pressed }) => [styles.sessionLink, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons color={Palette.ink} name="check-circle" size={20} />
              <Text style={styles.sessionLinkText}>Speaking practice saved · back to Today</Text>
            </Pressable>
          ) : null}
          {permissionBlocked ? (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                void Linking.openSettings().catch(() =>
                  setError('Open your phone settings, then Vokeno, Permissions and Microphone.'),
                )
              }
              style={{ padding: space(4) }}
            >
              <Text
                style={{
                  color: Palette.cream,
                  fontFamily: VokaFonts.bodySemiBold,
                  textDecorationLine: 'underline',
                }}
              >
                Open microphone settings
              </Text>
            </Pressable>
          ) : null}
          {unitCall && active && callStartedAt !== null ? (
            <Text accessibilityLiveRegion="polite" style={styles.statusHint}>
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')} left
            </Text>
          ) : null}
          {freeCallUsed ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/plus' as Href)}
              style={{ padding: space(4) }}
            >
              <Text style={{ color: Palette.cream, textDecorationLine: 'underline' }}>
                See Vokeno Plus
              </Text>
            </Pressable>
          ) : null}
          {diagnostic && status === 'ended' && turns.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              disabled={assessmentPending}
              onPress={() => void calculateAssessment()}
              style={{ padding: space(4) }}
            >
              <Text style={{ color: Palette.cream, textDecorationLine: 'underline' }}>
                {error
                  ? 'Retry assessment with this conversation'
                  : 'Calculate an estimate from this conversation'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {unitCall && callPhrases.length ? (
          <CallReviewCard
            review={callReview}
            pending={callReviewPending}
            error={callReviewError}
            phrases={callPhrases}
            scheduled={!callTooShort}
            speech={speech}
            accent={darkAccent}
          />
        ) : null}

        {turns.some((turn) => turn.role === 'assistant') ? (
          <View style={styles.reportRow}>
            <Text style={styles.aiNote}>Replies are generated by AI and can be wrong.</Text>
            <ReportContent
              dark
              surface="conversation"
              track={track}
              excerpt={turns
                .filter((turn) => turn.role === 'assistant')
                .slice(-2)
                .map((turn) => turn.text)
                .join('\n')}
            />
          </View>
        ) : null}

        {/* Captions belong to a call: nothing to show before one starts. */}
        {active || turns.length ? (
          <>
            <View style={styles.captionHeader}>
              <View>
                <Eyebrow color={Palette.cream}>Live captions</Eyebrow>
                <Text style={styles.captionHint}>
                  Follow along without losing the conversation.
                </Text>
              </View>
              <Switch
                // On dark screens the knob carries the state: cream when on, grey when off. Android
                // draws the track half see-through, so an ink knob on it all but disappeared.
                // React Native Web colours the knob from activeThumbColor when on (teal by default).
                {...{ activeThumbColor: Palette.cream }}
                thumbColor={captions ? Palette.cream : Palette.muted}
                accessibilityLabel="Show live captions"
                onValueChange={setCaptions}
                trackColor={{ false: Dark.switchOff, true: Palette.muted }}
                value={captions}
              />
            </View>

            {captions ? (
              <View style={styles.transcript}>
                {turns.length ? (
                  turns.slice(-6).map((turn) => (
                    <View
                      key={`${turn.role}-${turn.id}`}
                      style={[styles.turn, turn.role === 'user' && styles.userTurn]}
                    >
                      <Text style={styles.turnRole}>
                        {turn.role === 'user'
                          ? 'YOU'
                          : (unitCall?.character.toUpperCase() ?? 'VOKENO')}
                      </Text>
                      <Text style={styles.turnText}>{turn.text}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyTranscript}>Captions appear here as you talk.</Text>
                )}
              </View>
            ) : null}
          </>
        ) : null}

        {/* Tips only when the coach has noticed something; how it works is in "About this call". */}
        {signals.length ? (
          <View style={styles.coachCard}>
            <Text style={styles.coachTitle}>What the coach noticed</Text>
            {signals.map((signal, index) => (
              <View key={`${signal.label}-${index}`} style={styles.signal}>
                <Text style={[styles.signalLabel, { color: darkAccent }]}>{signal.label}</Text>
                <Text style={styles.signalReason}>{signal.reason}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sessionLink: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Palette.cream,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    marginTop: space(2),
    minHeight: 52,
    paddingHorizontal: space(4),
  },
  sessionLinkText: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space(4),
    paddingVertical: space(4),
  },
  logo: {
    color: Palette.cream,
    flexShrink: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    textAlign: 'center',
  },
  infoButton: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  about: { gap: space(3), paddingBottom: space(2) },
  aboutTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
  },
  aboutRow: { alignItems: 'flex-start', flexDirection: 'row', gap: space(3) },
  aboutDot: {
    backgroundColor: Palette.ink,
    borderRadius: Radius.pill,
    height: 6,
    marginTop: space(2),
    width: 6,
  },
  aboutText: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  body: { paddingBottom: space(8), paddingHorizontal: space(5), paddingTop: space(4) },
  title: {
    color: Palette.cream,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    marginTop: space(2),
  },
  description: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(2),
  },
  languageRow: { marginTop: space(4) },
  practiceHeading: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  reportRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'space-between',
    marginTop: space(4),
  },
  aiNote: {
    color: OnDark.textFaint,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
  },
  examClock: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  examBullet: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(2),
  },
  examNotes: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(2),
  },
  practiceFocus: {
    color: Palette.cream,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  phraseRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginTop: space(2) },
  phraseChip: {
    backgroundColor: OnDark.fillStrong,
    borderRadius: Radius.pill,
    color: Palette.cream,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
    paddingHorizontal: space(2),
    paddingVertical: space(2),
  },
  stage: {
    alignItems: 'center',
    backgroundColor: Dark.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginTop: space(4),
    padding: space(6),
  },
  lineStage: { alignItems: 'center', height: 88, justifyContent: 'center' },
  micAlert: {
    alignSelf: 'stretch',
    backgroundColor: Dark.raised,
    borderRadius: Radius.lg,
    gap: space(2),
    marginTop: space(4),
    padding: space(4),
  },
  micAlertHeading: { alignItems: 'center', flexDirection: 'row', gap: space(2) },
  micAlertTitle: {
    color: Palette.cream,
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  micAlertText: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  micAlertActions: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginTop: space(1) },
  // Dark-screen actions: cream for the main one, a cream outline for the other.
  micAlertButton: {
    alignItems: 'center',
    borderColor: Palette.cream,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: space(4),
  },
  micAlertPrimary: { backgroundColor: Palette.cream },
  micAlertButtonText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  status: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    marginTop: space(4),
    textAlign: 'center',
  },
  statusHint: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(2),
    textAlign: 'center',
  },
  startButton: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    marginTop: space(5),
    minHeight: 54,
    paddingHorizontal: space(6),
  },
  startText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  controls: { flexDirection: 'row', gap: space(3), marginTop: space(5) },
  controlButton: {
    alignItems: 'center',
    backgroundColor: Dark.control,
    borderRadius: Radius.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  endButton: { backgroundColor: Feedback.wrongFill },
  error: {
    color: Dark.errorText,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(4),
    textAlign: 'center',
  },
  captionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space(6),
  },
  captionHint: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    marginTop: space(1),
  },
  transcript: {
    backgroundColor: Dark.surface,
    borderRadius: Radius.xl,
    gap: space(2),
    marginTop: space(3),
    minHeight: 100,
    padding: space(4),
  },
  turn: { alignSelf: 'flex-start', maxWidth: '90%' },
  userTurn: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  turnRole: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    marginBottom: space(1),
  },
  turnText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  emptyTranscript: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  coachCard: {
    backgroundColor: Dark.raised,
    borderRadius: Radius.xl,
    marginTop: space(4),
    padding: space(4),
  },
  coachTitle: {
    color: Palette.cream,
    flex: 1,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
  },
  signal: {
    borderTopColor: OnDark.line,
    borderTopWidth: 1,
    marginTop: space(3),
    paddingTop: space(2),
  },
  signalLabel: { fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  signalReason: {
    color: OnDark.textFaint,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(1),
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
  practiceCard: {
    backgroundColor: OnDark.fill,
    borderRadius: Radius.lg,
    marginTop: space(4),
    padding: space(4),
  },
});

function ExamCardPanel({ card, active }: { card: SpeakingCard; active: boolean }) {
  const notes = useMockNotes((state) => state.notes[card.id] ?? '');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setStartedAt((value) => value ?? Date.now());
      setNow(Date.now());
    }, 500);
    return () => clearInterval(timer);
  }, [active]);
  const elapsed = startedAt ? now - startedAt : 0;
  const limit = card.speakSeconds * 1000;
  return (
    <View style={styles.practiceCard}>
      <View style={styles.practiceHeading}>
        <MaterialCommunityIcons color={Palette.cream} name="card-text-outline" size={18} />
        <Text style={styles.practiceFocus}>{card.title}</Text>
        <Text
          accessibilityLabel={`Speaking time ${formatClock(elapsed)} of ${formatClock(limit)}`}
          style={[styles.examClock, elapsed >= limit && { color: Dark.errorText }]}
        >
          {formatClock(elapsed)} / {formatClock(limit)}
        </Text>
      </View>
      {card.bullets.map((bullet) => (
        <Text key={bullet} style={styles.examBullet}>
          • {bullet}
        </Text>
      ))}
      {notes ? <Text style={styles.examNotes}>Your notes: {notes}</Text> : null}
    </View>
  );
}

/** A talk's level as shown: English shows no A1 or A2, since talks below B1 are the warm-up. */
function LevelText({ track, level }: { track: LanguageTrack; level: string }) {
  return <>{contentLevel(track, level)}</>;
}
