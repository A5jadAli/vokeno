import { useEffect } from 'react';

import { haptic } from './haptics';
import { playAnswerSound, prepareAnswerSound } from './sounds';

/** A checked answer was right: the chime and the haptic land together. */
export function answeredRight() {
  void playAnswerSound();
  haptic.correct();
}

/** Screens that grade answers load the chime once, before the first answer. */
export function useAnswerSound() {
  useEffect(prepareAnswerSound, []);
}
