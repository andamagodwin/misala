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
  verified?: boolean;
  verified_by_id?: string;
  verified_by_name?: string;
  verified_at?: string;
  author_name: string;
  created_at: string;
}

interface RemedyState {
  remedies: RemedyDocument[];
  isLoading: boolean;
  error: string | null;
  fetchRemedies: () => Promise<void>;
  fetchVerifiedRemedies: () => Promise<void>;
  fetchUnverifiedRemedies: () => Promise<void>;
  addRemedy: (remedy: Omit<Remedy, '$id' | 'author_id' | 'author_name' | 'created_at'>) => Promise<void>;
  verifyRemedy: (remedyId: string, verifierId: string, verifierName: string) => Promise<void>;
  unverifyRemedy: (remedyId: string) => Promise<void>;
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

  fetchVerifiedRemedies: async () => {
    set({ isLoading: true, error: null });
    try {
      const remedies = await remedyService.getVerifiedRemedies();
      set({ remedies, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch verified remedies',
        isLoading: false 
      });
    }
  },

  fetchUnverifiedRemedies: async () => {
    set({ isLoading: true, error: null });
    try {
      const remedies = await remedyService.getUnverifiedRemedies();
      set({ remedies, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch unverified remedies',
        isLoading: false 
      });
    }
  },

  verifyRemedy: async (remedyId: string, verifierId: string, verifierName: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Store: Verifying remedy', { remedyId, verifierId, verifierName });
      await remedyService.verifyRemedy(remedyId, verifierId, verifierName);
      // Refresh remedies after verifying
      await get().fetchRemedies();
    } catch (error) {
      console.error('Store: Error verifying remedy:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to verify remedy',
        isLoading: false 
      });
    }
  },

  unverifyRemedy: async (remedyId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Store: Unverifying remedy', { remedyId });
      await remedyService.unverifyRemedy(remedyId);
      // Refresh remedies after unverifying
      await get().fetchRemedies();
    } catch (error) {
      console.error('Store: Error unverifying remedy:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to unverify remedy',
        isLoading: false 
      });
    }
  },
}));
