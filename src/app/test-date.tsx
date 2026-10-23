import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { TestDatePicker } from '@/components/test-date-picker';
import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { Dark, Palette, VokaFonts, withAlpha } from '@/constants/theme';
import { defaultGoalLevel, goalLevels } from '@/features/coaching/goal-plan';
import { useCoachingStore, testDateFor } from '@/features/coaching/store';
import { exams, levelLabel } from '@/features/foundations/level-status';
import type { LessonLevel } from '@/features/foundations/types';
import { formatTestDate, parseDateOnly, toDateOnly } from '@/features/profile/test-date';
import { languageDetails, trackColors } from '@/features/language/config';
import { useLanguageSelection } from '@/features/language/selection';

function initialDate(saved: string | null) {
  const parsed = parseDateOnly(saved);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed && parsed >= today) return parsed;
  const nextMonth = new Date();
  nextMonth.setHours(12, 0, 0, 0);
  nextMonth.setDate(nextMonth.getDate() + 30);
  return nextMonth;
}

export default function TestDateScreen() {
  const router = useRouter();
  const track = useLanguageSelection((state) => state.track);
  const savedDate = useCoachingStore((state) => testDateFor(state, track));
  const setTestDate = useCoachingStore((state) => state.setTestDate);
  const choices = useCoachingStore((state) => state.preferences[track]);
  const progress = useCoachingStore((state) => state.foundations);
  const colors = trackColors[track];
  const levels = goalLevels(track);
  const [level, setLevel] = useState<LessonLevel>(
    () => choices.goalLevel ?? defaultGoalLevel(progress, track, choices.startAt),
  );
  const [draft, setDraft] = useState(() => initialDate(savedDate));
  const [pickerVisible, setPickerVisible] = useState(Platform.OS !== 'android');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const save = () => {
    setTestDate(track, toDateOnly(draft), level);
    router.back();
  };

  return (
    <AppScreen backgroundColor={Palette.ink} dark showNav={false}>
      <View style={styles.header}>
        <HeaderBack dark />
        <Text style={styles.headerTitle}>Your goal</Text>
        <View style={styles.spacer} />
      </View>
      <View style={styles.body}>
        <View style={[styles.icon, { backgroundColor: colors.accent }]}>
          <MaterialCommunityIcons color={colors.onAccent} name="flag-checkered" size={32} />
        </View>
        <Eyebrow color={colors.onDark}>Ready by your date</Eyebrow>
        <Text style={styles.title}>Which level, and by when?</Text>
        <Text style={styles.copy}>
          An exam, a visa or a move. Vokeno plans your weeks to get there. It does not book the
          exam.
        </Text>

        {levels.length > 1 ? (
          <View accessibilityRole="radiogroup" style={styles.levels}>
            {levels.map((item) => {
              const chosen = item === level;
              const exam = exams[track]?.[item];
              return (
                <Pressable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: chosen }}
                  accessibilityLabel={`${languageDetails[track].name} ${levelLabel(track, item)}${exam ? `, ${exam}` : ''}`}
                  onPress={() => setLevel(item)}
                  style={[styles.level, chosen && { backgroundColor: colors.onDark }]}
                >
                  <Text style={[styles.levelText, chosen && styles.levelTextChosen]}>{item}</Text>
                  {exam ? (
                    <Text
                      numberOfLines={1}
                      style={[styles.levelExam, chosen && styles.levelTextChosen]}
                    >
                      {exam.replace('-Zertifikat', '').replace(' or Cambridge', '')}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {Platform.OS === 'android' ? (
          <Pressable
            accessibilityLabel="Choose goal date"
            accessibilityRole="button"
            onPress={() => setPickerVisible(true)}
            style={styles.dateButton}
          >
            <MaterialCommunityIcons color={colors.onDark} name="calendar-month" size={23} />
            <Text style={styles.dateButtonText}>{formatTestDate(toDateOnly(draft))}</Text>
            <MaterialCommunityIcons color={Palette.cream} name="chevron-down" size={21} />
          </Pressable>
        ) : null}
        {pickerVisible ? (
          <View style={styles.pickerCard}>
            <TestDatePicker
              minimumDate={today}
              onChange={(value, dismissed) => {
                if (!dismissed) setDraft(value);
                if (Platform.OS === 'android') setPickerVisible(false);
              }}
              value={draft}
            />
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={save}
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.saveText, { color: colors.onAccent }]}>Save goal</Text>
        </Pressable>
        {savedDate ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setTestDate(track, null);
              router.back();
            }}
          >
            <Text style={styles.removeText}>Remove goal</Text>
          </Pressable>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
  headerTitle: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: 18 },
  spacer: { width: 40 },
  body: { padding: 24, paddingTop: 30 },
  icon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
    marginBottom: 20,
    width: 64,
  },
  title: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: 28,
    lineHeight: 34,
    marginTop: 9,
  },
  copy: {
    color: withAlpha(Palette.cream, 0.63),
    fontFamily: VokaFonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 11,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: Dark.raised,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 11,
    marginTop: 25,
    minHeight: 60,
    paddingHorizontal: 16,
  },
  dateButtonText: { color: Palette.cream, flex: 1, fontFamily: VokaFonts.bodyBold, fontSize: 15 },
  pickerCard: {
    backgroundColor: Dark.raised,
    borderRadius: 20,
    marginTop: 24,
    overflow: 'hidden',
    padding: 14,
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 25,
    minHeight: 58,
  },
  saveText: { fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  levels: { flexDirection: 'row', gap: 8, marginTop: 22 },
  level: {
    alignItems: 'center',
    backgroundColor: Dark.raised,
    borderRadius: 16,
    flex: 1,
    gap: 2,
    minHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  levelText: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: 17 },
  levelExam: { color: withAlpha(Palette.cream, 0.6), fontFamily: VokaFonts.body, fontSize: 11 },
  levelTextChosen: { color: Palette.ink },
  removeText: {
    color: withAlpha(Palette.cream, 0.72),
    fontFamily: VokaFonts.bodyBold,
    fontSize: 14,
    paddingVertical: 18,
    textAlign: 'center',
  },
});
