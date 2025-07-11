import { create } from 'zustand';
import { remedyService, RemedyDocument } from '../lib/remedyConfig';

export interface Remedy {
  $id: string;
  title: string;
  description: string;
  plant_name: string;
  ingredients: string;
  preparation_method: string;
  usage_instructions: string;
  benefits?: string;
  cautions?: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

interface RemedyState {
  remedies: RemedyDocument[];
  isLoading: boolean;
  error: string | null;
  fetchRemedies: () => Promise<void>;
  addRemedy: (remedy: Omit<Remedy, '$id' | 'author_id' | 'author_name' | 'created_at'>) => Promise<void>;
  deleteRemedy: (remedyId: string) => Promise<void>;
}

export const useRemedyStore = create<RemedyState>((set, get) => ({
  remedies: [],
  isLoading: false,
  error: null,

  fetchRemedies: async () => {
    set({ isLoading: true, error: null });
    try {
      const remedies = await remedyService.getAllRemedies();
      set({ remedies, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch remedies',
        isLoading: false 
      });
    }
  },

  addRemedy: async (remedyData) => {
    set({ isLoading: true, error: null });
    try {
      await remedyService.createRemedy(remedyData);
      // Refresh remedies after adding
      await get().fetchRemedies();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add remedy',
        isLoading: false 
      });
    }
  },

  deleteRemedy: async (remedyId: string) => {
    set({ isLoading: true, error: null });
    try {
      await remedyService.deleteRemedy(remedyId);
      // Refresh remedies after deletion
      await get().fetchRemedies();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete remedy',
        isLoading: false 
      });
    }
  },
}));
