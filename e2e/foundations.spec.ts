import { expect, test, type Page } from '@playwright/test';
import {
  classicLessons,
  foundationLessons,
  type LessonStep,
  type StepLesson,
} from '../src/features/foundations/catalog';
import { placementStages } from '../src/features/placement/items';
import { spanishA1Units } from '../src/features/foundations/spanish-a1-units';
import { chooseLanguage } from './nav';

const unitSessions = foundationLessons.filter(
  (lesson): lesson is StepLesson => lesson.format === 'steps' && lesson.track === 'DE',
);
const markedSteps = (lesson: StepLesson) =>
  lesson.steps.filter((step) => ['choose', 'build', 'type', 'match', 'form'].includes(step.kind))
    .length;

/** Answers one unit step correctly and moves on. */
async function playStep(page: Page, step: LessonStep, spoke = true, language = 'German') {
  const next = page.getByRole('button', { name: 'Continue', exact: true });
  if (step.kind === 'speak')
    return page
      .getByRole('button', { name: spoke ? 'I said it aloud' : 'Skip speaking for now' })
      .click();
  if (step.kind === 'scene' || step.kind === 'teach') return next.click();
  // A checkpoint's opening rule starts it; every other rule is "Got it".
  if (step.kind === 'rule')
    return page.getByRole('button', { name: /^(Got it|Start checkpoint)$/ }).click();
  if (step.kind === 'choose')
    await page.getByRole('radio', { name: step.options[step.answer], exact: true }).click();
  if (step.kind === 'build')
    for (const word of step.answer)
      await page
        .getByRole('button', { name: `Add ${word}`, exact: true })
        .first()
        .click();
  if (step.kind === 'type')
    await page.getByRole('textbox', { name: `Your ${language} answer` }).fill(step.accepted[0]);
  if (step.kind === 'form')
    for (const field of step.fields)
      await page.getByRole('textbox', { name: field.label, exact: true }).fill(field.accepted[0]);
  if (step.kind === 'match')
    for (const [left, right] of step.pairs) {
      await page.getByRole('button', { name: left, exact: true }).click();
      await page.getByRole('button', { name: right, exact: true }).click();
    }
  else await page.getByRole('button', { name: 'Check', exact: true }).click();
  await next.click();
}

test.beforeEach(async ({ page }) => {
  // These lessons must not require an account, provider calls or a microphone.
  await page.route('**/*', (route) =>
    ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname)
      ? route.continue()
      : route.abort(),
  );
});

