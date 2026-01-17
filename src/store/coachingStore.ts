import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CoachingMessage } from '../types';

interface CoachingState {
  // State
  messages: CoachingMessage[];
  lastGeneratedAt: string | null;

  // Actions
  addMessage: (message: CoachingMessage) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;

  // Query helpers
  getUnreadMessages: () => CoachingMessage[];
  getRecentMessages: (count: number) => CoachingMessage[];
  canGenerateNew: () => boolean; // Rate limiting check
}

// Rate limit: minimum 1 hour between generations
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

export const useCoachingStore = create<CoachingState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      lastGeneratedAt: null,

      // Actions
      addMessage: (message) =>
        set((state) => ({
          messages: [message, ...state.messages], // Newest first
          lastGeneratedAt: new Date().toISOString(),
        })),

      markAsRead: (id) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          messages: state.messages.map((m) => ({ ...m, read: true })),
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),

      clearMessages: () =>
        set({
          messages: [],
          lastGeneratedAt: null,
        }),

      // Query helpers
      getUnreadMessages: () => get().messages.filter((m) => !m.read),

      getRecentMessages: (count) =>
        [...get().messages]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, count),

      canGenerateNew: () => {
        const { lastGeneratedAt } = get();
        if (!lastGeneratedAt) return true;

        const lastGenTime = new Date(lastGeneratedAt).getTime();
        const now = new Date().getTime();
        return now - lastGenTime >= RATE_LIMIT_MS;
      },
    }),
    {
      name: 'coaching-tracker-storage',
    }
  )
);
