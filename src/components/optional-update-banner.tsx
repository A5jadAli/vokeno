import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Brand,
  FontSize,
  LineHeight,
  OnDark,
  Palette,
  Radius,
  space,
  VokaFonts,
} from '@/constants/theme';
import { downloadAvailableUpdate, restartWithDownloadedUpdate } from '@/features/updates/ota';

const UPDATE_SNOOZE_KEY = '@voka/update-snoozed-until';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function OptionalUpdateBanner() {
  const insets = useSafeAreaInsets();
  const [otaReady, setOtaReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    async function checkForUpdate() {
      try {
        const snoozedUntil = Number(await AsyncStorage.getItem(UPDATE_SNOOZE_KEY));
        if (Number.isFinite(snoozedUntil) && snoozedUntil > Date.now()) return;

        const ota = await downloadAvailableUpdate();
        if (ota.kind === 'ready') {
          setOtaReady(true);
        }
      } catch {
        // Update checks must never interrupt normal app use.
      }
    }

    void checkForUpdate();
  }, []);

  if (!otaReady || Platform.OS === 'web') return null;

  const dismiss = async () => {
    await AsyncStorage.setItem(UPDATE_SNOOZE_KEY, String(Date.now() + ONE_DAY_MS));
    setOtaReady(false);
  };

  return (
    <View pointerEvents="box-none" style={[styles.layer, { paddingTop: insets.top + 8 }]}>
      <View accessibilityLiveRegion="polite" style={styles.banner}>
        <View style={styles.icon}>
          <MaterialCommunityIcons color={Brand.onDarkInk} name="arrow-up-bold" size={21} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>A Vokeno update is ready</Text>
          <Text numberOfLines={2} style={styles.notes}>
            Restart now to apply it, or continue and update later.
          </Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={() => void dismiss()}>
              <Text style={styles.later}>Later</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => void restartWithDownloadedUpdate()}
              style={styles.updateButton}
            >
              <Text style={styles.updateText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    left: 12,
    position: 'absolute',
    right: 12,
    top: 0,
    zIndex: 100,
  },
  banner: {
    backgroundColor: Palette.ink,
    borderRadius: Radius.xl,
    elevation: 7,
    flexDirection: 'row',
    gap: space(3),
    padding: space(4),
    shadowColor: Palette.ink,
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: Brand.onDark,
    borderRadius: Radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  copy: { flex: 1 },
  title: { color: Palette.cream, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
  notes: {
    color: OnDark.textSecondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    marginTop: space(1),
  },
  actions: { alignItems: 'center', flexDirection: 'row', gap: space(4), marginTop: space(3) },
  later: { color: Palette.cream, fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.caption },
  updateButton: {
    backgroundColor: Brand.onDark,
    borderRadius: Radius.pill,
    paddingHorizontal: space(4),
    paddingVertical: space(2),
  },
  updateText: { color: Brand.onDarkInk, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.label },
});
