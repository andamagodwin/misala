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
      const user = await account.get();
      console.log('Current user:', user);
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false, 
          isInitialized: true 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false, 
          isInitialized: true 
        });
      }
    } catch (error) {
      console.log('No active session:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        isInitialized: true 
      });
    }
  },
}));
