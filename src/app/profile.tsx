import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow } from '@/components/voka-ui';
import {
  Brand,
  Feedback,
  FontSize,
  LineHeight,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { useAssessmentStore } from '@/features/assessment/store';
import { deleteCurrentAccount } from '@/features/auth/account';
import { supabase } from '@/features/auth/supabase';
import { useAuthSession } from '@/features/auth/use-auth-session';
import { fetchPlusAccess, isVokaPlusConfigured } from '@/features/subscription/billing';
import { getProfileDisplayName, getProfileInitials } from '@/features/profile/name';
import { formatTestDate } from '@/features/profile/test-date';
import { useCoachingStore, testDateFor } from '@/features/coaching/store';
import { useLanguageSelection } from '@/features/language/selection';
import { courseLevelOf, levelRange } from '@/features/foundations/level-status';
import { coursePosition } from '@/features/journey/course';
import { languageDetails, languageTracks, trackColors } from '@/features/language/config';
import { SpeakGlyph } from '@/components/voice-line';

export default function ProfileScreen() {
  const router = useRouter();
  const { loading, session } = useAuthSession();
  const [accountPending, setAccountPending] = useState(false);
  const isPermanent = Boolean(session && !session.user.is_anonymous);
  // Whether Plus can be bought: only a signed-in account can ask, so guests see "coming soon".
  const [plusOpen, setPlusOpen] = useState(false);
  const accountId = isPermanent ? session?.user.id : undefined;
  useEffect(() => {
    if (!accountId || !isVokaPlusConfigured) return;
    let live = true;
    fetchPlusAccess(accountId).then(
      (access) => {
        if (live) setPlusOpen(access.config.enabled && access.config.salesEnabled);
      },
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [accountId]);
  const displayName = getProfileDisplayName({
    email: session?.user.email,
    isPermanent,
    metadata: session?.user.user_metadata,
  });
  const initials = getProfileInitials(displayName);
  const assessments = useAssessmentStore((state) => state.assessments);
  const track = useLanguageSelection((state) => state.track);
  const foundations = useCoachingStore((state) => state.foundations);
  const startAt = useCoachingStore((state) => state.preferences[track].startAt);
  const assessed = languageTracks.filter((item) => assessments[item]?.estimatedLevel);
  const towards = courseLevelOf(
    track,
    coursePosition(foundations, track, startAt).next?.lesson.level ?? levelRange[track][0],
  );
  const testDate = useCoachingStore((state) => testDateFor(state, track));

  const handleAccount = () => {
    if (!isPermanent) {
      router.push('/auth');
      return;
    }

    Alert.alert('Sign out of Vokeno?', 'You can sign in again at any time.', [
      { style: 'cancel', text: 'Cancel' },
      {
        style: 'destructive',
        text: 'Sign out',
        onPress: () => {
          void (async () => {
            setAccountPending(true);
            const { error } = (await supabase?.auth.signOut()) ?? {};
            setAccountPending(false);
            if (error) {
              Alert.alert('Could not sign out', 'Check your connection and try again.');
            }
          })();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Permanently delete account?',
      'This permanently deletes your Vokeno account and synced learning data. Cancel any store subscription first: deleting your account does not stop billing, and its purchases cannot be restored to a new Vokeno account.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Delete account',
          onPress: () => {
            void (async () => {
              setAccountPending(true);
              try {
                await deleteCurrentAccount();
                router.replace('/');
              } catch (reason) {
                Alert.alert(
                  'Could not delete account',
                  reason instanceof Error ? reason.message : 'Please try again.',
                );
              } finally {
                setAccountPending(false);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <AppScreen>
      <View style={styles.profileHeader}>
        <View
          accessibilityLabel={`${displayName} profile initials`}
          accessibilityRole="image"
          accessible
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{loading ? '…' : initials}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text numberOfLines={1} style={styles.name}>
            {loading ? 'Loading…' : displayName}
          </Text>
          {/* Only levels a check has measured; until then, where the course is heading. */}
          {assessed.length ? (
            <View style={styles.badges}>
              {assessed.map((item) => (
                <Text
                  key={item}
                  accessibilityLabel={`${languageDetails[item].name}: ${assessments[item]?.estimatedLevel}`}
                  style={[styles.badge, { backgroundColor: trackColors[item].tint }]}
                >
                  {item} · {assessments[item]?.estimatedLevel}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.towards}>
              Working towards {towards} in {languageDetails[track].name}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View Vokeno Plus"
        onPress={() => router.push((isPermanent ? '/plus' : '/auth?mode=sign-up') as Href)}
        style={styles.planCard}
      >
        <View>
          {/* Says "coming soon" until sales are open, so the card never promises a checkout
              that the Plus screen then says is not available. */}
          <Eyebrow color={Brand.onDark}>
            {plusOpen ? 'Vokeno Plus' : 'Vokeno Plus · Coming soon'}
          </Eyebrow>
          <Text style={styles.planTitle}>
            {plusOpen ? 'Make room for more practice' : 'More live practice is on its way'}
          </Text>
          {(plusOpen
            ? [
                'Explore live practice plans',
                'See your subscription and allowance',
                'Your free lessons stay free',
              ]
            : ['Your free lessons stay free']
          ).map((benefit) => (
            <View key={benefit} style={styles.benefit}>
              <View style={styles.benefitCheck}>
                <MaterialCommunityIcons color={Palette.ink} name="check" size={14} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
          {/* The card's action, drawn as a button: cream on dark, like every action there. */}
          <View style={styles.planButton}>
            <Text style={styles.planButtonText}>{plusOpen ? 'See plans' : 'What is planned'}</Text>
            <MaterialCommunityIcons color={Palette.ink} name="arrow-right" size={18} />
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityLabel={isPermanent ? 'Sign out' : 'Sign in or create account'}
        accessibilityRole="button"
        accessibilityState={{ disabled: loading || accountPending }}
        disabled={loading || accountPending}
        onPress={handleAccount}
        style={({ pressed }) => [
          styles.accountButton,
          (loading || accountPending) && styles.accountButtonDisabled,
          pressed && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons
          color={Palette.ink}
          name={isPermanent ? 'logout-variant' : 'account-plus-outline'}
          size={21}
        />
        <View style={styles.accountCopy}>
          <Text style={styles.accountTitle}>
            {accountPending
              ? 'Signing out…'
              : isPermanent
                ? session?.user.email
                : 'Sign in for secure live sessions'}
          </Text>
          <Text style={styles.accountDescription}>
            {isPermanent
              ? 'Signed in · Syncs when online · Tap to sign out'
              : 'Sign in to sync your progress'}
          </Text>
        </View>
        <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={22} />
      </Pressable>

      <View style={styles.settings}>
        <Pressable
          accessibilityLabel="Open speaking style and goals"
          onPress={() => router.push('/accent')}
          style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
        >
          <SpeakGlyph color={Palette.ink} size={20} />
          <Text style={styles.settingLabel}>Speaking style &amp; goals</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel="Open spoken level check"
          onPress={() =>
            router.push(
              (assessments[track]
                ? `/assessment-result?track=${track}`
                : `/level-check?track=${track}`) as Href,
            )
          }
          style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="gauge" size={20} />
          <Text style={styles.settingLabel}>
            {assessments[track]
              ? `Latest ${languageDetails[track].name} assessment`
              : 'Spoken level check'}
          </Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel="What your coach remembers"
          accessibilityRole="button"
          onPress={() => router.push('/coach-memory' as Href)}
          style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="brain" size={20} />
          <Text style={styles.settingLabel}>Coach memory</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel={`Set goal date, currently ${formatTestDate(testDate)}`}
          accessibilityRole="button"
          onPress={() => router.push('/test-date' as Href)}
          style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="flag-checkered" size={20} />
          <Text style={styles.settingLabel}>Goal date</Text>
          <Text style={styles.settingValue}>{formatTestDate(testDate)}</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
      </View>

      <View style={styles.settings}>
        <Pressable
          accessibilityLabel="Open settings"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons color={Palette.ink} name="cog-outline" size={20} />
          <Text style={styles.settingLabel}>Settings &amp; app version</Text>
          <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
        </Pressable>
        <Setting icon="web" label="Support language" value="English" />
      </View>

      {/* Destructive, so last and on its own, as both platforms' guidelines ask. */}
      {isPermanent ? (
        <View style={styles.settings}>
          <Pressable
            accessibilityLabel="Delete account"
            accessibilityRole="button"
            disabled={accountPending}
            onPress={handleDeleteAccount}
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons color={Feedback.wrongText} name="delete-outline" size={20} />
            <Text style={[styles.settingLabel, styles.dangerText]}>Delete account</Text>
            <MaterialCommunityIcons color={Palette.muted} name="chevron-right" size={20} />
          </Pressable>
        </View>
      ) : null}
    </AppScreen>
  );
}

function Setting({ icon, label, value }: { icon: 'web'; label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <MaterialCommunityIcons color={Palette.ink} name={icon} size={20} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space(3),
    paddingHorizontal: space(6),
    paddingTop: space(4),
  },
  profileCopy: { flex: 1 },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.ink,
    borderRadius: Radius.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  avatarText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.heading,
  },
  name: { color: Palette.ink, fontFamily: VokaFonts.displayExtraBold, fontSize: FontSize.title },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginTop: space(2) },
  towards: {
    color: Palette.secondary,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(1),
  },
  badge: {
    backgroundColor: Palette.soft,
    borderRadius: Radius.pill,
    color: Palette.ink,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.caption,
    paddingHorizontal: space(3),
    paddingVertical: space(1),
  },
  planCard: {
    backgroundColor: Palette.ink,
    borderRadius: Radius.xl,
    marginHorizontal: space(4),
    marginTop: space(6),
    overflow: 'hidden',
    padding: space(6),
  },
  planTitle: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodyBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
    marginBottom: space(3),
    marginTop: space(2),
  },
  benefit: { alignItems: 'center', flexDirection: 'row', gap: space(3), marginTop: space(2) },
  benefitCheck: {
    alignItems: 'center',
    backgroundColor: Brand.onDark,
    borderRadius: Radius.pill,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  benefitText: {
    color: Palette.cream,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  planButton: {
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: space(2),
    justifyContent: 'center',
    marginTop: space(4),
    minHeight: 48,
  },
  planButtonText: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  accountButton: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space(3),
    marginHorizontal: space(4),
    marginTop: space(4),
    padding: space(4),
  },
  accountCopy: { flex: 1 },
  accountButtonDisabled: { opacity: 0.55 },
  accountTitle: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.body },
  accountDescription: {
    color: Palette.muted,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    marginTop: space(1),
  },
  settings: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.xl,
    borderWidth: 1,
    margin: space(4),
    overflow: 'hidden',
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: space(4),
    minHeight: 58,
    paddingHorizontal: space(4),
  },
  settingLabel: {
    color: Palette.ink,
    flex: 1,
    fontFamily: VokaFonts.bodySemiBold,
    fontSize: FontSize.label,
  },
  settingValue: { color: Palette.muted, fontFamily: VokaFonts.body, fontSize: FontSize.label },
  dangerText: { color: Feedback.wrongText },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
});
