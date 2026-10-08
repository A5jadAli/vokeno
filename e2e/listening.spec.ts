import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

import { chooseLanguage, openTab } from './nav';

const appVersion = (JSON.parse(readFileSync('app.json', 'utf8')) as { expo: { version: string } })
  .expo.version;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Today has the same layout in every language and no horizontal overflow', async ({ page }) => {
  const overflow = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Profile and settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Start lesson: / })).toBeVisible();
  expect(await overflow()).toBe(false);

  await chooseLanguage(page, 'German');
  await expect(page.getByText('Unit 1 · Hallo! · Lesson 1 of 4')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Start lesson: Hallo, Tschüss/ })).toBeVisible();
  await chooseLanguage(page, 'Spanish');
  await expect(page.getByRole('button', { name: /^Start lesson: / })).toBeVisible();
  expect(await overflow()).toBe(false);
});

test('connects the four labelled destinations and the account button', async ({ page }) => {
  for (const name of ['Today', 'Course', 'Practice', 'Progress'])
    await expect(page.getByRole('tab', { name, exact: true })).toBeVisible();

  await openTab(page, 'Course');
  await expect(page).toHaveURL(/\/sprint\?track=EN$/);
  await expect(page.getByText('You are here')).toBeVisible();

  await openTab(page, 'Practice');
  await expect(page).toHaveURL(/\/practice\?track=EN$/);
  await expect(page.getByRole('heading', { name: 'Skills' })).toBeVisible();

  await openTab(page, 'Progress');
  await expect(page).toHaveURL(/\/progress\?track=EN$/);
  await expect(page.getByText('English course')).toBeVisible();

  await page.getByRole('button', { name: 'Profile and settings' }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByLabel('Guest learner profile initials')).toBeVisible();
  await expect(page.getByRole('button', { name: 'View Vokeno Plus' })).toContainText(
    'Make room for more practice',
  );
});

test('keeps primary navigation visible in the live coach and supports both back paths', async ({
  page,
}) => {
  await openTab(page, 'Practice');
  await page.getByRole('button', { name: /^Speaking · / }).click();
  await expect(page).toHaveURL(/\/conversation\?track=EN/);
  for (const name of ['Today', 'Course', 'Practice', 'Progress'])
    await expect(page.getByRole('tab', { name, exact: true }).last()).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/practice\?track=EN$/);

  await page.getByRole('button', { name: /^Speaking · / }).click();
  await page.getByLabel('Go back').click();
  await expect(page).toHaveURL(/\/practice\?track=EN$/);
});

test('opens the live coach and recovers safely when live audio is unavailable', async ({
  page,
}) => {
  await page.goto('/conversation?track=EN');
  await expect(page.getByText('Modern interview English')).toBeVisible();
  await expect(page.getByText('Live captions', { exact: true })).toBeVisible();

  await page.getByLabel('Start live conversation').click();
  await expect(page.getByText('Connection needs attention')).toBeVisible();
  await expect(page.getByText('Try again', { exact: true })).toBeVisible();

  await page.getByLabel('German conversation').click();
  await expect(page.getByText('Everyday German').last()).toBeVisible();
});

test('runs the listening warm-up and continues to the detailed lesson', async ({ page }) => {
  await page.goto('/listening?track=EN');
  await page.getByText('Start with a short warm-up', { exact: true }).click();
  await expect(page).toHaveURL(/\/activity\/listen$/);
  await page.getByLabel('Show transcript').click();
  await expect(page.getByText('Let’s meet outside the station at half past three.')).toBeVisible();
  await expect(page.getByLabel('Check answer')).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('radio', { name: 'Outside the station' }).click();
  await page.getByText('Check', { exact: true }).click();
  await expect(page.getByText('Correct. They will meet outside the station.')).toBeVisible();
  await page.getByText('Continue', { exact: true }).click();

  await expect(page).toHaveURL(/\/lesson\/coffee-run$/);
  await expect(page.getByText('Listen for these')).toBeVisible();
  await page.getByRole('radio', { name: 'An extra espresso shot' }).click();
  await page.getByText('Check answer', { exact: true }).click();
  await expect(page.getByText(/^Today’s session: /)).toBeVisible();
  await page.getByRole('button', { name: 'More listening', exact: true }).click();
  await expect(page).toHaveURL(/\/listening\?track=EN$/);
});

test('opens the spoken check, honest empty result and real account form', async ({ page }) => {
  await page.goto('/profile');
  await page.getByLabel('Open spoken level check').click();
  await expect(page.getByText('The bus to the city leaves every twenty minutes.')).toBeVisible();
  await page.getByLabel('Start spoken level check').click();
  await expect(page.getByText('Spoken level check').last()).toBeVisible();

  await page.goto('/assessment-result');
  await expect(page.getByText('No result yet')).toBeVisible();
  await expect(page.getByLabel('Start spoken level check')).toBeVisible();

  await page.goto('/profile');
  await page.getByLabel('Sign in or create account').click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByText('Create an account', { exact: true })).toHaveCSS(
    'text-decoration-line',
    'underline',
  );
  await page.getByText('New here? Create an account').click();
  await expect(page.getByPlaceholder('First and last name')).toBeVisible();
  await expect(page.getByLabel('At least 8 characters: not met')).toBeVisible();
  await expect(page.getByLabel('Upper- and lowercase letters: not met')).toBeVisible();
  await expect(page.getByLabel('One number: not met')).toBeVisible();
  await expect(page.getByLabel('One symbol, such as ! ? # @: not met')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms of use' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy policy' })).toBeVisible();
  await page.getByPlaceholder('Create a strong password').fill('voka2026');
  await expect(page.getByLabel('At least 8 characters: met')).toBeVisible();
  await expect(page.getByLabel('One number: met')).toBeVisible();
  await expect(page.getByLabel('Upper- and lowercase letters: not met')).toBeVisible();
  await page.getByPlaceholder('Create a strong password').fill('Voka2026!');
  await expect(page.getByLabel('Upper- and lowercase letters: met')).toBeVisible();
  await expect(page.getByLabel('One symbol, such as ! ? # @: met')).toBeVisible();
  await page.getByLabel('Show password').click();
  await expect(page.getByLabel('Hide password')).toBeVisible();
});