test('Spanish Units 1 to 6 guide a beginner through twenty-four sessions with saved forms and listening help', async ({
  page,
}, testInfo) => {
  test.setTimeout(420_000);
  await page.goto('/');
  await chooseLanguage(page, 'Spanish');
  await page.getByRole('button', { name: `Start lesson: ${spanishA1Units[0].title}` }).click();
  for (const [index, lesson] of spanishA1Units.entries()) {
    await expect(page).toHaveURL(new RegExp(`/foundation/${lesson.id}$`));
    await expect(page.getByRole('heading', { name: lesson.title })).toBeVisible();
    let helped = 0;
    for (const step of lesson.steps) {
      if (step.kind === 'form') {
        // One field is wrong on purpose: the phone where the form has one, otherwise the last.
        const wrong =
          step.fields.find((field) => field.label === 'Teléfono') ?? step.fields.at(-1)!;
        const wrongValue = wrong.label === 'Teléfono' ? '5501000024' : 'nadie@example.com';
        for (const field of step.fields) {
          const value = field === wrong ? wrongValue : field.accepted[0];
          await page.getByRole('textbox', { name: field.label, exact: true }).fill(value);
        }
        await page.reload();
        // Drafts survive a reload, including ñ in a surname where the form has one.
        const surname = step.fields.find((field) => field.label === 'Apellido');
        if (surname)
          await expect(page.getByRole('textbox', { name: 'Apellido', exact: true })).toHaveValue(
            surname.accepted[0],
          );
        const wrongBox = page.getByRole('textbox', { name: wrong.label, exact: true });
        await expect(wrongBox).toHaveValue(wrongValue);
        await page.getByRole('button', { name: 'Check', exact: true }).click();
        await expect(page.getByText('Check the marked fields', { exact: true })).toBeVisible();
        await expect(page.getByText(wrong.hint, { exact: true })).toBeVisible();
        // The keyboard stays closed so the sheet sits at the bottom; the field is marked instead.
        await expect(wrongBox).not.toBeFocused();
        await wrongBox.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: testInfo.outputPath(`spanish-form-feedback-${lesson.id}.png`),
          fullPage: true,
        });
        helped += 1;
      }
      if (step.kind === 'type' && step.audio === 'cero, nueve, seis') {
        await expect(page.getByText(step.audio, { exact: true })).toHaveCount(0);
        await page.getByRole('button', { name: 'Read instead', exact: true }).click();
        await expect(page.getByText(step.audio, { exact: true })).toBeVisible();
        await page.reload();
        helped += 1;
      }
      if (step.kind === 'speak') {
        await expect(
          page.getByRole('button', { name: `Hear: ${step.lines[0]}`, exact: true }),
        ).toHaveCount(0);
        await page.getByRole('button', { name: 'Show an example', exact: true }).click();
        await expect(
          page.getByRole('button', { name: `Hear: ${step.lines[0]}`, exact: true }),
        ).toBeVisible();
        await page.getByRole('button', { name: 'Try a different situation' }).click();
        await expect(page.getByText(step.mission!.twist, { exact: true })).toBeVisible();
        await expect(
          page.getByRole('button', { name: `Hear: ${step.lines[0]}`, exact: true }),
        ).toHaveCount(0);
        if (index === 0)
          await page.screenshot({
            path: testInfo.outputPath('spanish-speaking.png'),
            fullPage: true,
          });
      }
      await playStep(page, step, false, 'Spanish');
    }
    await expect(
      page.getByText(`${markedSteps(lesson) - helped}/${markedSteps(lesson)} right first time`),
    ).toBeVisible();
    await expect(page.getByText('Skipped', { exact: true })).toBeVisible();
    if (index < spanishA1Units.length - 1) {
      await page
        .getByRole('button', { name: `One more: ${spanishA1Units[index + 1].title}` })
        .click();
    }
  }
  await expect(page.getByText('Unit complete.', { exact: true })).toBeVisible();
  await expect(page.getByText('No new phrases', { exact: true })).toBeVisible();
  const next = foundationLessons.find((lesson) => lesson.id === 'es-sounds')!;
  await page.getByRole('button', { name: `One more: ${next.title}` }).click();
  await expect(page).toHaveURL(/\/foundation\/es-sounds$/);
  await page.goto('/practice?track=ES');
  const phraseCount = spanishA1Units.reduce((sum, lesson) => sum + lesson.phrases.length, 0);
  await expect(
    page.getByText(`${phraseCount} phrases scheduled. Next review tomorrow.`),
  ).toBeVisible();
});

