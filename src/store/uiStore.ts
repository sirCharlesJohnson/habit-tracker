import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  isDarkMode: boolean;

  // Modal states
  isHabitModalOpen: boolean;
  isJournalModalOpen: boolean;
  editingHabitId: string | null;
  editingJournalId: string | null;

  // Loading states
  isLoadingAI: boolean;
  isSentimentAnalyzing: boolean;

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  openHabitModal: (habitId?: string) => void;
  closeHabitModal: () => void;
  openJournalModal: (journalId?: string) => void;
  closeJournalModal: () => void;
  setLoadingAI: (loading: boolean) => void;
  setSentimentAnalyzing: (analyzing: boolean) => void;
}

// Check system preference
const getSystemDarkMode = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      isDarkMode: getSystemDarkMode(),
      isHabitModalOpen: false,
      isJournalModalOpen: false,
      editingHabitId: null,
      editingJournalId: null,
      isLoadingAI: false,
      isSentimentAnalyzing: false,

      // Actions
      toggleDarkMode: () =>
        set((state) => {
          const newDark = !state.isDarkMode;
          document.documentElement.classList.toggle('dark', newDark);
          return { isDarkMode: newDark };
        }),

      setDarkMode: (dark) =>
        set(() => {
          document.documentElement.classList.toggle('dark', dark);
          return { isDarkMode: dark };
        }),

      openHabitModal: (habitId) =>
        set({
          isHabitModalOpen: true,
          editingHabitId: habitId || null,
        }),

      closeHabitModal: () =>
        set({
          isHabitModalOpen: false,
          editingHabitId: null,
        }),

      openJournalModal: (journalId) =>
        set({
          isJournalModalOpen: true,
          editingJournalId: journalId || null,
        }),

      closeJournalModal: () =>
        set({
          isJournalModalOpen: false,
          editingJournalId: null,
        }),

      setLoadingAI: (loading) =>
        set({ isLoadingAI: loading }),

      setSentimentAnalyzing: (analyzing) =>
        set({ isSentimentAnalyzing: analyzing }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDarkMode);
        }
      },
    }
  )
);
