import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/features/auth/supabase';
import { useCoachingStore } from '@/features/coaching/store';
import { localDay, type PracticeLog } from '@/features/habits/practice-log';
import type { LanguageTrack } from '@/features/language/config';

export type UsageKind = 'active_day' | 'call_started' | 'call_completed';

const INSTALL_KEY = 'voka-install-id';
const tracks: LanguageTrack[] = ['EN', 'DE', 'ES'];

/**
 * A random version-4 UUID for this install. It is not a secret and not tied to the account;
 * it only groups one phone's daily counts, so Math.random is enough.
 */
export function randomInstallId(random = Math.random) {
  const hex = Array.from({ length: 32 }, () => Math.floor(random() * 16).toString(16));
  hex[12] = '4';
  hex[16] = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  const id = hex.join('');
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

let installId: Promise<string> | undefined;
function getInstallId() {
  installId ??= AsyncStorage.getItem(INSTALL_KEY).then(async (saved) => {
    if (saved) return saved;
    const created = randomInstallId();
    await AsyncStorage.setItem(INSTALL_KEY, created);
    return created;
  });
  return installId;
}

/**
 * Counts one anonymous event for today: no content, only the event, the day and the language.
 * Development builds send nothing, and a failed send is dropped, never retried or shown.
 */
export function recordUsage(kind: UsageKind, track: LanguageTrack) {
  if (__DEV__ || !supabase) return;
  const client = supabase;
  const day = localDay(Date.now());
  void getInstallId()
    .then((id) =>
      client.rpc('voka_record_usage', {
        p_install_id: id,
        p_day: day,
        p_kind: kind,
        p_track: track,
      }),
    )
    .catch(() => undefined);
}

/** Languages practised today in `next` that were not practised today in `previous`. */
export function newlyActive(previous: PracticeLog, next: PracticeLog, day: string) {
  const practised = (log: PracticeLog, track: LanguageTrack) =>
    (log[day] ?? []).some((entry) => entry.endsWith(`:${track}`));
  return tracks.filter((track) => practised(next, track) && !practised(previous, track));
}

/** Sends an active day the first time each language is practised on a day. Returns a stop. */
export function startUsageTracking() {
  return useCoachingStore.subscribe((state, previous) => {
    if (state.practiceLog === previous.practiceLog) return;
    const day = localDay(Date.now());
    for (const track of newlyActive(previous.practiceLog, state.practiceLog, day)) {
      recordUsage('active_day', track);
    }
  });
}
