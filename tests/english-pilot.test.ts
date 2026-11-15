import { describe, expect, it } from '@jest/globals';

import { buildTodayPlan } from '@/features/coaching/daily-plan';
import { buildGoalPlan, defaultGoalLevel } from '@/features/coaching/goal-plan';
import { learningRecommendation } from '@/features/coaching/recommendation';
import { checkFoundationWriting, getTrackLessons } from '@/features/foundations/catalog';
import { englishA1Units } from '@/features/foundations/english-a1-units';
import { freshFoundationEntry, type FoundationProgress } from '@/features/foundations/progress';
import { finalStep, isGradedStep } from '@/features/foundations/types';
import { coursePosition, findNextLesson, lessonsAhead } from '@/features/journey/course';
import { getUnitCall, phrasesUsed, unitCallBrief } from '../supabase/functions/_shared/unit-calls';
import { englishGoals } from '../supabase/functions/_shared/english-reference';

const done = () => ({
  ...freshFoundationEntry(),
  attempts: [{ at: '2026-10-20T09:00:00Z', correctFirstTry: 3, spoken: true }],
});
const completePilot = Object.fromEntries(
  englishA1Units.map((lesson) => [lesson.id, { ...done(), step: finalStep(lesson) }]),
);

describe('English beginner pilot', () => {
  it('accepts equivalent repetition requests while rejecting a different instruction', () => {
    const writing = englishA1Units
      .find((lesson) => lesson.id === 'en-a1-u1-listen')!
      .steps.find((step) => step.kind === 'type')!;
    if (writing.kind !== 'type') throw new Error('Missing repeat task');
    for (const answer of ['again', 'once more', 'one more time'])
      expect(checkFoundationWriting({ track: 'EN', writing }, answer)).toBe(true);
    for (const answer of ['quickly', 'bye', 'never'])
      expect(checkFoundationWriting({ track: 'EN', writing }, answer)).toBe(false);
  });
  it('teaches the repair phrase native speakers use, not the textbook command', () => {
    const text = JSON.stringify([englishA1Units, getUnitCall('en-a1-u1'), getUnitCall('en-a1-u2')]);
    expect(text).not.toContain('Please say that again');
    expect(text).toContain('Sorry, can you say that again?');
  });

  it('accepts natural polite acceptance without accepting refusal or unrelated words', () => {
    const task = englishA1Units
      .find((lesson) => lesson.id === 'en-a1-u3-build')!
      .steps.find((step) => step.kind === 'type')!;
    if (task.kind !== 'type') throw new Error('Missing offer response');
    for (const answer of ['please', 'thanks', 'thank you', 'THANKS!'])
      expect(checkFoundationWriting({ track: 'EN', writing: task }, answer)).toBe(true);
    for (const answer of ['no thanks', 'coffee', 'from'])
      expect(checkFoundationWriting({ track: 'EN', writing: task }, answer)).toBe(false);
  });
  it('never treats the warm-up as a level: a goal aims at A2 or above', () => {
    expect(defaultGoalLevel({}, 'EN', 'en-a1-u1-meet')).toBe('A2');
    expect(defaultGoalLevel(completePilot, 'EN')).toBe('A2');
    const goal = (progress: FoundationProgress, startAt?: string) =>
      buildGoalPlan({
        track: 'EN',
        progress,
        startAt,
        level: 'B1',
        date: '2026-12-01',
        now: Date.parse('2026-10-27T09:00:00Z'),
      });
    // In the warm-up the pace covers only its three units, and says so.
    expect(goal({}, 'en-a1-u1-meet')?.scopeNote).toContain('three warm-up units');
    // Once it is finished the goal counts the course's own lessons.
    expect(goal(completePilot, 'en-a1-u1-meet')?.scopeNote).toBeUndefined();
    expect(goal(completePilot, 'en-a1-u1-meet')?.lessonsLeft).toBeGreaterThan(0);
  });
  it('recognises English contractions without counting fragments inside other words', () => {
    const call = getUnitCall('en-a1-u1')!;
    const used = phrasesUsed(call, ["Hi, I'm Alex. What's your name?"]);
    expect(used.find((item) => item.say.startsWith('I’m'))?.used).toBe(true);
    expect(used.find((item) => item.say.startsWith('What’s'))?.used).toBe(true);
    expect(phrasesUsed(call, ['history imagine']).every((item) => !item.used)).toBe(true);
  });
  it('has twelve short sessions in a stable three-unit sequence, with valid bounded tasks', () => {
    expect(englishA1Units.map((lesson) => lesson.id)).toEqual(
      [1, 2, 3].flatMap((n) =>
        ['meet', 'build', 'listen', 'use'].map((part) => `en-a1-u${n}-${part}`),
      ),
    );
    for (const lesson of englishA1Units) {
      expect(lesson.steps.length).toBeLessThanOrEqual(10);
      expect(lesson.steps.filter(isGradedStep).length).toBeGreaterThanOrEqual(2);
      expect(lesson.steps.some((step) => step.kind === 'speak')).toBe(true);
      expect(JSON.stringify(lesson)).not.toContain('—');
      for (const step of lesson.steps) {
        if (step.kind === 'choose') {
          expect(new Set(step.options).size).toBe(step.options.length);
          expect(step.options[step.answer]).toBeTruthy();
        }
        if (step.kind === 'type')
          for (const answer of step.accepted)
            expect(checkFoundationWriting({ track: 'EN', writing: step }, answer)).toBe(true);
      }
    }
  });

  it('starts people with basic English at A2 and offers the warm-up only to someone new, whatever their goal', () => {
    for (const goal of englishGoals) {
      expect(learningRecommendation('EN', 'basics', goal).href).toBe('/foundation/en-sounds');
      const warmUp = learningRecommendation('EN', 'new', goal);
      expect(warmUp.href).toBe('/foundation/en-a1-u1-meet');
      expect(warmUp.title).toMatch(/^Warm-up: /);
    }
  });

  it('starts a new learner at A2, never in the warm-up', () => {
    expect(findNextLesson({}, 'EN')?.lesson.id).toBe('en-sounds');
    expect(coursePosition({}, 'EN')).toMatchObject({ totalLessons: 20, finishedLessons: 0 });
    // The warm-up is never offered as "next" to someone on the course, even at its end.
    const course = Object.fromEntries(
      getTrackLessons('EN')
        .filter((lesson) => lesson.level !== 'A1')
        .map((lesson) => [lesson.id, done()]),
    );
    expect(findNextLesson(course, 'EN')).toBeNull();
    expect(coursePosition(course, 'EN')).toMatchObject({ totalLessons: 20, finishedLessons: 20 });
  });

  it('walks the chosen warm-up session by session, then moves on to A2', () => {
    const start = 'en-a1-u1-meet';
    const progress: FoundationProgress = {};
    for (const lesson of englishA1Units) {
      expect(findNextLesson(progress, 'EN', start)?.lesson.id).toBe(lesson.id);
      progress[lesson.id] = { ...freshFoundationEntry(), step: 2 };
      expect(findNextLesson(progress, 'EN', start)).toMatchObject({
        lesson: { id: lesson.id },
        reason: 'resume',
      });
      // Someone who began the pilot before the course started at A2 stays in it without a choice.
      expect(findNextLesson(progress, 'EN')?.lesson.id).toBe(lesson.id);
      progress[lesson.id] = done();
    }
    expect(findNextLesson(progress, 'EN', start)).toMatchObject({
      lesson: { id: 'en-sounds' },
      reason: 'start',
    });
    expect(lessonsAhead(progress, 'EN', start)[0].id).toBe('en-sounds');
    // The warm-up's twelve sessions are in neither the count nor the total.
    expect(coursePosition(progress, 'EN', start)).toMatchObject({
      totalLessons: 20,
      finishedLessons: 0,
    });
  });

  it('keeps an existing learner on their older path and honours a chosen starting point', () => {
    expect(findNextLesson({ 'en-sounds': done() }, 'EN')?.lesson.id).toBe('en-small-talk');
    expect(findNextLesson({}, 'EN', 'en-workplace')?.lesson.id).toBe('en-workplace');
    expect(findNextLesson({ 'en-sounds': done() }, 'EN', 'en-a1-u1-meet')?.lesson.id).toBe(
      'en-a1-u1-meet',
    );
    expect(getTrackLessons('DE')[0].id).toBe('de-a1-u1-hallo');
    expect(getTrackLessons('ES')[0].id).toBe('es-a1-u1-words');
  });

  it('offers the first A2 lesson after the warm-up, with no completion claim', () => {
    const plan = buildTodayPlan({
      track: 'EN',
      progress: completePilot,
      completedScenarioIds: [],
      completedUnitIds: [],
      log: {},
      now: Date.parse('2026-10-27T09:00:00Z'),
    });
    expect(plan.courseFinished).toBe(false);
    expect(plan.steps.map((step) => step.href)).toEqual(['/foundation/en-sounds']);
  });

  it('accepts either taught takeaway reply and rejects the opposite choice', () => {
    const task = englishA1Units
      .find((lesson) => lesson.id === 'en-a1-u3-listen')!
      .steps.find((step) => step.kind === 'type')!;
    if (task.kind !== 'type') throw new Error('Missing task');
    const target = { track: 'EN' as const, writing: task };
    expect(checkFoundationWriting(target, 'To go, please.')).toBe(true);
    expect(checkFoundationWriting(target, 'To take away, please.')).toBe(true);
    expect(checkFoundationWriting(target, 'For here, please.')).toBe(false);
  });

  it('links each unit to beginner practice and does not inherit Spanish corrections', () => {
    for (const n of [1, 2, 3]) {
      const call = getUnitCall(`en-a1-u${n}`)!;
      expect(call.track).toBe('EN');
      const brief = unitCallBrief(call, { facts: [], mistakes: [] });
      expect(brief).toContain('Accept clear short replies');
      expect(brief).not.toContain('correction in Spanish');
    }
  });
});
