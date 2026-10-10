import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { BottomSheet } from '@/components/bottom-sheet';

import { Palette, VokaFonts } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/use-auth-session';
import { useCoachingStore } from '@/features/coaching/store';
import { coursePosition } from '@/features/journey/course';
import {
  languageDetails,
  languageTracks,
  trackColors,
  type LanguageTrack,
} from '@/features/language/config';
import { getProfileDisplayName, getProfileInitials } from '@/features/profile/name';

/** What a language offers, said plainly where a language is chosen. */
export const languageAudience: Record<LanguageTrack, string> = {
  DE: 'From your first words',
  ES: 'From your first words',
  EN: 'For learners who know the basics (A2 and up)',
};

/** The same header on every main tab: where you are, which language, and your account. */
export function TabHeader({
  title,
  track,
  onTrack,
}: {
  title: string;
  track: LanguageTrack;
  onTrack: (track: LanguageTrack) => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <LanguagePicker track={track} onChange={onTrack} />
        <AccountButton />
      </View>
      <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

function AccountButton() {
  const router = useRouter();
  const { session } = useAuthSession();
  const isPermanent = Boolean(session && !session.user.is_anonymous);
  const initials = isPermanent
    ? getProfileInitials(
        getProfileDisplayName({
          email: session?.user.email,
          isPermanent,
          metadata: session?.user.user_metadata,
        }),
      )
    : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Profile and settings"
      hitSlop={4}
      onPress={() => router.push('/profile' as Href)}
      style={({ pressed }) => [styles.account, pressed && styles.pressed]}
    >
      {initials ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <MaterialCommunityIcons color={Palette.ink} name="account-outline" size={22} />
      )}
    </Pressable>
  );
}

/** One control for the active language; the sheet shows where you are in each one. */
export function LanguagePicker({
  track,
  onChange,
}: {
  track: LanguageTrack;
  onChange: (track: LanguageTrack) => void;
}) {
  const [open, setOpen] = useState(false);
  const progress = useCoachingStore((state) => state.foundations);
  const preferences = useCoachingStore((state) => state.preferences);
  const colors = trackColors[track];
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Learning ${languageDetails[track].name}. Change language`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.picker, pressed && styles.pressed]}
      >
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <Text style={styles.pickerText}>{languageDetails[track].name}</Text>
        <MaterialCommunityIcons color={Palette.ink} name="chevron-down" size={18} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} closeLabel="Close language list">
        {(close) => (
          <>
            <Text accessibilityRole="header" style={styles.sheetTitle}>
              Your languages
            </Text>
            <View accessibilityRole="radiogroup" style={styles.list}>
              {languageTracks.map((item, index) => {
                const selected = item === track;
                const position = coursePosition(progress, item, preferences[item].startAt);
                const where = !position.started
                  ? languageAudience[item]
                  : position.next
                    ? `${position.unit?.label ?? position.next.lesson.level} · ${position.finishedLessons} of ${position.totalLessons} lessons done`
                    : `All ${position.totalLessons} lessons done`;
                return (
                  <Animated.View key={item} entering={FadeIn.delay(60 * index).duration(200)}>
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      aria-checked={selected}
                      accessibilityLabel={`${languageDetails[item].name}. ${where}`}
                      onPress={() => {
                        onChange(item);
                        close();
                      }}
                      style={({ pressed }) => [
                        styles.row,
                        selected && { borderColor: trackColors[item].accent },
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={[styles.badge, { backgroundColor: trackColors[item].accent }]}>
                        <Text style={[styles.badgeText, { color: trackColors[item].onAccent }]}>
                          {item}
                        </Text>
                      </View>
                      <View style={styles.rowCopy}>
                        <Text style={styles.rowTitle}>
                          {languageDetails[item].name}
                          <Text style={styles.native}> · {languageDetails[item].nativeName}</Text>
                        </Text>
                        <Text style={styles.rowMeta}>{where}</Text>
                      </View>
                      <MaterialCommunityIcons
                        color={selected ? Palette.ink : Palette.muted}
                        name={selected ? 'check-circle' : 'circle-outline'}
                        size={22}
                      />
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
            <Text style={styles.footnote}>
              Your progress in each language is kept. Explanations are in English.
            </Text>
          </>
        )}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: 10, paddingBottom: 6, paddingHorizontal: 20, paddingTop: 8 },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 30, lineHeight: 36 },
  picker: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
    paddingLeft: 12,
    paddingRight: 8,
  },
  dot: { borderRadius: 99, height: 10, width: 10 },
  pickerText: { color: Palette.ink, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
  account: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: 99,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  initials: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 14 },
  pressed: { opacity: 0.7 },
  sheetTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 22, marginTop: 4 },
  list: { gap: 8 },
  row: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: 'transparent',
    borderRadius: 18,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 12,
    minHeight: 72,
    padding: 12,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  badgeText: { fontFamily: VokaFonts.bodyBold, fontSize: 13 },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: 16 },
  native: { color: Palette.secondary, fontFamily: VokaFonts.bodyMedium },
  rowMeta: { color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: 14, lineHeight: 20 },
  footnote: { color: Palette.muted, fontFamily: VokaFonts.body, fontSize: 13, lineHeight: 19 },
});