test('exposes profile initials, coaching settings, version and password recovery', async ({
  page,
}) => {
  await page.goto('/profile');
  await expect(page.getByLabel('Guest learner profile initials')).toBeVisible();
  await expect(page.getByText('Private by design')).toBeVisible();
  await page.getByLabel('Open settings').click();

  await expect(page.getByText('Choose how Vokeno pushes you')).toBeVisible();
  await page.getByRole('radio', { name: 'Tough coach coaching' }).click();
  await expect(page.getByRole('radio', { name: 'Tough coach coaching' })).toBeChecked();
  await expect(page.getByText('Vokeno version')).toBeVisible();
  await expect(page.getByText(new RegExp(`^${appVersion.replaceAll('.', '\\.')}`))).toBeVisible();

  await page.goto('/auth');
  await expect(page.getByText('Forgot password?')).toHaveCSS('text-decoration-line', 'underline');
  await page.getByText('Forgot password?').click();
  await expect(page.getByText('Reset your password')).toBeVisible();
  await expect(page.getByText('Send reset link')).toBeVisible();
});

test('sets, displays and removes a test date', async ({ page }) => {
  await page.goto('/profile');
  await page.getByLabel('Set test date, currently Not set').click();
  await expect(page.getByText('When is your language test?')).toBeVisible();
  await page.getByLabel('Next day').click();
  await page.getByText('Save test date').click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByLabel(/^Set test date, currently (?!Not set)/)).toBeVisible();

  await page.goto('/practice');
  await expect(
    page.getByRole('button', { name: /^Test date: .*4 focused sessions this week/ }),
  ).toBeVisible();

  await page.goto('/profile');
  await page.getByLabel(/^Set test date, currently (?!Not set)/).click();
  await page.getByText('Remove test date').click();
  await expect(page.getByLabel('Set test date, currently Not set')).toBeVisible();
});

test('protects purchases behind account creation and exposes legal terms', async ({ page }) => {
  await page.goto('/plus');
  await expect(page).toHaveURL(/\/auth\?mode=sign-up$/);
  await expect(page.getByText('Start speaking')).toBeVisible();

  await page.goto('/settings');
  await page.getByText('Privacy policy').click();
  await expect(page.getByText('What Vokeno processes')).toBeVisible();
});

test('configures a speaking goal and opens a focused German curriculum unit', async ({ page }) => {
  await page.goto('/accent?track=DE');
  await expect(page.getByText('Standard German reference')).toBeVisible();
  await page.getByLabel('Work & study speaking goal').click();
  await expect(page.getByLabel('Work & study speaking goal')).toBeChecked();

  await page.goto('/practice?track=DE');
  await page.getByRole('button', { name: /^Show all \d+ conversations$/ }).click();
  await page.getByRole('button', { name: /^B1 · .*Am Telefon/ }).click();
  await expect(page.getByText('Am Telefon').last()).toBeVisible();
  await expect(page.getByText('Kommt drauf an.')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Practice', exact: true }).last()).toBeVisible();
});

test('uses a safe fallback when a lesson id is unknown', async ({ page }) => {
  await page.goto('/lesson/not-a-real-lesson');
  await expect(page.getByText('Coffee on the go')).toBeVisible();
  await expect(page.getByText('What extra does the barista offer?')).toBeVisible();
});

test('first run asks for a language, then how much you know', async ({ page }) => {
  await page.goto('/onboarding');
  await expect(
    page.getByRole('heading', { name: 'Which language do you want to learn?' }),
  ).toBeVisible();
  await expect(page.getByText('For learners who know the basics (A2 and up)')).toBeVisible();
  await page.getByRole('radio', { name: /^German\./ }).click();
  await page.getByRole('button', { name: 'Continue with German' }).click();
  await expect(page).toHaveURL(/\/learning-plan$/);
  await expect(page.getByRole('heading', { name: 'How much German do you know?' })).toBeVisible();
  await expect(page.getByText(/^You will start with: /)).toBeVisible();
});

test('validates writing, records completion and gives a clear next action', async ({ page }) => {
  await page.goto('/activity/write');
  await page.getByRole('textbox', { name: 'Writing response', exact: true }).fill('jkhajkhjhjhjh');
  await page.getByRole('button', { name: 'Submit my writing' }).click();
  await expect(
    page.getByText('Write at least 12 words, using several different words, before you submit.'),
  ).toBeVisible();

  await page
    .getByRole('textbox', { name: 'Writing response', exact: true })
    .fill('Coffee sales rose during the week and Friday was the busiest day overall.');
  await page.getByRole('button', { name: 'Submit my writing' }).click();
  await expect(page.getByText(/Writing activity complete/)).toBeVisible();
  await page.getByRole('button', { name: 'View my progress' }).click();
  await expect(page).toHaveURL(/\/progress$/);
  await expect(page.getByText('Writing days')).toBeVisible();
});

test('finishes the complete vocabulary deck without looping', async ({ page }) => {
  await page.goto('/vocabulary');
  while (!(await page.getByText('Finish deck', { exact: true }).isVisible()))
    await page.getByText('Next card', { exact: true }).click();
  await page.getByText('Finish deck', { exact: true }).click();
  await expect(page).toHaveURL(/\/sprint\?track=DE$/);
});
