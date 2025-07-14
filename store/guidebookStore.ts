import { create } from 'zustand';
import { guidebookService, GuidebookDocument } from '../lib/guidebookConfig';

interface GuidebookStore {
  guidebooks: GuidebookDocument[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Guidebook actions
  fetchGuidebooks: () => Promise<void>;
  searchGuidebooks: (query: string) => Promise<void>;
  uploadGuidebook: (
    file: any,
    title: string,
    description: string,
    category: string,
    tags: string[],
    uploaderName: string,
    uploaderId: string
  ) => Promise<void>;
  downloadGuidebook: (guidebookId: string, fileId: string) => Promise<string>;
  deleteGuidebook: (guidebookId: string, fileId: string) => Promise<void>;
  
  // UI state
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useGuidebookStore = create<GuidebookStore>((set, get) => ({
  guidebooks: [],
  isLoading: false,
  isUploading: false,
  error: null,
  searchQuery: '',

  fetchGuidebooks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await guidebookService.fetchGuidebooks();
      set({ guidebooks: response.documents, isLoading: false });
    } catch (error) {
      console.error('Error fetching guidebooks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch guidebooks', 
        isLoading: false 
      });
    }
  },

  searchGuidebooks: async (query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    
    try {
      if (query.trim() === '') {
        // If search query is empty, fetch all guidebooks
        await get().fetchGuidebooks();
      } else {
        const response = await guidebookService.searchGuidebooks(query);
        set({ guidebooks: response.documents, isLoading: false });
      }
    } catch (error) {
      console.error('Error searching guidebooks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search guidebooks', 
        isLoading: false 
      });
    }
  },

  uploadGuidebook: async (
    file: any,
    title: string,
    description: string,
    category: string,
    tags: string[],
    uploaderName: string,
    uploaderId: string
  ) => {
    set({ isUploading: true, error: null });
    
    try {
      // Upload file to storage
      const uploadedFile = await guidebookService.uploadFile(file, file.name);
      
      // Get file URL
      const fileUrl = guidebookService.getFileUrl(uploadedFile.$id);
      
      // Create guidebook document
      const newGuidebook = await guidebookService.createGuidebook(
        title,
        description,
        file.name,
        uploadedFile.$id,
        fileUrl,
        uploadedFile.sizeOriginal,
        uploadedFile.mimeType,
        uploaderId,
        uploaderName,
        category,
        tags
      );
      
      // Add to the beginning of the guidebooks array
      set(state => ({
        guidebooks: [newGuidebook, ...state.guidebooks],
        isUploading: false
      }));
    } catch (error) {
      console.error('Error uploading guidebook:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload guidebook', 
        isUploading: false 
      });
    }
  },

  downloadGuidebook: async (guidebookId: string, fileId: string) => {
    try {
      // Increment download count
      await guidebookService.incrementDownloadCount(guidebookId);
      
      // Get download URL
      const downloadUrl = guidebookService.getFileDownloadUrl(fileId);
      
      // Update the local state to reflect the incremented download count
      set(state => ({
        guidebooks: state.guidebooks.map(guidebook =>
          guidebook.$id === guidebookId
            ? { ...guidebook, downloadCount: (guidebook.downloadCount || 0) + 1 }
            : guidebook
        )
      }));
      
      return downloadUrl;
    } catch (error) {
      console.error('Error downloading guidebook:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to download guidebook' });
      throw error;
    }
  },

  deleteGuidebook: async (guidebookId: string, fileId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await guidebookService.deleteGuidebook(guidebookId, fileId);
      
      // Remove from local state
      set(state => ({
        guidebooks: state.guidebooks.filter(guidebook => guidebook.$id !== guidebookId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting guidebook:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete guidebook', 
        isLoading: false 
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));
