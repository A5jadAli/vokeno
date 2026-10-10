// Who speaks each line. Every character has their own voice and a short direction, on top of a
// native-speaker direction for the language, so a scene sounds like different people talking.
// Voices are OpenAI text-to-speech voices; directions steer accent, age and manner.

import type { LanguageTrack } from '@/features/language/config';

export type Voice =
  | 'alloy'
  | 'ash'
  | 'ballad'
  | 'cedar'
  | 'coral'
  | 'echo'
  | 'marin'
  | 'nova'
  | 'onyx'
  | 'sage'
  | 'shimmer'
  | 'verse';

export type Casting = { voice: Voice; direction: string };

/** How everyone in a language speaks, before the character's own direction. */
export const nativeDirection: Record<LanguageTrack, string> = {
  DE: 'Speak as a native speaker from Germany, in natural, modern standard German (Hochdeutsch) at a relaxed conversational pace. Use native German pronunciation for every word and name, including ü, ö, ä, ch and the r. Sound like a real person, not an announcer or a textbook recording.',
  ES: 'Speak as a native speaker from Mexico City, in natural, modern Mexican Spanish at a relaxed conversational pace. Use native Mexican pronunciation and intonation for every word and name. Sound like a real person, not an announcer or a textbook recording.',
  EN: 'Speak as a native speaker from southern England, in natural, modern British English at a relaxed conversational pace. Use natural British pronunciation, rhythm and weak forms. Sound like a real person, not an announcer or a textbook recording.',
};

/** Words, questions and example sentences: one clear, friendly native voice per language. */
export const narrator: Record<LanguageTrack, Casting> = {
  DE: { voice: 'marin', direction: 'A friendly teacher saying a word or sentence clearly, once.' },
  ES: { voice: 'marin', direction: 'A friendly teacher saying a word or sentence clearly, once.' },
  EN: { voice: 'marin', direction: 'A friendly teacher saying a word or sentence clearly, once.' },
};

const cast = (voice: Voice, direction: string): Casting => ({ voice, direction });

