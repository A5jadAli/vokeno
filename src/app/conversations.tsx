import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LevelPill } from '@/components/course-view';
import { SpeakGlyph } from '@/components/voice-line';
import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { useCoachingStore } from '@/features/coaching/store';
import { examMockUnitIds, getCurriculumUnits } from '@/features/curriculum/catalog';
import { contentLevel, levelRange } from '@/features/foundations/level-status';
import type { LessonLevel } from '@/features/foundations/types';
import { levelNames } from '@/features/journey/course';
import { languageDetails, trackColors } from '@/features/language/config';
import { useSelectedLanguage } from '@/features/language/selection';

/**
 * Every conversation in the language, grouped by level like Course: Practice shows a few and
 * links here ("See all"), so the list can grow to B2 without burying Practice's other sections.
 */
export default function ConversationsScreen() {
  const router = useRouter();
  const [track] = useSelectedLanguage();
  const practised = useCoachingStore((state) => state.completedUnitIds);
  const colors = trackColors[track];
  const units = getCurriculumUnits(track).filter((unit) => !examMockUnitIds.includes(unit.id));
  // A warm-up first (talks below the course's range), then each level in the range.
  const groups = [
    { key: 'warm-up', label: 'Warm-up', name: `Before ${levelRange[track][0]}` },
    ...levelRange[track].map((level) => ({ key: level, label: level, name: levelNames[level] })),
  ]
    .map((group) => ({
      ...group,
      units: units.filter((unit) =>
        group.key === 'warm-up'
          ? contentLevel(track, unit.level) === 'Warm-up'
          : unit.level === (group.key as LessonLevel),
      ),
    }))
    .filter((group) => group.units.length);

  return (
    <AppScreen activeNav="practice">
      <View style={styles.header}>
        <HeaderBack />
        <Eyebrow>Speaking practice</Eyebrow>
      </View>
      <View style={styles.body}>
        <Text accessibilityRole="header" style={styles.title}>
          {languageDetails[track].name} conversations
        </Text>
        <Text style={styles.copy}>Short live talks with the coach, by level.</Text>
        {groups.map((group) => (
          <View key={group.key} style={styles.group}>
            <View style={styles.groupHead}>
              <LevelPill label={group.label} built track={track} />
              <Text style={styles.groupName}>{group.name}</Text>
            </View>
            {group.units.map((unit) => {
              const done = practised.includes(unit.id);
              return (
                <Pressable
                  key={unit.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${unit.title}. ${done ? 'Practised' : unit.outcome}`}
                  onPress={() =>
                    router.push(`/conversation?track=${track}&unit=${unit.id}` as Href)
                  }
                  style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                >
                  <View
                    style={[
                      styles.iconTile,
                      { backgroundColor: done ? colors.accent : colors.tint },
                    ]}
                  >
                    {done ? (
                      <MaterialCommunityIcons color={colors.onAccent} name="check" size={22} />
                    ) : (
                      <SpeakGlyph color={Palette.ink} size={22} />
                    )}
                  </View>
                  <View style={styles.cardCopy}>
                    <Text style={styles.meta}>{unit.context}</Text>
                    <Text style={styles.cardTitle}>{unit.title}</Text>
                    <Text style={styles.copy}>
                      {done ? 'Practised · again any time' : unit.outcome}
                    </Text>
                  </View>
                  <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', gap: space(4), padding: space(4) },
  body: { gap: space(4), paddingBottom: space(7), paddingHorizontal: space(5) },
  title: { color: Palette.ink, fontFamily: VokaFonts.displayExtraBold, fontSize: FontSize.display },
  copy: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  group: { gap: space(2), marginTop: space(2) },
  groupHead: { alignItems: 'center', flexDirection: 'row', gap: space(2), minHeight: 36 },
  groupName: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    gap: space(4),
    padding: space(4),
  },
  iconTile: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  cardCopy: { flex: 1, gap: space(0.5) },
  meta: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  cardTitle: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  pressed: { opacity: 0.7 },
});
