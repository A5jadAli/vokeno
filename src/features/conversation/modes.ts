import type { LanguageTrack } from '@/features/listening/scenarios';
import { Palette } from '@/constants/theme';

export type ConversationModeId = 'interview' | 'real-life';

export type ConversationMode = {
  accent: string;
  description: string;
  id: ConversationModeId;
  language: string;
  languageCode: 'de' | 'en' | 'es';
  level: string;
  starter: string;
  title: string;
  track: LanguageTrack;
};

export const conversationModes: ConversationMode[] = [
  {
    accent: Palette.orange,
    description:
      'A quick, natural British conversation with current expressions, connected speech and interview-style follow-ups.',
    id: 'interview',
    language: 'English',
    languageCode: 'en',
    level: 'B1–C1',
    starter: 'Start with a warm, surprising interview question about everyday life.',
    title: 'Modern interview English',
    track: 'EN',
  },
  {
    accent: Palette.yellow,
    description:
      'Handle a realistic everyday situation at native speed, then get gentle help with the phrases that slowed you down.',
    id: 'real-life',
    language: 'German',
    languageCode: 'de',
    level: 'A2–B2',
    starter: 'Begin a friendly conversation as a local at a busy bakery in Berlin.',
    title: 'Everyday German',
    track: 'DE',
  },
  {
    accent: Palette.violet,
    description:
      'A friendly everyday exchange in Mexican Spanish. Start with a short question, then try your own answer.',
    id: 'real-life',
    language: 'Spanish',
    languageCode: 'es',
    level: 'A1',
    starter: 'Start a short first-meeting conversation in clear Mexican Spanish.',
    title: 'Everyday Spanish',
    track: 'ES',
  },
];

export function getConversationMode(track: LanguageTrack) {
  return conversationModes.find((mode) => mode.track === track) ?? conversationModes[0];
}
