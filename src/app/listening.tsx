import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { Palette, VokaFonts } from '@/constants/theme';
import { useSelectedLanguage } from '@/features/language/selection';
import { getScenarios } from '@/features/listening/scenarios';
import { languageDetails, trackColors } from '@/features/language/config';
import { useProgressStore } from '@/features/progress/store';
import { LanguageSwitch } from '@/components/language-switch';

export default function ListeningLibrary() {
  const router = useRouter();
  const [track, select] = useSelectedLanguage();
  const completed = useProgressStore((state) => state.completedScenarioIds);
  const scenarios = getScenarios(track);
  return (
    <AppScreen activeNav="plan">
      <View style={styles.header}>
        <HeaderBack />
        <Eyebrow>Listening practice</Eyebrow>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{languageDetails[track].name} listening</Text>
        <Text style={styles.copy}>
          Choose a dialogue. Listen slowly, follow the meaning, then check what you understood.
        </Text>
        <LanguageSwitch
          groupLabel="Listening language"
          itemLabel={(name) => `${name} listening library`}
          onChange={select}
          track={track}
        />
        {track === 'EN' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/activity/listen')}
            style={styles.card}
          >
            <View style={styles.iconTile}>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color={Palette.ink} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.cardTitle}>Start with a short warm-up</Text>
              <Text style={styles.copy}>
                One sentence, one question. Replay as often as you need.
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Palette.muted} />
          </Pressable>
        ) : null}
        {scenarios.map((scenario) => (
          <Pressable
            key={scenario.id}
            accessibilityRole="button"
            accessibilityLabel={`Open listening lesson ${scenario.title}`}
            onPress={() => router.push(`/lesson/${scenario.id}`)}
            style={styles.card}
          >
            <View
              style={[
                styles.iconTile,
                {
                  backgroundColor: completed.includes(scenario.id)
                    ? trackColors[track].accent
                    : trackColors[track].tint,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={completed.includes(scenario.id) ? 'check' : scenario.icon}
                size={24}
                color={Palette.ink}
              />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.meta}>
                {scenario.level} · {scenario.duration}
                {completed.includes(scenario.id) ? ' · Practised' : ''}
              </Text>
              <Text style={styles.cardTitle}>{scenario.title}</Text>
              <Text style={styles.copy} numberOfLines={2}>
                {scenario.context}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Palette.muted} />
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  header: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  body: { paddingHorizontal: 22, paddingBottom: 28, gap: 14 },
  title: { fontFamily: VokaFonts.bodyBold, color: Palette.ink, fontSize: 28 },
  copy: { fontFamily: VokaFonts.body, color: Palette.secondary, fontSize: 14, lineHeight: 21 },
  iconTile: {
    alignItems: 'center',
    backgroundColor: '#FFE3D6',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  meta: { color: Palette.muted, fontFamily: VokaFonts.bodySemiBold, fontSize: 13 },
  cardTitle: { fontFamily: VokaFonts.bodyBold, fontSize: 16, lineHeight: 22, color: Palette.ink },
  card: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
});
