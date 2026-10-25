import { describe, expect, it } from '@jest/globals';

import { allTrackLessons } from '@/features/foundations/catalog';
import { wrongChoiceMessage } from '@/features/foundations/wrong-answer';

const phrase = allTrackLessons('DE')
  .flatMap((lesson) => lesson.phrases)
  .find((item) => item.target !== item.meaning)!;

describe('wrong choice messages', () => {
  it('says what a taught phrase means, then how to try again', () => {
    const message = wrongChoiceMessage('DE', phrase.target, 'Pick another answer.');
    expect(message.startsWith(`“${phrase.target}” means “${phrase.meaning}”.`)).toBe(true);
    expect(message.endsWith('Pick another answer.')).toBe(true);
  });

  it('turns a picked meaning back into the phrase, without giving the answer', () => {
    expect(wrongChoiceMessage('DE', phrase.meaning, 'Pick another answer.')).toBe(
      `“${phrase.meaning}” would be “${phrase.target}”. Pick another answer.`,
    );
  });

  it('keeps the plain retry for anything the course does not teach', () => {
    expect(wrongChoiceMessage('DE', 'Something else entirely', 'Pick another answer.')).toBe(
      'Pick another answer.',
    );
  });
});
