import { Databases, ID, Query, Models } from 'react-native-appwrite';
import { client, storage } from './appwriteConfig';
import { useAuthStore } from '../store/authStore';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const REMEDY_DATABASE_ID = '6871206100262eb02793'; // Same database as history
export const REMEDY_COLLECTION_ID = '687133380006f5c36c8c'; // You'll need to create this collection
export const REMEDY_STORAGE_BUCKET_ID = '687683e9000f7f64973d'; // You'll need to create this storage bucket

// Helper function to get image URL from file ID
export const getImageUrl = (fileId: string): string => {
  try {
    // For React Native, construct the URL manually using the client config
    const url = `${client.config.endpoint}/storage/buckets/${REMEDY_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${client.config.project}`;
    console.log('Generated image URL:', url);
    console.log('Client config:', {
      endpoint: client.config.endpoint,
      project: client.config.project,
      bucketId: REMEDY_STORAGE_BUCKET_ID
    });
    return url;
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
};

export interface RemedyData {
  title: string;
  common_name: string;
  plant_name: string;
  scientific_name: string;
  local_name: string;
  preparation_method: string;
  usage_instructions: string;
  ailments_treated?: string;
  cautions?: string;
  image?: string; // Image URI for upload
}

export interface RemedyDocument extends Models.Document {
  title: string;
  common_name: string;
  plant_name: string;
  scientific_name: string;
  local_name: string;
  preparation_method: string;
  usage_instructions: string;
  ailments_treated?: string;
  cautions?: string;
  author_id: string;
  author_name: string;
  created_at: string;
  // Image fields
  image_id?: string; // Appwrite file ID
  image_url?: string; // Appwrite file URL
  // Verification fields
  verified: boolean;
  verified_by_id?: string;
  verified_by_name?: string;
  verified_at?: string;
}

export const remedyService = {
  async createRemedy(remedyData: RemedyData) {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      let imageId: string | undefined;
      let imageUrl: string | undefined;

      // Upload image if provided
      if (remedyData.image) {
        try {
          const fileResponse = await storage.createFile(
            REMEDY_STORAGE_BUCKET_ID,
            ID.unique(),
            {
              name: `remedy-${Date.now()}.jpg`,
              type: 'image/jpeg',
              size: 1024000, // Default size, will be corrected by Appwrite
              uri: remedyData.image,
            }
          );
          imageId = fileResponse.$id;
          // Use just the file ID - we'll construct the URL on the client side when needed
          imageUrl = fileResponse.$id;
        } catch (imageError) {
          console.error('Failed to upload image:', imageError);
          // Continue without image rather than failing the entire remedy creation
        }
      }

      const response = await databases.createDocument(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        ID.unique(),
        {
          title: remedyData.title,
          common_name: remedyData.common_name,
          plant_name: remedyData.plant_name,
          scientific_name: remedyData.scientific_name,
          local_name: remedyData.local_name,
          preparation_method: remedyData.preparation_method,
          usage_instructions: remedyData.usage_instructions,
          ailments_treated: remedyData.ailments_treated || '',
          cautions: remedyData.cautions || '',
          author_id: user.$id,
          author_name: user.name,
          created_at: new Date().toISOString(),
          // Image fields
          image_id: imageId || null,
          image_url: imageUrl || null,
          // Verification fields - all remedies start as unverified
          verified: false,
          verified_by_id: null,
          verified_by_name: null,
          verified_at: null,
        }
      );
      console.log('Remedy created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating remedy:', error);
      throw error;
    }
  },

  async getAllRemedies(): Promise<RemedyDocument[]> {
    try {
      const response = await databases.listDocuments(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        [
          Query.orderDesc('created_at'),
          Query.limit(100) // Limit to 100 most recent remedies
        ]
      );
      console.log('Remedies fetched successfully:', response);
      return response.documents as RemedyDocument[];
    } catch (error) {
      console.error('Error fetching remedies:', error);
      throw error;
    }
  },

  async getRemediesByPlant(plantName: string): Promise<RemedyDocument[]> {
    try {
      const response = await databases.listDocuments(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        [
          Query.equal('plant_name', plantName),
          Query.orderDesc('created_at')
        ]
      );
      console.log('Plant remedies fetched successfully:', response);
      return response.documents as RemedyDocument[];
    } catch (error) {
      console.error('Error fetching plant remedies:', error);
      throw error;
    }
  },

  async getUserRemedies(userId: string): Promise<RemedyDocument[]> {
    try {
      const response = await databases.listDocuments(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        [
          Query.equal('author_id', userId),
          Query.orderDesc('created_at')
        ]
      );
      console.log('User remedies fetched successfully:', response);
      return response.documents as RemedyDocument[];
    } catch (error) {
      console.error('Error fetching user remedies:', error);
      throw error;
    }
  },

  async deleteRemedy(remedyId: string) {
    try {
      await databases.deleteDocument(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        remedyId
      );
      console.log('Remedy deleted successfully');
    } catch (error) {
      console.error('Error deleting remedy:', error);
      throw error;
    }
  },

  async verifyRemedy(remedyId: string, verifierId: string, verifierName: string) {
    try {
      console.log('Attempting to verify remedy:', { remedyId, verifierId, verifierName });
      
      if (!verifierName) {
        console.warn('Verifier name is null or undefined');
      }
      
      const response = await databases.updateDocument(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        remedyId,
        {
          verified: true,
          verified_by_id: verifierId,
          verified_by_name: verifierName,
          verified_at: new Date().toISOString(),
        }
      );
      console.log('Remedy verified successfully:', response);
      return response;
    } catch (error) {
      console.error('Error verifying remedy:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          code: (error as any).code,
          type: (error as any).type
        });
      }
      throw error;
    }
  },

  async unverifyRemedy(remedyId: string) {
    try {
      console.log('Attempting to unverify remedy:', { remedyId });
      
      const response = await databases.updateDocument(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        remedyId,
        {
          verified: false,
          verified_by_id: null,
          verified_by_name: null,
          verified_at: null,
        }
      );
      console.log('Remedy unverified successfully:', response);
      return response;
    } catch (error) {
      console.error('Error unverifying remedy:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          code: (error as any).code,
          type: (error as any).type
        });
      }
      throw error;
    }
  },

  async getVerifiedRemedies(): Promise<RemedyDocument[]> {
    try {
      const response = await databases.listDocuments(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        [
          Query.equal('verified', true),
          Query.orderDesc('verified_at'),
          Query.limit(100)
        ]
      );
      console.log('Verified remedies fetched successfully:', response);
      return response.documents as RemedyDocument[];
    } catch (error) {
      console.error('Error fetching verified remedies:', error);
      throw error;
    }
  },

  async getUnverifiedRemedies(): Promise<RemedyDocument[]> {
    try {
      const response = await databases.listDocuments(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        [
          Query.equal('verified', false),
          Query.orderDesc('created_at'),
          Query.limit(100)
        ]
      );
      console.log('Unverified remedies fetched successfully:', response);
      return response.documents as RemedyDocument[];
    } catch (error) {
      console.error('Error fetching unverified remedies:', error);
      throw error;
    }
  }
};
