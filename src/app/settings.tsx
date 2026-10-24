import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { Brand, FontSize, LineHeight, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/use-auth-session';
import { type CoachTone, useCoachingStore } from '@/features/coaching/store';
import { downloadAvailableUpdate, restartWithDownloadedUpdate } from '@/features/updates/ota';
import appConfig from '../../app.json';
import { ReminderPicker } from '@/components/reminder-picker';
import { remindersSupported } from '@/features/habits/reminder-scheduler';
import { useSoundSettings } from '@/features/feedback/sounds';
import { RadioRow } from '@/components/radio-row';

const toneOptions: { description: string; label: string; value: CoachTone }[] = [
  {
    description: 'Patient, specific feedback without teasing.',
    label: 'Supportive',
    value: 'supportive',
  },
  {
    description: 'Switches after recurring struggles across at least 3 practice days.',
    label: 'Adaptive',
    value: 'adaptive',
  },
  {
    description: 'Direct, playful accountability from the next live conversation.',
    label: 'Tough coach',
    value: 'tough',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuthSession();
  const coachTone = useCoachingStore((state) => state.coachTone);
  const setCoachTone = useCoachingStore((state) => state.setCoachTone);
  const answerSounds = useSoundSettings((state) => state.answerSounds);
  const setAnswerSounds = useSoundSettings((state) => state.setAnswerSounds);
  const [checking, setChecking] = useState(false);
  const version = Application.nativeApplicationVersion ?? appConfig.expo.version;
  const build = Application.nativeBuildVersion;
  const isPermanent = Boolean(session && !session.user.is_anonymous);

  const checkForUpdates = async () => {
    if (checking) return;
    setChecking(true);
    try {
      const result = await downloadAvailableUpdate();
      if (result.kind === 'ready') {
        Alert.alert('Update downloaded', 'Restart Vokeno now to apply it?', [
          { text: 'Later', style: 'cancel' },
          { text: 'Restart', onPress: () => void restartWithDownloadedUpdate() },
        ]);
      } else if (result.kind === 'disabled') {
        Alert.alert(
          'Update check unavailable here',
          'This works in the signed preview or production app, not a local development build.',
        );
      } else {
        Alert.alert('Vokeno is up to date', `Version ${version} is the latest available update.`);
      }
    } catch {
      Alert.alert('Could not check', 'Check your internet connection and try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <AppScreen showNav={false}>
      <View style={styles.header}>
        <HeaderBack />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <Eyebrow color={Brand.accent}>Coaching</Eyebrow>
        <Text style={styles.title}>Choose how Vokeno pushes you</Text>
        <Text style={styles.description}>
          Tough feedback is your choice, and it is only ever about your practice.
        </Text>

        <View style={styles.card}>
          {toneOptions.map((option, index) => (
            <RadioRow
              key={option.value}
              accessibilityLabel={`${option.label} coaching`}
              description={option.description}
              label={option.label}
              last={index === toneOptions.length - 1}
              onPress={() => setCoachTone(option.value)}
              selected={coachTone === option.value}
            />
          ))}
        </View>

        {remindersSupported ? (
          <>
            <Eyebrow color={Brand.accent}>Daily reminder</Eyebrow>
            <Text style={styles.description}>
              One reminder around the time you choose (your phone may send it a little later to save
              battery), skipped on days you have already practised. If you are away for a week,
              reminders pause until you come back.
            </Text>
            <View style={styles.card}>
              <ReminderPicker variant="list" />
            </View>
          </>
        ) : null}

        <Eyebrow color={Brand.accent}>Sounds</Eyebrow>
        <View style={styles.card}>
          <View style={styles.versionRow}>
            <MaterialCommunityIcons color={Palette.ink} name="music-note-outline" size={21} />
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>Answer sounds</Text>
              <Text style={styles.rowHint}>
                A short chime when an answer is right. Silent when your phone is on silent or
                vibrate.
              </Text>
            </View>
            <Switch
              // React Native Web colours the knob from activeThumbColor when on (teal by default).
              {...{ activeThumbColor: Palette.white }}
              accessibilityLabel="Answer sounds"
              onValueChange={setAnswerSounds}
              thumbColor={Palette.white}
              trackColor={{ false: Palette.muted, true: Palette.ink }}
              value={answerSounds}
            />
          </View>
        </View>

        <Eyebrow color={Brand.accent}>Account &amp; app</Eyebrow>
        <View style={styles.card}>
          {isPermanent ? (
            <SettingsRow
              icon="lock-reset"
              label="Change or reset password"
              onPress={() => router.push('/auth?mode=forgot')}
            />
          ) : null}
          <SettingsRow
            icon="map-marker-path"
            label="Replay welcome tour"
            onPress={() => router.push('/onboarding?replay=1')}
          />
          <SettingsRow
            icon="shield-lock-outline"
            label="Privacy policy"
            onPress={() => router.push('/legal/privacy' as Href)}
          />
          <SettingsRow
            icon="file-document-outline"
            label="Terms of use"
            onPress={() => router.push('/legal/terms' as Href)}
          />
          <SettingsRow
            icon="update"
            label={checking ? 'Checking for updates…' : 'Check for updates'}
            onPress={() => void checkForUpdates()}
          />
          <View style={styles.versionRow}>
            <MaterialCommunityIcons color={Palette.ink} name="information-outline" size={21} />
            <Text style={styles.rowLabel}>Vokeno version</Text>
            <Text style={styles.rowValue}>
              {version}
              {build ? ` (${build})` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.privacyNote}>
          <MaterialCommunityIcons color={Brand.onDark} name="shield-lock-outline" size={22} />
          <Text style={styles.privacyText}>
            Supabase authorises live practice. Microphone audio travels directly to OpenAI over an
            encrypted connection. Vokeno stops the stream when you end or leave the conversation.
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
}: {
  icon:
    'file-document-outline' | 'lock-reset' | 'map-marker-path' | 'shield-lock-outline' | 'update';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons color={Palette.ink} name={icon} size={21} />
      <Text style={styles.rowLabel}>{label}</Text>
      <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={21} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space(4),
  },
  headerTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  headerSpacer: { width: 40 },
  body: { paddingBottom: space(7), paddingHorizontal: space(5) },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
    marginTop: space(2),
  },
  description: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginBottom: space(4),
    marginTop: space(2),
  },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: space(6),
    marginTop: space(2),
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: space(3),
    minHeight: 60,
    paddingHorizontal: space(4),
  },
  versionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    minHeight: 60,
    paddingHorizontal: space(4),
  },
  rowLabel: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.body,
  },
  rowCopy: { flex: 1, gap: space(1), paddingVertical: space(3) },
  rowHint: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  rowValue: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
  },
  privacyNote: {
    backgroundColor: Palette.ink,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
  },
  privacyText: {
    color: Palette.cream,
    flex: 1,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  pressed: { opacity: 0.7 },
});
