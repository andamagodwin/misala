import { create } from 'zustand';
import { userProfileService, UserProfileDocument, UserType } from '../lib/userProfileConfig';

interface UserProfileState {
  currentProfile: UserProfileDocument | null;
  herbalists: UserProfileDocument[];
  isLoading: boolean;
  error: string | null;
  
  // Profile management
  createProfile: (profileData: {
    user_id: string;
    user_type: UserType;
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    experience_years?: number;
    specializations?: string[];
    certifications?: string[];
  }) => Promise<void>;
  
  updateProfile: (profileId: string, updates: Partial<UserProfileDocument>) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  
  // Herbalist management
  fetchHerbalists: () => Promise<void>;
  fetchVerifiedHerbalists: () => Promise<void>;
  searchHerbalistsBySpecialization: (specialization: string) => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  isHerbalist: () => boolean;
  isVerifiedHerbalist: () => boolean;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  currentProfile: null,
  herbalists: [],
  isLoading: false,
  error: null,

  createProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userProfileService.createUserProfile({
        ...profileData,
        verified: false, // New profiles are not verified by default
      });
      set({ currentProfile: profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create profile',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProfile: async (profileId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await userProfileService.updateUserProfile(profileId, updates);
      set({ currentProfile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userProfileService.getUserProfile(userId);
      set({ currentProfile: profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        isLoading: false 
      });
    }
  },

  deleteProfile: async (profileId) => {
    set({ isLoading: true, error: null });
    try {
      await userProfileService.deleteUserProfile(profileId);
      set({ currentProfile: null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete profile',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchHerbalists: async () => {
    set({ isLoading: true, error: null });
    try {
      const herbalists = await userProfileService.getAllHerbalists();
      set({ herbalists, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch herbalists',
        isLoading: false 
      });
    }
  },

  fetchVerifiedHerbalists: async () => {
    set({ isLoading: true, error: null });
    try {
      const herbalists = await userProfileService.getVerifiedHerbalists();
      set({ herbalists, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch verified herbalists',
        isLoading: false 
      });
    }
  },

  searchHerbalistsBySpecialization: async (specialization) => {
    set({ isLoading: true, error: null });
    try {
      const herbalists = await userProfileService.searchHerbalistsBySpecialization(specialization);
      set({ herbalists, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search herbalists',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),

  isHerbalist: () => {
    const { currentProfile } = get();
    return currentProfile?.user_type === UserType.HERBALIST;
  },

  isVerifiedHerbalist: () => {
    const { currentProfile } = get();
    return currentProfile?.user_type === UserType.HERBALIST && currentProfile?.verified === true;
  },
}));
