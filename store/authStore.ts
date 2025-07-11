import { create } from 'zustand';
import { Models } from 'react-native-appwrite';
import { account } from '../lib/appwriteConfig';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setAuth: (user: Models.User<Models.Preferences>) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setAuth: (user: Models.User<Models.Preferences>) => {
    console.log('Setting auth user:', user);
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false 
    });
  },

  clearAuth: () => {
    console.log('Clearing auth');
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },

  initialize: async () => {
    console.log('Initializing auth...');
    set({ isLoading: true });
    
    try {
      // First verify environment variables are available
      const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
      const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
      console.log('Environment variables check:', { 
        hasEndpoint: !!endpoint, 
        hasProjectId: !!projectId,
        endpoint,
        projectId
      });

      console.log('Attempting to get current user...');
      const user = await account.get();
      console.log('Current user:', user);
      
      if (user) {
        console.log('User authenticated:', user.$id);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false, 
          isInitialized: true 
        });
      } else {
        console.log('No user found, redirecting to auth');
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false, 
          isInitialized: true 
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      // Don't throw the error, just set the state
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        isInitialized: true 
      });
    }
  },
}));
