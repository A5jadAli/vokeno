import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  ActionBar,
  InfoCard,
  LessonTopBar,
  lessonText,
  PrimaryButton,
  TextButton,
  PrimaryAccent,
} from '@/components/lesson-ui';
import { AppScreen } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { useSelectedLanguage } from '@/features/language/selection';
import { formatClock, useMockNotes } from '@/features/speaking-mock/store';
import {
  speakingCards,
  type SpeakingCard,
  type SpeakingCardPart,
} from '../../supabase/functions/_shared/speaking-cards';
import { trackColors } from '@/features/language/config';

type Exam = { name: string; parts: SpeakingCardPart[]; unit?: string };

/** The exam a mock practises: German has A1 (goal-date practice) and B1; Spanish has A1. */
function examFor(track: 'DE' | 'EN' | 'ES', level?: string): Exam {
  if (track === 'EN')
    return { name: 'IELTS Speaking Part 2 and 3', parts: ['ielts-2'], unit: 'en-ielts-speaking' };
  if (track === 'ES')
    return {
      name: 'DELE A1 expresión oral',
      parts: ['dele-a1-intro', 'dele-a1-topic', 'dele-a1-dialogue'],
    };
  return level === 'A1'
    ? {
        name: 'Goethe-Zertifikat A1 Sprechen',
        parts: ['goethe-a1-intro', 'goethe-a1-ask', 'goethe-a1-request'],
      }
    : {
        name: 'Goethe-Zertifikat B1 Sprechen',
        parts: ['goethe-plan', 'goethe-present'],
        unit: 'de-b1-goethe-sprechen',
      };
}

const partInfo: Record<SpeakingCardPart, { tab: string; kicker: string; how: string }> = {
  'ielts-2': {
    tab: 'Part 2',
    kicker: 'Task card',
    how: 'Prepare for one minute, then speak for up to two minutes while the examiner listens. Then answer a rounding-off question and two Part 3 discussion questions, and get feedback on fluency, vocabulary, grammar and pronunciation. The live session is capped at five minutes, so Part 3 is shorter than in the real test. No band score is given.',
  },
  'goethe-plan': {
    tab: 'Plan together',
    kicker: 'Teil 1',
    how: 'Prepare, then plan the event with the coach as your partner. React to suggestions, agree on each point and summarise. You get feedback on interaction, not a score.',
  },
  'goethe-present': {
    tab: 'Present a topic',
    kicker: 'Teil 2',
    how: 'Prepare, then present for about three minutes using all five points. The coach asks a question afterwards (Teil 3) and gives brief feedback. No score is given.',
  },
  'goethe-a1-intro': {
    tab: 'Introduce yourself',
    kicker: 'Teil 1',
    how: 'Introduce yourself with the words on the card, then spell your name and give a phone number. Short, clear answers are what A1 needs. You get one strength and one thing to practise, not a score.',
  },
  'goethe-a1-ask': {
    tab: 'Ask and answer',
    kicker: 'Teil 2',
    how: 'Ask one question with each word on the card, then answer the coach’s questions. Simple questions are fine. You get one strength and one thing to practise, not a score.',
  },
  'goethe-a1-request': {
    tab: 'Polite requests',
    kicker: 'Teil 3',
    how: 'Make a polite request for each thing on the card and react to the coach’s requests. You get one strength and one thing to practise, not a score.',
  },
  'dele-a1-intro': {
    tab: 'Introduce yourself',
    kicker: 'Tarea 1',
    how: 'Present yourself for one to two minutes using the points on the card, then answer two short questions. You get one strength and one thing to practise, not a score.',
  },
  'dele-a1-topic': {
    tab: 'Talk about a topic',
    kicker: 'Tarea 2',
    how: 'Talk for about two minutes about the topic, then answer two short questions. Simple, clear sentences are what A1 needs. No score is given.',
  },
  'dele-a1-dialogue': {
    tab: 'Café dialogue',
    kicker: 'Tarea 4',
    how: 'The coach is the waiter. Order, ask the price and pay, reacting to what they say. You get one strength and one thing to practise, not a score.',
  },
};

export default function SpeakingMockScreen() {
  const [track] = useSelectedLanguage();
  const params = useLocalSearchParams<{ level?: string }>();
  return (
    <PrimaryAccent colors={trackColors[track]}>
      <SpeakingMock
        key={`${track}-${params.level}`}
        track={track}
        exam={examFor(track, params.level)}
      />
    </PrimaryAccent>
  );
}

function pick(cards: SpeakingCard[], avoid?: string) {
  const pool = cards.filter((card) => card.id !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] ?? cards[0];
}

