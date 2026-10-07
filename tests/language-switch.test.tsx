import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { LanguageSwitch } from '@/components/language-switch';

describe('LanguageSwitch', () => {
  it('shows all three languages and marks only the current one selected', async () => {
    const screen = await render(
      <LanguageSwitch groupLabel="Practice language" onChange={() => {}} track="ES" />,
    );
    for (const name of ['English', 'German', 'Spanish']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
    expect(screen.getByRole('button', { name: 'Spanish' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'German' })).not.toBeSelected();
    expect(screen.getByText('Español')).toBeTruthy();
  });

  it('reports the chosen language', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <LanguageSwitch groupLabel="Practice language" onChange={onChange} track="EN" />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'German' }));
    expect(onChange).toHaveBeenCalledWith('DE');
  });

  it('uses screen-specific names and short codes when asked', async () => {
    const screen = await render(
      <LanguageSwitch
        groupLabel="Conversation language"
        itemLabel={(name) => `${name} conversation`}
        onChange={() => {}}
        show="code"
        track="DE"
      />,
    );
    expect(screen.getByRole('button', { name: 'Spanish conversation' })).toBeTruthy();
    expect(screen.getByText('ES')).toBeTruthy();
    expect(screen.queryByText('Español')).toBeNull();
  });

  it('ignores presses while disabled, such as during a live session', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <LanguageSwitch disabled groupLabel="Language" onChange={onChange} track="EN" />,
    );
    const spanish = screen.getByRole('button', { name: 'Spanish' });
    expect(spanish).toBeDisabled();
    await fireEvent.press(spanish);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('works as a radio group for single-choice forms', async () => {
    const screen = await render(
      <LanguageSwitch
        groupLabel="Assessment language"
        onChange={() => {}}
        role="radio"
        track="DE"
      />,
    );
    expect(screen.getByRole('radio', { name: 'German' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Spanish' })).not.toBeChecked();
  });
});
