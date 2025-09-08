import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress } from './types';

interface ProgressStore extends Progress {
  markSectionComplete: (module: number, section: number) => void;
  setCurrentLesson: (module: number, section: number) => void;
  startSession: () => void;
  endSession: () => void;
  getTotalTimeSpent: () => string;
  recordQuizAnswer: (module: number, section: number, quizIndex: number, isCorrect: boolean) => void;
  getQuizScore: () => number;
  reset: () => void;
  toggleDevMode: () => void;
  isDevMode: boolean;
}

const defaultProgress: Progress = {
  completedSections: new Set(),
  currentModule: 1,
  currentSection: 1,
  timeSpent: {},
  sessionStartTime: null,
  quizAnswers: {},
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress,
      isDevMode: true,
      markSectionComplete: (module: number, section: number) => {
        set((state) => {
          const newCompleted = new Set(state.completedSections);
          newCompleted.add(`${module}-${section}`);
          return { completedSections: newCompleted };
        });
      },
      setCurrentLesson: (module: number, section: number) => {
        const state = get();
        const currentKey = `${state.currentModule}-${state.currentSection}`;
        const newKey = `${module}-${section}`;
        
        // If we're switching lessons, save the time spent on the previous lesson
        if (state.sessionStartTime && currentKey !== newKey) {
          const timeSpent = Math.floor((Date.now() - state.sessionStartTime) / 1000);
          set((prevState) => ({
            timeSpent: {
              ...prevState.timeSpent,
              [currentKey]: (prevState.timeSpent[currentKey] || 0) + timeSpent
            }
          }));
        }
        
        set({ 
          currentModule: module, 
          currentSection: section,
          sessionStartTime: Date.now()
        });
      },
      startSession: () => {
        set({ sessionStartTime: Date.now() });
      },
      endSession: () => {
        const state = get();
        if (state.sessionStartTime) {
          const currentKey = `${state.currentModule}-${state.currentSection}`;
          const timeSpent = Math.floor((Date.now() - state.sessionStartTime) / 1000);
          set((prevState) => ({
            timeSpent: {
              ...prevState.timeSpent,
              [currentKey]: (prevState.timeSpent[currentKey] || 0) + timeSpent
            },
            sessionStartTime: null
          }));
        }
      },
      getTotalTimeSpent: () => {
        const state = get();
        const totalSeconds = Object.values(state.timeSpent).reduce((sum, time) => sum + time, 0);
        
        // Round to nearest minute
        const totalMinutes = Math.round(totalSeconds / 60);
        
        if (totalMinutes < 60) {
          return `${totalMinutes}м`;
        } else {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return minutes > 0 ? `${hours}ч ${minutes}м` : `${hours}ч`;
        }
      },
      recordQuizAnswer: (module: number, section: number, quizIndex: number, isCorrect: boolean) => {
        const key = `${module}-${section}-${quizIndex}`;
        set((state) => ({
          quizAnswers: {
            ...state.quizAnswers,
            [key]: isCorrect
          }
        }));
      },
      getQuizScore: () => {
        const state = get();
        const correctAnswers = Object.values(state.quizAnswers).filter(Boolean).length;
        const totalAnswers = Object.keys(state.quizAnswers).length;
        
        if (totalAnswers === 0) return 0;
        return Math.round((correctAnswers / totalAnswers) * 100);
      },
      reset: () => {
        set(defaultProgress);
      },
      toggleDevMode: () => {
        set((state) => ({ isDevMode: !state.isDevMode }));
      },
    }),
    {
      name: 'learning-progress',
      partialize: (state) => ({
        completedSections: Array.from(state.completedSections),
        currentModule: state.currentModule,
        currentSection: state.currentSection,
        timeSpent: state.timeSpent,
        sessionStartTime: state.sessionStartTime,
        quizAnswers: state.quizAnswers,
        isDevMode: state.isDevMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert array back to Set
            state.completedSections = new Set(state.completedSections as any);
            // Reset session start time on rehydration to avoid counting time while page was closed
            state.sessionStartTime = null;
          } catch (error) {
            console.warn('Failed to rehydrate progress store:', error);
            // Fallback to default values
            state.completedSections = new Set();
            state.currentModule = 1;
            state.currentSection = 1;
            state.timeSpent = {};
            state.sessionStartTime = null;
          }
        }
      },
    }
  )
);
