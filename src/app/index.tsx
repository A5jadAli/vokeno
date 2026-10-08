import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { TabHeader } from '@/components/tab-header';
import { TodayCard } from '@/components/today-card';
import { AppScreen } from '@/components/voka-ui';
import { useSelectedLanguage } from '@/features/language/selection';
import { hasCompletedOnboarding } from '@/features/onboarding/storage';

/** Today: the same screen for every language, built around the one thing to do now. */
export default function TodayScreen() {
  const [track, setTrack] = useSelectedLanguage();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void hasCompletedOnboarding().then((completed) => {
      if (!completed) router.replace('/onboarding');
    });
  }, [router]);

  return (
    <AppScreen activeNav="today">
      <TabHeader title="Today" track={track} onTrack={setTrack} />
      <TodayCard track={track} />
    </AppScreen>
  );
}
