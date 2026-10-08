import { expect, test } from '@playwright/test';
import { listeningScenarios } from '../src/features/listening/scenarios';
import { chooseLanguage, openTab } from './nav';

test('German stays selected across every tab and a reload', async ({ page }) => {
  await page.goto('/');
  await chooseLanguage(page, 'German');
  await openTab(page, 'Practice');
  await expect(page).toHaveURL(/\/practice\?track=DE$/);
  await expect(page.getByRole('button', { name: /^Speaking · A1/ })).toBeVisible();
  await openTab(page, 'Course');
  await expect(page).toHaveURL(/\/sprint\?track=DE$/);
  await expect(page.getByRole('button', { name: /^Unit 1 · Hallo!/ })).toBeVisible();
  await openTab(page, 'Today');
  await page.reload();
  await expect(page.getByRole('button', { name: /^Learning German\./ })).toBeVisible();
  await openTab(page, 'Progress');
  await expect(page.getByText('German course')).toBeVisible();
  await openTab(page, 'Today');
  await page.getByRole('button', { name: /^Start lesson: Hallo, Tschüss/ }).click();
  await expect(page).toHaveURL(/\/foundation\/de-a1-u1-hallo$/);
});

test('Spanish shows a first step, persists across reload, and has its own placement check', async ({
  page,
}) => {
  await page.goto('/');
  await chooseLanguage(page, 'Spanish');
  await page.reload();
  await expect(page.getByRole('button', { name: /^Learning Spanish\./ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Start lesson: / })).toBeVisible();
  await page.goto('/placement?track=ES');
  await expect(page).toHaveURL(/\/placement\?track=ES$/);
  await expect(page.getByRole('heading', { name: 'Spanish placement check' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Spanish' })).toBeChecked();
});

test('a first practice starts the streak without claiming today’s lesson is done', async ({
  page,
}) => {
  await page.goto('/');
  await chooseLanguage(page, 'Spanish');
  await expect(page.getByText('Practise today to start a streak.')).toBeVisible();
  await expect(page.getByLabel('0-day streak. Best 0 days.')).toBeVisible();

  const dialogue = listeningScenarios.find((scenario) => scenario.id === 'es-first-meeting')!;
  await page.goto(`/lesson/${dialogue.id}`);
  await page
    .getByRole('radio', { name: dialogue.question.options[dialogue.question.correctIndex] })
    .click();
  await page.getByRole('button', { name: 'Check answer' }).click();

  await page.goto('/');
  await expect(page.getByLabel('1-day streak. Best 1 days.')).toBeVisible();
  await expect(page.getByText('You practised today.')).toBeVisible();
  // Listening is not today's lesson: the lesson is still the next thing to do.
  await expect(page.getByRole('button', { name: /^Start lesson: / })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('1-day streak. Best 1 days.')).toBeVisible();
  await expect(page.getByLabel(/: practised$/)).toHaveCount(1);
});

test('all authored listening lessons are discoverable and open in the correct language', async ({
  page,
}) => {
  for (const track of ['EN', 'DE', 'ES'] as const) {
    await page.goto(`/practice?track=${track}`);
    await page.getByRole('button', { name: /^Listening\. / }).click();
    await expect(page).toHaveURL(new RegExp(`/listening\\?track=${track}$`));
    for (const scenario of listeningScenarios.filter((entry) => entry.track === track)) {
      await page
        .getByRole('button', { name: `Open listening lesson ${scenario.title}`, exact: true })
        .click();
      await expect(page.getByText(scenario.question.prompt, { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Go back', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/listening\\?track=${track}$`));
    }
  }
});
