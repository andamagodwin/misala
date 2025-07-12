import { create } from 'zustand';
import { plantInfoService, PlantInfoDocument } from '../lib/plantInfoConfig';

interface PlantInfoStore {
  plantInfo: PlantInfoDocument | null;
  allPlants: PlantInfoDocument[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getPlantByClassName: (className: string) => Promise<PlantInfoDocument | null>;
  getAllPlants: () => Promise<void>;
  searchPlants: (query: string) => Promise<PlantInfoDocument[]>;
  clearPlantInfo: () => void;
  clearError: () => void;
}

export const usePlantInfoStore = create<PlantInfoStore>((set, get) => ({
  plantInfo: null,
  allPlants: [],
  isLoading: false,
  error: null,

  getPlantByClassName: async (className: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const plantInfo = await plantInfoService.getPlantByClassName(className);
      set({ plantInfo, isLoading: false });
      return plantInfo;
    } catch (error) {
      console.error('Error getting plant info:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get plant info', 
        isLoading: false 
      });
      return null;
    }
  },

  getAllPlants: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const plants = await plantInfoService.getAllPlants();
      set({ allPlants: plants, isLoading: false });
    } catch (error) {
      console.error('Error getting all plants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get plants', 
        isLoading: false 
      });
    }
  },

  searchPlants: async (query: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const plants = await plantInfoService.searchPlants(query);
      set({ isLoading: false });
      return plants;
    } catch (error) {
      console.error('Error searching plants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search plants', 
        isLoading: false 
      });
      return [];
    }
  },

  clearPlantInfo: () => {
    set({ plantInfo: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
