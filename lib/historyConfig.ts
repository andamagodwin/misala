import { Databases, ID, Query, Permission, Role } from 'react-native-appwrite';
import { client } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const HISTORY_DATABASE_ID = '6876693e003df851da66';
// export const HISTORY_DATABASE_ID = '6871206100262eb02793';
export const HISTORY_COLLECTION_ID = '68769967002fe5545586';
// export const HISTORY_COLLECTION_ID = '68712080003672c53da5';

export interface PlantHistory {
  user_id: string;
  plant_name: string;
  confidence: number;
  image_url: string;
  created_at: Date;
}

export const historyService = {
  async saveHistory(userId: string, plantName: string, confidence: number, imageUrl: string) {
    try {
      const response = await databases.createDocument(
        HISTORY_DATABASE_ID,
        HISTORY_COLLECTION_ID,
        ID.unique(),
        {
          user_id: userId,
          plant_name: plantName,
          confidence: confidence,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
      console.log('History saved successfully:', response);
      return response;
    } catch (error) {
      console.error('Error saving history:', error);
      throw error;
    }
  },

  async getUserHistory(userId: string) {
    try {
      const response = await databases.listDocuments(
        HISTORY_DATABASE_ID,
        HISTORY_COLLECTION_ID,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('created_at')
        ]
      );
      console.log('History fetched successfully:', response);
      return response.documents;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  async deleteHistoryItem(documentId: string) {
    try {
      await databases.deleteDocument(
        HISTORY_DATABASE_ID,
        HISTORY_COLLECTION_ID,
        documentId
      );
      console.log('History item deleted successfully');
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  },

  async clearUserHistory(userId: string) {
    try {
      const history = await this.getUserHistory(userId);
      await Promise.all(
        history.map(item => this.deleteHistoryItem(item.$id))
      );
      console.log('User history cleared successfully');
    } catch (error) {
      console.error('Error clearing user history:', error);
      throw error;
    }
  }
};
