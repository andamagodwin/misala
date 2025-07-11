import { create } from 'zustand';
import { historyService } from '../lib/historyConfig';
import { useAuthStore } from './authStore';

interface HistoryState {
  history: any[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  saveHistory: (plantName: string, confidence: number, imageUrl: string) => Promise<void>;
  deleteHistoryItem: (documentId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const history = await historyService.getUserHistory(user.$id);
      set({ history, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch history',
        isLoading: false 
      });
    }
  },

  saveHistory: async (plantName: string, confidence: number, imageUrl: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await historyService.saveHistory(user.$id, plantName, confidence, imageUrl);
      // Refresh history after saving
      await get().fetchHistory();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save history',
        isLoading: false 
      });
    }
  },

  deleteHistoryItem: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await historyService.deleteHistoryItem(documentId);
      // Refresh history after deletion
      await get().fetchHistory();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete history item',
        isLoading: false 
      });
    }
  },

  clearHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await historyService.clearUserHistory(user.$id);
      set({ history: [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear history',
        isLoading: false 
      });
    }
  },
}));
