// Every line the app can speak, with who speaks it. The voice generator records exactly this
// list, screens prefetch their part of it, and a test checks that every entry has a clip.

import { foundationLessons, type FoundationLesson } from '@/features/foundations/catalog';
import type { LanguageTrack } from '@/features/language/config';
import { listeningScenarios, type ListeningScenario } from '@/features/listening/scenarios';
import { placementItems } from '@/features/placement/items';

import { levelCheckSentences, listeningWarmUpSample, vocabularyDeck } from './spoken-texts';

export type SpokenLine = { track: LanguageTrack; text: string; speaker?: string };

function collector() {
  const lines: SpokenLine[] = [];
  const add = (track: LanguageTrack, text: string | undefined, speaker?: string) => {
    if (text && text.trim()) lines.push({ track, text, speaker });
  };
  return { lines, add };
}

/** Everything a lesson can say, in the order a learner meets it. */
export function lessonLines(lesson: FoundationLesson): SpokenLine[] {
  const { lines, add } = collector();
  const { track } = lesson;
  if (lesson.format === 'classic') {
    if (lesson.reading) add(track, lesson.reading.spoken ?? lesson.reading.target);
    lesson.phrases.forEach((phrase) => add(track, phrase.target));
    lesson.checks.forEach((check) => add(track, check.audio));
    return lines;
  }
  for (const step of lesson.steps) {
    if (step.kind === 'scene')
      step.lines.forEach((line) => {
        add(track, line.text, line.speaker);
        add(track, line.real, line.speaker);
      });
    if (step.kind === 'teach') step.items.forEach((item) => add(track, item.target));
    if (step.kind === 'choose') add(track, step.audio);
    if (step.kind === 'speak') step.lines.forEach((line) => add(track, line));
    if (step.kind === 'rule') step.examples?.forEach((example) => add(track, example));
    // A correct word-order answer is read back.
    if (step.kind === 'build') add(track, step.answer.join(' '));
  }
  return lines;
}

export function scenarioLines(scenario: ListeningScenario): SpokenLine[] {
  return scenario.lines.map((line) => ({
    track: scenario.track,
    text: line.text,
    speaker: line.speaker,
  }));
}

export function spokenLines(): SpokenLine[] {
  const { lines, add } = collector();
  for (const lesson of foundationLessons) lines.push(...lessonLines(lesson));
  for (const scenario of listeningScenarios) lines.push(...scenarioLines(scenario));
  for (const track of ['EN', 'DE', 'ES'] as const) {
    placementItems[track].forEach((item) => add(track, item.audio));
    add(track, levelCheckSentences[track].sentence);
  }
  vocabularyDeck.forEach((card) => add('DE', card.word));
  add('EN', listeningWarmUpSample);
  return lines;
}