function SpeakingMock({ track, exam }: { track: 'DE' | 'EN' | 'ES'; exam: Exam }) {
  const router = useRouter();
  const parts = exam.parts;
  const [part, setPart] = useState<SpeakingCardPart>(parts[0]);
  const deck = speakingCards.filter((card) => card.part === part);
  const [card, setCard] = useState(() => pick(deck));
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showGloss, setShowGloss] = useState(false);
  const notes = useMockNotes((state) => state.notes[card.id] ?? '');
  const setNotes = useMockNotes((state) => state.setNotes);

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [deadline]);
  const remaining = deadline ? Math.max(0, deadline - now) : card.prepSeconds * 1000;
  const preparing = deadline !== null;
  const start = () =>
    router.push(
      `/conversation?track=${track}${exam.unit ? `&unit=${exam.unit}` : ''}&card=${card.id}` as Href,
    );

  return (
    <AppScreen
      showNav={false}
      keyboardAware
      footer={
        <ActionBar>
          {preparing ? (
            <PrimaryButton
              title="Start speaking"
              accessibilityLabel={
                remaining === 0 ? 'Time is up: start speaking' : 'Start speaking now'
              }
              icon="microphone"
              tone={remaining === 0 ? 'green' : 'yellow'}
              onPress={start}
            />
          ) : (
            <PrimaryButton
              title="Start preparation"
              accessibilityLabel={`Start ${formatClock(card.prepSeconds * 1000)} preparation`}
              icon="timer-outline"
              onPress={() => {
                setNow(Date.now());
                setDeadline(Date.now() + card.prepSeconds * 1000);
              }}
            />
          )}
        </ActionBar>
      }
    >
      <LessonTopBar progress={preparing ? 0.5 : 0.1} />
      <View style={styles.body}>
        <Text style={lessonText.meta}>{exam.name} · practice mock</Text>
        <Text accessibilityRole="header" style={lessonText.title}>
          Speaking mock
        </Text>
        <Text style={lessonText.small}>Speaking practice only, not a full exam result.</Text>
        {parts.length > 1 && !preparing ? (
          <View accessibilityRole="tablist" style={styles.tabs}>
            {parts.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="tab"
                accessibilityState={{ selected: part === value }}
                onPress={() => {
                  setPart(value);
                  setCard(pick(speakingCards.filter((item) => item.part === value)));
                }}
                style={[styles.tab, part === value && styles.tabActive]}
              >
                <Text style={[styles.tabText, part === value && styles.tabTextActive]}>
                  {partInfo[value].tab}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={[styles.cardKicker, { color: trackColors[track].accent }]}>
            {partInfo[card.part].kicker}
          </Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          {card.part === 'ielts-2' ? <Text style={styles.cardSub}>You should say:</Text> : null}
          {card.bullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.bullet}>{bullet}</Text>
            </View>
          ))}
          {card.gloss ? (
            <Pressable accessibilityRole="button" onPress={() => setShowGloss(!showGloss)}>
              <Text style={styles.gloss}>{showGloss ? card.gloss : 'Show in English'}</Text>
            </Pressable>
          ) : null}
        </View>

        {preparing ? (
          <>
            <View
              accessibilityLabel={`Preparation time left ${formatClock(remaining)}`}
              style={[styles.clock, remaining === 0 && styles.clockDone]}
            >
              <MaterialCommunityIcons name="timer-outline" size={28} color={Palette.ink} />
              <Text style={styles.clockText}>{formatClock(remaining)}</Text>
            </View>
            <TextInput
              accessibilityLabel="Preparation notes"
              multiline
              value={notes}
              onChangeText={(text) => setNotes(card.id, text)}
              placeholder="Keywords only, one line per point"
              placeholderTextColor={Palette.muted}
              style={styles.notes}
              textAlignVertical="top"
            />
            <Text style={lessonText.small}>
              Your notes stay visible while you speak. Write keywords, not sentences.
            </Text>
          </>
        ) : (
          <>
            <InfoCard icon="information-outline" title="How the mock works">
              {partInfo[card.part].how}
            </InfoCard>
            <TextButton title="Try a different card" onPress={() => setCard(pick(deck, card.id))} />
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: { gap: 16, paddingBottom: 32, paddingHorizontal: 20, paddingTop: 8 },
  tabs: {
    backgroundColor: Palette.soft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tab: { alignItems: 'center', borderRadius: 12, flex: 1, justifyContent: 'center', minHeight: 44 },
  tabActive: { backgroundColor: Palette.ink },
  tabText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  tabTextActive: { color: Palette.cream },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.ink,
    borderRadius: 22,
    borderWidth: 2,
    gap: 10,
    padding: 20,
  },
  cardKicker: { color: Palette.orange, fontFamily: VokaFonts.bodyBold, fontSize: 13 },
  cardTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
  },
  cardSub: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 15 },
  bulletRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  dot: { backgroundColor: Palette.yellow, borderRadius: 99, height: 8, marginTop: 8, width: 8 },
  bullet: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 16,
    lineHeight: 23,
  },
  gloss: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline',
  },
  clock: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.yellow,
    borderRadius: 99,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  clockDone: { backgroundColor: '#E3F2E5' },
  clockText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 28 },
  notes: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 18,
    borderWidth: 2,
    color: Palette.ink,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 140,
    padding: 14,
  },
});
