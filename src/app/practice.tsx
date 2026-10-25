import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { TabHeader } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { testDateFor, useCoachingStore } from '@/features/coaching/store';
import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
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
import { formatTestDate, getTestDatePlan } from '@/features/profile/test-date';
import { useProgressStore } from '@/features/progress/store';
import { reviewSummary } from '@/features/review/schedule';
import { contentLevel, courseLevelOf, levelRange } from '@/features/foundations/level-status';
import { SpeakGlyph } from '@/components/voice-line';

const speaks = (name: string) => name === 'microphone-outline' || name === 'account-voice';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Practice: review first, then practice matched to your level, then everything else. */
export default function PracticeScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const progress = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const practisedUnits = useCoachingStore((state) => state.completedUnitIds);
  const testDate = useCoachingStore((state) => testDateFor(state, track));
  const testPlan = getTestDatePlan(testDate);
  const heard = useProgressStore((state) => state.completedScenarioIds);
  const colors = trackColors[track];
  const language = languageDetails[track].name;
  const [day] = useState(() => dayNumberOf(localDay(Date.now())));
  const position = coursePosition(progress, track, startAt);
  // The course level, so a warm-up lesson does not make A1 and A2 content count as "your level".
  const level = courseLevelOf(
    track,
    position.next?.lesson.level ?? getTrackLessons(track).at(-1)?.level ?? levelRange[track][0],
  );
  const review = reviewSummary(progress, track, day);
  const scenario = suggestedScenario(track, level, heard, day);
  const conversation = suggestedConversation(track, level, practisedUnits, day);
  const scenarios = fittingScenarios(track, level);
  const conversations = fittingConversations(track, level);
  // The suggestion above is not repeated in the list below it.
  const atLevel = conversations.filter((unit) => unit.id !== conversation?.id).slice(0, 3);
  const allConversations = getCurriculumUnits(track).filter(
    (unit) => !examMockUnitIds.includes(unit.id),
  );
  const go = (href: string) => router.push(href as Href);
  // "See all" opens its own screen: a right chevron goes somewhere, and the list keeps growing.
  const seeAll =
    allConversations.length > atLevel.length + (conversation ? 1 : 0) ? (
      <Row
        icon="format-list-bulleted"
        title={`All conversations · ${allConversations.length}`}
        meta="Every talk with the coach, by level"
        onPress={() => go(`/conversations?track=${track}`)}
      />
    ) : null;
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
            tint={colors.tint}
            label={`Listening · ${contentLevel(track, scenario.level)} · ${scenario.duration}`}
            title={scenario.title}
            meta={scenario.context}
            onPress={() => go(`/lesson/${scenario.id}`)}
          />
        ) : null}
        <Row
          icon="microphone-outline"
          tint={colors.tint}
          label={
            conversation
              ? `Speaking · ${contentLevel(track, conversation.level)} · live coach`
              : 'Speaking · live coach'
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
        {atLevel.length ? null : seeAll}
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

      {/* With nothing left after the suggestion, no empty heading: "See all" sits above. */}
      {atLevel.length ? (
        <Section title="More at your level">
          {atLevel.map((unit) => (
            <Row
              key={unit.id}
              icon={practisedUnits.includes(unit.id) ? 'check-circle-outline' : 'account-voice'}
              label={`${contentLevel(track, unit.level)} · ${unit.context}`}
              title={unit.title}
              meta={practisedUnits.includes(unit.id) ? 'Practised · again any time' : unit.outcome}
              onPress={() => go(`/conversation?track=${track}&unit=${unit.id}`)}
            />
          ))}
          {seeAll}
        </Section>
      ) : null}

      <Section title="Exams and level checks">
        <Row
          icon="compass-outline"
          title="Placement check"
          meta="About 5 minutes. Suggests where to start."
          onPress={() => go(`/placement?track=${track}`)}
        />
        {track === 'ES' ? (
          <Row
            icon="gauge"
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
          title={testDate ? `Goal date: ${formatTestDate(testDate)}` : 'Set a goal date'}
          meta={
            testPlan
              ? `${testPlan.cadence}. ${testPlan.recommendation}`
              : 'For an exam, a visa or a move'
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
  tint,
  onPress,
}: {
  icon: IconName;
  title: string;
  meta: string;
  label?: string;
  /** Language content sits on the language tint; tools on grey. */
  tint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label ? `${label}. ` : ''}${title}. ${meta}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.rowIcon, tint ? { backgroundColor: tint } : null]}>
        {/* Speaking carries Vokeno's voice mark, not a generic microphone. */}
        {speaks(icon) ? (
          <SpeakGlyph color={Palette.ink} size={20} />
        ) : (
          <MaterialCommunityIcons color={Palette.ink} name={icon} size={20} />
        )}
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
    borderRadius: Radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space(4),
    marginHorizontal: space(4),
    marginTop: space(2),
    padding: space(4),
  },
  reviewIcon: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  reviewTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  copy: { flex: 1, gap: space(0.5) },
  eyebrow: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
  },
  meta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  section: { gap: space(2), marginHorizontal: space(4), marginTop: space(6) },
  sectionTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  group: { backgroundColor: Palette.white, borderRadius: Radius.xl, overflow: 'hidden' },
  row: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 64,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: Palette.soft,
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  pressed: { opacity: 0.7 },
});
