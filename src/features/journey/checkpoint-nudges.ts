import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Checkpoints a learner has already been told about when jumping past them. The note is shown
 * once per checkpoint, never again, on this phone.
 */
export const useCheckpointNudges = create<{
  seen: string[];
  markSeen: (checkpointId: string) => void;
}>()(
  persist(
    (set) => ({
      seen: [],
      markSeen: (checkpointId) =>
        set((state) =>
          state.seen.includes(checkpointId) ? state : { seen: [...state.seen, checkpointId] },
        ),
    }),
    { name: 'voka-checkpoint-nudges', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
