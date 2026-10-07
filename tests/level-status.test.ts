import { describe, expect, it } from '@jest/globals';

import { foundationLessons } from '@/features/foundations/catalog';
import {
  isStarterLevel,
  levelLabel,
  levelNote,
  levelStatus,
} from '@/features/foundations/level-status';

describe('honest level labels', () => {
  it('knows the status of every level that has lessons', () => {
    for (const lesson of foundationLessons)
      expect(levelStatus[lesson.track][lesson.level]).toBeDefined();
  });

  it('labels unfinished levels as starter sets and names the exam they are not ready for', () => {
    expect(levelLabel('DE', 'A2')).toBe('A2 starter');
    expect(levelNote('DE', 'A2')).toMatch(/does not mean you have reached A2/);
    expect(levelNote('DE', 'A2')).toMatch(/Goethe-Zertifikat A2/);
    expect(levelNote('ES', 'A1')).toMatch(/DELE A1/);
  });

  it('treats a level with no recorded status as a starter, never as complete', () => {
    expect(isStarterLevel('ES', 'B1')).toBe(true);
    expect(levelLabel('ES', 'B1')).toBe('B1 starter');
  });

  it('drops the caveat only for a level explicitly marked complete', () => {
    const saved = levelStatus.DE.A1;
    levelStatus.DE.A1 = 'complete';
    try {
      expect(levelLabel('DE', 'A1')).toBe('A1');
      expect(levelNote('DE', 'A1')).toBe('');
    } finally {
      levelStatus.DE.A1 = saved;
    }
  });

  it('marks no level complete yet, until it passes the curriculum gates', () => {
    const complete = Object.values(levelStatus).flatMap((levels) =>
      Object.values(levels).filter((status) => status === 'complete'),
    );
    expect(complete).toEqual([]);
  });
});
