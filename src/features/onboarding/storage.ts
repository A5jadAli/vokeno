import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@voka/onboarding-complete';

export async function hasCompletedOnboarding() {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

const GUIDE_KEY = '@voka/today-guide-seen';

/** Whether the learner has dismissed the short “how it works” guide on Today. */
export async function hasSeenTodayGuide() {
  return (await AsyncStorage.getItem(GUIDE_KEY)) === 'true';
}

export async function markTodayGuideSeen() {
  await AsyncStorage.setItem(GUIDE_KEY, 'true');
}
