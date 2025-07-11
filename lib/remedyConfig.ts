import { Databases, ID, Query, Models } from 'react-native-appwrite';
import { client } from './appwriteConfig';
import { useAuthStore } from '../store/authStore';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const REMEDY_DATABASE_ID = '6871206100262eb02793'; // Same database as history
export const REMEDY_COLLECTION_ID = '687133380006f5c36c8c'; // You'll need to create this collection

export interface RemedyData {
  title: string;
  description: string;
  plant_name: string;
  ingredients: string;
  preparation_method: string;
  usage_instructions: string;
  benefits?: string;
  cautions?: string;
}

export interface RemedyDocument extends Models.Document {
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

export const remedyService = {
  async createRemedy(remedyData: RemedyData) {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await databases.createDocument(
        REMEDY_DATABASE_ID,
        REMEDY_COLLECTION_ID,
        ID.unique(),
        {
          title: remedyData.title,
          description: remedyData.description,
          plant_name: remedyData.plant_name,
          ingredients: remedyData.ingredients,
          preparation_method: remedyData.preparation_method,
          usage_instructions: remedyData.usage_instructions,
          benefits: remedyData.benefits || '',
          cautions: remedyData.cautions || '',
          author_id: user.$id,
          author_name: user.name,
          created_at: new Date().toISOString(),
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
  }
};
