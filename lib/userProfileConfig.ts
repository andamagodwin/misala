import { Databases, ID, Query, Models } from 'react-native-appwrite';
import { client } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const USER_DATABASE_ID = '6876693e003df851da66'; // Same database as history
export const USER_PROFILES_COLLECTION_ID = '68767cc6002deb10a0dd'; // You'll need to create this collection
// export const USER_PROFILES_COLLECTION_ID = '6875f8eb0007b91a211b'; // You'll need to create this collection

export enum UserType {
  NORMAL = 'normal',
  HERBALIST = 'herbalist'
}

export interface UserProfile {
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
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileDocument extends Models.Document {
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
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export class UserProfileService {
  // Create a new user profile
  async createUserProfile(profileData: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfileDocument> {
    try {
      const profile = await databases.createDocument(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      return profile as UserProfileDocument;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile by user ID
  async getUserProfile(userId: string): Promise<UserProfileDocument | null> {
    try {
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        [Query.equal('user_id', userId)]
      );
      
      return response.documents.length > 0 ? response.documents[0] as UserProfileDocument : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfileDocument> {
    try {
      const profile = await databases.updateDocument(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        profileId,
        {
          ...updates,
          updated_at: new Date().toISOString(),
        }
      );
      return profile as UserProfileDocument;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get all herbalists
  async getAllHerbalists(limit: number = 50): Promise<UserProfileDocument[]> {
    try {
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        [
          Query.equal('user_type', UserType.HERBALIST),
          Query.limit(limit),
          Query.orderDesc('created_at')
        ]
      );
      
      return response.documents as UserProfileDocument[];
    } catch (error) {
      console.error('Error fetching herbalists:', error);
      throw error;
    }
  }

  // Get verified herbalists
  async getVerifiedHerbalists(limit: number = 50): Promise<UserProfileDocument[]> {
    try {
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        [
          Query.equal('user_type', UserType.HERBALIST),
          Query.equal('verified', true),
          Query.limit(limit),
          Query.orderDesc('created_at')
        ]
      );
      
      return response.documents as UserProfileDocument[];
    } catch (error) {
      console.error('Error fetching verified herbalists:', error);
      throw error;
    }
  }

  // Search herbalists by specialization
  async searchHerbalistsBySpecialization(specialization: string, limit: number = 20): Promise<UserProfileDocument[]> {
    try {
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        [
          Query.equal('user_type', UserType.HERBALIST),
          Query.contains('specializations', specialization),
          Query.limit(limit),
          Query.orderDesc('created_at')
        ]
      );
      
      return response.documents as UserProfileDocument[];
    } catch (error) {
      console.error('Error searching herbalists:', error);
      throw error;
    }
  }

  // Delete user profile
  async deleteUserProfile(profileId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        USER_DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        profileId
      );
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