test('a complete beginner gets correction, a persistent draft, evidence and a next lesson', async ({
  page,
}) => {
  const [first, second] = unitSessions;
  await page.goto('/');
  await chooseLanguage(page, 'German');
  await page.getByRole('button', { name: `Start lesson: ${first.title}` }).click();
  await expect(page).toHaveURL(new RegExp(`/foundation/${first.id}$`));
  await expect(page.getByRole('heading', { name: first.title })).toBeVisible();
  const steps = [...first.steps];
  // Scene and words, then a wrong answer is corrected before moving on.
  await playStep(page, steps.shift()!);
  await expect(page.getByText('Hello! / Hi!', { exact: true })).toBeVisible();
  await playStep(page, steps.shift()!);
  const question = steps.shift()!;
  if (question.kind !== 'choose') throw new Error('Expected a question third');
  const wrong = question.options.find((_, index) => index !== question.answer)!;
  await page.getByRole('radio', { name: wrong, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByText('Not quite', { exact: true })).toBeVisible();
  // Picking again is one tap: the wrong option stays marked and closed.
  await expect(page.getByRole('radio', { name: wrong, exact: true })).toBeDisabled();
  await playStep(page, question);
  // The typed draft survives a reload, and a wrong answer gets a hint.
  while (steps[0].kind !== 'type') await playStep(page, steps.shift()!);
  const typing = steps.shift()!;
  if (typing.kind !== 'type') throw new Error('Expected a typing step');
  await page.getByRole('textbox', { name: 'Your German answer' }).fill('wrong words');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Your German answer' })).toHaveValue(
    'wrong words',
  );
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByText('Not yet', { exact: true })).toBeVisible();
  await playStep(page, typing);
  for (const step of steps) await playStep(page, step, false);
  const marked = markedSteps(first);
  await expect(page.getByText(`${marked - 2}/${marked} right first time`)).toBeVisible();
  await expect(page.getByText('Skipped', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(`${marked - 2}/${marked} right first time`)).toBeVisible();
  // The first day's session is one lesson: it is done, with the next lesson as an optional extra.
  await expect(page.getByText('Today’s session is done')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Done for today' })).toBeVisible();
  await page.getByRole('button', { name: `One more: ${second.title}` }).click();
  await expect(page).toHaveURL(new RegExp(`/foundation/${second.id}$`));
  // Today keeps the finished lesson ticked and offers the next one, and the words wait in review.
  await page.goto('/');
  await expect(page.getByRole('button', { name: `Done: ${first.title}` })).toBeVisible();
  await expect(page.getByRole('button', { name: `Optional: ${second.title}` })).toBeVisible();
  await page.goto('/practice?track=DE');
  await expect(
    page.getByText(`${first.phrases.length} phrases scheduled. Next review tomorrow.`),
  ).toBeVisible();
});

test('all lessons can be completed without audio and without false speaking credit', async ({
  page,
}) => {
  test.setTimeout(600_000);
  const lessons = classicLessons.map((lesson) => ({
    id: lesson.id,
    language: lesson.track === 'EN' ? 'English' : lesson.track === 'ES' ? 'Spanish' : 'German',
    choices: lesson.checks.map((check) => check.options[check.answer]),
    answer: lesson.writing.accepted[0],
  }));
  for (const lesson of lessons) {
    await page.goto(`/foundation/${lesson.id}`);
    await page.getByRole('button', { name: 'Practise these phrases' }).click();
    for (const [index, choice] of lesson.choices.entries()) {
      await page.getByRole('radio', { name: choice, exact: true }).click();
      await page.getByRole('button', { name: 'Check', exact: true }).click();
      await page
        .getByRole('button', {
          name: index === lesson.choices.length - 1 ? 'Continue to writing' : 'Next question',
        })
        .click();
    }
    await page.getByLabel(`Your ${lesson.language} answer`).fill(lesson.answer);
    await page.getByRole('button', { name: 'Check my phrase' }).click();
    await page.getByRole('button', { name: 'Continue to speaking practice' }).click();
    await page.getByRole('button', { name: 'Skip speaking for now' }).click();
    const total = lesson.choices.length + 1;
    await expect(page.getByText(`${total}/${total} answers right first time`)).toBeVisible();
    await expect(page.getByText(/You skipped the speaking practice/)).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Open the course' })).toBeVisible();
});

test('unavailable German audio explains the fallback and does not block learning', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.speechSynthesis, 'getVoices', {
      value: () => [
        { voiceURI: 'test-en', lang: 'en-GB', name: 'English', localService: true, default: true },
      ],
    });
  });
  await page.goto('/foundation/greetings');
  await page.getByRole('button', { name: 'Hear: Hallo!', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('continue with the text');
  await page.getByRole('button', { name: 'Practise these phrases' }).click();
  await expect(page.getByText('Question 1 of 3', { exact: true })).toBeVisible();
});

