import type { Page } from '@playwright/test';

/** Picks a language from the header's language picker on any main tab. */
export async function chooseLanguage(page: Page, name: 'English' | 'German' | 'Spanish') {
  await page
    .getByRole('button', { name: /Change language$/ })
    .first()
    .click();
  await page.getByRole('radio', { name: new RegExp(`^${name}\\.`) }).click();
}

/** Opens one of the four labelled destinations in the bottom navigation. */
export async function openTab(page: Page, name: 'Today' | 'Course' | 'Practice' | 'Progress') {
  await page.getByRole('tab', { name, exact: true }).last().click();
}
