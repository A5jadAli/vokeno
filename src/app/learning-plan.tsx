import { type Href, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  ActionBar,
  ActionRow,
  InfoCard,
  lessonText,
  PrimaryButton,
  SectionLabel,
} from '@/components/lesson-ui';
import { AppScreen, HeaderBack } from '@/components/voka-ui';
import { space } from '@/constants/theme';
import { learningRecommendation } from '@/features/coaching/recommendation';
import { useCoachingStore, type StartingAbility, type StudyGoal } from '@/features/coaching/store';
import { foundationLessons } from '@/features/foundations/catalog';
import { lessonIdFromHref } from '@/features/journey/course';
import { useSelectedLanguage } from '@/features/language/selection';
import { languageDetails } from '@/features/language/config';
import { LanguageSwitch } from '@/components/language-switch';

/** Choose where to start: how much you know decides your first lesson. */
export default function LearningPlanScreen() {
  const router = useRouter();
  const [track, setTrack] = useSelectedLanguage();
  const preferences = useCoachingStore((state) => state.preferences[track]);
  const setChoices = useCoachingStore((state) => state.setLearningChoices);
  const ability = preferences.ability ?? 'new';
  const goal = preferences.studyGoal ?? 'everyday';
  const language = languageDetails[track].name;
  const next = learningRecommendation(track, ability, goal);
  const lessonId = lessonIdFromHref(next.href);
  const isLesson = foundationLessons.some((item) => item.id === lessonId);
  const abilities: [StartingAbility, string][] = [
    ['new', `I am new to ${language}`],
    ['basics', 'I know some words and short phrases'],
    ['conversational', 'I can already have a simple conversation'],
  ];
  const goals: [StudyGoal, string][] = [
    ['everyday', 'Everyday life'],
    ['work-study', 'Work and study'],
    ...(track === 'EN'
      ? ([
          ['ielts-academic', 'IELTS Academic'],
          ['ielts-general', 'IELTS General Training'],
        ] as [StudyGoal, string][])
      : []),
  ];
  const start = () => {
    // Confirming saves the starting point, so Today and Course agree on it.
    useCoachingStore.getState().setStartAt(track, lessonId);
    router.replace(next.href as Href);
  };
  return (
    <AppScreen
      showNav={false}
      footer={
        <ActionBar>
          <PrimaryButton
            title={isLesson ? 'Start this lesson' : 'Start practice'}
            accessibilityLabel={`Start: ${next.title}`}
            icon="arrow-right"
            onPress={start}
          />
        </ActionBar>
      }
    >
      <View style={styles.header}>
        <HeaderBack />
      </View>
      <View style={styles.body}>
        <Text accessibilityRole="header" style={lessonText.title}>
          How much {language} do you know?
        </Text>
        <Text style={lessonText.lead}>
          This sets your first lesson. You can change it any time from Course.
        </Text>

        <LanguageSwitch groupLabel="Language" onChange={setTrack} role="radio" track={track} />

        <View style={styles.group}>
          {abilities.map(([value, label]) => (
            <ActionRow
              key={value}
              title={label}
              choice
              selected={ability === value}
              onPress={() => setChoices(track, value, goal)}
            />
          ))}
        </View>
        <ActionRow
          icon="compass-outline"
          title="Not sure? Take the 5-minute check"
          onPress={() => router.push(`/placement?track=${track}` as Href)}
        />

        {track === 'EN' && ability === 'new' ? (
          <InfoCard icon="information-outline" title="English here starts at A2">
            These lessons start at A2, for learners who know some basics. A beginner course is not
            ready yet.
          </InfoCard>
        ) : null}

        <InfoCard
          icon="arrow-right-circle-outline"
          title={`You will start with: ${next.title}`}
          tone="tint"
        >
          {next.why}
        </InfoCard>

        <SectionLabel>What is it for? (optional)</SectionLabel>
        <View style={styles.group}>
          {goals.map(([value, label]) => (
            <ActionRow
              key={value}
              title={label}
              choice
              selected={goal === value}
              onPress={() => setChoices(track, ability, value)}
            />
          ))}
        </View>
        <Text style={lessonText.small}>
          Practice supports learning; it is not a certified CEFR level or exam result.
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: space(4), paddingTop: space(2) },
  body: {
    gap: space(4),
    paddingBottom: space(8),
    paddingHorizontal: space(5),
    paddingTop: space(2),
  },
  group: { gap: space(2) },
});
