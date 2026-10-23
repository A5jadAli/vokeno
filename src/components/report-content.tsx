import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionRow, lessonText, PrimaryButton } from '@/components/lesson-ui';
import { Feedback, FontSize, Palette, Radius, space, VokaFonts } from '@/constants/theme';
import {
  REPORT_REASONS,
  reportAiContent,
  type ReportReason,
  type ReportSurface,
} from '@/features/safety/report';

/** "Report" control for AI-generated content, opening a bottom sheet. */
export function ReportContent({
  surface,
  excerpt,
  track,
  dark = false,
}: {
  surface: ReportSurface;
  excerpt?: string;
  track?: 'EN' | 'DE' | 'ES';
  dark?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const close = () => {
    setOpen(false);
    setReason(null);
    setDetails('');
    setState('idle');
    setError('');
  };
  const send = async () => {
    if (!reason) return;
    setState('sending');
    setError('');
    try {
      await reportAiContent({ surface, reason, details, excerpt, track });
      setState('sent');
    } catch (reportError) {
      setState('idle');
      setError(
        reportError instanceof Error ? reportError.message : 'The report could not be sent.',
      );
    }
  };
  const ink = dark ? Palette.cream : Palette.secondary;
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Report AI response"
        hitSlop={8}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && { opacity: 0.6 }]}
      >
        <MaterialCommunityIcons name="flag-outline" size={16} color={ink} />
        <Text style={[styles.triggerText, { color: ink }]}>Report</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent
        visible={open}
        onRequestClose={close}
        statusBarTranslucent
      >
        <Pressable accessibilityLabel="Close report" style={styles.scrim} onPress={close} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.grabber} />
            {state === 'sent' ? (
              <View style={styles.sent}>
                <View style={styles.sentIcon}>
                  <MaterialCommunityIcons name="check-bold" size={32} color={Palette.ink} />
                </View>
                <Text style={lessonText.prompt}>Thanks for reporting</Text>
                <Text style={[lessonText.lead, { textAlign: 'center' }]}>
                  We review every report and use it to improve Vokeno’s AI coach.
                </Text>
                <View style={{ alignSelf: 'stretch' }}>
                  <PrimaryButton title="Done" onPress={close} />
                </View>
              </View>
            ) : (
              <>
                <Text accessibilityRole="header" style={lessonText.prompt}>
                  Report this AI response
                </Text>
                <Text style={lessonText.small}>
                  Tell us what went wrong. Your report goes to the Vokeno team.
                </Text>
                <View accessibilityRole="radiogroup" style={{ gap: space(2) }}>
                  {REPORT_REASONS.map((item) => (
                    <ActionRow
                      key={item.key}
                      title={item.label}
                      selected={reason === item.key}
                      choice
                      onPress={() => setReason(item.key)}
                    />
                  ))}
                </View>
                <TextInput
                  accessibilityLabel="Report details"
                  multiline
                  maxLength={500}
                  placeholder="Add details (optional)"
                  placeholderTextColor={Palette.muted}
                  value={details}
                  onChangeText={setDetails}
                  style={styles.input}
                  textAlignVertical="top"
                />
                {error ? (
                  <Text accessibilityRole="alert" style={styles.error}>
                    {error}
                  </Text>
                ) : null}
                {state === 'sending' ? (
                  <ActivityIndicator color={Palette.ink} />
                ) : (
                  <PrimaryButton
                    title="Send report"
                    disabled={!reason}
                    onPress={() => void send()}
                  />
                )}
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { alignItems: 'center', flexDirection: 'row', gap: space(1), minHeight: 32 },
  triggerText: { fontFamily: VokaFonts.bodySemiBold, fontSize: FontSize.label },
  scrim: { backgroundColor: Palette.scrim, flex: 1 },
  sheet: {
    backgroundColor: Palette.cream,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: space(4),
    paddingBottom: space(7),
    paddingHorizontal: space(5),
    paddingTop: space(2),
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: Palette.handle,
    borderRadius: Radius.pill,
    height: 5,
    marginBottom: space(2),
    width: 40,
  },
  input: {
    backgroundColor: Palette.white,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 2,
    color: Palette.ink,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.body,
    minHeight: 80,
    padding: space(3),
  },
  error: { color: Feedback.wrongText, fontFamily: VokaFonts.bodyMedium, fontSize: FontSize.label },
  sent: { alignItems: 'center', gap: space(3), paddingVertical: space(2) },
  sentIcon: {
    alignItems: 'center',
    backgroundColor: Feedback.correctSoft,
    borderRadius: Radius.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
});
