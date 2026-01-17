import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry } from '../types';

interface JournalState {
  // State
  entries: JournalEntry[];

  // Actions
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;

  // Query helpers
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntriesByDateRange: (startDate: string, endDate: string) => JournalEntry[];
  getEntryByDate: (date: string) => JournalEntry | undefined;
  getRecentEntries: (count: number) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],

      // Actions
      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, entry],
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      // Query helpers
      getEntryById: (id) => get().entries.find((e) => e.id === id),

      getEntriesByDateRange: (startDate, endDate) =>
        get().entries.filter(
          (e) => e.date >= startDate && e.date <= endDate
        ).sort((a, b) => b.date.localeCompare(a.date)),

      getEntryByDate: (date) => get().entries.find((e) => e.date === date),

      getRecentEntries: (count) =>
        [...get().entries]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, count),
    }),
    {
      name: 'journal-tracker-storage',
    }
  )
);
