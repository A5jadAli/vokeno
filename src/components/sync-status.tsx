import { Pressable, Text, View } from 'react-native';
import { FontSize, Palette, space, VokaFonts } from '@/constants/theme';
import { syncStatusCopy, useSyncStatus } from '@/features/sync/status';

export function SyncStatusNotice() {
  const { status, retry } = useSyncStatus();
  return (
    <View style={{ paddingHorizontal: space(5), paddingVertical: space(3), gap: space(2) }}>
      <Text
        accessibilityLiveRegion="polite"
        style={{ color: Palette.secondary, fontFamily: VokaFonts.body, fontSize: FontSize.caption }}
      >
        {syncStatusCopy[status]}
      </Text>
      {status === 'offline' ? (
        <Pressable accessibilityRole="button" onPress={retry} style={{ paddingVertical: space(2) }}>
          <Text style={{ color: Palette.ink, textDecorationLine: 'underline' }}>
            Retry cloud sync
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
