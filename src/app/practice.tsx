import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { TabHeader } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { testDateFor, useCoachingStore } from '@/features/coaching/store';
import { getTrackLessons } from '@/features/foundations/catalog';
import { dayNumberOf, localDay } from '@/features/habits/practice-log';
import { coursePosition } from '@/features/journey/course';
import {
  fittingConversations,
  fittingScenarios,
  suggestedConversation,
  suggestedScenario,
} from '@/features/journey/practice';
import { languageDetails, trackColors } from '@/features/language/config';
import { useSelectedLanguage } from '@/features/language/selection';
import { formatTestDate } from '@/features/profile/test-date';
import { useProgressStore } from '@/features/progress/store';
import { reviewSummary } from '@/features/review/schedule';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Practice: review first, then practice matched to your level, then everything else. */
export default function PracticeScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const progress = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const practisedUnits = useCoachingStore((state) => state.completedUnitIds);
  const testDate = useCoachingStore((state) => testDateFor(state, track));
  const heard = useProgressStore((state) => state.completedScenarioIds);
  const colors = trackColors[track];
  const language = languageDetails[track].name;
  const [day] = useState(() => dayNumberOf(localDay(Date.now())));
  const position = coursePosition(progress, track, startAt);
  const level = position.next?.lesson.level ?? getTrackLessons(track).at(-1)?.level ?? 'A1';
  const review = reviewSummary(progress, track, day);
  const scenario = suggestedScenario(track, level, heard, day);
  const conversation = suggestedConversation(track, level, practisedUnits, day);
  const scenarios = fittingScenarios(track, level);
  const conversations = fittingConversations(track, level);
  const go = (href: string) => router.push(href as Href);

  return (
    <AppScreen activeNav="practice">
      <TabHeader title="Practice" track={track} onTrack={setTrack} />

      <Animated.View entering={FadeInDown.duration(220)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            review.due
              ? `Review ${review.due} phrases now`
              : review.learning
                ? 'Review: all caught up'
                : 'Review: nothing to review yet'
          }
          onPress={() => go(`/review?track=${track}`)}
          style={({ pressed }) => [styles.review, pressed && styles.pressed]}
        >
          <View
            style={[
              styles.reviewIcon,
              { backgroundColor: review.due ? colors.accent : Palette.soft },
            ]}
          >
            <MaterialCommunityIcons
              color={review.due ? colors.onAccent : Palette.ink}
              name="cards-outline"
              size={24}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>Review</Text>
            <Text style={styles.reviewTitle}>
              {review.due
                ? `${Math.min(review.due, 8)} phrases ready to review`
                : review.learning
                  ? 'All caught up'
                  : 'Nothing to review yet'}
            </Text>
            <Text style={styles.meta}>
              {review.due
                ? `About 3 minutes. ${review.learning} phrases in your review queue.`
                : review.learning
                  ? `${review.learning} phrases scheduled. ${review.nextInDays === 1 ? 'Next review tomorrow.' : `Next review in ${review.nextInDays} days.`}`
                  : 'Finish a lesson and its words appear here the next day.'}
            </Text>
          </View>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
        </Pressable>
      </Animated.View>

      <Section title={`Matched to your ${language}`}>
        {scenario ? (
          <Row
            icon="headphones"
            accent={colors.accent}
            onAccent={colors.onAccent}
            label={`Listening · ${scenario.level} · ${scenario.duration}`}
            title={scenario.title}
            meta={scenario.context}
            onPress={() => go(`/lesson/${scenario.id}`)}
          />
        ) : null}
        <Row
          icon="microphone-outline"
          accent={colors.accent}
          onAccent={colors.onAccent}
          label={
            conversation ? `Speaking · ${conversation.level} · live coach` : 'Speaking · live coach'
          }
          title={conversation ? conversation.title : `A short ${language} conversation`}
          meta={
            conversation ? conversation.outcome : 'Talk with the coach. Stop whenever you like.'
          }
          onPress={() =>
            go(
              conversation
                ? `/conversation?track=${track}&unit=${conversation.id}`
                : `/conversation?track=${track}`,
            )
          }
        />
      </Section>

      <Section title="Skills">
        <Row
          icon="headphones"
          title="Listening"
          meta={`${scenarios.filter((item) => heard.includes(item.id)).length} of ${scenarios.length} dialogues at your level heard`}
          onPress={() => go(`/listening?track=${track}`)}
        />
        <Row
          icon="pencil-outline"
          title="Writing"
          meta="Short tasks with feedback"
          onPress={() => go(`/activity/write?track=${track}`)}
        />
        {track === 'EN' ? (
          <Row
            icon="book-open-variant"
            title="Reading"
            meta="Main idea and detail"
            onPress={() => go('/reading')}
          />
        ) : null}
        {track === 'DE' ? (
          <Row
            icon="cards-variant"
            title="Nouns with der, die, das"
            meta="Flashcards with articles and plurals"
            onPress={() => go('/vocabulary')}
          />
        ) : null}
      </Section>

      <Section title="Conversations at your level">
        {conversations.slice(0, 4).map((unit) => (
          <Row
            key={unit.id}
            icon={practisedUnits.includes(unit.id) ? 'check-circle-outline' : 'account-voice'}
            label={`${unit.level} · ${unit.context}`}
            title={unit.title}
            meta={practisedUnits.includes(unit.id) ? 'Practised · again any time' : unit.outcome}
            onPress={() => go(`/conversation?track=${track}&unit=${unit.id}`)}
          />
        ))}
      </Section>

      <Section title="Exams and level checks">
        <Row
          icon="compass-outline"
          title="Placement check"
          meta="About 5 minutes. Suggests where to start."
          onPress={() => go(`/placement?track=${track}`)}
        />
        {track === 'ES' ? (
          <Row
            icon="account-voice"
            title="Spoken level check"
            meta="A short estimate, not a certificate"
            onPress={() => go('/level-check')}
          />
        ) : (
          <Row
            icon="card-text-outline"
            title={track === 'EN' ? 'IELTS speaking mock' : 'Goethe speaking mock'}
            meta={track === 'EN' ? 'IELTS Speaking Parts 2 and 3' : 'Goethe B1 Sprechen'}
            onPress={() => go(`/speaking-mock?track=${track}`)}
          />
        )}
        {track === 'EN' ? (
          <Row
            icon="school-outline"
            title="IELTS guide"
            meta="All four papers"
            onPress={() => go('/exam-practice')}
          />
        ) : null}
        <Row
          icon="calendar-clock"
          title={testDate ? `Test date: ${formatTestDate(testDate)}` : 'Add a test date'}
          meta={
            testDate ? 'See your practice suggestions' : 'Only if you are preparing for an exam'
          }
          onPress={() => go('/test-date')}
        />
      </Section>
    </AppScreen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  title,
  meta,
  label,
  accent,
  onAccent,
  onPress,
}: {
  icon: IconName;
  title: string;
  meta: string;
  label?: string;
  accent?: string;
  onAccent?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label ? `${label}. ` : ''}${title}. ${meta}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.rowIcon, accent ? { backgroundColor: accent } : null]}>
        <MaterialCommunityIcons color={accent ? onAccent : Palette.ink} name={icon} size={20} />
      </View>
      <View style={styles.copy}>
        {label ? <Text style={styles.eyebrow}>{label}</Text> : null}
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.meta} numberOfLines={2}>
          {meta}
        </Text>
      </View>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  review: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 18,
    marginTop: 8,
    padding: 16,
  },
  reviewIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  reviewTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 18, lineHeight: 24 },
  copy: { flex: 1, gap: 2 },
  eyebrow: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 12 },
  meta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  section: { gap: 10, marginHorizontal: 18, marginTop: 24 },
  sectionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 18 },
  group: { backgroundColor: Palette.white, borderRadius: 20, overflow: 'hidden' },
  row: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  pressed: { opacity: 0.7 },
});
