import { useState } from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';

import { FormPractice } from '@/components/form-practice';
import { ListeningPrompt } from '@/components/listening-prompt';
import type { LessonAudio } from '@/features/audio/use-lesson-audio';
import type { FormStep } from '@/features/foundations/form-practice';
import { writeFormDraft } from '@/features/foundations/form-practice';
import { spanishA1Units } from '@/features/foundations/spanish-a1-units';

jest.mock('expo-router', () => ({ useRouter: () => ({}) }));
const form = spanishA1Units
  .find((lesson) => lesson.id === 'es-a1-u3-task')!
  .steps.find((step): step is FormStep => step.kind === 'form')!;
const audio = () =>
  ({
    stop: jest.fn(),
    play: jest.fn<LessonAudio['play']>(),
    busy: false,
    loading: false,
    activeText: '',
    activeRate: 0.9,
    error: '',
  }) as unknown as LessonAudio;

describe('listening and form support', () => {
  it('does not leak the dictated answer through text or accessible labels, and records requested help', async () => {
    const speech = audio();
    const help = jest.fn();
    const text = 'cero, nueve, seis';
    const screen = await render(
      <ListeningPrompt text={text} speech={speech} complete={false} onHelp={help} />,
    );
    expect(screen.queryByText(text)).toBeNull();
    expect(screen.queryByRole('button', { name: `Hear: ${text}` })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Play the audio slowly' }));
    expect(speech.play).toHaveBeenCalledWith(text, 0.6);
    expect(help).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Read instead' }));
    expect(screen.getByText(text)).toBeTruthy();
    expect(speech.stop).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Read instead' })).toBeNull();
  });

  it('shows only incorrect field hints, keeps other answers, and can check a restored draft', async () => {
    let ready: { check: () => void } | null = null;
    const report = jest.fn();
    const original = form.fields.map((field) => field.accepted[0]);
    original[3] = '5501000024';
    function Harness() {
      const [draft, setDraft] = useState(writeFormDraft(original));
      return (
        <FormPractice
          step={form}
          draft={draft}
          onDraft={setDraft}
          setReady={(value) => {
            ready = value;
          }}
          report={report}
          complete={false}
          speech={audio()}
          onHelp={jest.fn()}
        />
      );
    }
    const screen = await render(<Harness />);
    await act(() => ready!.check());
    expect(report).toHaveBeenLastCalledWith(false, 'Check the marked fields', expect.any(String));
    expect(screen.getByText(form.fields[3].hint)).toBeTruthy();
    expect(screen.queryByText(form.fields[1].hint)).toBeNull();
    expect(screen.getAllByText('Correct')).toHaveLength(4);
    await fireEvent.changeText(screen.getByLabelText('Teléfono'), '55 0100 0048');
    expect(screen.getByLabelText('Apellido').props.value).toBe('Muñoz');
    await act(() => ready!.check());
    expect(report).toHaveBeenLastCalledWith(true, 'Correct', form.explanation);
    expect(screen.getAllByText('Correct')).toHaveLength(5);
  });
});
