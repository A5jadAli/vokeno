import { describe, expect, it } from '@jest/globals';

import { newlyActive, randomInstallId } from '@/features/usage/usage';

describe('anonymous usage counts', () => {
  it('makes a version-4 UUID the database accepts', () => {
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(randomInstallId()).toMatch(uuid);
    expect(randomInstallId(() => 0)).toBe('00000000-0000-4000-8000-000000000000');
    expect(randomInstallId(() => 0.999)).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });

  it('counts a language once, the first time it is practised that day', () => {
    const day = '2026-10-24';
    expect(newlyActive({}, { [day]: ['lesson:ES'] }, day)).toEqual(['ES']);
    expect(
      newlyActive({ [day]: ['lesson:ES'] }, { [day]: ['lesson:ES', 'review:ES'] }, day),
    ).toEqual([]);
    expect(
      newlyActive({ [day]: ['lesson:ES'] }, { [day]: ['lesson:ES', 'speaking:DE'] }, day),
    ).toEqual(['DE']);
    // Other days, and old entries with no language, are not today's activity.
    expect(newlyActive({}, { '2026-10-23': ['lesson:EN'], [day]: ['lesson'] }, day)).toEqual([]);
  });
});
