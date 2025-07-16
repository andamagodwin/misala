import { Databases, ID, Query, Models } from 'react-native-appwrite';
import { client } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constants - Update these with your actual IDs after creating the collection
export const PLANT_INFO_DATABASE_ID = '6876693e003df851da66'; // Use your existing database ID
// export const PLANT_INFO_DATABASE_ID = '6871206100262eb02793'; // Use your existing database ID
export const PLANT_INFO_COLLECTION_ID = '6876901e0028b611c7d0'; // Your actual plant_info collection ID
// export const PLANT_INFO_COLLECTION_ID = '68723943003476ae7141'; // Your actual plant_info collection ID

// Plant Info Document Interface
export interface PlantInfoDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  class_names: string; // Updated to match your Appwrite field name
  common_name: string;
  scientific_name: string;
  luhya_name?: string;
  ailment_treated: string;
  preparation_method: string;
  dosage: string;
  created_at: string;
  updated_at: string;
}

export const plantInfoService = {
  // Get plant info by class name (for prediction results)
  async getPlantByClassName(className: string) {
    try {
      const response = await databases.listDocuments(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        [Query.equal('class_names', className)]
      );
      
      return response.documents.length > 0 ? response.documents[0] as PlantInfoDocument : null;
    } catch (error) {
      console.error('Error fetching plant info:', error);
      throw error;
    }
  },

  // Get all plants (for admin/reference)
  async getAllPlants() {
    try {
      const response = await databases.listDocuments(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        [Query.orderAsc('common_name')]
      );
      
      return response.documents as PlantInfoDocument[];
    } catch (error) {
      console.error('Error fetching all plants:', error);
      throw error;
    }
  },

  // Search plants by name
  async searchPlants(query: string) {
    try {
      const response = await databases.listDocuments(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        [
          Query.search('common_name', query),
          Query.orderAsc('common_name')
        ]
      );
      
      return response.documents as PlantInfoDocument[];
    } catch (error) {
      console.error('Error searching plants:', error);
      throw error;
    }
  },

  // Add new plant info (for admin)
  async addPlantInfo(plantData: {
    class_names: string; // Updated to match your Appwrite field name
    common_name: string;
    scientific_name: string;
    luhya_name?: string;
    ailment_treated: string;
    preparation_method: string;
    dosage: string;
  }) {
    try {
      const response = await databases.createDocument(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        ID.unique(),
        {
          ...plantData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      
      return response as PlantInfoDocument;
    } catch (error) {
      console.error('Error adding plant info:', error);
      throw error;
    }
  },

  // Update plant info (for admin)
  async updatePlantInfo(plantId: string, updates: Partial<PlantInfoDocument>) {
    try {
      const response = await databases.updateDocument(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        plantId,
        {
          ...updates,
          updated_at: new Date().toISOString(),
        }
      );
      
      return response as PlantInfoDocument;
    } catch (error) {
      console.error('Error updating plant info:', error);
      throw error;
    }
  },

  // Delete plant info (for admin)
  async deletePlantInfo(plantId: string) {
    try {
      await databases.deleteDocument(
        PLANT_INFO_DATABASE_ID,
        PLANT_INFO_COLLECTION_ID,
        plantId
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting plant info:', error);
      throw error;
    }
  },
};
