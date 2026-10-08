import { beforeEach, describe, expect, it } from '@jest/globals';

import { testDateFor, useCoachingStore } from '@/features/coaching/store';

describe('test dates per language', () => {
  beforeEach(() => useCoachingStore.getState().resetCoaching());

  it('keeps each language’s exam date separate', () => {
    const { setTestDate } = useCoachingStore.getState();
    setTestDate('DE', '2026-11-20');
    setTestDate('EN', '2026-12-05');
    const state = useCoachingStore.getState();
    expect(testDateFor(state, 'DE')).toBe('2026-11-20');
    expect(testDateFor(state, 'EN')).toBe('2026-12-05');
    expect(testDateFor(state, 'ES')).toBeNull();
  });

  it('treats the original single date as the English (IELTS) date', () => {
    useCoachingStore.setState({ testDate: '2026-10-15' });
    const state = useCoachingStore.getState();
    expect(testDateFor(state, 'EN')).toBe('2026-10-15');
    expect(testDateFor(state, 'DE')).toBeNull();
  });

  it('keeps the original field in step for English, for older app versions', () => {
    useCoachingStore.getState().setTestDate('EN', '2026-12-05');
    expect(useCoachingStore.getState().testDate).toBe('2026-12-05');
    useCoachingStore.getState().setTestDate('DE', '2026-11-20');
    expect(useCoachingStore.getState().testDate).toBe('2026-12-05');
  });

  it('removes one language’s date without touching the others', () => {
    const { setTestDate } = useCoachingStore.getState();
    setTestDate('DE', '2026-11-20');
    setTestDate('EN', '2026-12-05');
    setTestDate('DE', null);
    const state = useCoachingStore.getState();
    expect(testDateFor(state, 'DE')).toBeNull();
    expect(testDateFor(state, 'EN')).toBe('2026-12-05');
  });
});