test('placement advances only on secure stages and recommends a real starting lesson', async ({
  page,
}) => {
  const [a1, a2] = placementStages('DE');
  await page.goto('/placement?track=DE');
  await page.getByRole('button', { name: 'Start the check' }).click();
  for (const item of a1) {
    await page.getByRole('radio', { name: item.options[item.answer], exact: true }).click();
    await page.getByRole('button', { name: /Next question|Finish this stage/ }).click();
  }
  await expect(page.getByText(/Stage 2 of 4 · A2/)).toBeVisible();
  for (const item of a2) {
    const wrong = item.options[(item.answer + 1) % item.options.length];
    await page.getByRole('radio', { name: wrong, exact: true }).click();
    await page.getByRole('button', { name: /Next question|Finish this stage/ }).click();
  }
  await expect(page.getByText('Secure up to A1 tasks')).toBeVisible();
  await expect(page.getByText(/not a certified CEFR level/)).toBeVisible();
  await expect(page.getByText('Review what you missed')).toBeVisible();
  await page.getByRole('button', { name: 'Start recommended practice' }).click();
  await expect(page).toHaveURL(/\/foundation\/weekend-smalltalk$/);
});

test('finished lesson phrases come back for spaced review the next day', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-28T09:00:00Z') });
  const lesson = classicLessons.find((item) => item.id === 'greetings')!;
  await page.goto('/foundation/greetings');
  await page.getByRole('button', { name: 'Practise these phrases' }).click();
  for (const [index, check] of lesson.checks.entries()) {
    await page.getByRole('radio', { name: check.options[check.answer], exact: true }).click();
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await page
      .getByRole('button', {
        name: index === lesson.checks.length - 1 ? 'Continue to writing' : 'Next question',
      })
      .click();
  }
  await page.getByLabel('Your German answer').fill('Danke');
  await page.getByRole('button', { name: 'Check my phrase' }).click();
  await page.getByRole('button', { name: 'Continue to speaking practice' }).click();
  await page.getByRole('button', { name: 'I practised aloud' }).click();
  await expect(page.getByText('Lesson complete')).toBeVisible();

  await page.goto('/review?track=DE');
  await expect(page.getByText('Nothing to review yet')).toHaveCount(0);
  await expect(page.getByText('All caught up')).toBeVisible();

  await page.clock.setFixedTime(new Date('2026-09-29T10:00:00Z'));
  await page.goto('/review?track=DE');
  await expect(page.getByText('Which phrase means:')).toBeVisible();
  for (let step = 0; step < 30; step++) {
    if (await page.getByText('Review complete').isVisible()) break;
    if (await page.getByRole('button', { name: 'Check', exact: true }).isVisible()) {
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Check', exact: true }).click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
    } else {
      await page.getByRole('button', { name: 'Show answer' }).click();
      await page.getByRole('button', { name: 'I knew it' }).click();
    }
  }
  await expect(page.getByText('Review complete')).toBeVisible();
  await expect(page.getByText(/You remembered \d+ of 7 phrases/)).toBeVisible();
});

// One test per unit, so a failure names the unit. The content is the same at every screen size,
// so one device runs the full walkthrough; the layout checks above cover both.
const unitNumbers = [...new Set(unitSessions.map((lesson) => lesson.unit.number))];
for (const number of unitNumbers)
  test(`every session of unit ${number} can be finished with full marks`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'modern-android', 'Content check: one device is enough.');
    test.setTimeout(300_000);
    for (const lesson of unitSessions.filter((item) => item.unit.number === number)) {
      await page.goto(`/foundation/${lesson.id}`);
      await expect(page.getByRole('heading', { name: lesson.title })).toBeVisible();
      for (const step of lesson.steps) await playStep(page, step);
      const marked = markedSteps(lesson);
      await expect(page.getByText(`${marked}/${marked} right first time`)).toBeVisible();
    }
  });
