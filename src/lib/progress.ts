import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress } from './types';

interface ProgressStore extends Progress {
  markSectionComplete: (module: number, section: number) => void;
  setCurrentLesson: (module: number, section: number) => void;
  reset: () => void;
}

const defaultProgress: Progress = {
  completedSections: new Set(),
  currentModule: 1,
  currentSection: 1,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress,
      markSectionComplete: (module: number, section: number) => {
        set((state) => {
          const newCompleted = new Set(state.completedSections);
          newCompleted.add(`${module}-${section}`);
          return { completedSections: newCompleted };
        });
      },
      setCurrentLesson: (module: number, section: number) => {
        set({ currentModule: module, currentSection: section });
      },
      reset: () => {
        set(defaultProgress);
      },
    }),
    {
      name: 'learning-progress',
      partialize: (state) => ({
        completedSections: Array.from(state.completedSections),
        currentModule: state.currentModule,
        currentSection: state.currentSection,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert array back to Set
            state.completedSections = new Set(state.completedSections as any);
          } catch (error) {
            console.warn('Failed to rehydrate progress store:', error);
            // Fallback to default values
            state.completedSections = new Set();
            state.currentModule = 1;
            state.currentSection = 1;
          }
        }
      },
    }
  )
);
