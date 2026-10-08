import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { ActionBar, PrimaryButton, TextButton } from '@/components/lesson-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { useHabits } from '@/features/habits/use-habits';
import { trackColors, type LanguageTrack } from '@/features/language/config';

/**
 * The end of every activity: where today's session stands, and one main action. That is the
 * next item in the session, or "Done for today" with one named optional extra. Activities can
 * add their own secondary action, such as returning to the library they were opened from.
 */
export function SessionFooter({
  track,
  secondary,
}: {
  track: LanguageTrack;
  secondary?: { title: string; onPress: () => void };
}) {
  const router = useRouter();
  const { plan } = useHabits(track);
  const colors = trackColors[track];
  const next = plan.steps.find((step) => !step.done);
  const open = (href: string) => router.replace(href as Href);
  return (
    <ActionBar>
      <View
        accessible
        accessibilityLabel={`Today's session: ${plan.doneCount} of ${plan.steps.length} done`}
        style={styles.status}
      >
        <View style={styles.dots}>
          {plan.steps.map((step) => (
            <View
              key={step.key}
              style={[styles.dot, step.done && { backgroundColor: colors.accent }]}
            >
              {step.done ? (
                <Animated.View entering={ZoomIn.springify().damping(14)}>
                  <MaterialCommunityIcons color={colors.onAccent} name="check" size={12} />
                </Animated.View>
              ) : null}
            </View>
          ))}
        </View>
        <Text style={styles.statusText}>
          {next
            ? `Today’s session: ${plan.doneCount} of ${plan.steps.length} done`
            : 'Today’s session is done'}
        </Text>
      </View>
      {next ? (
        <>
          <PrimaryButton
            title={`Next: ${next.title}`}
            icon="arrow-right"
            accessibilityLabel={`Next in today's session: ${next.title}`}
            onPress={() => open(next.href)}
          />
          <TextButton
            title={secondary?.title ?? 'Finish for now'}
            onPress={secondary?.onPress ?? (() => open('/'))}
          />
        </>
      ) : (
        <>
          <PrimaryButton title="Done for today" icon="check" onPress={() => open('/')} />
          {plan.bonus ? (
            <TextButton
              title={`One more: ${plan.bonus.title}`}
              onPress={() => open(plan.bonus!.href)}
            />
          ) : secondary ? (
            <TextButton title={secondary.title} onPress={secondary.onPress} />
          ) : null}
        </>
      )}
    </ActionBar>
  );
}

const styles = StyleSheet.create({
  status: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    alignItems: 'center',
    backgroundColor: 'rgba(19,18,17,0.1)',
    borderRadius: 99,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  statusText: { color: Palette.secondary, fontFamily: VokaFonts.bodySemiBold, fontSize: 14 },
});
