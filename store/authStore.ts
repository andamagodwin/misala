import { create } from 'zustand';
import { Models } from 'react-native-appwrite';
import { account } from '../lib/appwriteConfig';
import { UserProfileDocument, userProfileService } from '../lib/userProfileConfig';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  userProfile: UserProfileDocument | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setAuth: (user: Models.User<Models.Preferences>, profile?: UserProfileDocument) => void;
  setUserProfile: (profile: UserProfileDocument | null) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
  updateUserTermsAcceptance: (accepted: boolean) => Promise<void>;
  checkTermsAcceptance: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setAuth: (user: Models.User<Models.Preferences>, profile?: UserProfileDocument) => {
    console.log('Setting auth user:', user);
    set({ 
      user, 
      userProfile: profile || null,
      isAuthenticated: true, 
      isLoading: false 
    });
  },

  setUserProfile: (profile: UserProfileDocument | null) => {
    set({ userProfile: profile });
  },

  clearAuth: () => {
    console.log('Clearing auth');
    set({ 
      user: null, 
      userProfile: null,
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
        
        // Try to load user profile
        try {
          const profile = await userProfileService.getUserProfile(user.$id);
          set({ 
            user, 
            userProfile: profile,
            isAuthenticated: true, 
            isLoading: false, 
            isInitialized: true 
          });
        } catch (profileError) {
          console.error('Error loading user profile:', profileError);
          // User exists but no profile, still mark as authenticated
          set({ 
            user, 
            userProfile: null,
            isAuthenticated: true, 
            isLoading: false, 
            isInitialized: true 
          });
        }
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

  updateUserTermsAcceptance: async (accepted: boolean) => {
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('No user found');
      }

      // Update user preferences with terms acceptance
      const updatedUser = await account.updatePrefs({
        ...currentUser.prefs,
        termsAccepted: accepted,
        termsAcceptedDate: new Date().toISOString(),
      });

      // Update the local state
      set({ user: updatedUser });
    } catch (error) {
      console.error('Error updating terms acceptance:', error);
      throw error;
    }
  },

  checkTermsAcceptance: () => {
    const user = get().user;
    return user?.prefs?.termsAccepted === true;
  },
}));