export const characters: Record<LanguageTrack, Record<string, Casting>> = {
  DE: {
    Lena: cast(
      'coral',
      'Lena, a friendly woman in her late twenties from Leipzig. Warm and casual.',
    ),
    Jonas: cast('ash', 'Jonas, a relaxed young man from Hamburg. Easy-going, slightly fast.'),
    'Frau Schulz': cast('nova', 'Frau Schulz, a clear and kind language teacher in her forties.'),
    Alex: cast('alloy', 'Alex, a calm adult who is new in town. Polite and clear.'),
    Maria: cast(
      'shimmer',
      'Maria, a young Brazilian woman who speaks fluent German with a light Brazilian Portuguese accent.',
    ),
    'Frau Wagner': cast(
      'sage',
      'Frau Wagner, a warm, polite woman in her seventies. A little slower.',
    ),
    Karim: cast(
      'echo',
      'Karim, a man in his thirties from Egypt who speaks fluent German with a light Arabic accent.',
    ),
    Trainer: cast('verse', 'A cheerful gym trainer in his twenties. Casual and upbeat.'),
    Rezeption: cast('nova', 'A friendly gym receptionist on the phone. Efficient and polite.'),
    Kellnerin: cast('marin', 'A friendly waitress in a busy café. Quick and warm.'),
    Kassiererin: cast(
      'marin',
      'A supermarket cashier on a busy Saturday. Fast and matter-of-fact.',
    ),
    Verkäufer: cast('onyx', 'A cheerful market seller in his fifties. Loud, friendly and quick.'),
    Verkäuferin: cast('coral', 'A friendly woman at a bakery counter early in the morning.'),
    Kundin: cast('shimmer', 'A woman in her thirties shopping. Polite and relaxed.'),
    Ansage: cast(
      'onyx',
      'A railway station announcement. Calm, formal and evenly paced, as on a platform loudspeaker.',
    ),
    Vermieter: cast('ballad', 'A landlord in his fifties leaving a quick voicemail. Casual.'),
    Praxis: cast(
      'sage',
      'A receptionist at a busy doctor’s practice answering the phone. Brisk but kind.',
    ),
    Patient: cast(
      'echo',
      'Amir, a man in his thirties calling his doctor. Polite and a bit unwell.',
    ),
    Aylin: cast(
      'marin',
      'Aylin, a colleague in her late twenties from Cologne. Lively and friendly.',
    ),
    Tim: cast('verse', 'Tim, a colleague in his thirties. Tired after work but good-humoured.'),
    Tom: cast('ash', 'Tom, a young man telling a short story about his weekend. Relaxed.'),
    Sara: cast('coral', 'Sara, a woman in her twenties describing a chaotic morning. Lively.'),
    Nachbarin: cast(
      'sage',
      'A neighbour in her sixties making a polite complaint. Calm and courteous.',
    ),
    Mieter: cast('cedar', 'A tenant in his thirties, surprised and apologetic.'),
  },
  ES: {
    Ana: cast('coral', 'Ana, a friendly young woman from Mexico City. Warm and curious.'),
    Omar: cast(
      'echo',
      'Omar, a young man from Pakistan who lives in Mexico City and speaks fluent Spanish with a light accent.',
    ),
    Barista: cast('verse', 'A young barista in Mexico City. Friendly and quick.'),
    Cliente: cast('alloy', 'A customer in their thirties. Polite and relaxed.'),
    Viajera: cast('shimmer', 'A woman travelling in the city, asking for help. Polite.'),
    Chofer: cast('onyx', 'A bus driver in his fifties. Busy but helpful.'),
    Huésped: cast('ash', 'A hotel guest in the evening. Tired but polite.'),
    Recepcionista: cast('nova', 'A hotel receptionist. Warm and efficient.'),
    Vendedor: cast('ballad', 'A cheerful market seller in his fifties. Loud and friendly.'),
    Diego: cast('ash', 'Diego, a young man answering his phone. Very casual.'),
    Lucía: cast('coral', 'Lucía, a young woman calling a friend. Bright and casual.'),
    Mariana: cast('shimmer', 'Mariana, a colleague in her thirties. Chatty and friendly.'),
    Raúl: cast('echo', 'Raúl, a colleague in his thirties. Still tired from the weekend.'),
    Farmacéutica: cast('sage', 'A pharmacist in her fifties. Kind and reassuring.'),
    Mesero: cast('verse', 'A waiter at a busy taquería. Quick and friendly.'),
    Sofía: cast('nova', 'Sofía, a young woman ordering with friends. Relaxed.'),
    Andrés: cast('cedar', 'Andrés, a young man ordering with friends. Easy-going.'),
    Pasajero: cast('ash', 'An airline passenger whose flight was cancelled. Stressed but polite.'),
    Agente: cast('marin', 'An airline agent at the desk. Professional and kind.'),
  },
  EN: {
    Barista: cast(
      'verse',
      'A young barista in London during the morning rush. Friendly and quick.',
    ),
    Customer: cast('alloy', 'A customer in their thirties. Polite and relaxed.'),
    Announcement: cast(
      'onyx',
      'A railway station announcement. Calm, formal and evenly paced, as on a platform loudspeaker.',
    ),
    Maya: cast('coral', 'Maya, a colleague in her twenties. Casual and friendly.'),
    Sam: cast('ash', 'Sam, a colleague in his twenties. Laid-back.'),
    Receptionist: cast('nova', 'A receptionist answering the phone. Warm and professional.'),
    Caller: cast('cedar', 'A caller in his thirties booking a course. Polite.'),
    Priya: cast('shimmer', 'Priya, a woman in her twenties from London. Chatty and direct.'),
    Tom: cast('ash', 'Tom, a young man from London. Relaxed.'),
    'Host A': cast('marin', 'A podcast host. Lively, curious and quick.'),
    'Host B': cast('echo', 'A second podcast host. Thoughtful and measured.'),
    Patient: cast('alloy', 'A patient checking in at a GP surgery. Polite.'),
    Leah: cast('coral', 'Leah, a friend in her twenties. Warm and interested.'),
    Ravi: cast('verse', 'Ravi, a man in his twenties from London. Upbeat but a little tired.'),
    Lecturer: cast('sage', 'A university lecturer giving a clear, well-paced talk.'),
  },
};

/** The voice for a line: the character's own, or the narrator for everything else. */
export function castingFor(track: LanguageTrack, speaker?: string): Casting {
  return (speaker && characters[track][speaker]) || narrator[track];
}
