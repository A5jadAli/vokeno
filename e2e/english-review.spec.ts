import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

test('review findings persist per reviewer and export without implying sign-off', async ({
  page,
}) => {
  await page.route('https://**', (route) => route.abort());
  await page.goto(pathToFileURL(resolve('docs/english-m3-review.html')).href);
  await expect(page.getByText('No human approval is pre-filled.')).toBeVisible();
  await page.getByLabel('Reviewer code', { exact: true }).fill('UK-TEST');
  await page.getByLabel('Review role', { exact: true }).selectOption('British English reviewer');
  await page.getByRole('button', { name: 'Start or resume this review' }).click();
  await page.getByText('Unit 1: Hello, I’m Alex', { exact: true }).click();
  const decision = page.getByLabel('Decision: en-a1-u1-meet, step 1', { exact: true });
  await decision.selectOption('change');
  await page.getByRole('button', { name: 'Export findings' }).click();
  await expect(page.getByRole('status')).toContainText('Add a severity and explanation');
  await page.getByLabel('Severity: en-a1-u1-meet, step 1', { exact: true }).selectOption('major');
  const notes = page.getByLabel('Finding and suggested correction: en-a1-u1-meet, step 1', {
    exact: true,
  });
  await notes.fill('Synthetic browser check, not a human finding.');
  await page.reload();
  await page.getByLabel('Reviewer code', { exact: true }).fill('UK-TEST');
  await page.getByLabel('Review role', { exact: true }).selectOption('British English reviewer');
  await page.getByRole('button', { name: 'Start or resume this review' }).click();
  await page.getByText('Unit 1: Hello, I’m Alex', { exact: true }).click();
  await expect(decision).toHaveValue('change');
  await expect(notes).toHaveValue('Synthetic browser check, not a human finding.');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export findings' }).click();
  const file = await downloaded;
  const exported = JSON.parse(await readFile((await file.path())!, 'utf8'));
  expect(exported.reviewer).toBe('UK-TEST');
  expect(exported.humanSignOff).toBe('not implied by export');
  expect(Object.values(exported.items)).toEqual([
    expect.objectContaining({
      kind: 'script',
      lesson: 'en-a1-u1-meet',
      step: 1,
      decision: 'change',
      severity: 'major',
    }),
  ]);
  await page.getByLabel('Reviewer code', { exact: true }).fill('SECOND-REVIEWER');
  await page.getByRole('button', { name: 'Start or resume this review' }).click();
  await expect(decision).toHaveValue('pending');
  await expect(notes).toHaveValue('');
});

test('older lesson findings remain exportable without counting as current review', async ({
  page,
}) => {
  await page.goto(pathToFileURL(resolve('docs/english-m3-review.html')).href);
  await page.evaluate(() => {
    localStorage.setItem(
      'vokeno-english-m3:["OLD-TEST","English teacher"]',
      JSON.stringify({
        schema: 1,
        reviewer: 'OLD-TEST',
        role: 'English teacher',
        items: {
          'step:en-a1-u1-meet:obsolete-version:1': { decision: 'checked', notes: 'Old review' },
        },
      }),
    );
  });
  await page.getByLabel('Reviewer code', { exact: true }).fill('OLD-TEST');
  await page.getByLabel('Review role', { exact: true }).selectOption('English teacher');
  await page.getByRole('button', { name: 'Start or resume this review' }).click();
  await expect(page.locator('#progress')).toContainText('0 items checked without an issue');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export findings' }).click();
  const exported = JSON.parse(await readFile((await (await downloaded).path())!, 'utf8'));
  expect(exported.items['step:en-a1-u1-meet:obsolete-version:1'].notes).toBe('Old review');
  expect(exported.currentKeys).not.toContain('step:en-a1-u1-meet:obsolete-version:1');
});
