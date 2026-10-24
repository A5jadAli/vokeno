import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, Eyebrow, HeaderBack } from '@/components/voka-ui';
import { documents } from '@/features/legal/documents';
import { Brand, FontSize, LineHeight, Palette, space, VokaFonts } from '@/constants/theme';

export default function LegalScreen() {
  const { document } = useLocalSearchParams<{ document?: string }>();
  const page = document === 'terms' ? documents.terms : documents.privacy;
  return (
    <AppScreen showNav={false}>
      <View style={styles.header}>
        <HeaderBack />
        <Eyebrow color={Brand.accent}>Vokeno</Eyebrow>
        <View style={styles.spacer} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.date}>{page.intro}</Text>
        {page.sections.map(([heading, copy]) => (
          <View key={heading} style={styles.section}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.copy}>{copy}</Text>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: space(4),
  },
  spacer: { width: 40 },
  body: { paddingBottom: space(9), paddingHorizontal: space(6) },
  title: {
    color: Palette.ink,
    fontFamily: VokaFonts.displayExtraBold,
    fontSize: FontSize.display,
  },
  date: {
    color: Palette.muted,
    fontFamily: VokaFonts.bodyMedium,
    fontSize: FontSize.caption,
    marginTop: space(2),
  },
  section: {
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    marginTop: space(6),
    paddingTop: space(4),
  },
  heading: { color: Palette.ink, fontFamily: VokaFonts.bodyBold, fontSize: FontSize.heading },
  copy: {
    color: Palette.secondary,
    fontFamily: VokaFonts.body,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    marginTop: space(2),
  },
});
