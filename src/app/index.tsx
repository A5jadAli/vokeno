import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { StreakChip } from '@/components/streak-strip';
import { TabHeader } from '@/components/tab-header';
import { TodayCard } from '@/components/today-card';
import { AppScreen } from '@/components/voka-ui';
import { useAuthSession } from '@/features/auth/use-auth-session';
import { useHabits } from '@/features/habits/use-habits';
import { useSelectedLanguage } from '@/features/language/selection';
import { hasCompletedOnboarding } from '@/features/onboarding/storage';
import { getProfileDisplayName } from '@/features/profile/name';

function greeting(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Today: the same screen for every language, built around the one thing to do now. */
export default function TodayScreen() {
  const [track, setTrack] = useSelectedLanguage();
  const router = useRouter();
  const habits = useHabits(track);
  const { session } = useAuthSession();

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void hasCompletedOnboarding().then((completed) => {
      if (!completed) router.replace('/onboarding');
    });
  }, [router]);

  const now = new Date();
  const signedIn = Boolean(session && !session.user.is_anonymous);
  // Only a name the learner gave us: an email address makes an odd greeting.
  const profileName = signedIn
    ? getProfileDisplayName({ isPermanent: true, metadata: session?.user.user_metadata })
    : '';
  const name = profileName && profileName !== 'Learner' ? profileName.split(' ')[0] : '';

  return (
    <AppScreen activeNav="today">
      <TabHeader
        eyebrow={`Today · ${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        title={name ? `${greeting(now.getHours())}, ${name}` : greeting(now.getHours())}
        track={track}
        onTrack={setTrack}
        accessory={
          <StreakChip streak={habits.streak} onPress={() => router.push('/progress' as Href)} />
        }
      />
      <TodayCard track={track} habits={habits} />
    </AppScreen>
  );
}
