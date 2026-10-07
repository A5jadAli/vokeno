import { expect, test } from '@playwright/test';
import { listeningScenarios } from '../src/features/listening/scenarios';

test('German remains selected across navigation and a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'German', exact: true }).click();
  await page.getByLabel('Live speaking coach', { exact: true }).click();
  await expect(page).toHaveURL(/\/conversation\?track=DE$/);
  await expect(page.getByText('Everyday German', { exact: true }).last()).toBeVisible();
  await page.getByRole('button', { name: 'Learning path', exact: true }).last().click();
  await expect(page).toHaveURL(/\/sprint\?track=DE$/);
  await expect(page.getByLabel('Open A1 Erster Kontakt')).toBeVisible();
  await page.getByRole('button', { name: 'Home', exact: true }).last().click();
  await page.reload();
  await expect(page.getByText('Everyday German', { exact: true })).toBeVisible();
  await page.getByLabel('Progress', { exact: true }).last().click();
  await page
    .getByRole('button', {
      name: 'Start lesson: Start with your first German words',
      exact: true,
    })
    .last()
    .click();
  await expect(page).toHaveURL(/\/foundation\/greetings$/);
});

test('Spanish shows a first step, persists across reload, and has its own placement check', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Spanish', exact: true }).click();
  await expect(page.getByText('Español for real life')).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Start lesson: Your first useful Spanish exchange' }),
  ).toBeVisible();
  await page.goto('/placement?track=ES');
  await expect(page).toHaveURL(/\/placement\?track=ES$/);
  await expect(page.getByRole('heading', { name: 'Spanish placement check' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Spanish' })).toBeChecked();
});

test('a first practice starts the streak and ticks today, and both survive a reload', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Spanish', exact: true }).click();
  await expect(page.getByText('One small step', { exact: true })).toBeVisible();
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
  await expect(page.getByText('Done for today.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('1-day streak. Best 1 days.')).toBeVisible();
  await expect(page.getByLabel(/: practised$/)).toHaveCount(1);
});

test('all authored listening lessons are discoverable and open in the correct language', async ({
  page,
}) => {
  for (const track of ['EN', 'DE', 'ES'] as const) {
    await page.goto('/');
    await page
      .getByRole('button', {
        name: track === 'DE' ? 'German' : track === 'ES' ? 'Spanish' : 'English',
        exact: true,
      })
      .click();
    await page
      .getByLabel(
        `Open ${track === 'DE' ? 'German' : track === 'ES' ? 'Spanish' : 'English'} listening lessons`,
      )
      .click();
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
